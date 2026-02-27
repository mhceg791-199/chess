/*
 * CHESS Footer — Scandinavian Warmth + Swiss Precision
 * Dark charcoal background, warm off-white text, bronze accents.
 */
import { Link } from "wouter";
import { LOGO } from "@/types";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-chess-charcoal text-chess-offwhite">
      {/* Newsletter bar */}
      <div className="border-b border-white/10">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-semibold mb-1">Stay informed</h3>
            <p className="text-sm text-white/60">Product launches, project ideas, and exclusive commercial pricing.</p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="flex w-full md:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="h-11 px-4 bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40
                         rounded-l-sm focus:outline-none focus:border-chess-bronze w-full md:w-72"
            />
            <button
              type="submit"
              className="h-11 px-6 bronze-gradient text-chess-charcoal dark:text-white text-sm font-semibold rounded-r-sm
                         hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={LOGO.dark} alt="CHESS" className="h-14 w-auto invert brightness-200" style={{ filter: 'brightness(0) invert(1)' }} />
              {/* <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold text-white tracking-tight">CHESS</span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-chess-bronze font-semibold mt-1">by Mosaic Holding Corp.</span>
              </div> */}
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-3">
              Canadian Home, Electrical and Supply Solutions. A unified platform for residential and commercial projects.
            </p>
            <p className="text-[11px] text-white/40 border-l-2 border-chess-bronze/40 pl-3">A brand of Mosaic Holding Corporation</p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-chess-bronze transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-chess-bronze transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-chess-bronze transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-chess-bronze transition-colors">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2.5">
              {["Appliances", "Lighting", "Plumbing", "HVAC", "Electrical", "Building Materials", "Outdoor"].map((item) => (
                <li key={item}>
                  <Link href={`/category/${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-white/60 hover:text-white/90 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Commercial */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Commercial</h4>
            <ul className="space-y-2.5">
              {[
                { label: "B2B Portal", href: "/b2b" },
                { label: "Project Quotes", href: "/b2b" },
                { label: "Volume Pricing", href: "/b2b" },
                { label: "Hospitality Solutions", href: "/category/commercial" },
                { label: "Bulk Orders", href: "/b2b" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white/90 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Service & Warranty", href: "/service" },
                { label: "Schedule Service", href: "/service" },
                { label: "Track Order", href: "/account" },
                { label: "Returns & Exchanges", href: "/service" },
                { label: "Installation Services", href: "/service" },
                { label: "Product Registration", href: "/service" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white/90 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                <span>1-800-CHESS (24357)<br />Mon–Fri 8am–8pm EST</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                <span>support@chessproducts.ca</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                <span>Calgary, Alberta, Canada</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                <span>Showroom: Mon–Sat 9am–6pm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-wrap items-center justify-center gap-8 text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/80" /> CSA Certified
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/80" /> UL Listed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/80" /> Energy Star Partner
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/80" /> BIFMA Certified
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/80" /> LEED Contributing
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} CHESS — Canadian Home, Electrical and Supply Solutions. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="/accessibility" className="hover:text-white/60 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
