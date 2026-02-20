/*
 * CHESS Category Page — Scandinavian Warmth + Swiss Precision
 * Sidebar filters, sort controls, responsive product grid.
 * Now fetches data from the backend API instead of static store.ts.
 */
import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, Grid3X3, List, ChevronDown, X, Check,
  ArrowUpDown, ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import type { Product, Category as CategoryType } from "@/types";
import { productApi, categoryApi } from "@/services/api";

const priceRanges = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $500", min: 100, max: 500 },
  { label: "$500 – $1,000", min: 500, max: 1000 },
  { label: "$1,000 – $3,000", min: 1000, max: 3000 },
  { label: "$3,000+", min: 3000, max: Infinity },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

export default function Category() {
  const params = useParams<{ slug?: string; sub?: string }>();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const searchQuery = searchParams.get("search") || "";

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [commercialOnly, setCommercialOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [gridView, setGridView] = useState<"grid" | "list">("grid");

  // API state
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const isAll = params.slug === "all" || !params.slug;

  // Fetch category and products from API
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        if (searchQuery) {
          // Search mode
          const res = await productApi.search(searchQuery, 100);
          setAllProducts(res.data || []);
          setCategory(null);
        } else if (isAll) {
          // All products
          const res = await productApi.getAll({ limit: "200" });
          setAllProducts(res.data || []);
          setCategory(null);
        } else {
          // Category-specific
          const [catRes, prodRes] = await Promise.all([
            categoryApi.getBySlug(params.slug!),
            productApi.getAll({ category: params.slug!, limit: "200" }),
          ]);
          setCategory(catRes.data || null);
          setAllProducts(prodRes.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch category data:", err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug, searchQuery, isAll]);

  // Client-side filtering on top of API results
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Subcategory filter
    if (params.sub) {
      result = result.filter((p) => p.subcategory === params.sub);
    }
    // Price filter
    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }
    // Commercial filter
    if (commercialOnly) {
      result = result.filter((p) => p.commercial);
    }
    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, params.sub, selectedPrice, commercialOnly, inStockOnly, sortBy]);

  const pageTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : category
    ? category.name
    : "All Products";

  const activeFilters = [
    selectedPrice !== null ? priceRanges[selectedPrice].label : null,
    commercialOnly ? "Commercial Grade" : null,
    inStockOnly ? "In Stock" : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-border">
          <div className="container py-3">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-chess-bronze transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              {category ? (
                <>
                  <Link href="/categories" className="hover:text-chess-bronze transition-colors">Categories</Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-chess-charcoal font-medium">{category.name}</span>
                  {params.sub && (
                    <>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-chess-charcoal font-medium capitalize">{params.sub.replace(/-/g, " ")}</span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-chess-charcoal font-medium">{pageTitle}</span>
              )}
            </nav>
          </div>
        </div>

        {/* Page header */}
        <div className="bg-white border-b border-border">
          <div className="container py-6 md:py-8">
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal mb-1">
              {pageTitle}
            </h1>
            {category && (
              <p className="text-sm text-muted-foreground">{category.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {loading ? "Loading..." : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>

        {/* Subcategory pills */}
        {category && (
          <div className="bg-white border-b border-border">
            <div className="container py-3 flex gap-2 overflow-x-auto scrollbar-hide">
              <Link
                href={`/category/${category.slug}`}
                className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors
                  ${!params.sub ? "bg-chess-charcoal text-white border-chess-charcoal" : "bg-white text-chess-graphite border-border hover:border-chess-bronze"}`}
              >
                All {category.name}
              </Link>
              {(category.subcategories || []).map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/category/${category.slug}/${sub.slug}`}
                  className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors
                    ${params.sub === sub.slug ? "bg-chess-charcoal text-white border-chess-charcoal" : "bg-white text-chess-graphite border-border hover:border-chess-bronze"}`}
                >
                  {sub.name} ({sub.productCount ?? sub.count ?? 0})
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="container py-6 md:py-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-sm hover:border-chess-bronze transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-chess-bronze text-white text-[9px] flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              {/* Active filter chips */}
              {activeFilters.map((filter, i) => (
                <span key={i} className="hidden md:flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-chess-cream text-chess-charcoal rounded-sm">
                  {filter}
                  <button
                    onClick={() => {
                      if (filter === "Commercial Grade") setCommercialOnly(false);
                      else if (filter === "In Stock") setInStockOnly(false);
                      else setSelectedPrice(null);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-medium border border-border rounded-sm bg-white
                           focus:outline-none focus:border-chess-bronze cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
              </div>

              {/* View toggle */}
              <div className="hidden md:flex items-center border border-border rounded-sm overflow-hidden">
                <button
                  onClick={() => setGridView("grid")}
                  className={`p-1.5 ${gridView === "grid" ? "bg-chess-charcoal text-white" : "bg-white text-muted-foreground"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridView("list")}
                  className={`p-1.5 ${gridView === "list" ? "bg-chess-charcoal text-white" : "bg-white text-muted-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar filters */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.aside
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 240 }}
                  exit={{ opacity: 0, width: 0 }}
                  className="shrink-0 overflow-hidden hidden md:block"
                >
                  <div className="w-60 space-y-6">
                    {/* Price filter */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-chess-charcoal mb-3">Price Range</h4>
                      <div className="space-y-1.5">
                        {priceRanges.map((range, i) => {
                          const count = allProducts.filter(p => p.price >= range.min && p.price < range.max).length;
                          return (
                          <button
                            key={i}
                            onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
                            className={`flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-sm transition-colors
                              ${selectedPrice === i ? "bg-chess-bronze/10 text-chess-bronze font-medium" : "text-chess-graphite hover:bg-chess-cream"}`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center
                              ${selectedPrice === i ? "border-chess-bronze bg-chess-bronze" : "border-border"}`}>
                              {selectedPrice === i && <Check className="w-2.5 h-2.5 text-white" />}
                            </span>
                            {range.label}
                            <span className="ml-auto text-[10px] text-muted-foreground">({count})</span>
                          </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Commercial filter */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-chess-charcoal mb-3">Type</h4>
                      <button
                        onClick={() => setCommercialOnly(!commercialOnly)}
                        className={`flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-sm transition-colors
                          ${commercialOnly ? "bg-chess-bronze/10 text-chess-bronze font-medium" : "text-chess-graphite hover:bg-chess-cream"}`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center
                          ${commercialOnly ? "border-chess-bronze bg-chess-bronze" : "border-border"}`}>
                          {commercialOnly && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                        Commercial Grade Only
                      </button>
                    </div>

                    {/* Availability */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-chess-charcoal mb-3">Availability</h4>
                      <button
                        onClick={() => setInStockOnly(!inStockOnly)}
                        className={`flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-sm transition-colors
                          ${inStockOnly ? "bg-chess-bronze/10 text-chess-bronze font-medium" : "text-chess-graphite hover:bg-chess-cream"}`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center
                          ${inStockOnly ? "border-chess-bronze bg-chess-bronze" : "border-border"}`}>
                          {inStockOnly && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                        In Stock Only
                      </button>
                    </div>

                    {/* Clear all */}
                    {activeFilters.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedPrice(null);
                          setCommercialOnly(false);
                          setInStockOnly(false);
                        }}
                        className="text-xs text-chess-bronze hover:underline"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Product grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-chess-cream rounded-sm animate-pulse aspect-[3/4]" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg font-display font-semibold text-chess-charcoal mb-2">No products found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className={
                  gridView === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "space-y-4"
                }>
                  {filteredProducts.map((product, i) => (
                    <ProductCard key={product._id || product.id} product={product} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
