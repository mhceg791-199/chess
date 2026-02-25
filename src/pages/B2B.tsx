/*
 * CHESS B2B Portal — Scandinavian Warmth + Swiss Precision
 * Commercial/hospitality focused page with quote request, volume pricing, project tools.
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Building2, Users, Award, Truck, Shield, Clock, ArrowRight,
  ChevronRight, Phone, Mail, FileText, Calculator, Package,
  CheckCircle2, Star, Briefcase, Globe,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HERO_IMAGES } from "@/types";
import { toast } from "sonner";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

export default function B2B() {
  const [formData, setFormData] = useState({
    company: "", contact: "", email: "", phone: "",
    projectType: "", units: "", timeline: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Quote request submitted! Our commercial team will contact you within 24 hours.");
    setFormData({ company: "", contact: "", email: "", phone: "", projectType: "", units: "", timeline: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-chess-offwhite">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[400px] md:h-[480px] overflow-hidden">
          <img src={HERO_IMAGES.commercial} alt="Commercial solutions" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-chess-charcoal/85 via-chess-charcoal/60 to-transparent" />
          <div className="relative container h-full flex items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
              <span className="inline-block px-3 py-1 mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-chess-bronze border border-chess-bronze/40 rounded-sm">
                Commercial & B2B
              </span>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
                Built for Professional Scale
              </h1>
              <p className="text-base text-white/70 mb-6 max-w-md">
                Volume pricing, dedicated project management, and custom specifications for developers, contractors, and hospitality groups.
              </p>
              <a href="#quote-form" className="inline-flex items-center gap-2 px-6 py-3 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-border">
          <div className="container py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "500+", label: "Commercial Projects", icon: <Building2 className="w-5 h-5" /> },
                { value: "50K+", label: "Units Delivered", icon: <Package className="w-5 h-5" /> },
                { value: "98%", label: "On-Time Delivery", icon: <Clock className="w-5 h-5" /> },
                { value: "24hr", label: "Quote Response", icon: <FileText className="w-5 h-5" /> },
              ].map((stat, i) => (
                <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
                  <div className="flex flex-col items-center">
                    <span className="text-chess-bronze mb-2">{stat.icon}</span>
                    <p className="text-2xl md:text-3xl font-display font-bold text-chess-charcoal">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze mb-2 block">Why CHESS Commercial</span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal">
                End-to-End Project Support
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: <Calculator className="w-6 h-6" />, title: "Volume Pricing", desc: "Strategic pricing solutions designed to support contractors, developers, and commercial projects with competitive bulk purchasing benefits." },
                { icon: <Users className="w-6 h-6" />, title: "Dedicated Account Manager", desc: "Single point of contact for your entire project. Your account manager coordinates specifications, logistics, and after-sales support." },
                { icon: <FileText className="w-6 h-6" />, title: "Custom Specifications", desc: "Modify finishes, dimensions, and configurations to meet project requirements. Custom branding available for hospitality clients." },
                { icon: <Truck className="w-6 h-6" />, title: "Staged Delivery", desc: "Coordinate deliveries with your construction schedule. We warehouse and ship to match your project phases." },
                { icon: <Shield className="w-6 h-6" />, title: "Extended Commercial Warranty", desc: "Up to 10-year commercial warranty on qualifying products. Preventive maintenance programs available." },
                { icon: <Briefcase className="w-6 h-6" />, title: "Project Documentation", desc: "Complete submittals, cut sheets, CAD files, and compliance documentation for every product in your specification." },
              ].map((service, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <div className="bg-white rounded-sm border border-border/50 p-6 h-full card-hover">
                    <span className="text-chess-bronze mb-4 block">{service.icon}</span>
                    <h3 className="font-display text-base font-semibold text-chess-charcoal mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries served */}
        <section className="py-16 md:py-20 bg-chess-charcoal text-chess-offwhite">
          <div className="container">
            <motion.div {...fadeUp} className="mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze mb-2 block">Industries We Serve</span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold">Trusted Across Sectors</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Building2 className="w-5 h-5" />, title: "Multi-Residential", desc: "Condos, apartments, townhomes" },
                { icon: <Globe className="w-5 h-5" />, title: "Hospitality", desc: "Hotels, resorts, restaurants" },
                { icon: <Briefcase className="w-5 h-5" />, title: "Corporate", desc: "Offices, co-working spaces" },
                { icon: <Award className="w-5 h-5" />, title: "Healthcare", desc: "Clinics, senior living, hospitals" },
              ].map((industry, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <div className="bg-white/5 rounded-sm p-5 border border-white/10 hover:border-chess-bronze/30 transition-colors">
                    <span className="text-chess-bronze mb-3 block">{industry.icon}</span>
                    <h3 className="text-sm font-semibold mb-1">{industry.title}</h3>
                    <p className="text-xs text-white/50">{industry.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote form */}
        <section id="quote-form" className="py-16 md:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div {...fadeUp}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chess-bronze mb-2 block">Get Started</span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-chess-charcoal mb-4">
                  Request a Commercial Quote
                </h2>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  Tell us about your project and our commercial team will prepare a customized proposal within 24 hours. Volume pricing, custom specifications, and staged delivery options available.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: <CheckCircle2 className="w-4 h-4" />, text: "Custom finish and configuration options" },
                    { icon: <CheckCircle2 className="w-4 h-4" />, text: "Dedicated project coordination" },
                    { icon: <CheckCircle2 className="w-4 h-4" />, text: "Net 30/60/90 payment terms available" },
                    { icon: <CheckCircle2 className="w-4 h-4" />, text: "Complete project documentation and submittals" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-chess-graphite">
                      <span className="text-chess-bronze">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-chess-cream rounded-sm">
                  <p className="text-sm font-medium text-chess-charcoal mb-2">Prefer to speak directly?</p>
                  <div className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 text-chess-bronze" /> 1-800-CHESS ext. 200
                    </span>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 text-chess-bronze" /> commercial@chessproducts.ca
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-border/50 p-6 md:p-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Company Name *</label>
                      <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Contact Name *</label>
                      <input type="text" required value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Email *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Project Type *</label>
                      <select required value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze bg-white">
                        <option value="">Select type</option>
                        <option value="multi-residential">Multi-Residential</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="corporate">Corporate / Office</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="retail">Retail</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Estimated Units</label>
                      <select value={formData.units} onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze bg-white">
                        <option value="">Select range</option>
                        <option value="1-10">1–10 units</option>
                        <option value="10-50">10–50 units</option>
                        <option value="50-100">50–100 units</option>
                        <option value="100-500">100–500 units</option>
                        <option value="500+">500+ units</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Project Timeline</label>
                    <select value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full h-10 px-3 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze bg-white">
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (within 30 days)</option>
                      <option value="1-3months">1–3 months</option>
                      <option value="3-6months">3–6 months</option>
                      <option value="6-12months">6–12 months</option>
                      <option value="planning">Planning phase</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-chess-charcoal mb-1.5 block">Project Details</label>
                    <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project requirements, product categories of interest, and any custom specifications needed..."
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-sm focus:outline-none focus:border-chess-bronze resize-none" />
                  </div>
                  <button type="submit" className="w-full h-11 mt-5 bronze-gradient text-chess-charcoal text-sm font-semibold rounded-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    Submit Quote Request <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-muted-foreground mt-3">
                    We respond to all commercial inquiries within 24 business hours.
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
