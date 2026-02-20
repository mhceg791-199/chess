/*
 * CHESS Admin Dashboard — Overview with AdminLayout sidebar.
 * Shows revenue, orders, customers, and inventory alerts.
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/services/api";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";
import {
  DollarSign, Package, Users, ShoppingCart,
  AlertTriangle, Loader2, ArrowUpRight, ArrowDownRight,
  RefreshCw,
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  revenueChange: number;
  orderChange: number;
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    loadDashboard();
  }, [isAdmin]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [statsRes, ordersRes, inventoryRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getRecentOrders(),
        adminApi.getLowStock(),
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data || []);
      setLowStockItems(inventoryRes.data?.data || []);
    } catch (err: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: stats?.revenueChange || 0,
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total Orders",
      value: (stats?.totalOrders || 0).toLocaleString(),
      change: stats?.orderChange || 0,
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Customers",
      value: (stats?.totalCustomers || 0).toLocaleString(),
      change: 0,
      icon: <Users className="w-5 h-5" />,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Pending Orders",
      value: (stats?.pendingOrders || 0).toLocaleString(),
      change: 0,
      icon: <Package className="w-5 h-5" />,
      color: "text-orange-600 bg-orange-50",
    },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your store performance">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-chess-bronze" />
        </div>
      ) : (
        <>
          {/* Refresh */}
          <div className="flex justify-end mb-4">
            <button
              onClick={loadDashboard}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-sm hover:bg-chess-cream transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white rounded-sm border border-border/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-xl font-semibold text-chess-charcoal">{stat.value}</p>
                {stat.change !== 0 && (
                  <div className={`flex items-center gap-1 mt-1 text-xs ${stat.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {stat.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stat.change)}% from last month
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-sm border border-border/50">
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <h2 className="font-display text-base font-semibold text-chess-charcoal">Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs text-chess-bronze hover:underline">View all →</Link>
              </div>
              <div className="divide-y divide-border/30">
                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">No orders yet</div>
                ) : (
                  recentOrders.slice(0, 8).map((order) => (
                    <div key={order._id} className="flex items-center justify-between px-5 py-3 hover:bg-chess-cream/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-chess-charcoal">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer?.name || "Guest"} · {new Date(order.createdAt).toLocaleDateString("en-CA")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-sm capitalize
                          ${order.status === "delivered" ? "bg-green-50 text-green-600" :
                            order.status === "shipped" ? "bg-blue-50 text-blue-600" :
                            order.status === "cancelled" ? "bg-red-50 text-red-600" :
                            "bg-yellow-50 text-yellow-600"}`}>
                          {order.status}
                        </span>
                        <span className="text-sm font-medium text-chess-charcoal">
                          ${order.total?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-sm border border-border/50">
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <h2 className="font-display text-base font-semibold text-chess-charcoal flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" /> Low Stock
                </h2>
                <Link href="/admin/inventory" className="text-xs text-chess-bronze hover:underline">View all →</Link>
              </div>
              <div className="divide-y divide-border/30">
                {lowStockItems.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">All items in stock</div>
                ) : (
                  lowStockItems.slice(0, 6).map((item) => (
                    <div key={item._id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-chess-charcoal truncate max-w-[180px]">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                      </div>
                      <span className={`text-xs font-semibold ${item.stock === 0 ? "text-red-600" : "text-orange-600"}`}>
                        {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Manage Categories", href: "/admin/categories", desc: "Add, edit, or remove categories" },
              { label: "Manage Products", href: "/admin/products", desc: "Add, edit, or remove products" },
              { label: "View Orders", href: "/admin/orders", desc: "Process and track orders" },
              { label: "Manage Customers", href: "/admin/customers", desc: "View customer accounts" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-sm border border-border/50 p-4 hover:border-chess-bronze/30 hover:shadow-sm transition-all"
              >
                <p className="text-sm font-semibold text-chess-charcoal mb-1">{link.label}</p>
                <p className="text-[10px] text-muted-foreground">{link.desc}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
