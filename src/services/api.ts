/**
 * CHESS Commerce — API Service Layer
 * REST API calls via fetch with file upload support.
 */

import type { Product, Category, Order, CartItem } from "@/types";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: { page: number; limit: number; total: number; pages: number };
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("chess_token");
  if (token) {
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, config);

  if (response.status === 401) {
    localStorage.removeItem("chess_token");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || "Request failed", response.status);
  }

  return data;
}

/**
 * Upload request with FormData (for file uploads).
 * Does NOT set Content-Type — browser sets multipart/form-data boundary automatically.
 */
async function uploadRequest<T>(
  endpoint: string,
  formData: FormData,
  method: string = "POST"
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {};

  const token = localStorage.getItem("chess_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    credentials: "include",
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || "Upload failed", response.status);
  }

  return data;
}

// ─── Auth ─────────────────────────────────────────────────────

export const authApi = {
  register: (body: { email: string; password: string; name: string }) =>
    request<{ user: any; token: string }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ user: any; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  logout: () =>
    request<void>("/auth/logout", { method: "POST" }),

  getMe: () =>
    request<{ id: string; email: string; name: string; phone?: string; role: string; status: string }>("/auth/me"),

  updateProfile: (body: { name?: string; email?: string; phone?: string }) =>
    request<any>("/auth/profile", { method: "PUT", body: JSON.stringify(body) }),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    request<any>("/auth/password", { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Products ─────────────────────────────────────────────────

export const productApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<Product[]>(`/products${query}`);
  },

  getFeatured: () =>
    request<Product[]>("/products/featured"),

  search: (q: string, limit?: number) =>
    request<Product[]>(`/products/search?q=${encodeURIComponent(q)}${limit ? `&limit=${limit}` : ""}`),

  getById: (id: string) =>
    request<Product>(`/products/${id}`),

  getBySku: (sku: string) =>
    request<Product>(`/products/sku/${sku}`),

  getRelated: (id: string) =>
    request<Product[]>(`/products/${id}/related`),

  getCategories: () =>
    request<Category[]>("/products/categories"),
};

// ─── Cart ─────────────────────────────────────────────────────

export const cartApi = {
  get: () =>
    request<{ items: CartItem[] }>("/cart"),

  addItem: (productId: string, quantity: number = 1) =>
    request<{ items: CartItem[] }>("/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity }) }),

  updateItem: (productId: string, quantity: number) =>
    request<{ items: CartItem[] }>(`/cart/items/${productId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),

  removeItem: (productId: string) =>
    request<{ items: CartItem[] }>(`/cart/items/${productId}`, { method: "DELETE" }),

  clear: () =>
    request<void>("/cart", { method: "DELETE" }),
};

// ─── Orders ───────────────────────────────────────────────────

export const orderApi = {
  create: (body: { shippingAddress: any; customerInfo?: any; notes?: string }) =>
    request<Order>("/orders", { method: "POST", body: JSON.stringify(body) }),

  getMyOrders: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<Order[]>(`/orders${query}`);
  },

  getById: (id: string) =>
    request<Order>(`/orders/${id}`),

  getByNumber: (orderNumber: string) =>
    request<Order>(`/orders/number/${orderNumber}`),
};

// ─── Payments ─────────────────────────────────────────────────

export const paymentApi = {
  createCheckoutSession: (body: { shippingAddress?: any; customerInfo?: any }) =>
    request<{ url: string; sessionId: string; orderNumber: string }>(
      "/payments/create-checkout-session",
      { method: "POST", body: JSON.stringify(body) }
    ),

  getSessionStatus: (sessionId: string) =>
    request<any>(`/payments/session/${sessionId}`),

  getHistory: () =>
    request<any[]>("/payments/history"),
};

// ─── Customer ─────────────────────────────────────────────────

export const customerApi = {
  getAddresses: () =>
    request<any[]>("/customer/addresses"),

  createAddress: (body: any) =>
    request<any>("/customer/addresses", { method: "POST", body: JSON.stringify(body) }),

  updateAddress: (id: string, body: any) =>
    request<any>(`/customer/addresses/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  deleteAddress: (id: string) =>
    request<void>(`/customer/addresses/${id}`, { method: "DELETE" }),

  getWishlist: () =>
    request<string[]>("/customer/wishlist"),

  addToWishlist: (productId: string) =>
    request<string[]>(`/customer/wishlist/${productId}`, { method: "POST" }),

  removeFromWishlist: (productId: string) =>
    request<string[]>(`/customer/wishlist/${productId}`, { method: "DELETE" }),
};

// ─── Categories (Public) ─────────────────────────────────────

export const categoryApi = {
  getAll: () =>
    request<Category[]>("/categories"),

  getById: (id: string) =>
    request<Category>(`/categories/${id}`),

  getBySlug: (slug: string) =>
    request<Category>(`/categories/slug/${slug}`),
};

// ─── Admin ────────────────────────────────────────────────────

export const adminApi = {
  // Dashboard
  getDashboard: () =>
    request<any>("/admin/dashboard"),

  getStats: () =>
    request<any>("/admin/dashboard"),

  getRecentOrders: () =>
    request<Order[]>("/admin/orders?limit=10&sort=-createdAt"),

  getLowStock: () =>
    request<any>("/admin/inventory"),

  // Users / Customers
  getUsers: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/admin/users${query}`);
  },

  getUserById: (id: string) =>
    request<any>(`/admin/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    request<any>(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),

  updateUserStatus: (id: string, status: string) =>
    request<any>(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Products (with file upload)
  getProducts: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<Product[]>(`/products${query}`);
  },

  createProduct: (formData: FormData) =>
    uploadRequest<any>("/admin/products", formData, "POST"),

  updateProduct: (id: string, formData: FormData) =>
    uploadRequest<any>(`/admin/products/${id}`, formData, "PUT"),

  deleteProduct: (id: string) =>
    request<void>(`/admin/products/${id}`, { method: "DELETE" }),

  updateInventory: (id: string, inventory: number) =>
    request<any>(`/admin/products/${id}/inventory`, { method: "PATCH", body: JSON.stringify({ inventory }) }),

  // Orders
  getAllOrders: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<Order[]>(`/admin/orders${query}`);
  },

  getOrderStats: () =>
    request<any>("/admin/orders/stats"),

  updateOrderStatus: (id: string, status: string) =>
    request<any>(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  cancelOrder: (id: string) =>
    request<any>(`/admin/orders/${id}`, { method: "DELETE" }),

  // Inventory
  getInventoryReport: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/admin/inventory${query}`);
  },

  // Categories CRUD
  getCategories: () =>
    request<Category[]>("/categories"),

  createCategory: (formData: FormData) =>
    uploadRequest<any>("/admin/categories", formData, "POST"),

  updateCategory: (id: string, formData: FormData) =>
    uploadRequest<any>(`/admin/categories/${id}`, formData, "PUT"),

  deleteCategory: (id: string) =>
    request<void>(`/admin/categories/${id}`, { method: "DELETE" }),

  manageSubcategories: (id: string, body: { action: "add" | "remove"; subcategories: any[] }) =>
    request<any>(`/admin/categories/${id}/subcategories`, { method: "PATCH", body: JSON.stringify(body) }),

  bulkReassignProducts: (body: { fromCategory: string; toCategory: string; toSubcategory?: string }) =>
    request<any>("/admin/categories/bulk-reassign", { method: "POST", body: JSON.stringify(body) }),
};

// ─── Reviews ─────────────────────────────────────────────────

export const reviewApi = {
  getByProduct: (productId: string) =>
    request<any[]>(`/reviews/product/${productId}`),

  create: (body: { productId: string; rating: number; title: string; text: string }) =>
    request<any>("/reviews", { method: "POST", body: JSON.stringify(body) }),

  markHelpful: (reviewId: string) =>
    request<any>(`/reviews/${reviewId}/helpful`, { method: "POST" }),
};

export { ApiError };
