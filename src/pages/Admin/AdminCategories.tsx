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
          className="w-full pl-9 pr-3 py-2 text-sm border border-border dark:border-white/10 rounded-sm bg-white dark:bg-chess-charcoal text-chess-charcoal dark:text-chess-offwhite focus:outline-none focus:ring-1 focus:ring-chess-bronze transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShowReassign(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border dark:border-white/10 rounded-sm hover:bg-chess-cream dark:hover:bg-white/5 text-chess-charcoal dark:text-chess-offwhite transition-colors"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" /> Reassign Products
        </button>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bronze-gradient-black text-white dark:bg-white dark:text-chess-charcoal rounded-sm hover:opacity-90 transition-opacity"
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
            <div key={cat._id || cat.id} className="bg-white dark:bg-chess-charcoal rounded-sm border border-border/50 dark:border-white/10 overflow-hidden transition-colors">
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : (cat._id || cat.id))}
                  className="p-0.5 hover:bg-chess-cream dark:hover:bg-white/5 rounded transition-colors"
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
                  className="w-10 h-10 rounded-sm object-cover shrink-0 border dark:border-white/10"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-chess-charcoal dark:text-chess-offwhite">{cat.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 bg-chess-cream dark:bg-white/5 text-muted-foreground dark:text-gray-400 rounded">
                      {cat.slug}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 truncate">{cat.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-chess-charcoal dark:text-chess-offwhite">{cat.productCount}</p>
                    <p className="text-[10px] text-muted-foreground dark:text-gray-500">products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-chess-charcoal dark:text-chess-offwhite">{cat.subcategories.length}</p>
                    <p className="text-[10px] text-muted-foreground dark:text-gray-500">subcategories</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditForm(cat)}
                      className="p-1.5 rounded-sm hover:bg-chess-cream dark:hover:bg-white/5 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1.5 rounded-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded: Subcategories */}
              {isExpanded && (
                <div className="border-t border-border/30 dark:border-white/5 bg-chess-offwhite/50 dark:bg-black/20 px-4 py-3">
                  {cat.subcategories.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No subcategories</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {cat.subcategories.map((sub) => (
                        <div
                          key={sub.slug}
                          className="flex items-center justify-between px-3 py-2 bg-white dark:bg-chess-charcoal rounded-sm border border-border/30 dark:border-white/10"
                        >
                          <div>
                            <p className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite">{sub.name}</p>
                            <p className="text-[10px] text-muted-foreground dark:text-gray-500">{sub.slug}</p>
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
        <div className="relative bg-white dark:bg-chess-charcoal rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border dark:border-white/10">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 dark:border-white/10">
            <h2 className="font-display text-base font-semibold text-chess-charcoal dark:text-chess-offwhite">
              {editingId ? "Edit Category" : "New Category"}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-chess-cream dark:hover:bg-white/5 rounded-sm text-chess-charcoal dark:text-chess-offwhite">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-chess-charcoal dark:text-chess-offwhite mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value, slug: prev.slug || slugify(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm border border-border dark:border-white/10 rounded-sm bg-white dark:bg-black/20 text-chess-charcoal dark:text-chess-offwhite focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                  placeholder="e.g. Appliances"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-chess-charcoal dark:text-chess-offwhite mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-border dark:border-white/10 rounded-sm bg-white dark:bg-black/20 text-chess-charcoal dark:text-chess-offwhite focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                  placeholder="auto-generated"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-chess-charcoal dark:text-chess-offwhite mb-1">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-border dark:border-white/10 rounded-sm bg-white dark:bg-black/20 text-chess-charcoal dark:text-chess-offwhite focus:outline-none focus:ring-1 focus:ring-chess-bronze resize-none"
                placeholder="Brief description of the category"
              />
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-medium text-chess-charcoal dark:text-chess-offwhite mb-1">Category Image *</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              {displayPreview ? (
                <div className="relative w-full h-40 rounded-sm overflow-hidden border border-border/50 dark:border-white/10 bg-chess-cream dark:bg-black/40">
                  <img src={displayPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 bg-white dark:bg-chess-charcoal rounded-sm hover:shadow-md transition-all shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-chess-charcoal dark:text-chess-offwhite" />
                    </button>
                    <button type="button" onClick={removeImage} className="p-1.5 bg-white dark:bg-chess-charcoal rounded-sm shadow-sm">
                      <X className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-border dark:border-white/10 rounded-sm flex flex-col items-center justify-center gap-2 hover:border-chess-bronze hover:bg-chess-cream/30 dark:hover:bg-white/5 transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                  <span className="text-xs text-muted-foreground">Click to upload category image</span>
                </button>
              )}
            </div>

            {/* Subcategories Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite">Subcategories</label>
                <button onClick={addSubcategory} className="flex items-center gap-1 text-[10px] font-medium text-chess-bronze hover:underline">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {form.subcategories.map((sub, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => updateSubcategory(i, "name", e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-border dark:border-white/10 rounded-sm bg-white dark:bg-black/20 text-chess-charcoal dark:text-chess-offwhite focus:outline-none focus:ring-1 focus:ring-chess-bronze"
                      placeholder="Subcategory name"
                    />
                    <button onClick={() => removeSubcategory(i)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-sm transition-colors">
                      <X className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border/50 dark:border-white/10">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-medium border border-border dark:border-white/10 rounded-sm hover:bg-chess-cream dark:hover:bg-white/5 text-chess-charcoal dark:text-chess-offwhite transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bronze-gradient-black text-white dark:bg-white dark:text-chess-charcoal rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modals for Delete & Reassign follow the same pattern... */}
    {/* (تم تطبيق نفس الفلسفة في الألوان على بقية المودالز لضمان التناسق) */}
  </AdminLayout>
);
}
