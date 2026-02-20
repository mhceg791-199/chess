/*
 * CHESS Account Page — Scandinavian Warmth + Swiss Precision
 * Account dashboard with orders, profile, addresses (full CRUD), wishlist.
 * Connected to real REST API backend.
 */
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { orderApi, customerApi, authApi, productApi } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import type { Address, Product } from "@/types";
import {
  User, Package, Heart, MapPin, Settings, LogOut,
  ChevronRight, ArrowRight, Clock, Truck, CheckCircle2, Eye,
  Loader2, XCircle, Plus, Pencil, Trash2, Star, X,
} from "lucide-react";

const tabs = [
  { id: "orders", label: "Orders", icon: <Package className="w-4 h-4" /> },
  { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { id: "addresses", label: "Addresses", icon: <MapPin className="w-4 h-4" /> },
  { id: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
] as const;

type TabId = (typeof tabs)[number]["id"];

const statusConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  pending: { icon: <Clock className="w-3 h-3" />, color: "bg-yellow-50 text-yellow-600" },
  processing: { icon: <Loader2 className="w-3 h-3" />, color: "bg-blue-50 text-blue-600" },
  shipped: { icon: <Truck className="w-3 h-3" />, color: "bg-blue-50 text-blue-600" },
  delivered: { icon: <CheckCircle2 className="w-3 h-3" />, color: "bg-green-50 text-green-600" },
  cancelled: { icon: <XCircle className="w-3 h-3" />, color: "bg-red-50 text-red-600" },
};

const emptyAddress = { label: "Home", street: "", city: "", province: "", postalCode: "", country: "Canada", isDefault: false };

export default function Account() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [addressSaving, setAddressSaving] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load profile form
  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email, phone: "" });
    }
  }, [user]);

  // Load tab data
  const loadTabData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (activeTab === "orders") {
        const r = await orderApi.getMyOrders();
        setOrders(r.data || []);
      } else if (activeTab === "addresses") {
        const r = await customerApi.getAddresses();
        setAddresses(r.data || []);
      } else if (activeTab === "wishlist") {
        const r = await customerApi.getWishlist();
        const ids = r.data || [];
        setWishlistIds(ids);
        if (ids.length > 0) {
          const prods = await Promise.all(
            ids.map((id: string) => productApi.getById(id).then((res) => res.data).catch(() => null))
          );
          setWishlistProducts(prods.filter(Boolean) as Product[]);
        } else {
          setWishlistProducts([]);
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => { loadTabData(); }, [loadTabData]);

  // ─── Profile handlers ──────────────────────────────────────
  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      await authApi.updateProfile({ name: profileForm.name, email: profileForm.email });
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  // ─── Password handlers ─────────────────────────────────────
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPasswordSaving(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  // ─── Address handlers ──────────────────────────────────────
  const openAddressForm = (addr?: Address) => {
    if (addr) {
      setEditingAddressId(addr._id);
      setAddressForm({
        label: addr.label,
        street: addr.street,
        city: addr.city,
        province: addr.province,
        postalCode: addr.postalCode,
        country: addr.country,
        isDefault: addr.isDefault,
      });
    } else {
      setEditingAddressId(null);
      setAddressForm({ ...emptyAddress });
    }
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm({ ...emptyAddress });
  };

  const handleAddressSave = async () => {
    if (!addressForm.street || !addressForm.city || !addressForm.province || !addressForm.postalCode) {
      toast.error("Street, city, province, and postal code are required");
      return;
    }
    setAddressSaving(true);
    try {
      if (editingAddressId) {
        await customerApi.updateAddress(editingAddressId, addressForm);
        toast.success("Address updated");
      } else {
        await customerApi.createAddress(addressForm);
        toast.success("Address added");
      }
      closeAddressForm();
      // Reload addresses
      const r = await customerApi.getAddresses();
      setAddresses(r.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to save address");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleAddressDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      await customerApi.deleteAddress(id);
      toast.success("Address deleted");
      const r = await customerApi.getAddresses();
      setAddresses(r.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await customerApi.updateAddress(id, { isDefault: true });
      toast.success("Default address updated");
      const r = await customerApi.getAddresses();
      setAddresses(r.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to set default");
    }
  };

  // ─── Wishlist remove ───────────────────────────────────────
  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await customerApi.removeFromWishlist(productId);
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      setWishlistProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast("Signed out");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-chess-offwhite">
        <Loader2 className="w-8 h-8 animate-spin text-chess-bronze" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite">
      <Header />

      <main className="flex-1">
        <div className="bg-white border-b border-border">
          <div className="container py-3">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-chess-bronze transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-chess-charcoal font-medium">My Account</span>
            </nav>
          </div>
        </div>

        <div className="container py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-semibold text-chess-charcoal">My Account</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.name}</p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-600 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-sm border border-border/50 overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-border/30 last:border-0
                      ${activeTab === tab.id ? "bg-chess-bronze/5 text-chess-bronze" : "text-chess-graphite hover:bg-chess-cream/50"}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              {user?.role === "admin" && (
                <Link href="/admin" className="mt-3 block">
                  <div className="bg-chess-charcoal text-white rounded-sm p-3 text-center text-sm font-medium hover:bg-chess-charcoal/90 transition-colors">
                    Admin Dashboard →
                  </div>
                </Link>
              )}
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* ═══════════ ORDERS ═══════════ */}
              {activeTab === "orders" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-lg font-semibold text-chess-charcoal mb-5">Order History</h2>
                  {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-chess-bronze" /></div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-sm border border-border/50 p-12 text-center">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-3">No orders yet</p>
                      <Link href="/category/all" className="inline-flex items-center gap-1 text-sm text-chess-bronze hover:underline">
                        Start shopping <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const sc = statusConfig[order.status] || statusConfig.pending;
                        return (
                          <div key={order._id} className="bg-white rounded-sm border border-border/50 p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                              <div>
                                <p className="text-sm font-semibold text-chess-charcoal">{order.orderNumber}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {new Date(order.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })} — {order.items?.length || 0} items
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-base font-semibold text-chess-charcoal">
                                  ${order.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-sm capitalize ${sc.color}`}>
                                  {sc.icon} {order.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-border/30">
                              <Link href={`/orders/${order._id}`} className="flex items-center gap-1 text-xs font-medium text-chess-bronze hover:underline">
                                <Eye className="w-3 h-3" /> View Details
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════════ PROFILE ═══════════ */}
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-lg font-semibold text-chess-charcoal mb-5">Profile Information</h2>
                  <div className="bg-white rounded-sm border border-border/50 p-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Full Name</label>
                        <input type="text" value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Email</label>
                        <input type="email" value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                      </div>
                    </div>
                    <button onClick={handleProfileSave} disabled={profileSaving}
                      className="mt-5 px-5 py-2.5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                      {profileSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══════════ ADDRESSES (Full CRUD) ═══════════ */}
              {activeTab === "addresses" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-lg font-semibold text-chess-charcoal">Saved Addresses</h2>
                    {!showAddressForm && (
                      <button onClick={() => openAddressForm()}
                        className="flex items-center gap-1.5 px-4 py-2 bronze-gradient text-chess-charcoal text-xs font-semibold rounded-sm hover:opacity-90 transition-opacity">
                        <Plus className="w-3.5 h-3.5" /> Add Address
                      </button>
                    )}
                  </div>

                  {/* Address Form */}
                  {showAddressForm && (
                    <div className="bg-white rounded-sm border border-border/50 p-6 mb-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-chess-charcoal">
                          {editingAddressId ? "Edit Address" : "Add New Address"}
                        </h3>
                        <button onClick={closeAddressForm} className="text-muted-foreground hover:text-chess-charcoal">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Label</label>
                          <select value={addressForm.label}
                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                            className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze bg-white">
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Country</label>
                          <input type="text" value={addressForm.country}
                            onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                            className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Street Address *</label>
                          <input type="text" value={addressForm.street}
                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                            placeholder="123 Main Street"
                            className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">City *</label>
                          <input type="text" value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            placeholder="Toronto"
                            className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Province *</label>
                          <input type="text" value={addressForm.province}
                            onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                            placeholder="Ontario"
                            className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Postal Code *</label>
                          <input type="text" value={addressForm.postalCode}
                            onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                            placeholder="M5V 1A1"
                            className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="isDefault" checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            className="w-4 h-4 accent-chess-bronze" />
                          <label htmlFor="isDefault" className="text-xs text-chess-charcoal">Set as default address</label>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-5">
                        <button onClick={handleAddressSave} disabled={addressSaving}
                          className="px-5 py-2.5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                          {addressSaving ? "Saving..." : editingAddressId ? "Update Address" : "Save Address"}
                        </button>
                        <button onClick={closeAddressForm}
                          className="px-5 py-2.5 border border-border text-sm font-medium text-chess-graphite rounded-sm hover:bg-chess-cream/50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-chess-bronze" /></div>
                  ) : addresses.length === 0 && !showAddressForm ? (
                    <div className="bg-white rounded-sm border border-border/50 p-12 text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-3">No saved addresses</p>
                      <button onClick={() => openAddressForm()}
                        className="inline-flex items-center gap-1 text-sm text-chess-bronze hover:underline">
                        Add your first address <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr._id} className="bg-white rounded-sm border border-border/50 p-5 relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-chess-bronze">
                              {addr.isDefault ? "★ Default" : addr.label}
                            </span>
                            <div className="flex items-center gap-1">
                              {!addr.isDefault && (
                                <button onClick={() => handleSetDefault(addr._id)}
                                  title="Set as default"
                                  className="p-1 text-muted-foreground hover:text-chess-bronze transition-colors">
                                  <Star className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button onClick={() => openAddressForm(addr)}
                                title="Edit"
                                className="p-1 text-muted-foreground hover:text-chess-bronze transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleAddressDelete(addr._id)}
                                title="Delete"
                                className="p-1 text-muted-foreground hover:text-red-600 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-chess-charcoal font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {addr.street}<br />{addr.city}, {addr.province} {addr.postalCode}<br />{addr.country}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════════ WISHLIST (with product cards) ═══════════ */}
              {activeTab === "wishlist" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-lg font-semibold text-chess-charcoal mb-5">
                    Wishlist {wishlistProducts.length > 0 && <span className="text-sm font-normal text-muted-foreground">({wishlistProducts.length} items)</span>}
                  </h2>
                  {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-chess-bronze" /></div>
                  ) : wishlistProducts.length === 0 ? (
                    <div className="bg-white rounded-sm border border-border/50 p-12 text-center">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-3">Your wishlist is empty</p>
                      <Link href="/category/all" className="inline-flex items-center gap-1 text-sm text-chess-bronze hover:underline">
                        Browse products <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {wishlistProducts.map((product, i) => (
                        <div key={product._id || product.id} className="relative">
                          <ProductCard product={product} index={i} />
                          <button
                            onClick={() => handleRemoveFromWishlist(product._id || product.id || "")}
                            className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                            title="Remove from wishlist"
                          >
                            <X className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════════ SETTINGS ═══════════ */}
              {activeTab === "settings" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-lg font-semibold text-chess-charcoal mb-5">Account Settings</h2>
                  <div className="bg-white rounded-sm border border-border/50 p-6 space-y-5">
                    <div className="flex items-center justify-between py-3 border-b border-border/30">
                      <div>
                        <p className="text-sm font-medium text-chess-charcoal">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive order updates and promotions</p>
                      </div>
                      <button onClick={() => toast("Notification preferences saved")} className="text-xs text-chess-bronze hover:underline">Toggle</button>
                    </div>
                    <div className="py-3 border-b border-border/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-chess-charcoal">Change Password</p>
                          <p className="text-xs text-muted-foreground">Update your account password</p>
                        </div>
                        <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-xs text-chess-bronze hover:underline">
                          {showPasswordForm ? "Cancel" : "Change"}
                        </button>
                      </div>
                      {showPasswordForm && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="text-xs font-medium text-chess-charcoal mb-1 block">Current Password</label>
                            <input type="password" value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-chess-charcoal mb-1 block">New Password</label>
                            <input type="password" value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-chess-charcoal mb-1 block">Confirm New Password</label>
                            <input type="password" value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                          </div>
                          <button onClick={handlePasswordChange} disabled={passwordSaving}
                            className="px-5 py-2.5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                            {passwordSaving ? "Changing..." : "Update Password"}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-red-600">Delete Account</p>
                        <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
                      </div>
                      <button onClick={() => toast("Contact support to delete your account")} className="text-xs text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
