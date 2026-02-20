/*
 * CHESS Cart Page — Connected to REST API backend
 * Full shopping cart with quantity controls, Stripe checkout, and shipping calculator.
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { paymentApi } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronRight,
  Truck, Shield, Loader2, Tag,
} from "lucide-react";

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const TAX_RATE = 0.13; // Ontario HST
  const FREE_SHIPPING_THRESHOLD = 499;
  const SHIPPING_COST = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49.99;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to checkout");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setCheckoutLoading(true);
    try {
      // Backend reads cart from DB — no need to send items in the body
      const res = await paymentApi.createCheckoutSession({});

      // Backend returns { url, sessionId, orderNumber }
      if (res.data?.url) {
        toast.info("Redirecting to secure checkout...");
        window.open(res.data.url, "_blank");
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (err: any) {
      toast.error(err.message || "Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

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
              <span className="text-chess-charcoal font-medium">Shopping Cart</span>
            </nav>
          </div>
        </div>

        <div className="container py-8 md:py-12">
          <h1 className="font-display text-2xl font-semibold text-chess-charcoal mb-8">
            Shopping Cart {itemCount > 0 && <span className="text-muted-foreground text-lg">({itemCount} items)</span>}
          </h1>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold text-chess-charcoal mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Browse our products and add items to your cart.</p>
              <Link href="/category/all" className="inline-flex items-center gap-2 px-6 py-3 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-sm border border-border/50 p-4 md:p-5"
                  >
                    <div className="flex gap-4">
                      <Link href={`/product/${item.productId}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-sm shrink-0"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link href={`/product/${item.productId}`}>
                              <h3 className="text-sm font-semibold text-chess-charcoal hover:text-chess-bronze transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                          </div>
                          <p className="text-sm font-semibold text-chess-charcoal whitespace-nowrap">
                            ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-border rounded-sm">
                            <button
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center hover:bg-chess-cream transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-chess-cream transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => { removeItem(item.productId); toast("Item removed"); }}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => { clearCart(); toast("Cart cleared"); }}
                    className="text-xs text-muted-foreground hover:text-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <Link href="/category/all" className="text-xs text-chess-bronze hover:underline">
                    Continue Shopping →
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-sm border border-border/50 p-6 sticky top-24">
                  <h2 className="font-display text-lg font-semibold text-chess-charcoal mb-5">Order Summary</h2>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span className="text-chess-charcoal">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={SHIPPING_COST === 0 ? "text-green-600 font-medium" : "text-chess-charcoal"}>
                        {SHIPPING_COST === 0 ? "Free" : `$${SHIPPING_COST.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (HST 13%)</span>
                      <span className="text-chess-charcoal">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-chess-charcoal pt-3 border-t border-border">
                      <span>Total</span>
                      <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} CAD</span>
                    </div>
                  </div>

                  {/* Promo code */}
                  <div className="flex gap-2 mb-5">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code"
                        className="w-full h-9 pl-9 pr-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze"
                      />
                    </div>
                    <button
                      onClick={() => toast("Promo codes are applied at Stripe checkout")}
                      className="px-3 h-9 text-xs font-medium border border-border rounded-sm hover:bg-chess-cream transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <div className="bg-chess-cream/50 rounded-sm p-3 mb-5">
                      <p className="text-xs text-muted-foreground">
                        <Truck className="w-3.5 h-3.5 inline mr-1" />
                        Add <strong className="text-chess-charcoal">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> more for free shipping
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || items.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Proceed to Checkout <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1 mt-3">
                    <Shield className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Secure checkout powered by Stripe</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
