/*
 * CHESS Order Details Page — /orders/:id
 * Shows full order information: items, shipping, payment status, timeline.
 */
import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  ChevronRight, Loader2, Package, Truck, Clock, CheckCircle2,
  XCircle, CreditCard, MapPin, User, Mail, Phone, ArrowLeft,
  FileText, Star, ShoppingBag,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { orderApi } from "@/services/api";
import type { Order } from "@/types";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Clock className="w-4 h-4" /> },
  processing: { label: "Processing", color: "bg-blue-50 text-blue-700 border-blue-200", icon: <Package className="w-4 h-4" /> },
  shipped: { label: "Shipped", color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: <Truck className="w-4 h-4" /> },
  delivered: { label: "Delivered", color: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200", icon: <XCircle className="w-4 h-4" /> },
};

const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Payment Pending", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "Paid", color: "bg-green-50 text-green-700" },
  failed: { label: "Payment Failed", color: "bg-red-50 text-red-700" },
  refunded: { label: "Refunded", color: "bg-gray-50 text-gray-700" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700" },
};

const ORDER_STEPS = [
  { key: "pending", label: "Order Placed", icon: <FileText className="w-4 h-4" /> },
  { key: "processing", label: "Processing", icon: <Package className="w-4 h-4" /> },
  { key: "shipped", label: "Shipped", icon: <Truck className="w-4 h-4" /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle2 className="w-4 h-4" /> },
];

function getStepIndex(status: string): number {
  const idx = ORDER_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");

    orderApi.getById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => {
        // Try by order number if ID lookup fails
        orderApi.getByNumber(id)
          .then((res) => setOrder(res.data))
          .catch(() => setError(err.message || "Order not found"));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-chess-offwhite">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-chess-bronze" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-chess-offwhite">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold text-chess-charcoal mb-2">Order Not Found</h1>
            <p className="text-sm text-muted-foreground mb-6">{error || "The order you are looking for does not exist."}</p>
            <Link href="/account" className="text-sm text-chess-bronze hover:underline">
              ← Back to My Account
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";
  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const paymentInfo = PAYMENT_CONFIG[order.paymentStatus] || PAYMENT_CONFIG.pending;

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
              <Link href="/account" className="hover:text-chess-bronze transition-colors">My Account</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-chess-charcoal font-medium">Order #{order.orderNumber}</span>
            </nav>
          </div>
        </div>

        <div className="container py-8 md:py-12 max-w-4xl">
          {/* Back link */}
          <Link href="/account" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-chess-bronze transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to My Account
          </Link>

          {/* Order header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl font-semibold text-chess-charcoal">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-CA", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border ${statusInfo.color}`}>
                {statusInfo.icon} {statusInfo.label}
              </span>
              <span className={`px-3 py-1.5 text-xs font-semibold rounded-sm ${paymentInfo.color}`}>
                {paymentInfo.label}
              </span>
            </div>
          </div>

          {/* Progress tracker */}
          {!isCancelled && (
            <div className="bg-white rounded-sm border border-border/50 p-6 mb-6">
              <h2 className="text-sm font-semibold text-chess-charcoal mb-5">Order Progress</h2>
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-chess-bronze transition-all duration-500"
                  style={{ width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%` }}
                />

                {ORDER_STEPS.map((step, i) => {
                  const isComplete = i <= currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={step.key} className="relative flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                          ${isComplete ? "bg-chess-bronze text-white" : "bg-chess-cream text-muted-foreground border border-border"}`}
                      >
                        {step.icon}
                      </div>
                      <span className={`text-[10px] mt-2 font-medium ${isCurrent ? "text-chess-bronze" : isComplete ? "text-chess-charcoal" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cancelled notice */}
          {isCancelled && (
            <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-medium text-red-700">This order has been cancelled.</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column: Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order items */}
              <div className="bg-white rounded-sm border border-border/50 p-6">
                <h2 className="text-sm font-semibold text-chess-charcoal mb-4">
                  Items Ordered ({order.items.length})
                </h2>
                <div className="divide-y divide-border/50">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <Link href={`/product/${item.productId}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-sm shrink-0 hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="text-sm font-semibold text-chess-charcoal hover:text-chess-bronze transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} × {item.quantity}
                          </span>
                          <span className="text-sm font-semibold text-chess-charcoal">
                            ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order notes */}
              {order.notes && (
                <div className="bg-white rounded-sm border border-border/50 p-6">
                  <h2 className="text-sm font-semibold text-chess-charcoal mb-2">Order Notes</h2>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Right column: Summary + Info */}
            <div className="space-y-6">
              {/* Order summary */}
              <div className="bg-white rounded-sm border border-border/50 p-6">
                <h2 className="text-sm font-semibold text-chess-charcoal mb-4">Order Summary</h2>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-chess-charcoal">${order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (HST 13%)</span>
                    <span className="text-chess-charcoal">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={order.shippingCost === 0 ? "text-green-600 font-medium" : "text-chess-charcoal"}>
                      {order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-chess-charcoal pt-3 border-t border-border">
                    <span>Total</span>
                    <span>${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} CAD</span>
                  </div>
                </div>
              </div>

              {/* Customer info */}
              <div className="bg-white rounded-sm border border-border/50 p-6">
                <h2 className="text-sm font-semibold text-chess-charcoal mb-4">Customer Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-sm">
                    <User className="w-4 h-4 text-chess-bronze shrink-0" />
                    <span className="text-chess-graphite">{order.customerInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="w-4 h-4 text-chess-bronze shrink-0" />
                    <span className="text-chess-graphite">{order.customerInfo.email}</span>
                  </div>
                  {order.customerInfo.phone && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Phone className="w-4 h-4 text-chess-bronze shrink-0" />
                      <span className="text-chess-graphite">{order.customerInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-white rounded-sm border border-border/50 p-6">
                <h2 className="text-sm font-semibold text-chess-charcoal mb-4">Shipping Address</h2>
                <div className="flex items-start gap-2.5 text-sm text-chess-graphite">
                  <MapPin className="w-4 h-4 text-chess-bronze shrink-0 mt-0.5" />
                  <div>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                    <p>{order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              {/* Payment info */}
              <div className="bg-white rounded-sm border border-border/50 p-6">
                <h2 className="text-sm font-semibold text-chess-charcoal mb-4">Payment</h2>
                <div className="flex items-center gap-2.5 text-sm">
                  <CreditCard className="w-4 h-4 text-chess-bronze" />
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-sm ${paymentInfo.color}`}>
                    {paymentInfo.label}
                  </span>
                </div>
                {order.stripeSessionId && (
                  <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                    Session: {order.stripeSessionId.slice(0, 20)}...
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-border rounded-sm text-sm font-medium text-chess-charcoal hover:bg-chess-cream/50 transition-colors"
                >
                  <FileText className="w-4 h-4" /> Print Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
