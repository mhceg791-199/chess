/**
 * AdminLayout — Sidebar layout for admin pages.
 * Provides navigation between admin sections with CHESS branding.
 */
import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users,
  BarChart3, Settings, ChevronLeft, ChevronRight, LogOut, Menu, X,
  AlertTriangle, Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inventory", label: "Inventory", icon: BarChart3 },
];

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { user, isAuthenticated, isAdmin, loading: authLoading, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
      toast.error("Admin access required");
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-chess-offwhite">
        <Loader2 className="w-8 h-8 animate-spin text-chess-bronze" />
      </div>
    );
  }

  if (!isAdmin) return null;

  function isActive(href: string) {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bronze-gradient-black flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">C</span>
          </div>
          {sidebarOpen && (
            <span className="font-display font-semibold text-chess-charcoal text-sm">CHESS Admin</span>
          )}
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors
                ${active
                  ? "bg-chess-bronze/10 text-chess-bronze"
                  : "text-muted-foreground hover:bg-chess-cream hover:text-chess-charcoal"
                }`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-3 border-t border-border/50">
        {sidebarOpen && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium text-chess-charcoal truncate">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-sm text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-chess-offwhite">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-border/50 transition-all duration-300 shrink-0
          ${sidebarOpen ? "w-56" : "w-16"}`}
      >
        {sidebar}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 -right-3 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-chess-cream transition-colors z-10"
          style={{ left: sidebarOpen ? "calc(14rem - 0.75rem)" : "calc(4rem - 0.75rem)" }}
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-white shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-border/50 px-4 lg:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-sm hover:bg-chess-cream transition-colors"
            >
              <Menu className="w-5 h-5 text-chess-charcoal" />
            </button>
            <div>
              <h1 className="font-display text-lg font-semibold text-chess-charcoal">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-chess-bronze transition-colors"
          >
            ← Back to Store
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
