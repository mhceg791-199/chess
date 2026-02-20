/**
 * CHESS Wishlist Context
 * Manages wishlist state and operations (add, remove, fetch)
 * Works with both authenticated users (API) and guests (localStorage)
 */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { customerApi, productApi } from "@/services/api";
import type { Product } from "@/types";
import { toast } from "sonner";


interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "chess_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist on mount and when auth changes
  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  /**
   * Fetch wishlist IDs and product details
   */
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      let ids: string[] = [];

      if (isAuthenticated) {
        // Fetch from API for authenticated users
        const res = await customerApi.getWishlist();
        ids = res.data || [];
      } else {
        // Fetch from localStorage for guests
        const stored = localStorage.getItem(STORAGE_KEY);
        ids = stored ? JSON.parse(stored) : [];
      }

      setWishlistIds(ids);

      // Fetch product details for each wishlist item
      if (ids.length > 0) {
        const productPromises = ids.map((id) =>
          productApi.getById(id).then((res) => res.data).catch(() => null)
        );
        const products = (await Promise.all(productPromises)).filter(Boolean) as Product[];
        setWishlistProducts(products);
      } else {
        setWishlistProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setWishlistProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if product is in wishlist
   */
  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  /**
   * Add product to wishlist
   */
  const addToWishlist = async (productId: string) => {
    try {
      // Prevent duplicates
      if (isInWishlist(productId)) {
        return;
      }

      if (isAuthenticated) {
        // Add via API
        await customerApi.addToWishlist(productId);
      } else {
        // Add to localStorage
        const newIds = [...wishlistIds, productId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
        setWishlistIds(newIds);
      }

      // Fetch product details and add to state
      const productRes = await productApi.getById(productId);
      if (productRes.data) {
        setWishlistProducts((prev) => [...prev, productRes.data]);
        setWishlistIds((prev) => [...prev, productId]);
      }

      toast.success("Added to wishlist");
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  /**
   * Remove product from wishlist
   */
  const removeFromWishlist = async (productId: string) => {
    try {
      if (isAuthenticated) {
        // Remove via API
        await customerApi.removeFromWishlist(productId);
      } else {
        // Remove from localStorage
        const newIds = wishlistIds.filter((id) => id !== productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      }

      // Update state
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      setWishlistProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));

      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   */
  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  /**
   * Clear entire wishlist
   */
  const clearWishlist = async () => {
    try {
      if (isAuthenticated) {
        // Clear via API
        await customerApi.clearWishlist();
      } else {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEY);
      }

      setWishlistIds([]);
      setWishlistProducts([]);

      toast.success("Wishlist cleared");
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
  };

  /**
   * Refresh wishlist (useful after external changes)
   */
  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  const value: WishlistContextType = {
    wishlistIds,
    wishlistProducts,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: wishlistIds.length,
    refreshWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

/**
 * Hook to use wishlist context
 */
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}