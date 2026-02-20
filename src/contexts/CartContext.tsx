import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartApi } from "@/services/api";
import { useAuth } from "./AuthContext";

interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartApi.get();
      setItems(res.data?.items || []);
    } catch {
      // Cart might not exist yet
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart, isAuthenticated]);

  const addItem = async (productId: string, quantity: number = 1) => {
    const res = await cartApi.addItem(productId, quantity);
    setItems(res.data?.items || []);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const res = await cartApi.updateItem(productId, quantity);
    setItems(res.data?.items || []);
  };

  const removeItem = async (productId: string) => {
    const res = await cartApi.removeItem(productId);
    setItems(res.data?.items || []);
  };

  const clearCart = async () => {
    await cartApi.clear();
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, loading, addItem, updateQuantity, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
