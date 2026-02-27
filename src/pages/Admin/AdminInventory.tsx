/*
 * CHESS Admin Inventory Management — Stock levels, low stock alerts, inline editing.
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/services/api";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";
import {
  Package, Search, Loader2, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle2, XCircle, RefreshCw,
  Save, Edit3, Filter,
} from "lucide-react";

type StockFilter = "" | "in_stock" | "low_stock" | "out_of_stock";

export default function AdminInventory() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkUpdates, setBulkUpdates] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({ inStock: 0, lowStock: 0, outOfStock: 0, total: 0 });

  useEffect(() => {
    if (isAdmin) {
      loadInventory();
      loadCategories();
    }
  }, [isAdmin, page, stockFilter, categoryFilter]);

  async function loadCategories() {
    try {
      const res = await adminApi.getCategories();
      setCategories(res.data || []);
    } catch { }
  }

  async function loadInventory() {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "30",
      };
      // Map frontend filter values to backend query params
      if (stockFilter === "in_stock") params.status = "in-stock";
      else if (stockFilter === "low_stock") params.status = "low-stock";
      else if (stockFilter === "out_of_stock") params.status = "out-of-stock";
      if (categoryFilter) params.category = categoryFilter;
      if (search) params.search = search;

      const res = await adminApi.getInventoryReport(params);
      const data = res.data as any;
      setProducts(data?.products || []);
      if (res.pagination) {
        setTotalPages(res.pagination.pages);
        setTotal(res.pagination.total);
      }
      if (data?.summary) {
        setStats({
          inStock: data.summary.inStock || 0,
          lowStock: data.summary.lowStock || 0,
          outOfStock: data.summary.outOfStock || 0,
          total: data.summary.totalProducts || 0,
        });
      }
    } catch (err: any) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveStock(productId: string, newStock: number) {
    setSaving(true);
    try {
      await adminApi.updateInventory(productId, newStock);
      toast.success("Stock updated");
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, inventory: newStock } : p))
      );
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update stock");
    } finally {
      setSaving(false);
    }
  }

  async function handleBulkSave() {
    const entries = Object.entries(bulkUpdates);
    if (entries.length === 0) {
      toast("No changes to save");
      return;
    }
    setSaving(true);
    let successCount = 0;
    for (const [id, qty] of entries) {
      try {
        await adminApi.updateInventory(id, qty);
        successCount++;
      } catch { }
    }
    toast.success(`Updated ${successCount} of ${entries.length} items`);
    setBulkUpdates({});
    setBulkMode(false);
    setSaving(false);
    loadInventory();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadInventory();
  }

  function getStockStatus(product: any) {
    const stock = product.inventory ?? product.stock ?? 0;
    const threshold = product.lowStockThreshold || 10;
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-50", icon: <XCircle className="w-3 h-3" /> };
    if (stock <= threshold) return { label: "Low Stock", color: "text-orange-600", bg: "bg-orange-50", icon: <AlertTriangle className="w-3 h-3" /> };
    return { label: "In Stock", color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle2 className="w-3 h-3" /> };
  }

  const stockFilterOptions: { value: StockFilter; label: string; count: number }[] = [
    { value: "", label: "All Items", count: stats.total },
    { value: "in_stock", label: "In Stock", count: stats.inStock },
    { value: "low_stock", label: "Low Stock", count: stats.lowStock },
    { value: "out_of_stock", label: "Out of Stock", count: stats.outOfStock },
  ];

  return (
    <AdminLayout title="Inventory" subtitle="Manage stock levels and alerts">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stockFilterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setStockFilter(opt.value); setPage(1); }}
            className={`p-4 rounded-sm border text-left transition-all
            ${stockFilter === opt.value
                ? "border-white/20 bg-chess-bronze/5 dark:bg-white/30"
                : "border-border/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-chess-bronze/30"}`}
          >
            <p className="text-xl font-semibold text-chess-charcoal dark:text-zinc-100">{opt.count}</p>
            <p className="text-xs text-muted-foreground">{opt.label}</p>
          </button>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU..."
            className="w-full h-10 pl-9 pr-3 text-sm border border-border dark:border-zinc-800 rounded-sm focus:outline-none focus:border-chess-bronze bg-white dark:bg-zinc-900 dark:text-zinc-200"
          />
        </form>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 text-sm border border-border dark:border-zinc-800 rounded-sm focus:outline-none focus:border-chess-bronze bg-white dark:bg-zinc-900 dark:text-zinc-200"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={() => { setBulkMode(!bulkMode); setBulkUpdates({}); }}
          className={`h-10 px-3 flex items-center gap-1.5 text-sm border rounded-sm transition-colors
          ${bulkMode
              ? "border-chess-bronze bg-chess-bronze/10 text-chess-bronze"
              : "border-border dark:border-zinc-800 dark:text-zinc-300 hover:bg-chess-cream dark:hover:bg-zinc-800"}`}
        >
          <Edit3 className="w-3.5 h-3.5" /> {bulkMode ? "Cancel Bulk" : "Bulk Edit"}
        </button>
        {bulkMode && Object.keys(bulkUpdates).length > 0 && (
          <button
            onClick={handleBulkSave}
            disabled={saving}
            className="h-10 px-4 flex items-center gap-1.5 text-sm font-medium bronze-gradient text-chess-charcoal rounded-sm hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save {Object.keys(bulkUpdates).length} Changes
          </button>
        )}
        <button onClick={loadInventory}
          className="h-10 px-3 flex items-center gap-1.5 text-sm border border-border dark:border-zinc-800 rounded-sm hover:bg-chess-cream dark:hover:bg-zinc-800 dark:text-zinc-300 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-chess-bronze" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-sm border border-border/50 dark:border-zinc-800 p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-zinc-900 rounded-sm border border-border/50 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 dark:border-zinc-800 bg-chess-cream/30 dark:bg-zinc-800/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal dark:text-zinc-300">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal dark:text-zinc-300">SKU</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal dark:text-zinc-300">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal dark:text-zinc-300">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal dark:text-zinc-300">Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal dark:text-zinc-300">Threshold</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal dark:text-zinc-300">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal dark:text-zinc-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 dark:divide-zinc-800/50">
                  {products.map((product) => {
                    const stock = product.inventory ?? product.stock ?? 0;
                    const ss = getStockStatus(product);
                    const isEditing = editingId === product._id;
                    const hasBulkChange = bulkUpdates[product._id] !== undefined;

                    return (
                      <tr key={product._id} className={`hover:bg-chess-cream/20 dark:hover:bg-zinc-800/30 transition-colors ${hasBulkChange ? "bg-chess-bronze/5 dark:bg-chess-bronze/10" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.image && (
                              <img src={product.image} alt="" className="w-8 h-8 rounded-sm object-cover border dark:border-zinc-800" />
                            )}
                            <p className="text-sm font-medium text-chess-charcoal dark:text-zinc-200 truncate max-w-[200px]">{product.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{product.sku}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{product.category}</td>
                        <td className="px-4 py-3 text-sm text-chess-charcoal dark:text-zinc-200">${(product.price || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {bulkMode ? (
                            <input
                              type="number"
                              min="0"
                              value={bulkUpdates[product._id] ?? stock}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                if (val !== stock) {
                                  setBulkUpdates({ ...bulkUpdates, [product._id]: val });
                                } else {
                                  const updated = { ...bulkUpdates };
                                  delete updated[product._id];
                                  setBulkUpdates(updated);
                                }
                              }}
                              className="w-20 h-8 px-2 text-sm border border-border dark:border-zinc-700 rounded-sm focus:outline-none focus:border-chess-bronze bg-white dark:bg-zinc-800 dark:text-zinc-200 text-center"
                            />
                          ) : isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                value={editValue}
                                onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                                className="w-20 h-8 px-2 text-sm border border-chess-bronze rounded-sm focus:outline-none bg-white dark:bg-zinc-800 dark:text-zinc-200 text-center"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveStock(product._id, editValue);
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                              />
                              <button
                                onClick={() => handleSaveStock(product._id, editValue)}
                                disabled={saving}
                                className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-sm"
                              >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 text-muted-foreground hover:bg-chess-cream dark:hover:bg-zinc-800 rounded-sm"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className={`text-sm font-semibold ${stock === 0 ? "text-red-600 dark:text-red-400" : stock <= (product.lowStockThreshold || 10) ? "text-orange-600 dark:text-orange-400" : "text-chess-charcoal dark:text-zinc-200"}`}>
                              {stock}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.lowStockThreshold || 10}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-sm ${ss.bg} ${ss.color} dark:bg-opacity-20`}>
                            {ss.icon} {ss.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {!bulkMode && !isEditing && (
                            <button
                              onClick={() => { setEditingId(product._id); setEditValue(stock); }}
                              className="p-1.5 text-chess-bronze dark:text-white hover:bg-chess-cream dark:hover:bg-zinc-800 rounded-sm transition-colors"
                              title="Edit stock"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
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
                Page {page} of {totalPages} ({total} products)
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border dark:border-zinc-800 rounded-sm hover:bg-chess-cream dark:hover:bg-zinc-800 dark:text-zinc-400 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-border dark:border-zinc-800 rounded-sm hover:bg-chess-cream dark:hover:bg-zinc-800 dark:text-zinc-400 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
