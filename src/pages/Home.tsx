/*
 * CHESS Homepage — Scandinavian Warmth + Swiss Precision
 * Magazine-spread layout with editorial hero, category grid, featured products,
 * bundle systems, service block, and trust elements.
 * Psychological triggers: social proof, urgency, authority, reciprocity.
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, Truck, Shield, Headphones, Clock, Star,
  Building2, Users, Award, ChevronRight, Package, Wrench,
  Zap, Flame, Droplets, Lightbulb, Wind, Hammer, TreePine, Sofa,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { HERO_IMAGES, BUNDLES } from "@/types";
import type { Product, Category } from "@/types";
import { productApi, categoryApi } from "@/services/api";

const categoryIcons: Record<string, React.ReactNode> = {
  appliances: <Flame className="w-5 h-5" />,
  furniture: <Sofa className="w-5 h-5" />,
  lighting: <Lightbulb className="w-5 h-5" />,
  plumbing: <Droplets className="w-5 h-5" />,
  hvac: <Wind className="w-5 h-5" />,
  electrical: <Zap className="w-5 h-5" />,
  "building-materials": <Hammer className="w-5 h-5" />,
  outdoor: <TreePine className="w-5 h-5" />,
  commercial: <Building2 className="w-5 h-5" />,
  parts: <Wrench className="w-5 h-5" />,
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);

  // Fetch categories and featured products from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      categoryApi.getAll().catch(() => ({ data: [] as Category[] })),
      productApi.getFeatured().catch(() => ({ data: [] as Product[] })),
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data || []);
      setFeaturedProducts((prodRes.data || []).slice(0, 8));
      setLoading(false);
    });
  }, []);

  const heroSlides = [
    {
      image: HERO_IMAGES.kitchen,
      title: "Engineered products for residential and commercial use.",
      subtitle: "A unified platform supporting projects of any scale.",
      cta1: { label: "View Products", href: "/category/appliances" },
      cta2: { label: "Commercial Solutions", href: "/b2b" },
    },
    {
      image: HERO_IMAGES.living,
      title: "Furniture designed for how you live and work.",
      subtitle: "From single rooms to entire hospitality projects.",
      cta1: { label: "Explore Furniture", href: "/category/furniture" },
      cta2: { label: "Project Quotes", href: "/b2b" },
    },
    {
      image: HERO_IMAGES.bathroom,
      title: "Premium plumbing and fixtures for every space.",
      subtitle: "Professional-grade quality with residential elegance.",
      cta1: { label: "Shop Plumbing", href: "/category/plumbing" },
      cta2: { label: "Schedule Consultation", href: "/service" },
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const bundles = BUNDLES;

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite">
      <Header />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION — Full-bleed editorial with overlaid typography
           ═══════════════════════════════════════════════════════════════ */}
        <section className="relative h-[520px] md:h-[600px] lg:h-[680px] overflow-hidden">
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIndex ? "opacity-100" : "opacity-0"}`}
            >
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-chess-charcoal/80 via-chess-charcoal/50 to-transparent" />
            </div>
          ))}

          <div className="relative container h-full flex items-center">
            <div className="max-w-xl">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-chess-bronze border border-chess-bronze/40 rounded-sm">
                  CHESS by MHC
                </span>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
                  {heroSlides[heroIndex].title}
                </h1>
                <p className="text-base md:text-lg text-white/70 mb-8 max-w-md">
                  {heroSlides[heroIndex].subtitle}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={heroSlides[heroIndex].cta1.href}
                    className="inline-flex items-center gap-2 px-6 py-3 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
                  >
                    {heroSlides[heroIndex].cta1.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={heroSlides[heroIndex].cta2.href}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-sm hover:bg-white/10 transition-colors"
                  >
                    {heroSlides[heroIndex].cta2.label}
                  </Link>
                </div>
              </motion.div>

              {/* Slide indicators */}
              <div className="flex gap-2 mt-10">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === heroIndex ? "w-10 bg-chess-bronze" : "w-4 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            TRUST BAR — Authority signals
           ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-white border-b border-border">
          <div className="container py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { icon: <Truck className="w-5 h-5 text-chess-bronze" />, title: "Free Shipping", desc: "On orders over $499" },
                { icon: <Shield className="w-5 h-5 text-chess-bronze" />, title: "Extended Warranty", desc: "Up to 10 years coverage" },
                { icon: <Headphones className="w-5 h-5 text-chess-bronze" />, title: "Expert Support", desc: "Dedicated project advisors" },
                { icon: <Clock className="w-5 h-5 text-chess-bronze" />, title: "Fast Delivery", desc: "Most items ship in 3-5 days" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-chess-cream flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-chess-charcoal">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CATEGORY GRID — Visual navigation with product counts
           ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze mb-2 block">
                Browse by Department
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal">
                Shop All Categories
              </h2>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-sm bg-chess-cream animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link href={`/category/${cat.slug}`}>
                      <div className="group relative overflow-hidden rounded-sm bg-white border border-border/50 card-hover">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-chess-charcoal/70 via-chess-charcoal/20 to-transparent" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-chess-bronze">
                              {categoryIcons[cat.slug] || <Package className="w-4 h-4" />}
                            </span>
                            <h3 className="text-sm md:text-base font-semibold text-white">{cat.name}</h3>
                          </div>
                          <p className="text-[10px] text-white/60">{(cat.productCount ?? 0).toLocaleString()} products</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FEATURED PRODUCTS — Conversion-optimized product grid
           ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container">
            <motion.div {...fadeUp} className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze mb-2 block">
                  Curated Selection
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal">
                  Featured Products
                </h2>
              </div>
              <Link
                href="/category/all"
                className="hidden md:flex items-center gap-1 text-sm font-medium text-chess-bronze hover:underline"
              >
                View all products <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-chess-cream rounded-sm animate-pulse aspect-[3/4]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {featuredProducts.map((product, i) => (
                  <ProductCard key={product._id || product.id} product={product} index={i} />
                ))}
              </div>
            )}

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/category/all"
                className="inline-flex items-center gap-1 text-sm font-medium text-chess-bronze hover:underline"
              >
                View all products <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            EDITORIAL BAND — Commercial/Hospitality hero
           ═══════════════════════════════════════════════════════════════ */}
        <section className="relative h-[400px] md:h-[480px] overflow-hidden">
          <img
            src={HERO_IMAGES.commercial}
            alt="Commercial solutions"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-chess-charcoal/80 via-chess-charcoal/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <motion.div {...fadeUp} className="ml-auto max-w-lg text-right">
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-chess-bronze border border-chess-bronze/40 rounded-sm">
                  For Professionals
                </span>
                <h2 className="font-display text-2xl md:text-4xl font-semibold text-white leading-tight mb-4">
                  Commercial & Hospitality Solutions
                </h2>
                <p className="text-sm md:text-base text-white/70 mb-6">
                  Dedicated project support, volume pricing, and custom specifications for developers, contractors, and hospitality groups.
                </p>
                <div className="flex flex-wrap gap-3 justify-end">
                  <Link
                    href="/b2b"
                    className="inline-flex items-center gap-2 px-6 py-3 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
                  >
                    Request Commercial Pricing
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BUNDLE SYSTEMS — Package deals (psychological anchoring)
           ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze mb-2 block">
                Save More Together
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal">
                Curated Systems & Packages
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                Pre-configured product bundles designed for complete project solutions. Save up to 15% compared to individual pricing.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {bundles.map((bundle, i) => (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href="/category/all">
                    <div className="group bg-white rounded-sm border border-border/50 overflow-hidden card-hover">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={bundle.image}
                          alt={bundle.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-chess-success text-white text-[10px] font-bold rounded-sm">
                          Save ${bundle.savings.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg font-semibold text-chess-charcoal mb-1 group-hover:text-chess-bronze transition-colors">
                          {bundle.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>
                        <div className="flex items-baseline gap-3">
                          <span className="text-xl font-semibold text-chess-charcoal">
                            ${bundle.bundlePrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${bundle.individualPrice.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {bundle.products.length} products included
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SERVICE & WARRANTY SECTION
           ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-chess-charcoal text-chess-offwhite">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeUp}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze mb-2 block">
                  Lifecycle Support
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
                  Service, Warranty & Maintenance
                </h2>
                <p className="text-sm text-white/60 mb-8 leading-relaxed max-w-md">
                  Every CHESS product is backed by comprehensive warranty coverage and professional service support. From installation to maintenance, we are with you for the full lifecycle.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Shield className="w-5 h-5" />, title: "Warranty Protection", desc: "Up to 10 years on select products" },
                    { icon: <Wrench className="w-5 h-5" />, title: "Professional Service", desc: "Certified technicians nationwide" },
                    { icon: <Package className="w-5 h-5" />, title: "Genuine Parts", desc: "OEM replacement parts in stock" },
                    { icon: <Clock className="w-5 h-5" />, title: "Scheduled Maintenance", desc: "Preventive care programs available" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-sm bg-white/5">
                      <span className="text-chess-bronze mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-white/50">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Link
                    href="/service"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
                  >
                    Schedule Service
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/service"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white text-sm font-semibold rounded-sm hover:bg-white/10 transition-colors"
                  >
                    Register Product
                  </Link>
                </div>
              </motion.div>

              <motion.div
                {...fadeUp}
                className="relative"
              >
                <img
                  src={HERO_IMAGES.outdoor}
                  alt="CHESS Service"
                  className="w-full rounded-sm"
                />
                {/* Stats overlay */}
                <div className="absolute -bottom-6 -left-4 right-4 md:left-8 md:right-8 bg-white text-chess-charcoal rounded-sm shadow-xl p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-display font-bold text-chess-bronze">98%</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Customer Satisfaction</p>
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-chess-bronze">24hr</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Response Time</p>
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-chess-bronze">50K+</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Projects Completed</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SOCIAL PROOF — Reviews & testimonials
           ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24">
          <div className="container">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze mb-2 block">
                Trusted by Professionals
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal">
                What Our Clients Say
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "CHESS transformed our 200-unit development project. The unified sourcing for appliances, plumbing, and lighting saved us over $400,000 and 3 months of procurement time.",
                  author: "Sarah Chen",
                  role: "VP Development, Meridian Properties",
                  rating: 5,
                },
                {
                  quote: "The quality of CHESS products rivals brands at twice the price. We have standardized on CHESS for all our hotel renovation projects across Western Canada.",
                  author: "Michael Torres",
                  role: "Director of Procurement, Atlas Hospitality",
                  rating: 5,
                },
                {
                  quote: "From ordering to installation to after-sales service, CHESS delivers a complete experience. The warranty support alone sets them apart from competitors.",
                  author: "David Park",
                  role: "Licensed Contractor, Park & Associates",
                  rating: 5,
                },
              ].map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-sm border border-border/50 p-6"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-chess-bronze text-chess-bronze" />
                    ))}
                  </div>
                  <p className="text-sm text-chess-graphite leading-relaxed mb-5 italic">
                    "{review.quote}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-chess-charcoal">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            B2B CTA BAND
           ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-chess-cream py-16">
          <div className="container">
            <motion.div {...fadeUp} className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-sm bg-chess-charcoal flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7 text-chess-bronze" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-chess-charcoal mb-1">
                    Are you a contractor, developer, or buyer?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Access volume pricing, project management tools, and dedicated account support through our B2B portal.
                  </p>
                </div>
              </div>
              <Link
                href="/b2b"
                className="inline-flex items-center gap-2 px-6 py-3 bg-chess-charcoal text-white text-sm font-semibold rounded-sm hover:bg-chess-graphite transition-colors whitespace-nowrap"
              >
                Apply for Commercial Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
