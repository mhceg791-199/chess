/**
 * Admin Categories Management — Full CRUD with subcategory management.
 * Shows dynamic product counts, prevents deletion of categories with products.
 * Image upload via Cloudinary through FormData.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { adminApi } from "@/services/api";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, FolderTree, Package, Loader2,
  ChevronDown, ChevronRight, X, Save, AlertTriangle, Search,
  ArrowRightLeft, Upload, ImageIcon,
} from "lucide-react";

interface Subcategory {
  name: string;
  slug: string;
  productCount?: number;
}

interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  subcategories: Subcategory[];
  productCount: number;
}

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  subcategories: [] as { name: string; slug: string }[],
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImage, setExistingImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reassign modal
  const [showReassign, setShowReassign] = useState(false);
  const [reassignFrom, setReassignFrom] = useState("");
  const [reassignTo, setReassignTo] = useState("");
  const [reassigning, setReassigning] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCategories();
      setCategories(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function slugify(text: string): string {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-");
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setExistingImage("");
    setShowForm(true);
  }

  function openEditForm(cat: Category) {
    setEditingId(cat._id || cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon || "",
      subcategories: cat.subcategories.map((s) => ({ name: s.name, slug: s.slug })),
    });
    setImageFile(null);
    setImagePreview("");
    setExistingImage(cat.image || "");
    setShowForm(true);
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview("");
    setExistingImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function addSubcategory() {
    setForm((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, { name: "", slug: "" }],
    }));
  }

  function updateSubcategory(index: number, field: "name" | "slug", value: string) {
    setForm((prev) => {
      const subs = [...prev.subcategories];
      subs[index] = { ...subs[index], [field]: value };
      if (field === "name" && !subs[index].slug) {
        subs[index].slug = slugify(value);
      }
      return { ...prev, subcategories: subs };
    });
  }

  function removeSubcategory(index: number) {
    setForm((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!imageFile && !existingImage) {
      toast.error("Category image is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug || slugify(form.name));
      formData.append("description", form.description);
      formData.append("icon", form.icon);

      // Append subcategories as JSON string
      const validSubs = form.subcategories.filter((s) => s.name.trim());
      formData.append("subcategories", JSON.stringify(validSubs));

      // Append image file if selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingId) {
        await adminApi.updateCategory(editingId, formData);
        toast.success(`Category '${form.name}' updated`);
      } else {
        await adminApi.createCategory(formData);
        toast.success(`Category '${form.name}' created`);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setImageFile(null);
      setImagePreview("");
      setExistingImage("");
      loadCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteCategory(deleteTarget._id || deleteTarget.id);
      toast.success(`Category '${deleteTarget.name}' deleted`);
      setDeleteTarget(null);
      loadCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  }

  async function handleReassign() {
    if (!reassignFrom || !reassignTo || reassignFrom === reassignTo) {
      toast.error("Select different source and target categories");
      return;
    }
    setReassigning(true);
    try {
      const res = await adminApi.bulkReassignProducts({
        fromCategory: reassignFrom,
        toCategory: reassignTo,
      });
      toast.success(res.message || "Products reassigned");
      setShowReassign(false);
      setReassignFrom("");
      setReassignTo("");
      loadCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to reassign products");
    } finally {
      setReassigning(false);
    }
  }

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);

  const displayPreview = imagePreview || existingImage;

  return (
    <AdminLayout title="Categories" subtitle={`${categories.length} categories · ${totalProducts} total products`}>
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-chess-bronze"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowReassign(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-sm hover:bg-chess-cream transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Reassign Products
          </button>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bronze-gradient-black text-white rounded-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" /> New Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-chess-bronze" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FolderTree className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {search ? "No categories match your search" : "No categories yet. Create your first one."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((cat) => {
            const isExpanded = expandedId === (cat._id || cat.id);
            return (
              <div key={cat._id || cat.id} className="bg-white rounded-sm border border-border/50 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : (cat._id || cat.id))}
                    className="p-0.5 hover:bg-chess-cream rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-10 h-10 rounded-sm object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-chess-charcoal">{cat.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 bg-chess-cream text-muted-foreground rounded">
                        {cat.slug}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{cat.description}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-chess-charcoal">{cat.productCount}</p>
                      <p className="text-[10px] text-muted-foreground">products</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-chess-charcoal">{cat.subcategories.length}</p>
                      <p className="text-[10px] text-muted-foreground">subcategories</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditForm(cat)}
                        className="p-1.5 rounded-sm hover:bg-chess-cream transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 rounded-sm hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded: Subcategories */}
                {isExpanded && (
                  <div className="border-t border-border/30 bg-chess-offwhite/50 px-4 py-3">
                    {cat.subcategories.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No subcategories</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {cat.subcategories.map((sub) => (
                          <div
                            key={sub.slug}
                            className="flex items-center justify-between px-3 py-2 bg-white rounded-sm border border-border/30"
                          >
                            <div>
                              <p className="text-xs font-medium text-chess-charcoal">{sub.name}</p>
                              <p className="text-[10px] text-muted-foreground">{sub.slug}</p>
                            </div>
                            <span className="text-xs font-semibold text-chess-bronze">
                              {sub.productCount ?? 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ Create/Edit Modal ═══ */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <h2 className="font-display text-base font-semibold text-chess-charcoal">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-chess-cream rounded-sm">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                        slug: prev.slug || slugify(e.target.value),
                      }));
                    }}
                    className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                    placeholder="e.g. Appliances"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-chess-charcoal mb-1">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                    placeholder="auto-generated"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-chess-charcoal mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze resize-none"
                  placeholder="Brief description of the category"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-medium text-chess-charcoal mb-1">Category Image *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {displayPreview ? (
                  <div className="relative w-full h-40 rounded-sm overflow-hidden border border-border/50 bg-chess-cream">
                    <img
                      src={displayPreview}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 bg-white/90 rounded-sm hover:bg-white shadow-sm"
                        title="Replace image"
                      >
                        <Upload className="w-3.5 h-3.5 text-chess-charcoal" />
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-1.5 bg-white/90 rounded-sm hover:bg-white shadow-sm"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                    {imageFile && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded">
                        {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 hover:border-chess-bronze hover:bg-chess-cream/30 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground">Click to upload category image</span>
                    <span className="text-[10px] text-muted-foreground/60">Max 5MB · JPG, PNG, WebP</span>
                  </button>
                )}
              </div>

              {/* Icon Name */}
              <div>
                <label className="block text-xs font-medium text-chess-charcoal mb-1">Icon Name</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                  placeholder="e.g. Flame, Sofa, Lightbulb"
                />
              </div>

              {/* Subcategories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-chess-charcoal">Subcategories</label>
                  <button
                    onClick={addSubcategory}
                    className="flex items-center gap-1 text-[10px] font-medium text-chess-bronze hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {form.subcategories.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No subcategories. Click "Add" to create one.</p>
                ) : (
                  <div className="space-y-2">
                    {form.subcategories.map((sub, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => updateSubcategory(i, "name", e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                          placeholder="Subcategory name"
                        />
                        <input
                          type="text"
                          value={sub.slug}
                          onChange={(e) => updateSubcategory(i, "slug", e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                          placeholder="slug (auto)"
                        />
                        <button
                          onClick={() => removeSubcategory(i)}
                          className="p-1 hover:bg-red-50 rounded-sm"
                        >
                          <X className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border/50">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-medium border border-border rounded-sm hover:bg-chess-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bronze-gradient-black text-white rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Delete Confirmation Modal ═══ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-sm shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-chess-charcoal">Delete Category</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-chess-charcoal mb-2">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
            </p>

            {deleteTarget.productCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-sm mb-4">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-700">
                  This category has <strong>{deleteTarget.productCount} product{deleteTarget.productCount > 1 ? "s" : ""}</strong>.
                  You must reassign them before deleting.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-medium border border-border rounded-sm hover:bg-chess-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Reassign Products Modal ═══ */}
      {showReassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowReassign(false)} />
          <div className="relative bg-white rounded-sm shadow-xl w-full max-w-md p-6">
            <h3 className="font-display text-base font-semibold text-chess-charcoal mb-4">
              Bulk Reassign Products
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Move all products from one category to another. This is useful before deleting a category.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-chess-charcoal mb-1">From Category</label>
                <select
                  value={reassignFrom}
                  onChange={(e) => setReassignFrom(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                >
                  <option value="">Select source...</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.productCount} products)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-chess-charcoal mb-1">To Category</label>
                <select
                  value={reassignTo}
                  onChange={(e) => setReassignTo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                >
                  <option value="">Select target...</option>
                  {categories.filter((c) => c.slug !== reassignFrom).map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowReassign(false)}
                className="px-4 py-2 text-xs font-medium border border-border rounded-sm hover:bg-chess-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReassign}
                disabled={reassigning || !reassignFrom || !reassignTo}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bronze-gradient-black text-white rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {reassigning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
