/**
 * Admin Products Management — Full CRUD with Cloudinary image upload.
 * Supports search, filter by category, pagination, inline inventory editing,
 * and file upload for main image + gallery images.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { adminApi } from "@/services/api";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Package, Loader2, Search, X, Save,
  AlertTriangle, ChevronLeft, ChevronRight, Upload, ImageIcon,
} from "lucide-react";

interface Product {
  _id: string;
  customId?: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inventory: number;
  lowStockThreshold: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  warranty: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories: { name: string; slug: string }[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [inventory, setInventory] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [warranty, setWarranty] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [specsText, setSpecsText] = useState("");

  // File upload state
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingImage, setExistingImage] = useState("");
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "20",
        sort: "-createdAt",
      };
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;

      const res = await adminApi.getProducts(params);
      setProducts(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.pages);
        setTotal(res.pagination.total);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCategory]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await adminApi.getCategories();
      setCategories(res.data || []);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function getSubcategories(catSlug: string) {
    const cat = categories.find((c) => c.slug === catSlug);
    return cat?.subcategories || [];
  }

  function resetForm() {
    setSku(""); setName(""); setBrand(""); setPrice(0); setOriginalPrice("");
    setCategory(""); setSubcategory(""); setDescription(""); setInventory(0);
    setLowStockThreshold(5); setWarranty(""); setFeaturesText(""); setTagsText("");
    setSpecsText(""); setMainImageFile(null); setMainImagePreview(""); setGalleryFiles([]);
    setGalleryPreviews([]); setExistingImage(""); setExistingGallery([]);
  }

  function openCreateForm() {
    setEditingId(null);
    resetForm();
    setShowForm(true);
  }

  function openEditForm(p: Product) {
    setEditingId(p._id);
    setSku(p.sku); setName(p.name); setBrand(p.brand); setPrice(p.price);
    setOriginalPrice(p.originalPrice || ""); setCategory(p.category);
    setSubcategory(p.subcategory); setDescription(p.description);
    setInventory(p.inventory); setLowStockThreshold(p.lowStockThreshold || 5);
    setWarranty(p.warranty || "");
    setFeaturesText((p.features || []).join("\n"));
    setTagsText((p.tags || []).join(", "));
    setSpecsText(Object.entries(p.specifications || {}).map(([k, v]) => `${k}: ${v}`).join("\n"));
    setMainImageFile(null); setMainImagePreview(""); setGalleryFiles([]);
    setGalleryPreviews([]); setExistingImage(p.image); setExistingGallery(p.images || []);
    setShowForm(true);
  }

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files]);
      setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    }
  }

  function removeGalleryPreview(index: number) {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingGallery(index: number) {
    setExistingGallery((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!sku.trim()) { toast.error("SKU is required"); return; }
    if (!name.trim()) { toast.error("Product name is required"); return; }
    if (!category.trim()) { toast.error("Category is required"); return; }
    if (!subcategory.trim()) { toast.error("Subcategory is required"); return; }
    if (price < 0) { toast.error("Valid price is required"); return; }

    setSaving(true);
    try {
      const features = featuresText.split("\n").map((s) => s.trim()).filter(Boolean);
      const tags = tagsText.split(",").map((s) => s.trim()).filter(Boolean);
      const specifications: Record<string, string> = {};
      specsText.split("\n").forEach((line) => {
        const idx = line.indexOf(":");
        if (idx > 0) specifications[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      });

      const formData = new FormData();
      formData.append("sku", sku);
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("price", price.toString());
      if (originalPrice !== "") formData.append("originalPrice", originalPrice.toString());
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("description", description);
      formData.append("inventory", inventory.toString());
      formData.append("lowStockThreshold", lowStockThreshold.toString());
      formData.append("warranty", warranty);
      formData.append("features", JSON.stringify(features));
      formData.append("tags", JSON.stringify(tags));
      formData.append("specifications", JSON.stringify(specifications));
      formData.append("inStock", (inventory > 0).toString());

      // Main image
      if (mainImageFile) {
        formData.append("image", mainImageFile);
      } else if (existingImage) {
        formData.append("existingImage", existingImage);
      }

      // Gallery images — new files
      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });
      // Gallery images — keep existing
      if (existingGallery.length > 0) {
        formData.append("existingImages", JSON.stringify(existingGallery));
      }

      if (editingId) {
        await adminApi.updateProduct(editingId, formData);
        toast.success(`Product '${name}' updated`);
      } else {
        await adminApi.createProduct(formData);
        toast.success(`Product '${name}' created`);
      }

      setShowForm(false);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteProduct(deleteTarget._id);
      toast.success(`Product '${deleteTarget.name}' deleted`);
      setDeleteTarget(null);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  async function handleQuickInventory(productId: string, inv: number) {
    try {
      await adminApi.updateInventory(productId, inv);
      toast.success("Inventory updated");
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to update inventory");
    }
  }

  return (
    <AdminLayout title="Products" subtitle={`${total} products across ${categories.length} categories`}>
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-chess-bronze"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-chess-bronze"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bronze-gradient-black text-white rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" /> New Product
        </button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-chess-bronze" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No products found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-sm border border-border/50 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-chess-offwhite/50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">SKU</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Category</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Price</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Stock</th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-border/30 hover:bg-chess-offwhite/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-sm object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-sm bg-chess-cream flex items-center justify-center shrink-0">
                            <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-chess-charcoal truncate max-w-[200px]">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-chess-charcoal">{p.category}</span>
                      <span className="text-[10px] text-muted-foreground block">{p.subcategory}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-sm font-semibold text-chess-charcoal">${p.price.toLocaleString()}</span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-[10px] text-muted-foreground line-through block">
                          ${p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <input
                        type="number"
                        min={0}
                        defaultValue={p.inventory}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val !== p.inventory) handleQuickInventory(p._id, val);
                        }}
                        className="w-16 text-right px-2 py-1 text-xs border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          p.inStock
                            ? p.inventory <= (p.lowStockThreshold || 5)
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {p.inStock ? (p.inventory <= (p.lowStockThreshold || 5) ? "Low" : "In Stock") : "Out"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEditForm(p)} className="p-1.5 rounded-sm hover:bg-chess-cream transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-sm hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">Page {page} of {totalPages} · {total} products</p>
              <div className="flex gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-sm border border-border hover:bg-chess-cream disabled:opacity-30 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-sm border border-border hover:bg-chess-cream disabled:opacity-30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══ Create/Edit Modal ═══ */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-sm shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <h2 className="font-display text-base font-semibold text-chess-charcoal">
                {editingId ? "Edit Product" : "New Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-chess-cream rounded-sm">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Row 1: SKU, Name, Brand */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">SKU *</label>
                  <input type="text" value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze font-mono" placeholder="CHE-APP-001" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze" placeholder="Product name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Brand</label>
                  <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze" placeholder="Brand name" />
                </div>
              </div>

              {/* Row 2: Category, Subcategory */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Category *</label>
                  <select value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory(""); }} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze">
                    <option value="">Select category...</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Subcategory *</label>
                  <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze" disabled={!category}>
                    <option value="">Select subcategory...</option>
                    {getSubcategories(category).map((s) => (
                      <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Price, Original Price, Inventory, Low Stock, Warranty */}
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Price (CAD) *</label>
                  <input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Original Price</label>
                  <input type="number" min={0} step={0.01} value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value ? parseFloat(e.target.value) : "")} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze" placeholder="For sale" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Inventory</label>
                  <input type="number" min={0} value={inventory} onChange={(e) => setInventory(parseInt(e.target.value, 10) || 0)} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Low Stock At</label>
                  <input type="number" min={0} value={lowStockThreshold} onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 5)} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Warranty</label>
                  <input type="text" value={warranty} onChange={(e) => setWarranty(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze" placeholder="2 years" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-chess-charcoal mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze resize-none" />
              </div>

              {/* ═══ Image Upload Section ═══ */}
              <div className="border border-border/50 rounded-sm p-4 bg-chess-offwhite/30">
                <h3 className="text-xs font-semibold text-chess-charcoal mb-3 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Product Images
                </h3>

                {/* Main Image */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Main Image</label>
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => mainImageRef.current?.click()}
                      className="w-24 h-24 border-2 border-dashed border-border rounded-sm flex items-center justify-center cursor-pointer hover:border-chess-bronze transition-colors overflow-hidden"
                    >
                      {mainImagePreview ? (
                        <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : existingImage ? (
                        <img src={existingImage} alt="Current" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground/40 mx-auto" />
                          <span className="text-[10px] text-muted-foreground">Click to upload</span>
                        </div>
                      )}
                    </div>
                    <input ref={mainImageRef} type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                    <div className="text-xs text-muted-foreground">
                      <p>Click the box to upload main product image.</p>
                      <p>Supports JPG, PNG, WebP. Max 5MB.</p>
                      {mainImageFile && <p className="text-chess-bronze mt-1">New file: {mainImageFile.name}</p>}
                    </div>
                  </div>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Gallery Images (up to 8)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {/* Existing gallery */}
                    {existingGallery.map((url, i) => (
                      <div key={`existing-${i}`} className="relative w-16 h-16 rounded-sm overflow-hidden border border-border group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeExistingGallery(i)}
                          className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {/* New gallery previews */}
                    {galleryPreviews.map((url, i) => (
                      <div key={`new-${i}`} className="relative w-16 h-16 rounded-sm overflow-hidden border border-chess-bronze group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeGalleryPreview(i)}
                          className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {/* Add more button */}
                    {(existingGallery.length + galleryFiles.length) < 8 && (
                      <div
                        onClick={() => galleryRef.current?.click()}
                        className="w-16 h-16 border-2 border-dashed border-border rounded-sm flex items-center justify-center cursor-pointer hover:border-chess-bronze transition-colors"
                      >
                        <Plus className="w-5 h-5 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
                  <p className="text-[10px] text-muted-foreground">{existingGallery.length + galleryFiles.length} of 8 images</p>
                </div>
              </div>

              {/* Features (one per line) */}
              <div>
                <label className="block text-xs font-medium text-chess-charcoal mb-1">Features (one per line)</label>
                <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze resize-none font-mono" placeholder={"Energy Star certified\nStainless steel finish\nQuiet operation"} />
              </div>

              {/* Specifications (key: value per line) */}
              <div>
                <label className="block text-xs font-medium text-chess-charcoal mb-1">Specifications (key: value per line)</label>
                <textarea value={specsText} onChange={(e) => setSpecsText(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze resize-none font-mono" placeholder={"Width: 30 inches\nHeight: 36 inches\nWeight: 150 lbs"} />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-chess-charcoal mb-1">Tags (comma-separated)</label>
                <input type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze" placeholder="energy-efficient, premium, sale" />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-xs font-medium border border-border rounded-sm hover:bg-chess-cream transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bronze-gradient-black text-white rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-sm shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-chess-charcoal">Delete Product</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-chess-charcoal mb-4">
              Delete <strong>{deleteTarget.name}</strong> ({deleteTarget.sku})?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-xs font-medium border border-border rounded-sm hover:bg-chess-cream transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
