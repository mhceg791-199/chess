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
      <div className="min-h-screen flex flex-col bg-chess-offwhite">
        <Header />
        <main className="flex-1 flex items-center justify-center my-10">
          <div className="text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-semibold text-chess-charcoal mb-2">No items to checkout</h2>
            <p className="text-muted-foreground mb-6">Add some products to your cart first.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm">
              Continue Shopping <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-6xl">
          <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-chess-charcoal mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-10">
            {[{ num: 1, label: "Shipping" }, { num: 2, label: "Review" }, { num: 3, label: "Payment" }].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <button onClick={() => s.num < step ? setStep(s.num as 1 | 2 | 3) : undefined}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= s.num ? "bg-chess-bronze text-white" : "bg-chess-cream text-muted-foreground"}`}>
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </button>
                <span className={`text-sm font-medium ${step >= s.num ? "text-chess-charcoal" : "text-muted-foreground"}`}>{s.label}</span>
                {i < 2 && <div className={`w-12 h-px ${step > s.num ? "bg-chess-bronze" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-display text-xl font-semibold text-chess-charcoal mb-6">Shipping Information</h2>
                  <div className="bg-white rounded-sm border border-border/50 p-6 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal mb-1">First Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze" placeholder="John" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal mb-1">Last Name *</label>
                        <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                          className="w-full px-4 py-2.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal mb-1">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze" placeholder="john@example.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal mb-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze" placeholder="(416) 555-0123" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-chess-charcoal mb-1">Street Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze" placeholder="123 Main Street, Unit 4" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal mb-1">City *</label>
                        <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                          className="w-full px-4 py-2.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze" placeholder="Toronto" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal mb-1">Province *</label>
                        <select value={form.province} onChange={e => setForm({...form, province: e.target.value})}
                          className="w-full px-4 py-2.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze bg-white">
                          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-chess-charcoal mb-1">Postal Code *</label>
                        <input type="text" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})}
                          className="w-full px-4 py-2.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze" placeholder="M5V 2T6" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-chess-charcoal mb-1">Order Notes (optional)</label>
                      <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
                        className="w-full px-4 py-2.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-chess-bronze/20 focus:border-chess-bronze resize-none" placeholder="Special delivery instructions..." />
                    </div>
                    <button onClick={() => {
                      if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.postalCode) { toast.error("Please fill in all required fields."); return; }
                      setStep(2);
                    }} className="w-full py-3 bronze-gradient-black text-white text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity">
                      Continue to Review
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-display text-xl font-semibold text-chess-charcoal mb-6">Review Your Order</h2>
                  <div className="space-y-4">
                    <div className="bg-white rounded-sm border border-border/50 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-chess-charcoal flex items-center gap-2"><MapPin className="w-4 h-4 text-chess-bronze" /> Shipping To</h3>
                        <button onClick={() => setStep(1)} className="text-xs text-chess-bronze hover:underline">Edit</button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {form.firstName} {form.lastName}<br />
                        {form.address}<br />
                        {form.city}, {form.province} {form.postalCode}<br />
                        {form.email} {form.phone && `· ${form.phone}`}
                      </p>
                    </div>

                    <div className="bg-white rounded-sm border border-border/50 p-5">
                      <h3 className="text-sm font-semibold text-chess-charcoal mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.productId} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-sm object-cover" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-chess-charcoal">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-chess-charcoal">
                              ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => setStep(3)}
                      className="w-full py-3 bronze-gradient-black text-white text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity">
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-display text-xl font-semibold text-chess-charcoal mb-6">Payment</h2>
                  <div className="bg-white rounded-sm border border-border/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-sm bg-chess-cream flex items-center justify-center">
                        <Lock className="w-5 h-5 text-chess-bronze" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-chess-charcoal">Secure Payment via Stripe</p>
                        <p className="text-xs text-muted-foreground">You'll be redirected to Stripe's secure checkout page</p>
                      </div>
                    </div>

                    <div className="bg-chess-cream/50 rounded-sm p-4 mb-6">
                      <p className="text-xs text-muted-foreground">
                        <Shield className="w-3.5 h-3.5 inline mr-1 text-chess-bronze" />
                        Your payment information is encrypted and processed securely by Stripe. We never store your card details.
                      </p>
                    </div>

                    <button
                      onClick={handleStripeCheckout}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-chess-charcoal text-white text-sm font-semibold rounded-sm hover:bg-chess-charcoal/90 transition-colors disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} CAD
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-muted-foreground text-center mt-3">
                      For testing, use card number 4242 4242 4242 4242
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm border border-border/50 p-5 sticky top-24">
                <h3 className="font-display text-base font-semibold text-chess-charcoal mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (HST 13%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-chess-charcoal pt-3 border-t border-border">
                    <span>Total</span>
                    <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} CAD</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="w-3.5 h-3.5 text-chess-bronze" />
                    {shipping === 0 ? "Free shipping included" : "Free shipping on orders $499+"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-chess-bronze" />
                    Secure checkout powered by Stripe
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
