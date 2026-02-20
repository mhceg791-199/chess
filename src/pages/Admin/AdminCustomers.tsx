/*
 * CHESS Admin Customers Management — View, search, block/unblock customers.
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/services/api";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";
import {
  Users, Search, Loader2, Eye, X, ChevronLeft, ChevronRight,
  Shield, ShieldOff, Mail, Phone, MapPin, Package, Calendar,
  RefreshCw, UserCheck, UserX,
} from "lucide-react";

export default function AdminCustomers() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin, page, roleFilter, statusFilter]);

  async function loadUsers() {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "20",
      };
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await adminApi.getUsers(params);
      setUsers(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.pages);
        setTotal(res.pagination.total);
      }
    } catch (err: any) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusToggle(userId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    const action = newStatus === "suspended" ? "block" : "unblock";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      await adminApi.updateUserStatus(userId, newStatus);
      toast.success(`User ${action}ed successfully`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
      if (selectedUser?._id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} user`);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    if (!confirm(`Change this user's role to ${newRole}?`)) return;
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      if (selectedUser?._id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
  }

  async function viewUserDetail(userId: string) {
    setDetailLoading(true);
    try {
      const res = await adminApi.getUserById(userId);
      setSelectedUser(res.data);
    } catch {
      toast.error("Failed to load user details");
    } finally {
      setDetailLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadUsers();
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });

  return (
    <AdminLayout title="Customers" subtitle={`${total} registered users`}>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-10 pl-9 pr-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze"
          />
        </form>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze bg-white"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze bg-white"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <button onClick={loadUsers}
          className="h-10 px-3 flex items-center gap-1.5 text-sm border border-border rounded-sm hover:bg-chess-cream transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-chess-bronze" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-sm border border-border/50 p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No customers found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-sm border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-chess-cream/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Customer</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Joined</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-chess-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-chess-cream/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-chess-cream flex items-center justify-center text-xs font-semibold text-chess-bronze uppercase">
                            {u.name?.charAt(0) || "?"}
                          </div>
                          <p className="text-sm font-medium text-chess-charcoal">{u.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-sm border-0 capitalize cursor-pointer
                            ${u.role === "admin" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-sm capitalize
                          ${(u.status || "active") === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                          {(u.status || "active") === "active" ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          {u.status || "active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewUserDetail(u._id)}
                            className="p-1.5 text-chess-bronze hover:bg-chess-cream rounded-sm transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusToggle(u._id, u.status || "active")}
                            className={`p-1.5 rounded-sm transition-colors ${
                              u.status === "blocked"
                                ? "text-green-600 hover:bg-green-50"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                            title={u.status === "blocked" ? "Unblock" : "Block"}
                          >
                            {u.status === "blocked" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages} ({total} customers)
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

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedUser(null)}>
          <div
            className="bg-white rounded-sm shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-chess-bronze" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-chess-charcoal">Customer Details</h2>
                  <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-chess-cream rounded-sm">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-chess-cream flex items-center justify-center text-xl font-semibold text-chess-bronze uppercase">
                      {selectedUser.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-chess-charcoal">{selectedUser.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-sm capitalize
                          ${selectedUser.role === "admin" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                          {selectedUser.role}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-sm capitalize
                          ${selectedUser.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                          {selectedUser.status || "active"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-chess-cream/30 rounded-sm p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-chess-bronze" />
                      <span className="text-chess-charcoal">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-chess-bronze" />
                        <span className="text-chess-charcoal">{selectedUser.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-chess-bronze" />
                      <span className="text-muted-foreground">Joined {formatDate(selectedUser.createdAt)}</span>
                    </div>
                  </div>

                  {/* Order Summary */}
                  {selectedUser.orderCount !== undefined && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border border-border/50 rounded-sm p-3 text-center">
                        <p className="text-lg font-semibold text-chess-charcoal">{selectedUser.orderCount || 0}</p>
                        <p className="text-[10px] text-muted-foreground">Total Orders</p>
                      </div>
                      <div className="bg-white border border-border/50 rounded-sm p-3 text-center">
                        <p className="text-lg font-semibold text-chess-charcoal">
                          ${(selectedUser.totalSpent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Total Spent</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleStatusToggle(selectedUser._id, selectedUser.status || "active")}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-sm transition-colors
                        ${(selectedUser.status || "active") !== "active"
                          ? "bg-green-50 text-green-600 hover:bg-green-100"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                    >
                      {(selectedUser.status || "active") !== "active" ? "Unblock User" : "Block User"}
                    </button>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => handleRoleChange(selectedUser._id, e.target.value)}
                      className="flex-1 py-2.5 text-sm font-medium border border-border rounded-sm focus:outline-none focus:border-chess-bronze"
                    >
                      <option value="user">Role: User</option>
                      <option value="admin">Role: Admin</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
