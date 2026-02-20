import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";
import { WishlistProvider } from "./contexts/WishlistContext";

// Lazy-loaded pages
const Home = lazy(() => import("@/pages/Home"));
const Category = lazy(() => import("@/pages/Category"));
const Categories = lazy(() => import("@/pages/Categories"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/pages/OrderConfirmation"));
const Account = lazy(() => import("@/pages/Account"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const B2B = lazy(() => import("@/pages/B2B"));
const Service = lazy(() => import("@/pages/Service"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminCategories = lazy(() => import("@/pages/admin/AdminCategories"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("@/pages/admin/AdminCustomers"));
const AdminInventory = lazy(() => import("@/pages/admin/AdminInventory"));
const OrderDetails = lazy(() => import("@/pages/OrderDetails"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-chess-offwhite">
      <Loader2 className="w-8 h-8 animate-spin text-chess-bronze" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/category/all" component={Categories} />
                <Route path="/category/:slug/:sub" component={Category} />
                <Route path="/category/:slug" component={Category} />
                <Route path="/product/:id" component={ProductDetail} />
                <Route path="/cart" component={CartPage} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/orders/:id" component={OrderDetails} />
                <Route path="/order-confirmation" component={OrderConfirmation} />
                <Route path="/order-confirmation/:orderId" component={OrderConfirmation} />
                <Route path="/account" component={Account} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/b2b" component={B2B} />
                <Route path="/service" component={Service} />
                <Route path="/wishlist" component={Wishlist} />
                {/* Admin Routes */}
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/admin/categories" component={AdminCategories} />
                <Route path="/admin/products" component={AdminProducts} />
                <Route path="/admin/orders" component={AdminOrders} />
                <Route path="/admin/customers" component={AdminCustomers} />
                <Route path="/admin/inventory" component={AdminInventory} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </WishlistProvider>
          <Toaster position="bottom-right" richColors closeButton />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
