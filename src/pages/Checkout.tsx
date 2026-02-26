/*
 * CHESS Checkout Page — Dark Mode Optimized
 * Features: Step navigation, Stripe integration, and responsive summary.
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, CreditCard, FileText, Shield, Truck, Lock,
  ChevronRight, CheckCircle2, MapPin, User, Mail, Phone, Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { paymentApi } from "@/services/api";
import { toast } from "sonner";

const PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Nova Scotia", "Ontario",
  "Prince Edward Island", "Quebec", "Saskatchewan",
  "Northwest Territories", "Nunavut", "Yukon",
];

const TAX_RATE = 0.13;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    address: "", city: "", province: "Ontario", postalCode: "",
    notes: "",
  });

  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= 499 ? 0 : 49.99;
  const total = subtotal + tax + shipping;

  const handleStripeCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to checkout");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const res = await paymentApi.createCheckoutSession({
        shippingAddress: {
          name: `${form.firstName} ${form.lastName}`,
          street: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          country: "CA",
        },
        customerInfo: {
          email: form.email,
          phone: form.phone,
          notes: form.notes,
        },
      });

      if (res.data?.url) {
        toast.info("Redirecting to secure payment...");
        window.open(res.data.url, "_blank");
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (err: any) {
      toast.error(err.message || "Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-chess-offwhite dark:bg-zinc-950 transition-colors">
        <Header />
        <main className="flex-1 flex items-center justify-center my-10 px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-chess-charcoal dark:text-zinc-100 mb-2">No items to checkout</h2>
            <p className="text-muted-foreground mb-6">Add some products to your cart first.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-3 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-all">
              Continue Shopping <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite dark:bg-zinc-950 transition-colors">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-6xl">
          <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-chess-charcoal dark:hover:text-zinc-200 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {[{ num: 1, label: "Shipping" }, { num: 2, label: "Review" }, { num: 3, label: "Payment" }].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => s.num < step ? setStep(s.num as 1 | 2 | 3) : undefined}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s.num ? "bg-chess-bronze dark:bg-white text-white dark:text-chess-bronze" : "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </button>
                <span className={`text-sm font-medium ${step >= s.num ? "text-chess-charcoal dark:text-zinc-100" : "text-muted-foreground"}`}>{s.label}</span>
                {i < 2 && <div className={`w-8 md:w-12 h-px ${step > s.num ? "bg-chess-bronze" : "bg-zinc-300 dark:bg-zinc-800"}`} />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-display text-xl font-semibold text-chess-charcoal dark:text-zinc-100 mb-6">Shipping Information</h2>
                  <div className="bg-white dark:bg-zinc-900 rounded-sm border border-border/50 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1.5">First Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze dark:text-zinc-200 outline-none" placeholder="John" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1.5">Last Name *</label>
                        <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                          className="w-full px-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze dark:text-zinc-200 outline-none" placeholder="Doe" />
                      </div>
                    </div>
                    {/* ... (بقية الحقول تتبع نفس النمط dark:border-zinc-800 و dark:text-zinc-200) */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1.5">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze dark:text-zinc-200 outline-none" placeholder="john@example.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1.5">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze dark:text-zinc-200 outline-none" placeholder="(416) 555-0123" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1.5">Street Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze dark:text-zinc-200 outline-none" placeholder="123 Main Street, Unit 4" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1.5">City *</label>
                        <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                          className="w-full px-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze dark:text-zinc-200 outline-none" placeholder="Toronto" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1.5">Province *</label>
                        <select value={form.province} onChange={e => setForm({...form, province: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm text-sm focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze dark:text-zinc-200 outline-none">
                          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1.5">Postal Code *</label>
                        <input type="text" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})}
                          className="w-full px-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze dark:text-zinc-200 outline-none" placeholder="M5V 2T6" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1.5">Order Notes</label>
                      <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
                        className="w-full px-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze dark:text-zinc-200 outline-none resize-none" placeholder="Special delivery instructions..." />
                    </div>
                    <button onClick={() => {
                      if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.postalCode) { toast.error("Please fill in all required fields."); return; }
                      setStep(2);
                    }} className="w-full py-3.5 bg-chess-charcoal dark:bg-white text-white dark:text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-95 transition-all shadow-md active:scale-[0.99]">
                      Continue to Review
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-display text-xl font-semibold text-chess-charcoal dark:text-zinc-100 mb-6">Review Your Order</h2>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-sm border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                        <h3 className="text-sm font-semibold text-chess-charcoal dark:text-zinc-200 flex items-center gap-2"><MapPin className="w-4 h-4 text-chess-bronze" /> Shipping To</h3>
                        <button onClick={() => setStep(1)} className="text-xs text-chess-bronze hover:underline font-medium">Edit</button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="text-chess-charcoal dark:text-zinc-300 font-medium">{form.firstName} {form.lastName}</span><br />
                        {form.address}<br />
                        {form.city}, {form.province} {form.postalCode}<br />
                        <span className="flex items-center gap-2 mt-2">
                          <Mail className="w-3 h-3" /> {form.email} {form.phone && `· ${form.phone}`}
                        </span>
                      </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-sm border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-chess-charcoal dark:text-zinc-200 mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.productId} className="flex items-center gap-4">
                            <div className="relative">
                               <img src={item.image} alt={item.name} className="w-16 h-16 rounded-sm object-cover border border-zinc-100 dark:border-zinc-800" />
                               <span className="absolute -top-2 -right-2 w-5 h-5 bg-chess-bronze text-white text-[10px] flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-chess-charcoal dark:text-zinc-200 truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Unit: ${item.price.toFixed(2)}</p>
                            </div>
                            <p className="text-sm font-semibold text-chess-charcoal dark:text-zinc-100">
                              ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => setStep(3)}
                      className="w-full py-3.5 bg-chess-charcoal dark:bg-white text-white dark:text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-95 transition-all shadow-md">
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                  <h2 className="font-display text-xl font-semibold text-chess-charcoal dark:text-zinc-100 mb-6">Payment</h2>
                  <div className="bg-white dark:bg-zinc-900 rounded-sm border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-chess-cream dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                      <Lock className="w-8 h-8 text-chess-bronze dark:text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-chess-charcoal dark:text-zinc-100 mb-2">Secure Payment via Stripe</h3>
                    <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                      Click the button below to be redirected to Stripe's secure environment to complete your purchase.
                    </p>

                    <button
                      onClick={handleStripeCheckout}
                      disabled={submitting}
                      className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-4 bg-chess-charcoal dark:bg-zinc-100 dark:text-zinc-900 text-white text-sm font-bold rounded-sm hover:bg-chess-charcoal/90 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 shadow-lg"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Complete Order — ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </>
                      )}
                    </button>

                    <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <Shield className="w-5 h-5 text-chess-bronze" />
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">SSL Encrypted</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <CheckCircle2 className="w-5 h-5 text-chess-bronze" />
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">PCI Compliant</span>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-sm border border-zinc-200 dark:border-zinc-800 p-6 sticky top-24 shadow-sm">
                <h3 className="font-display text-base font-semibold text-chess-charcoal dark:text-zinc-100 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="dark:text-zinc-200">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 dark:text-green-500 font-medium" : "dark:text-zinc-200"}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Tax (13%)</span>
                    <span className="dark:text-zinc-200">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-chess-charcoal dark:text-zinc-100 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-base">
                    <span>Total</span>
                    <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[10px] font-normal text-muted-foreground">CAD</span></span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-sm">
                    <Truck className="w-4 h-4 text-chess-bronze dark:text-white shrink-0" />
                    <p className="text-[11px] leading-tight text-muted-foreground">
                       {shipping === 0 ? "Your order qualifies for free white-glove delivery." : "Spend $499 or more to unlock free shipping."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}