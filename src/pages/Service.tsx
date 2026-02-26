/*
 * CHESS Service & Warranty — Scandinavian Warmth + Swiss Precision
 * Service scheduling, warranty registration, parts ordering, FAQ.
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Shield, Wrench, Package, Clock, Phone, Mail, ArrowRight,
  ChevronRight, ChevronDown, CheckCircle2, Calendar, FileText,
  AlertCircle, Truck, Star, MapPin, Headphones,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
// import { trpc } from "@/lib/trpc"; // Will be re-added after full-stack upgrade

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const faqs = [
  { q: "How do I register my product for warranty?", a: "Use the product registration form on this page. You will need your product model number, serial number, and proof of purchase. Registration activates your full warranty coverage and enables priority service." },
  { q: "What does the warranty cover?", a: "CHESS warranties cover manufacturing defects in materials and workmanship. Coverage periods vary by product category: Appliances (1-5 years), Furniture (2-10 years), Plumbing (5-10 years), Electrical (3-5 years). Extended warranty options are available at purchase." },
  { q: "How do I schedule a service appointment?", a: "Fill out the service request form on this page or call 1-800-CHESS. Our service coordinators will match you with a certified technician in your area and schedule a convenient appointment window." },
  { q: "Can I order replacement parts directly?", a: "Yes. All OEM replacement parts are available through our parts catalog. Enter your product model number to find compatible parts. Commercial clients can set up automatic parts replenishment programs." },
  { q: "What is the return policy?", a: "CHESS offers a 30-day return policy on most products in original condition. Commercial orders have custom return terms as specified in your project agreement. Restocking fees may apply to special-order items." },
  { q: "Do you offer installation services?", a: "Yes. Professional installation is available for appliances, plumbing fixtures, HVAC systems, and electrical products. Installation can be added at checkout or scheduled separately through our service team." },
];

export default function Service() {
  const [activeTab, setActiveTab] = useState<"service" | "warranty" | "parts">("service");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: "", email: "", phone: "", productModel: "", serialNumber: "",
    issueType: "", description: "", preferredDate: "",
  });
  const [warrantyForm, setWarrantyForm] = useState({
    name: "", email: "", productModel: "", serialNumber: "",
    purchaseDate: "", retailer: "",
  });

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Service request submitted! A technician will contact you within 24 hours.");
    setServiceForm({ name: "", email: "", phone: "", productModel: "", serialNumber: "", issueType: "", description: "", preferredDate: "" });
  };

  const handleWarrantySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Product registered! Your warranty is now active.");
    setWarrantyForm({ name: "", email: "", productModel: "", serialNumber: "", purchaseDate: "", retailer: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite dark:bg-chess-charcoal transition-colors duration-300">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-chess-charcoal/80 border-b border-border dark:border-white/10">
          <div className="container py-3">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-chess-bronze transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-chess-charcoal dark:text-chess-offwhite font-medium">Service & Support</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-chess-charcoal dark:bg-black/40 text-chess-offwhite py-16 md:py-20 border-b border-white/5">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze mb-3 block">
                Lifecycle Support
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-4">
                Service, Warranty & Support
              </h1>
              <p className="text-base text-white/60 leading-relaxed">
                Every CHESS product is backed by comprehensive warranty coverage and professional service support. From installation to maintenance, we stand behind every product we sell.
              </p>
            </motion.div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {[
                { icon: <Wrench className="w-5 h-5" />, value: "500+", label: "Certified Technicians" },
                { icon: <Clock className="w-5 h-5" />, value: "24hr", label: "Response Time" },
                { icon: <Star className="w-5 h-5" />, value: "98%", label: "Satisfaction Rate" },
                { icon: <MapPin className="w-5 h-5" />, value: "Coast to Coast", label: "Service Coverage" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 dark:bg-white/10 rounded-sm p-4 border border-white/10">
                  <span className="text-chess-bronze mb-2 block">{stat.icon}</span>
                  <p className="text-xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service options */}
        <section className="py-12 bg-white dark:bg-chess-charcoal border-b border-border dark:border-white/10">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <Wrench className="w-6 h-6" />, title: "Schedule Service", desc: "Request a service appointment with a certified technician", tab: "service" as const },
                { icon: <Shield className="w-6 h-6" />, title: "Register Warranty", desc: "Activate your product warranty for full coverage", tab: "warranty" as const },
                { icon: <Package className="w-6 h-6" />, title: "Order Parts", desc: "Find and order genuine OEM replacement parts", tab: "parts" as const },
              ].map((option, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(option.tab)}
                  className={`text-left p-5 rounded-sm border transition-all ${
                    activeTab === option.tab
                      ? "border-chess-bronze dark:border-white bg-chess-bronze/5 dark:bg-white/10 shadow-sm"
                      : "border-border/50 dark:border-white/40 hover:border-chess-bronze/30 dark:hover:border-chess-bronze/40"
                  }`}
                >
                  <span className={`block mb-3 ${activeTab === option.tab ? "text-white" : "text-muted-foreground dark:text-white/40"}`}>
                    {option.icon}
                  </span>
                  <h3 className="font-display text-base font-semibold text-chess-charcoal dark:text-white mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground dark:text-white/60">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Active tab content */}
        <section className="py-12 md:py-16 bg-chess-offwhite dark:bg-chess-charcoal/50">
          <div className="container">
            {activeTab === "service" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                <h2 className="font-display text-xl font-semibold text-chess-charcoal dark:text-white mb-6 text-center md:text-left">Schedule a Service Appointment</h2>
                <form onSubmit={handleServiceSubmit} className="bg-white dark:bg-chess-charcoal dark:border-white/10 rounded-sm border border-border/50 p-6 md:p-8 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Full Name *</label>
                      <input type="text" required value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Email *</label>
                      <input type="email" required value={serviceForm.email} onChange={(e) => setServiceForm({ ...serviceForm, email: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Phone *</label>
                      <input type="tel" required value={serviceForm.phone} onChange={(e) => setServiceForm({ ...serviceForm, phone: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Product Model # *</label>
                      <input type="text" required value={serviceForm.productModel} onChange={(e) => setServiceForm({ ...serviceForm, productModel: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Serial Number</label>
                      <input type="text" value={serviceForm.serialNumber} onChange={(e) => setServiceForm({ ...serviceForm, serialNumber: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Issue Type *</label>
                      <select required value={serviceForm.issueType} onChange={(e) => setServiceForm({ ...serviceForm, issueType: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze transition-colors">
                        <option value="">Select issue</option>
                        <option value="repair">Repair / Malfunction</option>
                        <option value="installation">Installation</option>
                        <option value="maintenance">Preventive Maintenance</option>
                        <option value="warranty">Warranty Claim</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Preferred Service Date</label>
                    <input type="date" value={serviceForm.preferredDate} onChange={(e) => setServiceForm({ ...serviceForm, preferredDate: e.target.value })}
                      className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Description of Issue *</label>
                    <textarea rows={4} required value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="Please describe the issue in detail..."
                      className="w-full px-3 py-2.5 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze resize-none transition-colors" />
                  </div>
                  <button type="submit" className="w-full h-11 bronze-gradient-black dark:bronze-gradient text-white dark:text-chess-charcoal text-sm font-semibold rounded-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    Submit Service Request <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "warranty" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                <h2 className="font-display text-xl font-semibold text-chess-charcoal dark:text-white mb-6 text-center md:text-left">Register Your Product</h2>
                <form onSubmit={handleWarrantySubmit} className="bg-white dark:bg-chess-charcoal dark:border-white/10 rounded-sm border border-border/50 p-6 md:p-8 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Full Name *</label>
                      <input type="text" required value={warrantyForm.name} onChange={(e) => setWarrantyForm({ ...warrantyForm, name: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Email *</label>
                      <input type="email" required value={warrantyForm.email} onChange={(e) => setWarrantyForm({ ...warrantyForm, email: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Product Model # *</label>
                      <input type="text" required value={warrantyForm.productModel} onChange={(e) => setWarrantyForm({ ...warrantyForm, productModel: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Serial Number *</label>
                      <input type="text" required value={warrantyForm.serialNumber} onChange={(e) => setWarrantyForm({ ...warrantyForm, serialNumber: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Purchase Date *</label>
                      <input type="date" required value={warrantyForm.purchaseDate} onChange={(e) => setWarrantyForm({ ...warrantyForm, purchaseDate: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Purchased From</label>
                      <input type="text" value={warrantyForm.retailer} onChange={(e) => setWarrantyForm({ ...warrantyForm, retailer: e.target.value })}
                        placeholder="Retailer or project name"
                        className="w-full h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                  </div>
                  <button type="submit" className="w-full h-11 bronze-gradient-black dark:bronze-gradient text-white dark:text-chess-charcoal text-sm font-semibold rounded-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    Register Product <Shield className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "parts" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                <h2 className="font-display text-xl font-semibold text-chess-charcoal dark:text-white mb-6 text-center md:text-left">Order Replacement Parts</h2>
                <div className="bg-white dark:bg-chess-charcoal dark:border-white/10 rounded-sm border border-border/50 p-6 md:p-8">
                  <div className="mb-6 space-y-3">
                    <label className="text-xs font-medium text-chess-charcoal dark:text-chess-offwhite block">Enter Product Model Number</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input type="text" placeholder="e.g., CHE-RF-3600SS"
                        className="flex-1 h-10 px-3 text-sm border border-border dark:border-white/10 bg-white dark:bg-chess-charcoal/50 text-chess-charcoal dark:text-white rounded-sm focus:outline-none focus:border-chess-bronze" />
                      <button onClick={() => toast("Parts catalog search coming soon")}
                        className="px-5 h-10 bronze-gradient-black dark:bronze-gradient text-white dark:text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                        Search Parts
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-border dark:border-white/10 pt-6">
                    <h3 className="text-sm font-semibold text-chess-charcoal dark:text-white mb-4">Popular Part Categories</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {["Filters & Cartridges", "Handles & Knobs", "Heating Elements", "Gaskets & Seals", "Motors & Pumps", "Shelves & Racks", "Thermostats", "Valves & Fittings"].map((cat) => (
                        <button key={cat} onClick={() => toast("Feature coming soon")}
                          className="text-left p-3 rounded-sm border border-border/50 dark:border-white/10 hover:border-chess-bronze/30 dark:hover:border-chess-bronze/40 transition-colors text-sm text-chess-graphite dark:text-white/70 hover:text-chess-bronze dark:hover:text-chess-bronze">
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16 bg-white dark:bg-chess-charcoal transition-colors">
          <div className="container max-w-2xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze dark:text-white mb-2 block">Help Center</span>
              <h2 className="font-display text-2xl font-semibold text-chess-charcoal dark:text-white">Frequently Asked Questions</h2>
            </motion.div>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border/50 dark:border-white/10 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-chess-charcoal dark:text-white hover:bg-chess-cream/50 dark:hover:bg-white/5 transition-colors"
                  >
                    {faq.q}
                    <ChevronDown className={`w-4 h-4 shrink-0 ml-2 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="overflow-hidden">
                      <p className="px-4 pb-4 text-sm text-muted-foreground dark:text-white/60 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact bar */}
        <section className="bg-chess-cream dark:bg-black/20 py-10 transition-colors">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-chess-charcoal dark:bg-white/20 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-chess-charcoal dark:text-white">Need immediate help?</h3>
                  <p className="text-sm text-muted-foreground dark:text-white/70">Our support team is available Mon–Fri 8am–8pm EST</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <a href="tel:18002437" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-chess-charcoal dark:bg-white text-white dark:text-chess-charcoal text-sm font-semibold rounded-sm hover:bg-chess-graphite dark:hover:bg-chess-bronze/80 transition-colors">
                  <Phone className="w-4 h-4" /> 1-800-CHESS
                </a>
                <a href="mailto:support@chessproducts.ca" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-chess-charcoal dark:border-white/20 text-chess-charcoal dark:text-white text-sm font-semibold rounded-sm hover:bg-chess-charcoal hover:text-white dark:hover:bg-white/5 transition-colors">
                  <Mail className="w-4 h-4" /> Email Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}