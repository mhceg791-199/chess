/*
 * CHESS Admin Orders Management — Full order management with filters, status updates.
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/services/api";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";
import {
  Package, Search, Filter, Loader2, Eye, X, ChevronLeft,
  ChevronRight, Clock, Truck, CheckCircle2, XCircle, DollarSign,
  MapPin, User, CreditCard, RefreshCw,
} from "lucide-react";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  pending: { icon: <Clock className="w-3 h-3" />, color: "text-yellow-600", bg: "bg-yellow-50" },
  processing: { icon: <Loader2 className="w-3 h-3" />, color: "text-blue-600", bg: "bg-blue-50" },
  shipped: { icon: <Truck className="w-3 h-3" />, color: "text-indigo-600", bg: "bg-indigo-50" },
  delivered: { icon: <CheckCircle2 className="w-3 h-3" />, color: "text-green-600", bg: "bg-green-50" },
  cancelled: { icon: <XCircle className="w-3 h-3" />, color: "text-red-600", bg: "bg-red-50" },
};

export default function AdminOrders() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
      loadStats();
    }
  }, [isAdmin, page, statusFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "20",
        sort: "-createdAt",
      };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await adminApi.getAllOrders(params);
      setOrders(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.pages);
        setTotal(res.pagination.total);
      }
    } catch (err: any) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const res = await adminApi.getOrderStats();
      setStats(res.data);
    } catch {}
  }

  async function handleStatusUpdate(orderId: string, newStatus: string) {
    setUpdatingStatus(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  }

  async function handleCancelOrder(orderId: string) {
    if (!confirm("Are you sure you want to cancel this order? This cannot be undone.")) return;
    try {
      await adminApi.cancelOrder(orderId);
      toast.success("Order cancelled");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "cancelled" });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel order");
    }
  }

  async function viewOrderDetail(orderId: string) {
    setDetailLoading(true);
    try {
      const res = await adminApi.getAllOrders({ page: "1", limit: "1" });
      // Try to find the order in current list first
      const found = orders.find((o) => o._id === orderId);
      setSelectedOrder(found || null);
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setDetailLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadOrders();
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });

  const formatCurrency = (n: number) =>
    `$${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <AdminLayout title="Orders" subtitle={`${total} total orders`}>
      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {statusOptions.map((s) => {
            const sc = statusConfig[s];
            const count = stats[s] || 0;
            return (
              <button
                key={s}
                onClick={() => { setStatusFilter(statusFilter === s ? "" : s); setPage(1); }}
                className={`flex items-center gap-2 p-3 rounded-sm border transition-all text-left
                  ${statusFilter === s ? "border-chess-bronze bg-chess-bronze/5" : "border-border/50 bg-white hover:border-chess-bronze/30"}`}
              >
                <div className={`w-7 h-7 rounded-sm flex items-center justify-center ${sc.bg} ${sc.color}`}>
                  {sc.icon}
                </div>
                <div>
                  <p className="text-lg font-semibold text-chess-charcoal">{count}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{s}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, customer..."
            className="w-full h-10 pl-9 pr-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze"
          />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze bg-white"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <button onClick={() => { loadOrders(); loadStats(); }}
          className="h-10 px-3 flex items-center gap-1.5 text-sm border border-border rounded-sm hover:bg-chess-cream transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-chess-bronze" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-sm border border-border/50 p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-sm border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-chess-cream/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Order</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Customer</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Items</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Total</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {orders.map((order) => {
                    const sc = statusConfig[order.status] || statusConfig.pending;
                    return (
                      <tr key={order._id} className="hover:bg-chess-cream/20 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-chess-charcoal">{order.orderNumber}</p>
                          {order.paymentMethod && (
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <CreditCard className="w-3 h-3" /> {order.paymentMethod}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-chess-charcoal">{order.customer?.name || order.shippingAddress?.firstName || "Guest"}</p>
                          <p className="text-[10px] text-muted-foreground">{order.customer?.email || order.shippingAddress?.email || ""}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(order.createdAt)}</td>
                        <td className="px-4 py-3 text-sm text-chess-charcoal">{order.items?.length || 0}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-chess-charcoal">{formatCurrency(order.total)}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingStatus === order._id || order.status === "cancelled"}
                            className={`text-xs font-semibold px-2 py-1 rounded-sm border-0 capitalize cursor-pointer ${sc.bg} ${sc.color} disabled:opacity-50`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 text-chess-bronze hover:bg-chess-cream rounded-sm transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {order.status !== "cancelled" && order.status !== "delivered" && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                                title="Cancel order"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages} ({total} orders)
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border rounded-sm hover:bg-chess-cream disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-border rounded-sm hover:bg-chess-cream disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div>
                <h2 className="font-display text-lg font-semibold text-chess-charcoal">
                  Order {selectedOrder.orderNumber}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-chess-cream rounded-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-sm capitalize
                    ${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.color}`}>
                    {statusConfig[selectedOrder.status]?.icon} {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-xl font-semibold text-chess-charcoal">{formatCurrency(selectedOrder.total)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-chess-cream/30 rounded-sm p-4">
                <h3 className="text-xs font-semibold text-chess-charcoal mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-chess-bronze" /> Customer
                </h3>
                <p className="text-sm text-chess-charcoal">{selectedOrder.customer?.name || selectedOrder.shippingAddress?.firstName || "Guest"}</p>
                <p className="text-xs text-muted-foreground">{selectedOrder.customer?.email || selectedOrder.shippingAddress?.email || ""}</p>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="bg-chess-cream/30 rounded-sm p-4">
                  <h3 className="text-xs font-semibold text-chess-charcoal mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-chess-bronze" /> Shipping Address
                  </h3>
                  <p className="text-sm text-chess-charcoal">
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedOrder.shippingAddress.address}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.postalCode}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="text-xs font-semibold text-chess-charcoal mb-3">Items ({selectedOrder.items?.length || 0})</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-sm object-cover" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-chess-charcoal">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">SKU: {item.sku || "N/A"} · Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-chess-charcoal">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-border/50 pt-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{selectedOrder.shipping === 0 ? "Free" : formatCurrency(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-chess-charcoal pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Stripe Info */}
              {selectedOrder.stripePaymentIntentId && (
                <div className="bg-chess-cream/30 rounded-sm p-4">
                  <h3 className="text-xs font-semibold text-chess-charcoal mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-chess-bronze" /> Payment
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Stripe PI: <span className="font-mono text-chess-charcoal">{selectedOrder.stripePaymentIntentId}</span>
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
                <div className="flex gap-2 pt-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                    className="flex-1 h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-sm hover:bg-red-50 transition-colors"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
