/**
 * CHESS Commerce — Shared Frontend Types
 * These types match the MongoDB models returned by the backend API.
 */

// ─── Product ─────────────────────────────────────────────────
// import moduleName from '../../public/chess_logo.png';
export interface Product {
  _id: string;
  id?: string;
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  type: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  badge?: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  inventory?: number;
  leadTime: string;
  warranty: string;
  commercial: boolean;
  bulkEligible: boolean;
  installationRequired: boolean;
  finish: string;
  color: string;
  dimensions: { width: string; height: string; depth: string };
  weight: string;
  voltage?: string;
  compliance: string[];
  priceUnit?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Category ────────────────────────────────────────────────

export interface Subcategory {
  name: string;
  slug: string;
  productCount?: number;
  count?: number;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  subcategories: Subcategory[];
  subcategoriesWithCounts?: Subcategory[];
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Order ───────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Address ────────────────────────────────────────────────

export interface Address {
  _id: string;
  id?: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Review ─────────────────────────────────────────────────

export interface Review {
  _id: string;
  id?: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  text: string;
  userName: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Cart ────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// ─── Bundle (static for now, can be moved to DB later) ───────

export interface Bundle {
  id: string;
  name: string;
  description: string;
  products: string[];
  bundlePrice: number;
  individualPrice: number;
  savings: number;
  image: string;
}

// ─── API Response ────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ─── Hero Images & Logo (static assets) ──────────────────────

export const HERO_IMAGES = {
  kitchen: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/gvLuXujCnAVHyRyN.jpg",
  living: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/GuFDnPbeEhsMwVEN.jpg",
  bathroom: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/ghrhZhoLDNkYpAXf.jpg",
  commercial: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/sdPYRGfjLcjHTsWv.jpg",
  outdoor: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/csHwksbAOBOUFSIH.jpg",
};

export const LOGO = {
  dark: "/chess_logo.png",
  white: "/chess_logo.png",
  // dark: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/FApXNnzqFWwiFOuD.png",
  // white: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/aoUCKPDFFgkguxbf.png",
};

// ─── Static bundles (until moved to DB) ──────────────────────

export const BUNDLES: Bundle[] = [
  {
    id: "bundle-kitchen-3pc",
    name: "Complete Kitchen Suite — 3 Piece",
    description: "French door refrigerator, gas range, and dishwasher in matching stainless steel.",
    products: ["chs-ref-fd-36-ss", "chs-rng-gs-30-ss", "chs-dw-bi-24-ss"],
    bundlePrice: 6499,
    individualPrice: 7647,
    savings: 1148,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    id: "bundle-condo-pkg",
    name: "Full Condo Package",
    description: "Everything needed for a complete condo fit-out — appliances, lighting, and plumbing.",
    products: ["chs-ref-fd-36-ss", "chs-rng-gs-30-ss", "chs-dw-bi-24-ss", "chs-fct-kn-br", "chs-lgt-pnd-md-bk"],
    bundlePrice: 7299,
    individualPrice: 8496,
    savings: 1197,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
  },
  {
    id: "bundle-hotel-room",
    name: "Hotel Room Package",
    description: "Standardized hotel room furnishing and fixture package for hospitality projects.",
    products: ["chs-bed-kng-wl", "chs-lgt-pnd-md-bk", "chs-fct-kn-br", "chs-com-hotel-bed-qn"],
    bundlePrice: 2999,
    individualPrice: 3647,
    savings: 648,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
  },
];
