import { useState, useEffect } from "react";
import { Link, useSearch, useParams } from "wouter";
import {
  CheckCircle2, FileText, Truck, Clock, Mail,
  ArrowRight, Download, Phone, Loader2, Package,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { orderApi } from "@/services/api";
import type { Order, OrderItem } from "@/types";

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const orderNumberParam = params.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        if (orderId) {
          const res = await orderApi.getById(orderId);
          setOrder(res.data);
        } else if (orderNumberParam) {
          const res = await orderApi.getByNumber(orderNumberParam);
          setOrder(res.data);
        }
      } catch {
        // Order might not be ready yet
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId, orderNumberParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-chess-offwhite dark:bg-zinc-950 transition-colors duration-300">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-chess-bronze" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-chess-charcoal dark:text-zinc-100 mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground dark:text-zinc-400">Thank you for your order. Your confirmation will be sent shortly.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-sm border border-border/50 dark:border-zinc-800 p-6 md:p-8 mb-6 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border dark:border-zinc-800">
              <div>
                <p className="text-xs text-muted-foreground dark:text-zinc-500 uppercase tracking-wider">Order Number</p>
                <p className="text-lg font-semibold text-chess-charcoal dark:text-zinc-100 font-mono">
                  #{order?.orderNumber || orderId || "Processing..."}
                </p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-sm ${
                order?.paymentStatus === "paid"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : "bg-chess-bronze/10 text-chess-bronze dark:text-white dark:bg-white/20"
              }`}>
                {order?.paymentStatus === "paid" ? "Paid" : "Payment Processing"}
              </span>
            </div>

            {/* Order items */}
            {order?.items && order.items.length > 0 && (
              <div className="mb-6 pb-6 border-b border-border dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-chess-charcoal dark:text-zinc-200 mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items.map((item: OrderItem, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-sm object-cover dark:brightness-90" />
                        )}
                        <div>
                          <p className="text-sm text-chess-charcoal dark:text-zinc-300">{item.name}</p>
                          <p className="text-xs text-muted-foreground dark:text-zinc-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-chess-charcoal dark:text-zinc-200">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 dark:border-zinc-800 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-zinc-500">Subtotal</span>
                    <span className="dark:text-zinc-300">${order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-zinc-500">Tax (HST 13%)</span>
                    <span className="dark:text-zinc-300">${order.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-zinc-500">Shipping</span>
                    <span className="dark:text-zinc-300">{order.shippingCost === 0 ? "Free" : `$${order.shippingCost?.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-chess-charcoal dark:text-zinc-100 pt-2 border-t border-border/50 dark:border-zinc-800">
                    <span>Total</span>
                    <span>${order.total?.toFixed(2)} CAD</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-semibold text-chess-charcoal dark:text-zinc-200">What happens next?</h3>
              <div className="space-y-3">
                {[
                  { icon: <Mail className="w-4 h-4" />, title: "Confirmation Email", desc: "You will receive a confirmation email with your order details.", active: true },
                  { icon: <FileText className="w-4 h-4" />, title: "Order Processing", desc: "Your order is being prepared for shipment.", active: order?.status === "processing" },
                  { icon: <Clock className="w-4 h-4" />, title: "Quality Check", desc: "All items undergo inspection before shipping.", active: false },
                  { icon: <Truck className="w-4 h-4" />, title: "Delivery", desc: "Estimated delivery 3-7 business days. Tracking will be provided.", active: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.active ? "bg-chess-bronze text-white" : "bg-chess-cream dark:bg-zinc-800 text-muted-foreground dark:text-zinc-500"}`}>
                      {step.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${step.active ? "text-chess-charcoal dark:text-zinc-200" : "text-muted-foreground dark:text-zinc-500"}`}>{step.title}</p>
                      <p className="text-xs text-muted-foreground dark:text-zinc-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/account" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border dark:border-zinc-700 rounded-sm text-sm font-medium text-chess-charcoal dark:text-zinc-200 hover:bg-chess-cream/50 dark:hover:bg-zinc-800 transition-colors">
                <Package className="w-4 h-4" /> View Order History
              </Link>
              <Link href="/" className="flex items-center justify-center gap-2 px-4 py-2.5 bronze-gradient text-chess-charcoal dark:text-white dark:bg- text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity">
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-sm border border-border/50 dark:border-zinc-800 p-5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-chess-cream dark:bg-zinc-800 flex items-center justify-center">
                <Phone className="w-5 h-5 text-chess-bronze dark:text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-chess-charcoal dark:text-zinc-200">Need help with your order?</p>
                <p className="text-xs text-muted-foreground dark:text-zinc-400">Contact our team at 1-800-CHESS-CA or support@chess-canada.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}