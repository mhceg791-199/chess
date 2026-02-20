// /*
//  * CHESS Wishlist Page — Scandinavian Warmth + Swiss Precision
//  * Now fetches product data from the backend API.
//  */
// import { useState, useEffect } from "react";
// import { Link } from "wouter";
// import { Heart, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import ProductCard from "@/components/ProductCard";
// import { useAuth } from "@/contexts/AuthContext";
// import { customerApi, productApi } from "@/services/api";
// import type { Product } from "@/types";

// export default function Wishlist() {
//   const { isAuthenticated } = useAuth();
//   const [wishlistIds, setWishlistIds] = useState<string[]>([]);
//   const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         let ids: string[] = [];
//         if (isAuthenticated) {
//           const res = await customerApi.getWishlist();
//           ids = res.data || [];
//         } else {
//           const stored = localStorage.getItem("chess_wishlist");
//           ids = stored ? JSON.parse(stored) : [];
//         }
//         setWishlistIds(ids);

//         // Fetch product details for each wishlist item
//         if (ids.length > 0) {
//           const productPromises = ids.map((id) =>
//             productApi.getById(id).then((res) => res.data).catch(() => null)
//           );
//           const products = (await Promise.all(productPromises)).filter(Boolean) as Product[];
//           setWishlistProducts(products);
//         } else {
//           setWishlistProducts([]);
//         }
//       } catch {
//         setWishlistProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [isAuthenticated]);

//   return (
//     <div className="min-h-screen flex flex-col bg-chess-offwhite">
//       <Header />
//       <main className="flex-1">
//         <div className="bg-white border-b border-border">
//           <div className="container py-3">
//             <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
//               <Link href="/" className="hover:text-chess-bronze transition-colors">Home</Link>
//               <ChevronRight className="w-3 h-3" />
//               <span className="text-chess-charcoal font-medium">Wishlist</span>
//             </nav>
//           </div>
//         </div>

//         <div className="container py-10">
//           <h1 className="font-display text-2xl font-semibold text-chess-charcoal mb-2">My Wishlist</h1>
//           <p className="text-sm text-muted-foreground mb-8">{wishlistProducts.length} items saved</p>

//           {loading ? (
//             <div className="flex items-center justify-center py-20">
//               <Loader2 className="w-8 h-8 animate-spin text-chess-bronze" />
//             </div>
//           ) : wishlistProducts.length === 0 ? (
//             <div className="text-center py-20">
//               <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
//               <h2 className="font-display text-xl font-semibold text-chess-charcoal mb-2">Your wishlist is empty</h2>
//               <p className="text-muted-foreground mb-6">Save items you love for later.</p>
//               <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm">
//                 Start Shopping <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
//               {wishlistProducts.map((product, i) => (
//                 <ProductCard key={product._id || product.id} product={product} index={i} />
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }


/*
 * CHESS Wishlist Page — Scandinavian Warmth + Swiss Precision
 * Now fetches product data from the backend API.
 */
import { Link } from "wouter";
import { Heart, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";

export default function Wishlist() {
  const { wishlistProducts, loading, wishlistCount } = useWishlist();

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite">
      <Header />
      <main className="flex-1">
        <div className="bg-white border-b border-border">
          <div className="container py-3">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-chess-bronze transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-chess-charcoal font-medium">Wishlist</span>
            </nav>
          </div>
        </div>

        <div className="container py-10">
          <h1 className="font-display text-2xl font-semibold text-chess-charcoal mb-2">My Wishlist</h1>
          <p className="text-sm text-muted-foreground mb-8">{wishlistCount} items saved</p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-chess-bronze" />
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold text-chess-charcoal mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Save items you love for later.</p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm">
                Start Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {wishlistProducts.map((product, i) => (
                <ProductCard key={product._id || product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}