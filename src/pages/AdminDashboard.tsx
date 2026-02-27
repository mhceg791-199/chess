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
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border dark:border-white/10 rounded-sm hover:bg-chess-cream dark:hover:bg-white/5 text-chess-charcoal dark:text-chess-offwhite transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-chess-charcoal rounded-sm border border-border/50 dark:border-white/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground dark:text-gray-400">{stat.label}</span>
                <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-xl font-semibold text-chess-charcoal dark:text-chess-offwhite">{stat.value}</p>
              {stat.change !== 0 && (
                <div className={`flex items-center gap-1 mt-1 text-xs ${stat.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {stat.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(stat.change)}% from last month
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white dark:bg-chess-charcoal rounded-sm border border-border/50 dark:border-white/10">
            <div className="flex items-center justify-between p-5 border-b border-border/50 dark:border-white/10">
              <h2 className="font-display text-base font-semibold text-chess-charcoal dark:text-chess-offwhite">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-chess-bronze hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-border/30 dark:divide-white/5">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground dark:text-gray-500 text-sm">No orders yet</div>
              ) : (
                recentOrders.slice(0, 8).map((order) => (
                  <div key={order._id} className="flex items-center justify-between px-5 py-3 hover:bg-chess-cream/30 dark:hover:bg-white/5 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-chess-charcoal dark:text-chess-offwhite">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        {order.customer?.name || "Guest"} · {new Date(order.createdAt).toLocaleDateString("en-CA")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-sm capitalize
                        ${order.status === "delivered" ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" :
                          order.status === "shipped" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                          order.status === "cancelled" ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" :
                          "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-medium text-chess-charcoal dark:text-chess-offwhite">
                        ${order.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white dark:bg-chess-charcoal rounded-sm border border-border/50 dark:border-white/10">
            <div className="flex items-center justify-between p-5 border-b border-border/50 dark:border-white/10">
              <h2 className="font-display text-base font-semibold text-chess-charcoal dark:text-chess-offwhite flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" /> Low Stock
              </h2>
              <Link href="/admin/inventory" className="text-xs text-chess-bronze hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-border/30 dark:divide-white/5">
              {lowStockItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground dark:text-gray-500 text-sm">All items in stock</div>
              ) : (
                lowStockItems.slice(0, 6).map((item) => (
                  <div key={item._id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-chess-charcoal dark:text-chess-offwhite truncate max-w-[180px]">{item.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">{item.sku}</p>
                    </div>
                    <span className={`text-xs font-semibold ${item.stock === 0 ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`}>
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
              className="bg-white dark:bg-chess-charcoal rounded-sm border border-border/50 dark:border-white/10 p-4 hover:border-chess-bronze/30 dark:hover:border-chess-bronze/50 hover:shadow-sm transition-all"
            >
              <p className="text-sm font-semibold text-chess-charcoal dark:text-chess-offwhite mb-1">{link.label}</p>
              <p className="text-[10px] text-muted-foreground dark:text-gray-400">{link.desc}</p>
            </Link>
          ))}
        </div>
      </>
    )}
  </AdminLayout>
);
}
