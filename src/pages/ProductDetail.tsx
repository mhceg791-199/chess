// /*
//  * CHESS Product Detail — Scandinavian Warmth + Swiss Precision
//  * Split layout: large imagery left, scrollable specs/options right.
//  * Conversion triggers: urgency, social proof, anchoring, reciprocity.
//  * Fetches product data and reviews from the backend API.
//  */
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useParams, Link } from "wouter";
// import { motion } from "framer-motion";
// import {
//   Star, Heart, ShoppingCart, Truck, Shield, Clock, Check,
//   ChevronRight, Minus, Plus, Share2, Building2, Package,
//   ArrowRight, Zap, Loader2, ThumbsUp, MessageSquare,
// } from "lucide-react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import ProductCard from "@/components/ProductCard";
// import type { Product, Review } from "@/types";
// import { productApi, reviewApi, customerApi } from "@/services/api";
// import { useCart } from "@/contexts/CartContext";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";

// export default function ProductDetail() {
//   const { id } = useParams<{ id: string }>();
//   const { addItem } = useCart();
//   const { isAuthenticated, user } = useAuth();
//   const [wishlisted, setWishlisted] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [activeImage, setActiveImage] = useState(0);
//   const [activeTab, setActiveTab] = useState<"specs" | "features" | "reviews">("features");

//   // API state
//   const [product, setProduct] = useState<Product | null>(null);
//   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [reviewsLoading, setReviewsLoading] = useState(false);

//   // Review form state
//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", text: "" });
//   const [reviewSubmitting, setReviewSubmitting] = useState(false);

//   // Load product
//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     setActiveImage(0);
//     setQuantity(1);

//     productApi.getById(id)
//       .then((res) => {
//         const p = res.data;
//         setProduct(p || null);
//         if (p?.category) {
//           productApi.getAll({ category: p.category, limit: "5" })
//             .then((relRes) => {
//               const related = (relRes.data || []).filter(
//                 (rp: Product) => (rp._id || rp.id) !== (p._id || p.id)
//               ).slice(0, 4);
//               setRelatedProducts(related);
//             })
//             .catch(() => {});
//         }
//       })
//       .catch(() => setProduct(null))
//       .finally(() => setLoading(false));
//   }, [id]);

//   // Load reviews
//   const loadReviews = useCallback(async () => {
//     if (!id) return;
//     setReviewsLoading(true);
//     try {
//       const res = await reviewApi.getByProduct(id);
//       setReviews(res.data || []);
//     } catch {
//       // silent
//     } finally {
//       setReviewsLoading(false);
//     }
//   }, [id]);

//   useEffect(() => { loadReviews(); }, [loadReviews]);

//   // Check wishlist status
//   useEffect(() => {
//     if (!isAuthenticated || !id) return;
//     customerApi.getWishlist()
//       .then((res) => {
//         const ids = res.data || [];
//         setWishlisted(ids.includes(id));
//       })
//       .catch(() => {});
//   }, [isAuthenticated, id]);

//   const handleToggleWishlist = async () => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to use your wishlist");
//       return;
//     }
//     try {
//       if (wishlisted) {
//         await customerApi.removeFromWishlist(id!);
//         setWishlisted(false);
//         toast.success("Removed from wishlist");
//       } else {
//         await customerApi.addToWishlist(id!);
//         setWishlisted(true);
//         toast.success("Added to wishlist");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update wishlist");
//     }
//   };

//   // Submit review
//   const handleSubmitReview = async () => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to leave a review");
//       return;
//     }
//     if (!reviewForm.title.trim() || !reviewForm.text.trim()) {
//       toast.error("Title and review text are required");
//       return;
//     }
//     setReviewSubmitting(true);
//     try {
//       await reviewApi.create({
//         productId: id!,
//         rating: reviewForm.rating,
//         title: reviewForm.title.trim(),
//         text: reviewForm.text.trim(),
//       });
//       toast.success("Review submitted — thank you!");
//       setShowReviewForm(false);
//       setReviewForm({ rating: 5, title: "", text: "" });
//       // Reload reviews and product (to get updated rating)
//       loadReviews();
//       productApi.getById(id!).then((res) => {
//         if (res.data) setProduct(res.data);
//       }).catch(() => {});
//     } catch (err: any) {
//       toast.error(err.message || "Failed to submit review");
//     } finally {
//       setReviewSubmitting(false);
//     }
//   };

//   const handleMarkHelpful = async (reviewId: string) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to mark reviews as helpful");
//       return;
//     }
//     try {
//       await reviewApi.markHelpful(reviewId);
//       setReviews((prev) =>
//         prev.map((r) => r._id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)
//       );
//     } catch {
//       toast.error("Failed to mark as helpful");
//     }
//   };

//   // Compute rating distribution from actual reviews
//   const ratingDistribution = useMemo(() => {
//     const dist = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars
//     reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++; });
//     const total = reviews.length || 1;
//     return [5, 4, 3, 2, 1].map((stars) => ({
//       stars,
//       count: dist[stars - 1],
//       pct: Math.round((dist[stars - 1] / total) * 100),
//     }));
//   }, [reviews]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-chess-offwhite">
//         <Header />
//         <div className="flex-1 flex items-center justify-center">
//           <Loader2 className="w-8 h-8 animate-spin text-chess-bronze" />
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex flex-col bg-chess-offwhite">
//         <Header />
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <h1 className="font-display text-2xl font-semibold text-chess-charcoal mb-2">Product Not Found</h1>
//             <p className="text-sm text-muted-foreground mb-4">The product you are looking for does not exist.</p>
//             <Link href="/" className="text-sm text-chess-bronze hover:underline">Return to Homepage</Link>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   const savings = product.originalPrice ? product.originalPrice - product.price : 0;
//   const savingsPercent = product.originalPrice
//     ? Math.round((savings / product.originalPrice) * 100)
//     : 0;

//   const handleAddToCart = () => {
//     addItem(product._id || product.id || "", quantity).catch(() => {});
//     toast.success(`${product.name} added to cart`, {
//       description: `Qty: ${quantity} — $${(product.price * quantity).toLocaleString()}`,
//     });
//   };

//   // Check if current user already reviewed
//   const userAlreadyReviewed = reviews.some((r) => r.userId === user?.id || r.userId === user?._id);

//   return (
//     <div className="min-h-screen flex flex-col bg-chess-offwhite">
//       <Header />

//       <main className="flex-1">
//         {/* Breadcrumb */}
//         <div className="bg-white border-b border-border">
//           <div className="container py-3">
//             <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
//               <Link href="/" className="hover:text-chess-bronze transition-colors">Home</Link>
//               <ChevronRight className="w-3 h-3" />
//               <Link href={`/category/${product.category}`} className="hover:text-chess-bronze transition-colors capitalize">
//                 {product.category}
//               </Link>
//               <ChevronRight className="w-3 h-3" />
//               <span className="text-chess-charcoal font-medium truncate max-w-[200px]">{product.name}</span>
//             </nav>
//           </div>
//         </div>

//         {/* Product detail */}
//         <div className="container py-8 md:py-12">
//           <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
//             {/* Left: Images */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="sticky top-28">
//                 <div className="relative aspect-square bg-white rounded-sm border border-border/50 overflow-hidden mb-3">
//                   <img
//                     src={(product.images || [])[activeImage] || product.image}
//                     alt={product.name}
//                     className="w-full h-full object-contain p-6"
//                   />
//                   {product.badge && (
//                     <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-chess-charcoal text-chess-offwhite rounded-sm">
//                       {product.badge}
//                     </span>
//                   )}
//                   {savingsPercent > 0 && (
//                     <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-bold bg-chess-error text-white rounded-sm">
//                       -{savingsPercent}% OFF
//                     </span>
//                   )}
//                 </div>

//                 {(product.images || []).length > 1 && (
//                   <div className="flex gap-2">
//                     {product.images.map((img, i) => (
//                       <button
//                         key={i}
//                         onClick={() => setActiveImage(i)}
//                         className={`w-16 h-16 rounded-sm border overflow-hidden transition-all
//                           ${activeImage === i ? "border-chess-bronze ring-1 ring-chess-bronze/30" : "border-border/50 hover:border-chess-bronze/50"}`}
//                       >
//                         <img src={img} alt="" className="w-full h-full object-cover" />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </motion.div>

//             {/* Right: Product info */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//             >
//               <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
//                 SKU: {product.sku}
//               </p>

//               <h1 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal mb-3 leading-tight">
//                 {product.name}
//               </h1>

//               <div className="flex items-center gap-3 mb-4">
//                 <div className="flex items-center gap-0.5">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-chess-bronze text-chess-bronze" : "text-border"}`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-muted-foreground">
//                   {product.rating} ({product.reviewCount} reviews)
//                 </span>
//                 {product.commercial && (
//                   <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider border border-chess-bronze/30 text-chess-bronze rounded-sm">
//                     Commercial Grade
//                   </span>
//                 )}
//               </div>

//               {/* Price block */}
//               <div className="bg-white rounded-sm border border-border/50 p-5 mb-6">
//                 <div className="flex items-baseline gap-3 mb-2">
//                   <span className="text-3xl font-semibold text-chess-charcoal">
//                     ${product.price.toLocaleString(undefined, { minimumFractionDigits: product.price < 100 ? 2 : 0 })}
//                   </span>
//                   {product.originalPrice && (
//                     <>
//                       <span className="text-lg text-muted-foreground line-through">
//                         ${product.originalPrice.toLocaleString()}
//                       </span>
//                       <span className="px-2 py-0.5 text-xs font-bold bg-chess-success/10 text-chess-success rounded-sm">
//                         Save ${savings.toLocaleString()}
//                       </span>
//                     </>
//                   )}
//                 </div>
//                 {product.price < 100 && (
//                   <p className="text-xs text-muted-foreground">Price per square foot</p>
//                 )}
//                 <p className="text-xs text-muted-foreground mt-1">
//                   B2B pricing available — <Link href="/b2b" className="text-chess-bronze hover:underline">Request commercial quote</Link>
//                 </p>
//               </div>

//               <p className="text-sm text-chess-graphite leading-relaxed mb-6">
//                 {product.description}
//               </p>

//               {/* Key specs quick view */}
//               <div className="grid grid-cols-2 gap-3 mb-6">
//                 <div className="bg-chess-cream rounded-sm p-3">
//                   <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Finish</p>
//                   <p className="text-sm font-medium text-chess-charcoal">{product.finish}</p>
//                 </div>
//                 <div className="bg-chess-cream rounded-sm p-3">
//                   <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Dimensions</p>
//                   <p className="text-sm font-medium text-chess-charcoal">{product.dimensions?.width || "N/A"} W</p>
//                 </div>
//                 <div className="bg-chess-cream rounded-sm p-3">
//                   <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Warranty</p>
//                   <p className="text-sm font-medium text-chess-charcoal">{product.warranty}</p>
//                 </div>
//                 <div className="bg-chess-cream rounded-sm p-3">
//                   <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Compliance</p>
//                   <p className="text-sm font-medium text-chess-charcoal">{(product.compliance || []).join(", ") || "N/A"}</p>
//                 </div>
//               </div>

//               {/* Quantity + Add to cart */}
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="flex items-center border border-border rounded-sm">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="w-10 h-10 flex items-center justify-center hover:bg-chess-cream transition-colors"
//                   >
//                     <Minus className="w-4 h-4" />
//                   </button>
//                   <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-border">
//                     {quantity}
//                   </span>
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="w-10 h-10 flex items-center justify-center hover:bg-chess-cream transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>

//                 <button
//                   onClick={handleAddToCart}
//                   className="flex-1 h-11 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm
//                            flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
//                 >
//                   <ShoppingCart className="w-4 h-4" />
//                   Add to Cart — ${(product.price * quantity).toLocaleString(undefined, { minimumFractionDigits: product.price < 100 ? 2 : 0 })}
//                 </button>

//                 <button
//                   onClick={handleToggleWishlist}
//                   className={`w-11 h-11 rounded-sm border flex items-center justify-center transition-colors
//                     ${wishlisted ? "bg-chess-bronze border-chess-bronze text-white" : "border-border hover:border-chess-bronze"}`}
//                 >
//                   <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
//                 </button>
//               </div>

//               {/* B2B actions */}
//               <div className="flex gap-2 mb-6">
//                 <Link
//                   href="/b2b"
//                   className="flex-1 h-10 border border-chess-charcoal text-chess-charcoal text-xs font-semibold rounded-sm
//                            flex items-center justify-center gap-1.5 hover:bg-chess-charcoal hover:text-white transition-colors"
//                 >
//                   <Building2 className="w-3.5 h-3.5" />
//                   Request Commercial Pricing
//                 </Link>
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(window.location.href);
//                     toast.success("Link copied to clipboard");
//                   }}
//                   className="w-10 h-10 border border-border rounded-sm flex items-center justify-center hover:border-chess-bronze transition-colors"
//                 >
//                   <Share2 className="w-4 h-4" />
//                 </button>
//               </div>

//               {/* Delivery & trust signals */}
//               <div className="space-y-2.5 mb-8">
//                 <div className="flex items-center gap-2.5 text-sm">
//                   <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-chess-success" : "bg-chess-error"}`} />
//                   <span className={`font-medium ${product.inStock ? "text-chess-success" : "text-chess-error"}`}>
//                     {product.inStock ? "In Stock" : "Out of Stock"}
//                   </span>
//                   <span className="text-muted-foreground">— {product.leadTime}</span>
//                 </div>
//                 <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
//                   <Truck className="w-4 h-4 text-chess-bronze" />
//                   Free shipping on orders over $499
//                 </div>
//                 <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
//                   <Shield className="w-4 h-4 text-chess-bronze" />
//                   {product.warranty} warranty included
//                 </div>
//                 {product.installationRequired && (
//                   <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
//                     <Zap className="w-4 h-4 text-chess-bronze" />
//                     Professional installation available
//                   </div>
//                 )}
//               </div>

//               {/* Tabs: Features / Specs / Reviews */}
//               <div className="border-t border-border pt-6">
//                 <div className="flex gap-6 mb-5 border-b border-border">
//                   {(["features", "specs", "reviews"] as const).map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px
//                         ${activeTab === tab ? "border-chess-bronze text-chess-bronze" : "border-transparent text-muted-foreground hover:text-chess-charcoal"}`}
//                     >
//                       {tab === "reviews" ? `Reviews (${reviews.length || product.reviewCount})` : tab}
//                     </button>
//                   ))}
//                 </div>

//                 {activeTab === "features" && (
//                   <ul className="space-y-2.5">
//                     {(product.features || []).map((feature, i) => (
//                       <li key={i} className="flex items-start gap-2.5 text-sm text-chess-graphite">
//                         <Check className="w-4 h-4 text-chess-bronze shrink-0 mt-0.5" />
//                         {feature}
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 {activeTab === "specs" && (
//                   <div className="space-y-0">
//                     {Object.entries(product.specs || {}).map(([key, value], i) => (
//                       <div
//                         key={key}
//                         className={`flex items-center justify-between py-2.5 text-sm ${i % 2 === 0 ? "bg-chess-cream/50" : ""} px-3 rounded-sm`}
//                       >
//                         <span className="text-muted-foreground">{key}</span>
//                         <span className="font-medium text-chess-charcoal">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {activeTab === "reviews" && (
//                   <div className="space-y-5">
//                     {/* Rating summary */}
//                     <div className="flex items-center gap-4 p-4 bg-chess-cream rounded-sm">
//                       <div className="text-center">
//                         <p className="text-3xl font-display font-bold text-chess-charcoal">{product.rating}</p>
//                         <div className="flex gap-0.5 justify-center mt-1">
//                           {[...Array(5)].map((_, i) => (
//                             <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-chess-bronze text-chess-bronze" : "text-border"}`} />
//                           ))}
//                         </div>
//                         <p className="text-xs text-muted-foreground mt-1">{reviews.length || product.reviewCount} reviews</p>
//                       </div>
//                       <div className="flex-1 space-y-1">
//                         {ratingDistribution.map(({ stars, pct }) => (
//                           <div key={stars} className="flex items-center gap-2">
//                             <span className="text-xs text-muted-foreground w-3">{stars}</span>
//                             <Star className="w-3 h-3 fill-chess-bronze text-chess-bronze" />
//                             <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
//                               <div className="h-full bg-chess-bronze rounded-full" style={{ width: `${pct}%` }} />
//                             </div>
//                             <span className="text-xs text-muted-foreground w-8">{pct}%</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Write review button / form */}
//                     {isAuthenticated && !userAlreadyReviewed && !showReviewForm && (
//                       <button
//                         onClick={() => setShowReviewForm(true)}
//                         className="flex items-center gap-2 px-4 py-2.5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
//                       >
//                         <MessageSquare className="w-4 h-4" />
//                         Write a Review
//                       </button>
//                     )}

//                     {!isAuthenticated && (
//                       <p className="text-sm text-muted-foreground">
//                         <Link href="/login" className="text-chess-bronze hover:underline">Sign in</Link> to leave a review.
//                       </p>
//                     )}

//                     {userAlreadyReviewed && !showReviewForm && (
//                       <p className="text-sm text-muted-foreground italic">You have already reviewed this product.</p>
//                     )}

//                     {/* Review form */}
//                     {showReviewForm && (
//                       <div className="bg-white rounded-sm border border-border/50 p-5">
//                         <h3 className="text-sm font-semibold text-chess-charcoal mb-4">Write Your Review</h3>
//                         <div className="mb-4">
//                           <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Rating</label>
//                           <div className="flex gap-1">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
//                                 <Star
//                                   className={`w-6 h-6 transition-colors ${
//                                     star <= reviewForm.rating ? "fill-chess-bronze text-chess-bronze" : "text-border hover:text-chess-bronze/50"
//                                   }`}
//                                 />
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="mb-3">
//                           <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Title *</label>
//                           <input
//                             type="text"
//                             value={reviewForm.title}
//                             onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
//                             placeholder="Summarize your experience"
//                             maxLength={200}
//                             className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze"
//                           />
//                         </div>
//                         <div className="mb-4">
//                           <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Review *</label>
//                           <textarea
//                             value={reviewForm.text}
//                             onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
//                             placeholder="Share your thoughts about this product..."
//                             maxLength={2000}
//                             rows={4}
//                             className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze resize-none"
//                           />
//                         </div>
//                         <div className="flex gap-3">
//                           <button
//                             onClick={handleSubmitReview}
//                             disabled={reviewSubmitting}
//                             className="px-5 py-2.5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
//                           >
//                             {reviewSubmitting ? "Submitting..." : "Submit Review"}
//                           </button>
//                           <button
//                             onClick={() => setShowReviewForm(false)}
//                             className="px-5 py-2.5 border border-border text-sm font-medium text-chess-graphite rounded-sm hover:bg-chess-cream/50 transition-colors"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     {/* Reviews list */}
//                     {reviewsLoading ? (
//                       <div className="flex justify-center py-8">
//                         <Loader2 className="w-5 h-5 animate-spin text-chess-bronze" />
//                       </div>
//                     ) : reviews.length === 0 ? (
//                       <div className="text-center py-8">
//                         <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
//                         <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product!</p>
//                       </div>
//                     ) : (
//                       reviews.map((review) => (
//                         <div key={review._id} className="border-b border-border/50 pb-4">
//                           <div className="flex items-center gap-2 mb-1.5">
//                             <div className="flex gap-0.5">
//                               {[...Array(5)].map((_, j) => (
//                                 <Star key={j} className={`w-3 h-3 ${j < review.rating ? "fill-chess-bronze text-chess-bronze" : "text-border"}`} />
//                               ))}
//                             </div>
//                             <span className="text-xs font-medium text-chess-charcoal">{review.userName}</span>
//                             {review.verifiedPurchase && (
//                               <span className="text-[9px] font-semibold uppercase tracking-wider text-chess-success bg-chess-success/10 px-1.5 py-0.5 rounded-sm">
//                                 Verified Purchase
//                               </span>
//                             )}
//                             <span className="text-xs text-muted-foreground">
//                               {new Date(review.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
//                             </span>
//                           </div>
//                           <p className="text-sm font-medium text-chess-charcoal mb-1">{review.title}</p>
//                           <p className="text-sm text-chess-graphite mb-2">{review.text}</p>
//                           <button
//                             onClick={() => handleMarkHelpful(review._id)}
//                             className="flex items-center gap-1 text-xs text-muted-foreground hover:text-chess-bronze transition-colors"
//                           >
//                             <ThumbsUp className="w-3 h-3" />
//                             Helpful ({review.helpfulCount})
//                           </button>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </div>

//           {/* Related products */}
//           {relatedProducts.length > 0 && (
//             <div className="mt-16 pt-12 border-t border-border">
//               <h2 className="font-display text-xl font-semibold text-chess-charcoal mb-6">
//                 You May Also Like
//               </h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {relatedProducts.map((p, i) => (
//                   <ProductCard key={p._id || p.id} product={p} index={i} />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

/*
 * CHESS Product Detail — Scandinavian Warmth + Swiss Precision
 * Split layout: large imagery left, scrollable specs/options right.
 * Conversion triggers: urgency, social proof, anchoring, reciprocity.
 * Fetches product data and reviews from the backend API.
 * Uses WishlistContext for wishlist management.
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  Star, Heart, ShoppingCart, Truck, Shield, Clock, Check,
  ChevronRight, Minus, Plus, Share2, Building2, Package,
  ArrowRight, Zap, Loader2, ThumbsUp, MessageSquare,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import type { Product, Review } from "@/types";
import { productApi, reviewApi } from "@/services/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem, updateQuantity, items } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "features" | "reviews">("features");

  // API state
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", text: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Check if product is already in cart
  const cartItem = useMemo(() => {
    return items.find((item) => item.productId === id);
  }, [items, id]);

  // Check if product is in wishlist
  const wishlisted = useMemo(() => {
    return id ? isInWishlist(id) : false;
  }, [id, isInWishlist]);

  // Sync quantity with cart
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem]);

  // Load product
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setActiveImage(0);

    productApi.getById(id)
      .then((res) => {
        const p = res.data;
        setProduct(p || null);
        if (p?.category) {
          productApi.getAll({ category: p.category, limit: "5" })
            .then((relRes) => {
              const related = (relRes.data || []).filter(
                (rp: Product) => (rp._id || rp.id) !== (p._id || p.id)
              ).slice(0, 4);
              setRelatedProducts(related);
            })
            .catch(() => {});
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Load reviews
  const loadReviews = useCallback(async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const res = await reviewApi.getByProduct(id);
      setReviews(res.data || []);
    } catch {
      // silent
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to use your wishlist");
      return;
    }
    if (!id) return;
    
    await toggleWishlist(id);
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (!reviewForm.title.trim() || !reviewForm.text.trim()) {
      toast.error("Title and review text are required");
      return;
    }
    setReviewSubmitting(true);
    try {
      await reviewApi.create({
        productId: id!,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        text: reviewForm.text.trim(),
      });
      toast.success("Review submitted — thank you!");
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: "", text: "" });
      // Reload reviews and product (to get updated rating)
      loadReviews();
      productApi.getById(id!).then((res) => {
        if (res.data) setProduct(res.data);
      }).catch(() => {});
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to mark reviews as helpful");
      return;
    }
    try {
      await reviewApi.markHelpful(reviewId);
      setReviews((prev) =>
        prev.map((r) => r._id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)
      );
    } catch {
      toast.error("Failed to mark as helpful");
    }
  };

  // Handle quantity change with cart update
  const handleQuantityChange = async (newQuantity: number) => {
    const finalQuantity = Math.max(1, newQuantity);
    setQuantity(finalQuantity);

    // If product is in cart, update cart quantity
    if (cartItem) {
      try {
        await updateQuantity(id!, finalQuantity);
      } catch (err) {
        toast.error("Failed to update quantity");
        // Revert to cart quantity on error
        setQuantity(cartItem.quantity);
      }
    }
  };

  // Compute rating distribution from actual reviews
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars
    reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++; });
    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: dist[stars - 1],
      pct: Math.round((dist[stars - 1] / total) * 100),
    }));
  }, [reviews]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-chess-offwhite">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-chess-bronze" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-chess-offwhite">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-chess-charcoal mb-2">Product Not Found</h1>
            <p className="text-sm text-muted-foreground mb-4">The product you are looking for does not exist.</p>
            <Link href="/" className="text-sm text-chess-bronze hover:underline">Return to Homepage</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const savingsPercent = product.originalPrice
    ? Math.round((savings / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product._id || product.id || "", quantity).catch(() => {});
    toast.success(`${product.name} added to cart`, {
      description: `Qty: ${quantity} — $${(product.price * quantity).toLocaleString()}`,
    });
  };

  // Check if current user already reviewed
  const userAlreadyReviewed = reviews.some((r) => r.userId === user?.id || r.userId === user?._id);

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-border">
          <div className="container py-3">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-chess-bronze transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/category/${product.category}`} className="hover:text-chess-bronze transition-colors capitalize">
                {product.category}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-chess-charcoal font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product detail */}
        <div className="container py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="sticky top-28">
                <div className="relative aspect-square bg-white rounded-sm border border-border/50 overflow-hidden mb-3">
                  <img
                    src={(product.images || [])[activeImage] || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6"
                  />
                  {product.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-chess-charcoal text-chess-offwhite rounded-sm">
                      {product.badge}
                    </span>
                  )}
                  {savingsPercent > 0 && (
                    <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-bold bg-chess-error text-white rounded-sm">
                      -{savingsPercent}% OFF
                    </span>
                  )}
                </div>

                {(product.images || []).length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 rounded-sm border overflow-hidden transition-all
                          ${activeImage === i ? "border-chess-bronze ring-1 ring-chess-bronze/30" : "border-border/50 hover:border-chess-bronze/50"}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: Product info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                SKU: {product.sku}
              </p>

              <h1 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal mb-3 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-chess-bronze text-chess-bronze" : "text-border"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
                {product.commercial && (
                  <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider border border-chess-bronze/30 text-chess-bronze rounded-sm">
                    Commercial Grade
                  </span>
                )}
              </div>

              {/* Price block */}
              <div className="bg-white rounded-sm border border-border/50 p-5 mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-semibold text-chess-charcoal">
                    ${product.price.toLocaleString(undefined, { minimumFractionDigits: product.price < 100 ? 2 : 0 })}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-bold bg-chess-success/10 text-chess-success rounded-sm">
                        Save ${savings.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
                {product.price < 100 && (
                  <p className="text-xs text-muted-foreground">Price per square foot</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  B2B pricing available — <Link href="/b2b" className="text-chess-bronze hover:underline">Request commercial quote</Link>
                </p>
              </div>

              <p className="text-sm text-chess-graphite leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Key specs quick view */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-chess-cream rounded-sm p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Finish</p>
                  <p className="text-sm font-medium text-chess-charcoal">{product.finish}</p>
                </div>
                <div className="bg-chess-cream rounded-sm p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Dimensions</p>
                  <p className="text-sm font-medium text-chess-charcoal">{product.dimensions?.width || "N/A"} W</p>
                </div>
                <div className="bg-chess-cream rounded-sm p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Warranty</p>
                  <p className="text-sm font-medium text-chess-charcoal">{product.warranty}</p>
                </div>
                <div className="bg-chess-cream rounded-sm p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Compliance</p>
                  <p className="text-sm font-medium text-chess-charcoal">{(product.compliance || []).join(", ") || "N/A"}</p>
                </div>
              </div>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-border rounded-sm">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center hover:bg-chess-cream transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-chess-cream transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-11 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm
                           flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart — ${(product.price * quantity).toLocaleString(undefined, { minimumFractionDigits: product.price < 100 ? 2 : 0 })}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`w-11 h-11 rounded-sm border flex items-center justify-center transition-colors
                    ${wishlisted ? "bg-chess-bronze border-chess-bronze text-white" : "border-border hover:border-chess-bronze"}`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* B2B actions */}
              <div className="flex gap-2 mb-6">
                <Link
                  href="/b2b"
                  className="flex-1 h-10 border border-chess-charcoal text-chess-charcoal text-xs font-semibold rounded-sm
                           flex items-center justify-center gap-1.5 hover:bg-chess-charcoal hover:text-white transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Request Commercial Pricing
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard");
                  }}
                  className="w-10 h-10 border border-border rounded-sm flex items-center justify-center hover:border-chess-bronze transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Delivery & trust signals */}
              <div className="space-y-2.5 mb-8">
                <div className="flex items-center gap-2.5 text-sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-chess-success" : "bg-chess-error"}`} />
                  <span className={`font-medium ${product.inStock ? "text-chess-success" : "text-chess-error"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <span className="text-muted-foreground">— {product.leadTime}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-chess-bronze" />
                  Free shipping on orders over $499
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-chess-bronze" />
                  {product.warranty} warranty included
                </div>
                {product.installationRequired && (
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-chess-bronze" />
                    Professional installation available
                  </div>
                )}
              </div>

              {/* Tabs: Features / Specs / Reviews */}
              <div className="border-t border-border pt-6">
                <div className="flex gap-6 mb-5 border-b border-border">
                  {(["features", "specs", "reviews"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px
                        ${activeTab === tab ? "border-chess-bronze text-chess-bronze" : "border-transparent text-muted-foreground hover:text-chess-charcoal"}`}
                    >
                      {tab === "reviews" ? `Reviews (${reviews.length || product.reviewCount})` : tab}
                    </button>
                  ))}
                </div>

                {activeTab === "features" && (
                  <ul className="space-y-2.5">
                    {(product.features || []).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-chess-graphite">
                        <Check className="w-4 h-4 text-chess-bronze shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-0">
                    {Object.entries(product.specs || {}).map(([key, value], i) => (
                      <div
                        key={key}
                        className={`flex items-center justify-between py-2.5 text-sm ${i % 2 === 0 ? "bg-chess-cream/50" : ""} px-3 rounded-sm`}
                      >
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium text-chess-charcoal">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-5">
                    {/* Rating summary */}
                    <div className="flex items-center gap-4 p-4 bg-chess-cream rounded-sm">
                      <div className="text-center">
                        <p className="text-3xl font-display font-bold text-chess-charcoal">{product.rating}</p>
                        <div className="flex gap-0.5 justify-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-chess-bronze text-chess-bronze" : "text-border"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{reviews.length || product.reviewCount} reviews</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        {ratingDistribution.map(({ stars, pct }) => (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-3">{stars}</span>
                            <Star className="w-3 h-3 fill-chess-bronze text-chess-bronze" />
                            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-chess-bronze rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Write review button / form */}
                    {isAuthenticated && !userAlreadyReviewed && !showReviewForm && (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Write a Review
                      </button>
                    )}

                    {!isAuthenticated && (
                      <p className="text-sm text-muted-foreground">
                        <Link href="/login" className="text-chess-bronze hover:underline">Sign in</Link> to leave a review.
                      </p>
                    )}

                    {userAlreadyReviewed && !showReviewForm && (
                      <p className="text-sm text-muted-foreground italic">You have already reviewed this product.</p>
                    )}

                    {/* Review form */}
                    {showReviewForm && (
                      <div className="bg-white rounded-sm border border-border/50 p-5">
                        <h3 className="text-sm font-semibold text-chess-charcoal mb-4">Write Your Review</h3>
                        <div className="mb-4">
                          <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                                <Star
                                  className={`w-6 h-6 transition-colors ${
                                    star <= reviewForm.rating ? "fill-chess-bronze text-chess-bronze" : "text-border hover:text-chess-bronze/50"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Title *</label>
                          <input
                            type="text"
                            value={reviewForm.title}
                            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                            placeholder="Summarize your experience"
                            maxLength={200}
                            className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Review *</label>
                          <textarea
                            value={reviewForm.text}
                            onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                            placeholder="Share your thoughts about this product..."
                            maxLength={2000}
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze resize-none"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleSubmitReview}
                            disabled={reviewSubmitting}
                            className="px-5 py-2.5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {reviewSubmitting ? "Submitting..." : "Submit Review"}
                          </button>
                          <button
                            onClick={() => setShowReviewForm(false)}
                            className="px-5 py-2.5 border border-border text-sm font-medium text-chess-graphite rounded-sm hover:bg-chess-cream/50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reviews list */}
                    {reviewsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-chess-bronze" />
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div key={review._id} className="border-b border-border/50 pb-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className={`w-3 h-3 ${j < review.rating ? "fill-chess-bronze text-chess-bronze" : "text-border"}`} />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-chess-charcoal">{review.userName}</span>
                            {review.verifiedPurchase && (
                              <span className="text-[9px] font-semibold uppercase tracking-wider text-chess-success bg-chess-success/10 px-1.5 py-0.5 rounded-sm">
                                Verified Purchase
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-chess-charcoal mb-1">{review.title}</p>
                          <p className="text-sm text-chess-graphite mb-2">{review.text}</p>
                          <button
                            onClick={() => handleMarkHelpful(review._id)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-chess-bronze transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            Helpful ({review.helpfulCount})
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border">
              <h2 className="font-display text-xl font-semibold text-chess-charcoal mb-6">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p._id || p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
