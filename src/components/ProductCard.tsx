// /*
//  * CHESS Product Card — Scandinavian Warmth + Swiss Precision
//  * Golden-ratio proportions, warm shadows, bronze accent on hover.
//  * Psychological triggers: urgency badges, social proof (reviews), savings display.
//  */
// import { useState } from "react";
// import { Link } from "wouter";
// import { motion } from "framer-motion";
// import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
// import type { Product } from "@/types";
// import { useCart } from "@/contexts/CartContext";
// import { toast } from "sonner";

// interface ProductCardProps {
//   product: Product;
//   index?: number;
// }

// export default function ProductCard({ product, index = 0 }: ProductCardProps) {
//   const { addItem } = useCart();
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [wishlisted, setWishlisted] = useState(false);

//   const productId = product._id || product.id || "";

//   const savings = product.originalPrice
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : 0;

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     addItem(productId).catch(() => {});
//     toast.success(`${product.name} added to cart`, {
//       description: `$${product.price.toLocaleString()} — ${product.leadTime}`,
//     });
//   };

//   const handleToggleWishlist = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setWishlisted(!wishlisted);
//     toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, delay: index * 0.05 }}
//     >
//       <Link href={`/product/${productId}`}>
//         <div className="group bg-white rounded-sm border border-border/50 overflow-hidden card-hover relative">
//           {/* Image container — golden ratio ~1.618:1 */}
//           <div className="relative aspect-[4/3] overflow-hidden bg-chess-cream">
//             <img
//               src={product.image}
//               alt={product.name}
//               className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
//               onLoad={() => setImageLoaded(true)}
//               loading="lazy"
//             />
//             {!imageLoaded && (
//               <div className="absolute inset-0 bg-chess-cream animate-pulse" />
//             )}

//             {/* Badge */}
//             {product.badge && (
//               <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider
//                              bg-chess-charcoal text-chess-offwhite rounded-sm">
//                 {product.badge}
//               </span>
//             )}

//             {/* Savings badge */}
//             {savings > 0 && (
//               <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold
//                              bg-chess-error text-white rounded-sm">
//                 -{savings}%
//               </span>
//             )}

//             {/* Quick actions overlay */}
//             <div className="absolute inset-0 bg-chess-charcoal/0 group-hover:bg-chess-charcoal/10 transition-all duration-300">
//               <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                 <button
//                   onClick={handleAddToCart}
//                   className="flex-1 h-9 bg-chess-charcoal text-white text-xs font-semibold rounded-sm
//                            flex items-center justify-center gap-1.5 hover:bg-chess-bronze transition-colors"
//                 >
//                   <ShoppingCart className="w-3.5 h-3.5" />
//                   Add to Cart
//                 </button>
//                 <button
//                   onClick={handleToggleWishlist}
//                   className={`w-9 h-9 rounded-sm flex items-center justify-center transition-colors
//                     ${wishlisted ? "bg-chess-bronze text-white" : "bg-white text-chess-charcoal hover:bg-chess-bronze hover:text-white"}`}
//                 >
//                   <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-current" : ""}`} />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-4">
//             {/* Category tag */}
//             <span className="text-[10px] font-semibold uppercase tracking-widest text-chess-bronze mb-1.5 block">
//               {product.type}
//             </span>

//             {/* Product name */}
//             <h3 className="font-sans text-sm font-medium leading-snug text-chess-charcoal mb-2 line-clamp-2 group-hover:text-chess-bronze transition-colors">
//               {product.name}
//             </h3>

//             {/* Rating */}
//             <div className="flex items-center gap-1.5 mb-2.5">
//               <div className="flex items-center gap-0.5">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-chess-bronze text-chess-bronze" : "text-border"}`}
//                   />
//                 ))}
//               </div>
//               <span className="text-xs text-muted-foreground">
//                 {product.rating} ({product.reviewCount})
//               </span>
//             </div>

//             {/* Price */}
//             <div className="flex items-baseline gap-2">
//               <span className="text-lg font-semibold text-chess-charcoal">
//                 ${product.price.toLocaleString(undefined, { minimumFractionDigits: product.price < 100 ? 2 : 0 })}
//               </span>
//               {product.originalPrice && (
//                 <span className="text-sm text-muted-foreground line-through">
//                   ${product.originalPrice.toLocaleString()}
//                 </span>
//               )}
//               {product.price < 100 && (
//                 <span className="text-[10px] text-muted-foreground">/sq.ft.</span>
//               )}
//             </div>

//             {/* Social proof / urgency */}
//             <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-chess-success font-medium">
//               <span className="w-1.5 h-1.5 rounded-full bg-chess-success animate-pulse" />
//               {product.inStock ? "In Stock" : "Made to Order"} — {product.leadTime}
//             </div>

//             {/* Commercial badge */}
//             {product.commercial && (
//               <span className="inline-block mt-2 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider
//                              border border-chess-bronze/30 text-chess-bronze rounded-sm">
//                 Commercial Grade
//               </span>
//             )}
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }


/*
 * CHESS Product Card — Scandinavian Warmth + Swiss Precision
 * Golden-ratio proportions, warm shadows, bronze accent on hover.
 * Psychological triggers: urgency badges, social proof (reviews), savings display.
 * Uses WishlistContext for wishlist management.
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const productId = product._id || product.id || "";
  const wishlisted = isInWishlist(productId);

  const savings = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(productId).catch(() => {});
    toast.success(`${product.name} added to cart`, {
      description: `$${product.price.toLocaleString()} — ${product.leadTime}`,
    });
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to use your wishlist");
      return;
    }
    
    await toggleWishlist(productId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/product/${productId}`}>
        <div className="group bg-white rounded-sm border border-border/50 overflow-hidden card-hover relative">
          {/* Image container — golden ratio ~1.618:1 */}
          <div className="relative aspect-[4/3] overflow-hidden bg-chess-cream">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-chess-cream animate-pulse" />
            )}

            {/* Badge */}
            {product.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider
                             bg-chess-charcoal text-chess-offwhite rounded-sm">
                {product.badge}
              </span>
            )}

            {/* Savings badge */}
            {savings > 0 && (
              <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold
                             bg-chess-error text-white rounded-sm">
                -{savings}%
              </span>
            )}

            {/* Quick actions overlay */}
            <div className="absolute inset-0 bg-chess-charcoal/0 group-hover:bg-chess-charcoal/10 transition-all duration-300">
              <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-9 bg-chess-charcoal text-white text-xs font-semibold rounded-sm
                           flex items-center justify-center gap-1.5 hover:bg-chess-bronze transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-9 h-9 rounded-sm flex items-center justify-center transition-colors
                    ${wishlisted ? "bg-chess-bronze text-white" : "bg-white text-chess-charcoal hover:bg-chess-bronze hover:text-white"}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category tag */}
            <span className="text-[10px] font-semibold uppercase tracking-widest text-chess-bronze mb-1.5 block">
              {product.type}
            </span>

            {/* Product name */}
            <h3 className="font-sans text-sm font-medium leading-snug text-chess-charcoal mb-2 line-clamp-2 group-hover:text-chess-bronze transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-chess-bronze text-chess-bronze" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating} ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-chess-charcoal">
                ${product.price.toLocaleString(undefined, { minimumFractionDigits: product.price < 100 ? 2 : 0 })}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.price < 100 && (
                <span className="text-[10px] text-muted-foreground">/sq.ft.</span>
              )}
            </div>

            {/* Social proof / urgency */}
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-chess-success font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-chess-success animate-pulse" />
              {product.inStock ? "In Stock" : "Made to Order"} — {product.leadTime}
            </div>

            {/* Commercial badge */}
            {product.commercial && (
              <span className="inline-block mt-2 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider
                             border border-chess-bronze/30 text-chess-bronze rounded-sm">
                Commercial Grade
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}