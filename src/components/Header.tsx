/*
 * CHESS Header — Scandinavian Warmth + Swiss Precision
 * Warm off-white background, charcoal text, bronze accents on interactive elements.
 * Persistent top nav with mega-menu, search, cart drawer.
 */
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, User, Heart, Menu, X, ChevronDown,
  Phone, MapPin, Truck, Shield, Building2, Headphones, CreditCard,
} from "lucide-react";
import { LOGO } from "@/types";
import type { Category } from "@/types";
import { categoryApi } from "@/services/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";


export default function Header() {
  const [, navigate] = useLocation();
  const { itemCount: count } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { wishlistProducts } = useWishlist();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  

  // Fetch categories from API
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res.data || []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  

  const handleMegaEnter = (id: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(id);
  };
  const handleMegaLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(null), 200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const topCategories = categories.slice(0, 7);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="bg-chess-charcoal text-chess-offwhite text-xs">
        <div className="container flex items-center justify-between h-8">
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3 h-3 text-chess-bronze" />
              Free shipping on orders over $499
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-chess-bronze" />
              Extended warranty available
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/service" className="flex items-center gap-1 hover:text-chess-bronze transition-colors">
              <Headphones className="w-3 h-3" /> Service & Support
            </Link>
            <Link href="/b2b" className="flex items-center gap-1 hover:text-chess-bronze transition-colors">
              <Building2 className="w-3 h-3" /> Commercial / B2B
            </Link>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> 1-800-CHESS
            </span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-chess-offwhite/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16 lg:h-[72px]">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={LOGO.dark}
              alt="CHESS"
              className="h-12 lg:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-lg lg:text-xl font-bold text-chess-charcoal tracking-tight">CHESS</span>
              <span className="text-[8px] lg:text-[9px] uppercase tracking-[0.15em] text-chess-bronze font-semibold mt-0.5">by Mosaic Holding Corp.</span>
            </div>
          </Link>

          {/* Desktop search bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search products, categories, SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-10 rounded-sm border border-border bg-white text-sm
                           focus:outline-none focus:border-chess-bronze focus:ring-1 focus:ring-chess-bronze/30
                           placeholder:text-muted-foreground transition-all"
              />
              <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-chess-bronze transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="lg:hidden p-2"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link href={isAuthenticated ? "/account" : "/login"} className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-sm hover:text-chess-bronze transition-colors">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{isAuthenticated ? user?.name?.split(" ")[0] || "Account" : "Sign In"}</span>
            </Link>

            <Link href="/wishlist" className="hidden relative sm:flex items-center gap-1.5 px-2 py-1.5 text-sm hover:text-chess-bronze transition-colors">
              <Heart className="w-4 h-4" />
              <span className="hidden md:inline">Wishlist</span>
              {wishlistProducts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-chess-bronze text-white text-[10px] font-semibold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {wishlistProducts.length}
                </span>
              )}
            </Link>

            <Link href="/checkout" className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-sm hover:text-chess-bronze transition-colors">
              <CreditCard className="w-4 h-4" />
              <span className="hidden md:inline">Checkout</span>
            </Link>

            <Link href="/cart" className="flex items-center gap-1.5 px-2 py-1.5 text-sm hover:text-chess-bronze transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-chess-bronze text-white text-[10px] font-semibold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {count}
                </span>
              )}
              <span className="hidden md:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* Category navigation */}
        <nav className="hidden lg:block border-t border-border/50">
          <div className="container flex items-center h-10">
            {topCategories.map((cat) => (
              <div
                key={cat._id}
                className="relative"
                onMouseEnter={() => handleMegaEnter(cat._id)}
                onMouseLeave={handleMegaLeave}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-1 px-3 py-2 text-[13px] font-medium tracking-wide
                    hover:text-chess-bronze transition-colors whitespace-nowrap
                    ${megaMenuOpen === cat._id ? "text-chess-bronze" : "text-foreground"}`}
                >
                  {cat.name}
                  <ChevronDown className={`w-3 h-3 transition-transform ${megaMenuOpen === cat._id ? "rotate-180" : ""}`} />
                </Link>

                {/* Mega menu dropdown */}
                <AnimatePresence>
                  {megaMenuOpen === cat._id && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-[480px] bg-white rounded-sm shadow-xl border border-border/50 p-5 z-50"
                      onMouseEnter={() => handleMegaEnter(cat._id)}
                      onMouseLeave={handleMegaLeave}
                    >
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <h3 className="font-display text-base font-semibold mb-3 text-chess-charcoal">{cat.name}</h3>
                          <p className="text-xs text-muted-foreground mb-4">{cat.description}</p>
                          <div className="space-y-1.5">
                            {(cat.subcategories || []).map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/category/${cat.slug}/${sub.slug}`}
                                className="flex items-center justify-between py-1 text-sm hover:text-chess-bronze transition-colors group"
                              >
                                <span>{sub.name}</span>
                                <span className="text-xs text-muted-foreground group-hover:text-chess-bronze">{(sub.productCount ?? sub.count ?? 0).toLocaleString()}</span>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href={`/category/${cat.slug}`}
                            className="inline-block mt-4 text-xs font-semibold text-chess-bronze hover:underline"
                          >
                            View all {cat.name} →
                          </Link>
                        </div>
                        <div className="w-40 shrink-0">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-32 object-cover rounded-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link
              href="/category/all"
              className="px-3 py-2 text-[13px] font-medium tracking-wide text-chess-bronze hover:underline whitespace-nowrap ml-auto"
            >
              All Categories
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-border p-3 shadow-lg z-40"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-10 rounded-sm border border-border text-sm focus:outline-none focus:border-chess-bronze"
              />
              <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 top-[calc(4rem+2rem)] bg-white z-40 overflow-y-auto"
          >
            <div className="p-4 space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="flex items-center justify-between py-3 px-2 text-sm font-medium border-b border-border/30 hover:text-chess-bronze transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{(cat.productCount ?? 0).toLocaleString()} products</span>
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link href="/b2b" className="block py-2 px-2 text-sm font-medium text-chess-bronze" onClick={() => setMobileOpen(false)}>
                  Commercial / B2B Portal
                </Link>
                <Link href="/service" className="block py-2 px-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  Service & Support
                </Link>
                <Link href="/account" className="block py-2 px-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  My Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
