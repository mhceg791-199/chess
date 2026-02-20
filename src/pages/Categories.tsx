/*
 * CHESS All Categories Page — Scandinavian Warmth + Swiss Precision
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Category } from "@/types";
import { categoryApi } from "@/services/api";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite">
      <Header />
      <main className="flex-1">
        <div className="bg-white border-b border-border">
          <div className="container py-3">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-chess-bronze transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-chess-charcoal font-medium">All Categories</span>
            </nav>
          </div>
        </div>

        <div className="container py-8 md:py-12">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal mb-2">
            All Departments
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Browse our complete product catalog across {categories.length} departments.
          </p>

          {loading ? (
            <div className="space-y-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid md:grid-cols-4 gap-5">
                  <div className="aspect-[4/3] rounded-sm bg-chess-cream animate-pulse" />
                  <div className="md:col-span-3 space-y-3">
                    <div className="h-4 w-3/4 bg-chess-cream animate-pulse rounded" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {[...Array(8)].map((_, j) => (
                        <div key={j} className="h-10 bg-chess-cream animate-pulse rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="grid md:grid-cols-4 gap-5 items-start">
                    {/* Category image & title */}
                    <Link href={`/category/${cat.slug}`} className="group">
                      <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-3">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-chess-charcoal/60 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <h2 className="font-display text-lg font-semibold text-white">{cat.name}</h2>
                          <p className="text-[10px] text-white/60">{(cat.productCount ?? 0).toLocaleString()} products</p>
                        </div>
                      </div>
                    </Link>

                    {/* Subcategories grid */}
                    <div className="md:col-span-3">
                      <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {(cat.subcategories || []).map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/category/${cat.slug}/${sub.slug}`}
                            className="flex items-center justify-between py-2 px-3 text-sm rounded-sm border border-border/50 bg-white
                                     hover:border-chess-bronze/30 hover:text-chess-bronze transition-colors group"
                          >
                            <span>{sub.name}</span>
                            <span className="text-[10px] text-muted-foreground group-hover:text-chess-bronze">{sub.productCount ?? sub.count ?? 0}</span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-chess-bronze hover:underline"
                      >
                        View all {cat.name} <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                  {i < categories.length - 1 && <div className="border-b border-border/30 mt-8" />}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
