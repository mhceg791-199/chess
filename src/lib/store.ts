// ═══════════════════════════════════════════════════════════════
// CHESS E-Commerce Dynamic Data Store
// Design: Scandinavian Warmth + Swiss Precision
// All counts are computed dynamically from product data.
// Only ONE discount per category.
// ═══════════════════════════════════════════════════════════════

export interface Product {
  id: string;
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
  priceUnit?: string; // e.g. "per sq. ft.", "per linear ft."
}

export interface SubcategoryDef {
  name: string;
  slug: string;
}

export interface CategoryDef {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  subcategories: SubcategoryDef[];
}

// Computed category with live counts
export interface Category extends CategoryDef {
  productCount: number;
  subcategoriesWithCounts: { name: string; slug: string; count: number }[];
}

// ─── HERO IMAGES ───────────────────────────────────────────────
export const HERO_IMAGES = {
  kitchen: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/gvLuXujCnAVHyRyN.jpg",
  living: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/GuFDnPbeEhsMwVEN.jpg",
  bathroom: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/ghrhZhoLDNkYpAXf.jpg",
  commercial: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/sdPYRGfjLcjHTsWv.jpg",
  outdoor: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/csHwksbAOBOUFSIH.jpg",
};

export const LOGO = {
  dark: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/FApXNnzqFWwiFOuD.png",
  white: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663232530149/aoUCKPDFFgkguxbf.png",
};

// ─── CATEGORY DEFINITIONS (counts computed dynamically) ────────
const categoryDefs: CategoryDef[] = [
  {
    id: "appliances", name: "Appliances", slug: "appliances",
    description: "Premium kitchen and laundry appliances engineered for lasting performance.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    icon: "Refrigerator",
    subcategories: [
      { name: "Refrigeration", slug: "refrigeration" },
      { name: "Cooking", slug: "cooking" },
      { name: "Dishwashing", slug: "dishwashing" },
      { name: "Laundry", slug: "laundry" },
      { name: "Small Appliances", slug: "small-appliances" },
      { name: "Ventilation", slug: "ventilation" },
    ],
  },
  {
    id: "furniture", name: "Furniture", slug: "furniture",
    description: "Thoughtfully designed furniture for every room and commercial space.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
    icon: "Sofa",
    subcategories: [
      { name: "Living Room", slug: "living-room" },
      { name: "Bedroom", slug: "bedroom" },
      { name: "Dining Room", slug: "dining-room" },
      { name: "Office", slug: "office" },
      { name: "Storage", slug: "storage" },
      { name: "Accent Furniture", slug: "accent" },
    ],
  },
  {
    id: "lighting", name: "Lighting", slug: "lighting",
    description: "Architectural and decorative lighting for residential and commercial projects.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    icon: "Lightbulb",
    subcategories: [
      { name: "Pendants & Chandeliers", slug: "pendants-chandeliers" },
      { name: "Recessed & Track", slug: "recessed-track" },
      { name: "Wall Sconces", slug: "wall-sconces" },
      { name: "Floor & Table Lamps", slug: "floor-table-lamps" },
      { name: "Outdoor Lighting", slug: "outdoor-lighting" },
      { name: "Ceiling Fans", slug: "ceiling-fans" },
    ],
  },
  {
    id: "plumbing", name: "Plumbing", slug: "plumbing",
    description: "Professional-grade plumbing fixtures and fittings for every application.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    icon: "Droplets",
    subcategories: [
      { name: "Kitchen Faucets", slug: "kitchen-faucets" },
      { name: "Bathroom Faucets", slug: "bathroom-faucets" },
      { name: "Shower Systems", slug: "shower-systems" },
      { name: "Toilets", slug: "toilets" },
      { name: "Sinks", slug: "sinks" },
      { name: "Bathtubs", slug: "bathtubs" },
    ],
  },
  {
    id: "hvac", name: "HVAC", slug: "hvac",
    description: "Climate control systems for residential and commercial environments.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop",
    icon: "Wind",
    subcategories: [
      { name: "Mini-Split Systems", slug: "mini-split" },
      { name: "Central Air", slug: "central-air" },
      { name: "Furnaces", slug: "furnaces" },
      { name: "Heat Pumps", slug: "heat-pumps" },
      { name: "Thermostats", slug: "thermostats" },
      { name: "Air Quality", slug: "air-quality" },
    ],
  },
  {
    id: "electrical", name: "Electrical", slug: "electrical",
    description: "Electrical components, panels, and smart home systems.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
    icon: "Zap",
    subcategories: [
      { name: "Panels & Breakers", slug: "panels-breakers" },
      { name: "Switches & Outlets", slug: "switches-outlets" },
      { name: "Smart Home", slug: "smart-home" },
      { name: "Wiring & Cable", slug: "wiring-cable" },
      { name: "Generators", slug: "generators" },
      { name: "EV Charging", slug: "ev-charging" },
    ],
  },
  {
    id: "building-materials", name: "Building Materials", slug: "building-materials",
    description: "Structural and finishing materials for construction projects of any scale.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    icon: "Hammer",
    subcategories: [
      { name: "Flooring", slug: "flooring" },
      { name: "Tile", slug: "tile" },
      { name: "Countertops", slug: "countertops" },
      { name: "Cabinets", slug: "cabinets" },
      { name: "Doors & Windows", slug: "doors-windows" },
      { name: "Insulation", slug: "insulation" },
    ],
  },
  {
    id: "outdoor", name: "Outdoor", slug: "outdoor",
    description: "Outdoor living, landscaping, and exterior building products.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    icon: "TreePine",
    subcategories: [
      { name: "Patio Furniture", slug: "patio-furniture" },
      { name: "Grills & Cooking", slug: "grills-cooking" },
      { name: "Fire Features", slug: "fire-features" },
      { name: "Outdoor Lighting", slug: "outdoor-lighting-ext" },
      { name: "Decking", slug: "decking" },
      { name: "Fencing & Privacy", slug: "fencing-privacy" },
    ],
  },
  {
    id: "commercial", name: "Commercial & Hospitality", slug: "commercial",
    description: "Specialized solutions for hotels, restaurants, and institutional projects.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    icon: "Building2",
    subcategories: [
      { name: "Hotel Furnishings", slug: "hotel-furnishings" },
      { name: "Restaurant Equipment", slug: "restaurant-equipment" },
      { name: "Office Solutions", slug: "office-solutions" },
      { name: "Healthcare", slug: "healthcare" },
      { name: "Education", slug: "education" },
      { name: "Institutional", slug: "institutional" },
    ],
  },
  {
    id: "parts", name: "Parts & Accessories", slug: "parts",
    description: "Replacement parts, accessories, and maintenance supplies.",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&h=400&fit=crop",
    icon: "Wrench",
    subcategories: [
      { name: "Appliance Parts", slug: "appliance-parts" },
      { name: "Plumbing Parts", slug: "plumbing-parts" },
      { name: "HVAC Filters", slug: "hvac-filters" },
      { name: "Electrical Parts", slug: "electrical-parts" },
      { name: "Hardware & Fasteners", slug: "hardware-fasteners" },
      { name: "Lighting Accessories", slug: "lighting-accessories" },
    ],
  },
];

// ─── PRODUCT HELPER ────────────────────────────────────────────
function p(
  id: string, sku: string, name: string, category: string, subcategory: string,
  type: string, price: number, rating: number, reviewCount: number,
  image: string, description: string, features: string[], specs: Record<string, string>,
  opts: Partial<Pick<Product, "originalPrice" | "badge" | "commercial" | "bulkEligible" | "installationRequired" | "finish" | "color" | "dimensions" | "weight" | "voltage" | "compliance" | "warranty" | "leadTime" | "inStock" | "priceUnit" | "images">> = {}
): Product {
  return {
    id, sku, name, category, subcategory, type, price, rating, reviewCount,
    image, images: opts.images || [image.replace("w=500", "w=800").replace("h=500", "h=800")],
    description, features, specs,
    badge: opts.badge,
    originalPrice: opts.originalPrice,
    inStock: opts.inStock ?? true,
    leadTime: opts.leadTime || "3-7 business days",
    warranty: opts.warranty || "3 years parts & labor",
    commercial: opts.commercial ?? false,
    bulkEligible: opts.bulkEligible ?? false,
    installationRequired: opts.installationRequired ?? false,
    finish: opts.finish || "",
    color: opts.color || "",
    dimensions: opts.dimensions || { width: "", height: "", depth: "" },
    weight: opts.weight || "",
    voltage: opts.voltage,
    compliance: opts.compliance || ["CSA"],
    priceUnit: opts.priceUnit,
  };
}

// ═══════════════════════════════════════════════════════════════
// PRODUCTS — 80+ items, ONE discount per category
// ═══════════════════════════════════════════════════════════════

export const products: Product[] = [

  // ─── APPLIANCES (10 products, 1 discount) ────────────────────
  p("chs-ref-fd-36-ss", "CHS-REF-FD-36-SS", "CHESS Professional French Door Refrigerator 36\"", "appliances", "refrigeration", "French Door Refrigerator",
    3299, 4.8, 342,
    "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop",
    "Counter-depth French door refrigerator with dual cooling zones, FlexZone drawer, and Energy Star certification. Designed for seamless kitchen integration.",
    ["Counter-depth design for flush fit", "Dual cooling with independent zones", "FlexZone drawer — 4 temperature settings", "Energy Star certified", "Built-in water filtration & ice maker", "Fingerprint-resistant finish"],
    { "Capacity": "28.2 cu. ft.", "Width": "35.75\"", "Height": "70\"", "Depth": "29\"", "Noise Level": "42 dB", "Voltage": "120V / 60Hz" },
    { originalPrice: 3899, badge: "Best Seller", warranty: "5 years parts & labor", commercial: true, bulkEligible: true, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "35.75\"", height: "70\"", depth: "29\"" }, weight: "298 lbs", voltage: "120V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-ref-sb-33-ss", "CHS-REF-SB-33-SS", "CHESS Side-by-Side Refrigerator 33\"", "appliances", "refrigeration", "Side-by-Side Refrigerator",
    1899, 4.6, 218,
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop",
    "Full-size side-by-side refrigerator with external ice and water dispenser. Spacious interior with adjustable shelving.",
    ["External ice & water dispenser", "Adjustable glass shelves", "Humidity-controlled crisper drawers", "LED interior lighting", "Door alarm system", "Energy Star certified"],
    { "Capacity": "25.1 cu. ft.", "Width": "32.75\"", "Height": "69.5\"", "Depth": "34\"", "Voltage": "120V / 60Hz" },
    { warranty: "3 years parts & labor", finish: "Stainless Steel", color: "Silver", dimensions: { width: "32.75\"", height: "69.5\"", depth: "34\"" }, weight: "265 lbs", voltage: "120V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-rng-gs-30-ss", "CHS-RNG-GS-30-SS", "CHESS Pro Gas Range 30\" with Convection", "appliances", "cooking", "Gas Range",
    2499, 4.7, 218,
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&h=500&fit=crop",
    "Professional-style 30-inch gas range with 5 sealed burners, true convection oven, and continuous cast-iron grates.",
    ["5 sealed burners (up to 20,000 BTU)", "True European convection oven", "Continuous cast-iron grates", "Self-cleaning cycle", "Stainless steel construction", "Infrared broiler"],
    { "Burners": "5 sealed", "Oven Capacity": "5.8 cu. ft.", "Max BTU": "20,000", "Width": "29.9\"", "Height": "36\"", "Depth": "28.5\"" },
    { commercial: true, bulkEligible: true, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "29.9\"", height: "36\"", depth: "28.5\"" }, weight: "195 lbs", voltage: "120V", compliance: ["CSA", "UL"] }
  ),
  p("chs-rng-ind-30-bk", "CHS-RNG-IND-30-BK", "CHESS Induction Range 30\" — Matte Black", "appliances", "cooking", "Induction Range",
    2799, 4.7, 156,
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=500&fit=crop",
    "Sleek induction range with 4 cooking zones, bridge element, and convection oven. Rapid boil technology heats water in under 90 seconds.",
    ["4 induction zones + bridge element", "Rapid boil — water in under 90 seconds", "Convection oven with steam assist", "Slide-touch controls", "Child lock safety", "Easy-clean ceramic surface"],
    { "Cooking Zones": "4 + bridge", "Oven Capacity": "5.4 cu. ft.", "Width": "29.9\"", "Height": "36\"", "Depth": "27\"" },
    { finish: "Matte Black", color: "Black", dimensions: { width: "29.9\"", height: "36\"", depth: "27\"" }, weight: "178 lbs", voltage: "240V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-dw-bi-24-ss", "CHS-DW-BI-24-SS", "CHESS Built-In Dishwasher 24\" — Stainless", "appliances", "dishwashing", "Built-In Dishwasher",
    1199, 4.6, 203,
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&h=500&fit=crop",
    "Ultra-quiet 42 dB dishwasher with third rack, AutoSense cycle, and stainless steel interior tub.",
    ["42 dB — one of the quietest in class", "Third rack for utensils", "AutoSense adjusts water and time", "Stainless steel tub", "Fingerprint-resistant exterior", "Delay start up to 24 hours"],
    { "Place Settings": "16", "Wash Cycles": "7", "Noise Level": "42 dB", "Width": "23.75\"", "Height": "33.9\"", "Water Usage": "3.1 gal/cycle" },
    { installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "23.75\"", height: "33.9\"", depth: "24.5\"" }, weight: "82 lbs", voltage: "120V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-wash-fl-wh", "CHS-WSH-FL-WH", "CHESS Front-Load Washer 5.0 cu. ft.", "appliances", "laundry", "Front-Load Washer",
    1099, 4.5, 189,
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop",
    "High-efficiency front-load washer with steam cleaning, allergen cycle, and vibration reduction technology.",
    ["5.0 cu. ft. capacity", "Steam cleaning cycle", "Allergen removal certified", "Vibration reduction system", "12 wash programs", "Delay start"],
    { "Capacity": "5.0 cu. ft.", "Spin Speed": "1,300 RPM", "Programs": "12", "Width": "27\"", "Height": "38.7\"", "Water Factor": "3.2" },
    { finish: "White", color: "White", dimensions: { width: "27\"", height: "38.7\"", depth: "31.5\"" }, weight: "195 lbs", voltage: "120V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-dry-el-wh", "CHS-DRY-EL-WH", "CHESS Electric Dryer 7.4 cu. ft.", "appliances", "laundry", "Electric Dryer",
    999, 4.5, 164,
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&h=500&fit=crop",
    "Large-capacity electric dryer with sensor dry technology, steam refresh, and wrinkle prevention.",
    ["7.4 cu. ft. capacity", "Sensor dry technology", "Steam refresh cycle", "Wrinkle prevention option", "Interior drum light", "Lint filter indicator"],
    { "Capacity": "7.4 cu. ft.", "Cycles": "10", "Width": "27\"", "Height": "38.7\"", "Voltage": "240V / 30A" },
    { finish: "White", color: "White", dimensions: { width: "27\"", height: "38.7\"", depth: "31.5\"" }, weight: "130 lbs", voltage: "240V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-mw-otc-30-ss", "CHS-MW-OTC-30-SS", "CHESS Over-the-Range Microwave 1.9 cu. ft.", "appliances", "small-appliances", "Over-the-Range Microwave",
    549, 4.4, 276,
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=500&fit=crop&q=80",
    "Powerful over-the-range microwave with sensor cooking, 400 CFM ventilation, and easy-clean interior.",
    ["1.9 cu. ft. capacity", "1,100W cooking power", "Sensor cooking — 10 presets", "400 CFM ventilation system", "Easy-clean interior coating", "LED cooktop lighting"],
    { "Capacity": "1.9 cu. ft.", "Wattage": "1,100W", "Ventilation": "400 CFM", "Width": "29.9\"", "Height": "17\"" },
    { finish: "Stainless Steel", color: "Silver", dimensions: { width: "29.9\"", height: "17\"", depth: "15.9\"" }, weight: "62 lbs", voltage: "120V", compliance: ["CSA", "UL"] }
  ),
  p("chs-hood-wall-36-ss", "CHS-HOOD-WL-36-SS", "CHESS Wall-Mount Range Hood 36\" — 600 CFM", "appliances", "ventilation", "Range Hood",
    899, 4.6, 134,
    "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500&h=500&fit=crop",
    "Professional wall-mount chimney hood with 600 CFM blower, LED lighting, and dishwasher-safe baffle filters.",
    ["600 CFM blower capacity", "3-speed + boost mode", "LED task lighting", "Dishwasher-safe baffle filters", "Quiet operation — 56 dB max", "Telescoping chimney"],
    { "CFM": "600", "Speeds": "3 + boost", "Noise": "56 dB max", "Width": "36\"", "Height": "Chimney adjustable" },
    { installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "36\"", height: "Adjustable", depth: "20\"" }, weight: "48 lbs", voltage: "120V", compliance: ["CSA", "UL"] }
  ),
  p("chs-frz-upright-21", "CHS-FRZ-UP-21", "CHESS Upright Freezer 21 cu. ft.", "appliances", "refrigeration", "Upright Freezer",
    1299, 4.5, 98,
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop&q=80",
    "Frost-free upright freezer with electronic temperature controls, quick-freeze shelf, and door alarm.",
    ["21 cu. ft. capacity", "Frost-free operation", "Electronic temperature controls", "Quick-freeze shelf", "Door ajar alarm", "Interior LED lighting"],
    { "Capacity": "21 cu. ft.", "Width": "32.7\"", "Height": "72\"", "Depth": "29\"", "Shelves": "5 adjustable" },
    { finish: "White", color: "White", dimensions: { width: "32.7\"", height: "72\"", depth: "29\"" }, weight: "210 lbs", voltage: "120V", compliance: ["CSA", "UL", "Energy Star"] }
  ),

  // ─── FURNITURE (10 products, 1 discount) ─────────────────────
  p("chs-sofa-sec-hg", "CHS-FRN-SEC-HG", "CHESS Modular Sectional Sofa — Heather Grey", "furniture", "living-room", "Sectional Sofa",
    4199, 4.9, 156,
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    "Modular 5-piece sectional with performance fabric, removable covers, and solid hardwood frame. Configure to fit any space.",
    ["5-piece modular design", "Performance fabric — stain resistant", "Removable & washable covers", "Solid hardwood frame", "High-resilience foam cushions", "10-year structural warranty"],
    { "Configuration": "5-piece modular", "Seating": "6-7 people", "Material": "Performance polyester", "Frame": "Kiln-dried hardwood" },
    { originalPrice: 4999, warranty: "10 years structural", commercial: true, bulkEligible: true, finish: "Heather Grey", color: "Grey", dimensions: { width: "118\"", height: "34\"", depth: "92\"" }, weight: "285 lbs", compliance: ["BIFMA", "CARB Phase 2"] }
  ),
  p("chs-sofa-3s-navy", "CHS-FRN-3S-NV", "CHESS Copenhagen 3-Seat Sofa — Navy Velvet", "furniture", "living-room", "3-Seat Sofa",
    2499, 4.8, 203,
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop",
    "Mid-century inspired 3-seat sofa with velvet upholstery, tapered walnut legs, and pocket-spring cushions.",
    ["Premium velvet upholstery", "Pocket-spring seat cushions", "Tapered solid walnut legs", "Sinuous spring support", "Removable seat cushions", "Arm height 24\""],
    { "Seating": "3 people", "Material": "Velvet", "Frame": "Hardwood", "Leg Material": "Solid walnut" },
    { warranty: "5 years", finish: "Navy Velvet", color: "Navy", dimensions: { width: "84\"", height: "33\"", depth: "36\"" }, weight: "145 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-bed-kng-wl", "CHS-FRN-BED-KNG-WL", "CHESS Oslo Platform Bed — King, Walnut", "furniture", "bedroom", "Platform Bed",
    1899, 4.8, 94,
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop",
    "Scandinavian-inspired platform bed in solid walnut with integrated headboard and hidden storage drawers.",
    ["Solid American walnut construction", "Integrated upholstered headboard", "Under-bed storage drawers (2 per side)", "Slatted base — no box spring needed", "Rounded edges for safety", "Tool-free assembly"],
    { "Size": "King (76\" x 80\")", "Material": "Solid walnut", "Weight Capacity": "800 lbs", "Assembly": "30 minutes" },
    { warranty: "10 years structural", commercial: true, bulkEligible: true, finish: "Natural Walnut", color: "Walnut", dimensions: { width: "82\"", height: "42\"", depth: "86\"" }, weight: "165 lbs", compliance: ["BIFMA", "CARB Phase 2"] }
  ),
  p("chs-bed-qn-oak", "CHS-FRN-BED-QN-OAK", "CHESS Bergen Bed Frame — Queen, White Oak", "furniture", "bedroom", "Bed Frame",
    1499, 4.7, 127,
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&h=500&fit=crop",
    "Minimalist queen bed frame in white oak with slat headboard and low-profile design.",
    ["Solid white oak construction", "Slat headboard design", "Low-profile platform", "No box spring required", "Center support rail", "Easy assembly"],
    { "Size": "Queen (60\" x 80\")", "Material": "Solid white oak", "Weight Capacity": "700 lbs" },
    { warranty: "10 years structural", finish: "Natural White Oak", color: "Oak", dimensions: { width: "64\"", height: "38\"", depth: "84\"" }, weight: "135 lbs", compliance: ["BIFMA", "CARB Phase 2"] }
  ),
  p("chs-din-tbl-ext-wl", "CHS-FRN-DIN-EXT-WL", "CHESS Aarhus Extendable Dining Table — Walnut", "furniture", "dining-room", "Dining Table",
    2199, 4.8, 88,
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop",
    "Extendable dining table in solid walnut with butterfly leaf mechanism. Seats 6 to 10.",
    ["Solid walnut top", "Butterfly leaf extension", "Seats 6-10", "Tapered legs", "Felt floor protectors", "Matches CHESS dining chairs"],
    { "Seats": "6-10", "Material": "Solid walnut", "Extended Length": "96\"", "Collapsed Length": "72\"" },
    { warranty: "10 years", finish: "Natural Walnut", color: "Walnut", dimensions: { width: "40\"", height: "30\"", depth: "72-96\"" }, weight: "125 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-din-chr-wl", "CHS-FRN-CHR-DIN-WL", "CHESS Aarhus Dining Chair — Walnut (Set of 2)", "furniture", "dining-room", "Dining Chair",
    599, 4.7, 214,
    "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&h=500&fit=crop",
    "Sculpted dining chair in solid walnut with woven cord seat. Sold as a set of 2.",
    ["Solid walnut frame", "Hand-woven cord seat", "Ergonomic curved backrest", "Stackable design", "Felt floor protectors", "Set of 2"],
    { "Material": "Solid walnut + woven cord", "Weight Capacity": "300 lbs each", "Set": "2 chairs" },
    { finish: "Natural Walnut", color: "Walnut", dimensions: { width: "20\"", height: "32\"", depth: "21\"" }, weight: "22 lbs (set)", compliance: ["BIFMA"] }
  ),
  p("chs-desk-stand-wl", "CHS-FRN-DSK-STD-WL", "CHESS Executive Standing Desk — Walnut", "furniture", "office", "Standing Desk",
    1299, 4.9, 167,
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=500&fit=crop",
    "Motorized sit-stand desk with solid walnut top, dual motors, and 4 programmable height presets.",
    ["Dual-motor height adjustment (25-51\")", "4 programmable presets", "Solid walnut desktop 1.5\" thick", "Integrated cable management", "Anti-collision sensor", "350 lbs lifting capacity"],
    { "Desktop": "72\" x 30\"", "Height Range": "25-51\"", "Lifting Capacity": "350 lbs", "Motors": "Dual" },
    { badge: "Top Rated", warranty: "10 years frame, 5 years electronics", commercial: true, bulkEligible: true, finish: "Natural Walnut", color: "Walnut", dimensions: { width: "72\"", height: "25-51\"", depth: "30\"" }, weight: "115 lbs", compliance: ["BIFMA", "GREENGUARD"] }
  ),
  p("chs-bookshelf-oak", "CHS-FRN-BKS-OAK", "CHESS Aalborg Bookshelf — White Oak", "furniture", "storage", "Bookshelf",
    899, 4.6, 73,
    "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&h=500&fit=crop",
    "Open-frame bookshelf in white oak with steel accents. 5 adjustable shelves.",
    ["Solid white oak shelves", "Powder-coated steel frame", "5 adjustable shelf heights", "Wall-anchor kit included", "Anti-tip hardware", "Matches CHESS Aalborg collection"],
    { "Shelves": "5 adjustable", "Material": "White oak + steel", "Weight Capacity": "50 lbs per shelf" },
    { finish: "White Oak / Black Steel", color: "Oak", dimensions: { width: "36\"", height: "72\"", depth: "14\"" }, weight: "85 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-coffee-tbl-mrb", "CHS-FRN-CFT-MRB", "CHESS Marble Coffee Table — Carrara White", "furniture", "accent", "Coffee Table",
    1599, 4.7, 62,
    "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&h=500&fit=crop",
    "Italian Carrara marble top coffee table with brushed brass legs. Each piece is unique due to natural stone veining.",
    ["Genuine Carrara marble top", "Brushed brass legs", "Felt floor protectors", "Each piece unique", "Sealed & polished finish", "Matches CHESS marble collection"],
    { "Top Material": "Carrara marble", "Base": "Brushed brass steel", "Top Thickness": "3/4\"" },
    { finish: "Carrara White / Brass", color: "White", dimensions: { width: "48\"", height: "16\"", depth: "28\"" }, weight: "95 lbs" }
  ),
  p("chs-nightstand-wl", "CHS-FRN-NS-WL", "CHESS Oslo Nightstand — Walnut", "furniture", "bedroom", "Nightstand",
    449, 4.6, 183,
    "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=500&h=500&fit=crop",
    "Matching nightstand for the CHESS Oslo bed collection. Solid walnut with soft-close drawer and open shelf.",
    ["Solid walnut construction", "Soft-close drawer", "Open shelf for books", "Rounded edges", "Matches Oslo bed collection", "Pre-assembled"],
    { "Material": "Solid walnut", "Drawers": "1 soft-close", "Shelves": "1 open" },
    { finish: "Natural Walnut", color: "Walnut", dimensions: { width: "22\"", height: "24\"", depth: "18\"" }, weight: "35 lbs", compliance: ["CARB Phase 2"] }
  ),

  // ─── LIGHTING (8 products, 1 discount) ───────────────────────
  p("chs-lgt-pnd-md-bk", "CHS-LGT-PND-MD-BK", "CHESS Meridian Pendant Light — Matte Black", "lighting", "pendants-chandeliers", "Pendant Light",
    349, 4.7, 124,
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&h=500&fit=crop",
    "Minimalist dome pendant in matte black with brass interior. Adjustable drop height up to 72 inches.",
    ["Matte black exterior, brass interior", "Adjustable drop up to 72\"", "E26 socket — LED compatible", "Dimmable with compatible dimmer", "UL listed for dry locations", "Hardwire installation"],
    { "Diameter": "14\"", "Height": "10\"", "Max Drop": "72\"", "Socket": "E26", "Wattage": "Up to 100W" },
    { originalPrice: 429, installationRequired: true, finish: "Matte Black / Brass", color: "Black", dimensions: { width: "14\"", height: "10\"", depth: "14\"" }, weight: "6.5 lbs", voltage: "120V", compliance: ["UL", "CSA"] }
  ),
  p("chs-lgt-chand-6-br", "CHS-LGT-CHD-6-BR", "CHESS Sputnik Chandelier 6-Light — Brushed Brass", "lighting", "pendants-chandeliers", "Chandelier",
    699, 4.8, 87,
    "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=500&h=500&fit=crop",
    "Mid-century sputnik chandelier with 6 arms in brushed brass. Statement piece for dining rooms and entryways.",
    ["6-light sputnik design", "Brushed brass finish", "Adjustable arm angles", "E12 candelabra sockets", "Dimmable", "UL listed"],
    { "Lights": "6", "Diameter": "26\"", "Height": "14\"", "Socket": "E12 candelabra", "Max Wattage": "60W per socket" },
    { installationRequired: true, finish: "Brushed Brass", color: "Gold", dimensions: { width: "26\"", height: "14\"", depth: "26\"" }, weight: "12 lbs", voltage: "120V", compliance: ["UL"] }
  ),
  p("chs-lgt-rec-4in-wh", "CHS-LGT-REC-4-WH", "CHESS Ultra-Slim Recessed LED 4\" (6-Pack)", "lighting", "recessed-track", "Recessed Light",
    189, 4.6, 412,
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&h=500&fit=crop&q=90",
    "Ultra-slim recessed LED downlights. IC-rated, dimmable, and available in 3 color temperatures. Pack of 6.",
    ["Ultra-slim 0.5\" profile", "IC-rated for insulated ceilings", "3 selectable color temps (3000K/4000K/5000K)", "Dimmable 10-100%", "50,000 hour lifespan", "6-pack"],
    { "Size": "4\"", "Wattage": "9W (65W equivalent)", "Lumens": "750", "Color Temp": "3000K/4000K/5000K selectable", "Pack": "6" },
    { installationRequired: true, finish: "White", color: "White", dimensions: { width: "4\"", height: "0.5\"", depth: "4\"" }, weight: "4 lbs (pack)", voltage: "120V", compliance: ["UL", "Energy Star"] }
  ),
  p("chs-lgt-sconce-br", "CHS-LGT-SCN-BR", "CHESS Arc Wall Sconce — Brushed Brass", "lighting", "wall-sconces", "Wall Sconce",
    179, 4.5, 96,
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
    "Elegant arc wall sconce in brushed brass with frosted glass shade. ADA compliant.",
    ["Brushed brass finish", "Frosted glass shade", "ADA compliant — 4\" projection", "E26 socket", "Dimmable", "Up/down light distribution"],
    { "Width": "6\"", "Height": "12\"", "Projection": "4\"", "Socket": "E26" },
    { installationRequired: true, finish: "Brushed Brass", color: "Gold", dimensions: { width: "6\"", height: "12\"", depth: "4\"" }, weight: "3.5 lbs", voltage: "120V", compliance: ["UL", "ADA"] }
  ),
  p("chs-lgt-floor-arc-bk", "CHS-LGT-FLR-ARC-BK", "CHESS Arc Floor Lamp — Matte Black", "lighting", "floor-table-lamps", "Floor Lamp",
    399, 4.6, 78,
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop&q=80",
    "Dramatic arc floor lamp with weighted marble base and adjustable arm. Perfect reading light for living rooms.",
    ["Weighted marble base", "Adjustable arc arm", "Linen drum shade", "Foot switch", "E26 socket — LED compatible", "73\" max height"],
    { "Height": "73\"", "Arc Reach": "42\"", "Base": "Marble, 12\" diameter", "Shade": "Linen drum 16\"" },
    { finish: "Matte Black / Marble", color: "Black", dimensions: { width: "42\"", height: "73\"", depth: "16\"" }, weight: "28 lbs", voltage: "120V", compliance: ["UL"] }
  ),
  p("chs-lgt-outdoor-wall", "CHS-LGT-OUT-WL-BK", "CHESS Coastal Outdoor Wall Lantern — Black", "lighting", "outdoor-lighting", "Outdoor Wall Light",
    149, 4.5, 203,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop",
    "Weather-resistant outdoor wall lantern with clear seeded glass and dusk-to-dawn sensor option.",
    ["Die-cast aluminum construction", "Clear seeded glass panels", "Dusk-to-dawn photocell option", "IP65 rated", "E26 socket", "Powder-coated black finish"],
    { "Width": "7\"", "Height": "14\"", "Projection": "8\"", "IP Rating": "IP65" },
    { installationRequired: true, finish: "Black", color: "Black", dimensions: { width: "7\"", height: "14\"", depth: "8\"" }, weight: "4 lbs", voltage: "120V", compliance: ["UL", "CSA"] }
  ),
  p("chs-lgt-fan-52-wl", "CHS-LGT-FAN-52-WL", "CHESS Breeze Ceiling Fan 52\" — Walnut Blades", "lighting", "ceiling-fans", "Ceiling Fan",
    449, 4.7, 145,
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=500&fit=crop",
    "Quiet DC motor ceiling fan with solid walnut blades, integrated LED light, and remote control.",
    ["DC motor — ultra quiet", "Solid walnut blades", "Integrated LED light kit", "6-speed remote control", "Reversible for winter/summer", "Energy Star certified"],
    { "Blade Span": "52\"", "Motor": "DC", "Speeds": "6", "Light": "Integrated LED 20W", "Airflow": "5,800 CFM" },
    { installationRequired: true, finish: "Walnut / Matte White", color: "Walnut", dimensions: { width: "52\"", height: "14\"", depth: "52\"" }, weight: "18 lbs", voltage: "120V", compliance: ["UL", "Energy Star"] }
  ),
  p("chs-lgt-tbl-ceramic", "CHS-LGT-TBL-CRM", "CHESS Ceramic Table Lamp — Ivory", "lighting", "floor-table-lamps", "Table Lamp",
    219, 4.4, 167,
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
    "Handcrafted ceramic table lamp with linen shade. Each piece has subtle glaze variations.",
    ["Handcrafted ceramic base", "Natural linen shade", "3-way switch", "E26 socket", "Each piece unique", "Felt base protector"],
    { "Height": "24\"", "Shade Diameter": "14\"", "Base Diameter": "6\"", "Socket": "E26 3-way" },
    { finish: "Ivory Ceramic / Linen", color: "Ivory", dimensions: { width: "14\"", height: "24\"", depth: "14\"" }, weight: "8 lbs", voltage: "120V", compliance: ["UL"] }
  ),

  // ─── PLUMBING (8 products, 1 discount) ───────────────────────
  p("chs-fct-kn-br", "CHS-PLB-FCT-KN-BR", "CHESS Artisan Kitchen Faucet — Brushed Bronze", "plumbing", "kitchen-faucets", "Kitchen Faucet",
    489, 4.6, 89,
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop",
    "Pull-down kitchen faucet with dual-function spray head, ceramic disc valve, and brushed bronze finish.",
    ["Pull-down spray head — stream & spray", "Ceramic disc valve — drip-free", "Single-handle operation", "360° swivel spout", "Deck plate included", "Supply lines included"],
    { "Spout Height": "16.5\"", "Spout Reach": "9\"", "Flow Rate": "1.8 GPM", "Valve": "Ceramic disc", "Connections": "3/8\" compression" },
    { warranty: "Lifetime limited", installationRequired: true, finish: "Brushed Bronze", color: "Bronze", dimensions: { width: "9\"", height: "16.5\"", depth: "9\"" }, weight: "7 lbs", compliance: ["CSA", "NSF", "WaterSense"] }
  ),
  p("chs-fct-bath-wf-ch", "CHS-PLB-FCT-BW-CH", "CHESS Waterfall Bathroom Faucet — Chrome", "plumbing", "bathroom-faucets", "Bathroom Faucet",
    329, 4.5, 156,
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop",
    "Single-hole waterfall bathroom faucet with open-channel spout and pop-up drain assembly.",
    ["Waterfall open-channel spout", "Single-hole mount", "Ceramic disc valve", "Pop-up drain included", "1.2 GPM WaterSense", "Chrome finish"],
    { "Spout Height": "7\"", "Flow Rate": "1.2 GPM", "Mount": "Single-hole", "Drain": "Pop-up included" },
    { warranty: "Lifetime limited", installationRequired: true, finish: "Chrome", color: "Chrome", dimensions: { width: "6\"", height: "7\"", depth: "5\"" }, weight: "4 lbs", compliance: ["CSA", "WaterSense"] }
  ),
  p("chs-shower-rain-bk", "CHS-PLB-SHW-RN-BK", "CHESS Rainfall Shower System — Matte Black", "plumbing", "shower-systems", "Shower System",
    899, 4.8, 112,
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop",
    "Thermostatic rainfall shower system with 12\" head, handheld wand, and body jets. Matte black finish.",
    ["12\" rainfall shower head", "Handheld wand with 72\" hose", "Thermostatic valve — anti-scald", "3 body jets", "Diverter for 3 outlets", "Matte black finish"],
    { "Head Size": "12\"", "Valve": "Thermostatic", "Outlets": "3 (head, hand, jets)", "Flow": "2.0 GPM combined" },
    { originalPrice: 1099, warranty: "Lifetime limited", installationRequired: true, finish: "Matte Black", color: "Black", dimensions: { width: "12\"", height: "Adjustable", depth: "12\"" }, weight: "18 lbs", compliance: ["CSA", "ASME"] }
  ),
  p("chs-toilet-dual-wh", "CHS-PLB-TLT-DL-WH", "CHESS Dual-Flush Elongated Toilet — White", "plumbing", "toilets", "Toilet",
    549, 4.6, 234,
    "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=500&h=500&fit=crop",
    "Water-efficient dual-flush toilet with elongated bowl, soft-close seat, and skirted trapway for easy cleaning.",
    ["Dual flush — 0.8/1.28 GPF", "Elongated comfort-height bowl", "Soft-close seat included", "Skirted trapway — easy clean", "EverClean surface", "WaterSense certified"],
    { "Flush": "Dual 0.8/1.28 GPF", "Bowl": "Elongated", "Height": "Comfort (16.5\")", "Rough-In": "12\"" },
    { warranty: "10 years", installationRequired: true, finish: "White", color: "White", dimensions: { width: "15\"", height: "30\"", depth: "28\"" }, weight: "95 lbs", compliance: ["CSA", "WaterSense"] }
  ),
  p("chs-sink-farm-33-wh", "CHS-PLB-SNK-FM-33", "CHESS Farmhouse Apron Sink 33\" — Fireclay White", "plumbing", "sinks", "Kitchen Sink",
    899, 4.7, 178,
    "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500&h=500&fit=crop&q=80",
    "Single-bowl farmhouse sink in genuine fireclay. Chip-resistant, stain-resistant, and heat-resistant up to 572°F.",
    ["Genuine fireclay construction", "Single bowl — 9\" deep", "Chip & stain resistant", "Heat resistant to 572°F", "Reversible — smooth or fluted", "Drain not included"],
    { "Material": "Fireclay", "Bowl Depth": "9\"", "Width": "33\"", "Front-to-Back": "20\"" },
    { warranty: "Lifetime limited", installationRequired: true, finish: "White Fireclay", color: "White", dimensions: { width: "33\"", height: "9\"", depth: "20\"" }, weight: "85 lbs", compliance: ["CSA"] }
  ),
  p("chs-tub-free-67-wh", "CHS-PLB-TUB-FR-67", "CHESS Freestanding Soaking Tub 67\" — Acrylic White", "plumbing", "bathtubs", "Freestanding Bathtub",
    1899, 4.8, 67,
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=500&h=500&fit=crop",
    "Modern freestanding soaking tub in reinforced acrylic with integrated overflow and adjustable leveling feet.",
    ["Reinforced acrylic construction", "Double-walled insulation", "Integrated overflow", "Adjustable leveling feet", "Center drain", "Holds 58 gallons"],
    { "Length": "67\"", "Width": "31\"", "Height": "23\"", "Capacity": "58 gallons", "Material": "Reinforced acrylic" },
    { warranty: "Lifetime limited", installationRequired: true, finish: "Glossy White", color: "White", dimensions: { width: "31\"", height: "23\"", depth: "67\"" }, weight: "110 lbs", compliance: ["CSA"] }
  ),
  p("chs-fct-kn-pull-ss", "CHS-PLB-FCT-KN-SS", "CHESS Pro Pull-Down Kitchen Faucet — Stainless", "plumbing", "kitchen-faucets", "Kitchen Faucet",
    399, 4.5, 267,
    "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=500&h=500&fit=crop&q=80",
    "Commercial-style pull-down kitchen faucet with spring coil neck and magnetic docking spray head.",
    ["Spring coil neck design", "Magnetic docking spray head", "Dual-function spray", "Ceramic disc valve", "Single-handle", "Spot-resistant stainless"],
    { "Spout Height": "21\"", "Spout Reach": "10\"", "Flow Rate": "1.8 GPM", "Style": "Commercial spring" },
    { warranty: "Lifetime limited", installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "10\"", height: "21\"", depth: "10\"" }, weight: "8 lbs", compliance: ["CSA", "NSF", "WaterSense"] }
  ),
  p("chs-vanity-48-wl", "CHS-PLB-VAN-48-WL", "CHESS Floating Vanity 48\" — Walnut with Quartz Top", "plumbing", "sinks", "Bathroom Vanity",
    1699, 4.7, 93,
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop&q=80",
    "Wall-mounted floating vanity in walnut veneer with white quartz countertop and integrated rectangular sink.",
    ["Walnut veneer cabinet", "White quartz countertop", "Integrated rectangular sink", "Soft-close drawers (2)", "Wall-mount floating design", "Faucet not included"],
    { "Width": "48\"", "Depth": "22\"", "Height": "20\"", "Top": "White quartz", "Sink": "Integrated rectangular" },
    { warranty: "5 years", installationRequired: true, finish: "Walnut / White Quartz", color: "Walnut", dimensions: { width: "48\"", height: "20\"", depth: "22\"" }, weight: "120 lbs", compliance: ["CSA"] }
  ),

  // ─── HVAC (8 products, 1 discount) ───────────────────────────
  p("chs-hp-ms-24k", "CHS-HVAC-HP-MS-24K", "CHESS Inverter Mini-Split Heat Pump 24,000 BTU", "hvac", "mini-split", "Mini-Split Heat Pump",
    1899, 4.5, 67,
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop",
    "Ductless inverter mini-split with heating and cooling. WiFi-enabled with 22 SEER2 rating.",
    ["24,000 BTU heating & cooling", "22 SEER2 efficiency", "Inverter compressor", "WiFi control via app", "Whisper-quiet 19 dB indoor", "Covers up to 1,500 sq. ft."],
    { "BTU": "24,000", "SEER2": "22", "Coverage": "Up to 1,500 sq. ft.", "Noise (Indoor)": "19 dB", "Refrigerant": "R-410A" },
    { badge: "Energy Efficient", warranty: "7 years compressor, 5 years parts", commercial: true, bulkEligible: true, installationRequired: true, finish: "White", color: "White", dimensions: { width: "33.5\"", height: "11.5\"", depth: "8.5\"" }, weight: "26 lbs (indoor)", voltage: "240V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-hp-ms-12k", "CHS-HVAC-HP-MS-12K", "CHESS Inverter Mini-Split 12,000 BTU", "hvac", "mini-split", "Mini-Split Heat Pump",
    1299, 4.6, 134,
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop",
    "Compact ductless mini-split for single rooms. 20 SEER2 rating with heating down to -22°F.",
    ["12,000 BTU capacity", "20 SEER2 efficiency", "Heating down to -22°F", "WiFi enabled", "Sleep mode", "Auto-restart after power outage"],
    { "BTU": "12,000", "SEER2": "20", "Coverage": "Up to 750 sq. ft.", "Low Temp Heating": "-22°F" },
    { warranty: "7 years compressor, 5 years parts", installationRequired: true, finish: "White", color: "White", dimensions: { width: "32\"", height: "11\"", depth: "8\"" }, weight: "20 lbs (indoor)", voltage: "240V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-furnace-96-80k", "CHS-HVAC-FUR-96-80K", "CHESS High-Efficiency Gas Furnace 80,000 BTU", "hvac", "furnaces", "Gas Furnace",
    2899, 4.7, 89,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&q=80",
    "96% AFUE two-stage gas furnace with variable-speed blower. Suitable for homes up to 2,500 sq. ft.",
    ["96% AFUE efficiency", "Two-stage gas valve", "Variable-speed ECM blower", "Stainless steel heat exchanger", "Compatible with smart thermostats", "Low NOx emissions"],
    { "BTU Input": "80,000", "AFUE": "96%", "Stages": "2", "Blower": "Variable-speed ECM", "Coverage": "Up to 2,500 sq. ft." },
    { originalPrice: 3399, warranty: "Lifetime heat exchanger, 10 years parts", installationRequired: true, finish: "Grey", color: "Grey", dimensions: { width: "21\"", height: "33\"", depth: "28\"" }, weight: "130 lbs", voltage: "120V", compliance: ["CSA", "Energy Star"] }
  ),
  p("chs-ac-central-3t", "CHS-HVAC-AC-3T", "CHESS Central Air Conditioner 3-Ton", "hvac", "central-air", "Central Air Conditioner",
    3499, 4.6, 56,
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop&q=80",
    "High-efficiency central air conditioner with 17 SEER2 rating. Quiet operation at 72 dB.",
    ["3-ton (36,000 BTU) capacity", "17 SEER2 efficiency", "Two-stage compressor", "Sound blanket — 72 dB", "R-410A refrigerant", "10-year compressor warranty"],
    { "Capacity": "3-ton (36,000 BTU)", "SEER2": "17", "Noise": "72 dB", "Refrigerant": "R-410A" },
    { warranty: "10 years compressor, 5 years parts", installationRequired: true, finish: "Grey", color: "Grey", dimensions: { width: "35\"", height: "40\"", depth: "35\"" }, weight: "210 lbs", voltage: "240V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-therm-smart-wh", "CHS-HVAC-THR-SM-WH", "CHESS Smart Thermostat — WiFi", "hvac", "thermostats", "Smart Thermostat",
    249, 4.7, 389,
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=500&fit=crop",
    "Learning smart thermostat with touchscreen, geofencing, and energy reports. Works with all major HVAC systems.",
    ["Color touchscreen display", "Learning algorithm", "Geofencing auto-away", "Weekly energy reports", "Works with Alexa, Google, HomeKit", "C-wire adapter included"],
    { "Display": "3.5\" color touch", "Connectivity": "WiFi + Bluetooth", "Compatibility": "Most 24V systems", "Sensors": "Temperature, humidity, proximity" },
    { warranty: "3 years", finish: "White", color: "White", dimensions: { width: "3.3\"", height: "3.3\"", depth: "1.2\"" }, weight: "0.5 lbs", voltage: "24V", compliance: ["UL", "FCC", "Energy Star"] }
  ),
  p("chs-purifier-hepa", "CHS-HVAC-PUR-HEPA", "CHESS HEPA Air Purifier — Large Room", "hvac", "air-quality", "Air Purifier",
    599, 4.6, 213,
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop&q=80",
    "True HEPA air purifier for rooms up to 1,000 sq. ft. Captures 99.97% of particles down to 0.3 microns.",
    ["True HEPA H13 filter", "Covers up to 1,000 sq. ft.", "3-stage filtration", "Auto mode with air quality sensor", "Sleep mode — 24 dB", "Filter replacement indicator"],
    { "Coverage": "Up to 1,000 sq. ft.", "Filter": "True HEPA H13", "CADR": "350 CFM", "Noise": "24-52 dB", "Stages": "3 (pre-filter, HEPA, carbon)" },
    { warranty: "2 years", finish: "White", color: "White", dimensions: { width: "13\"", height: "24\"", depth: "13\"" }, weight: "18 lbs", voltage: "120V", compliance: ["UL", "AHAM Verified"] }
  ),
  p("chs-hp-ducted-36k", "CHS-HVAC-HP-DT-36K", "CHESS Ducted Heat Pump 36,000 BTU", "hvac", "heat-pumps", "Ducted Heat Pump",
    4299, 4.5, 34,
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop&q=85",
    "Ducted central heat pump system for whole-home heating and cooling. 18 SEER2 with cold-climate operation.",
    ["36,000 BTU capacity", "18 SEER2 / 10 HSPF2", "Cold climate rated to -13°F", "Variable-speed compressor", "Compatible with existing ductwork", "Quiet outdoor unit — 56 dB"],
    { "BTU": "36,000", "SEER2": "18", "HSPF2": "10", "Low Temp": "-13°F", "Noise (Outdoor)": "56 dB" },
    { warranty: "10 years compressor, 5 years parts", commercial: true, installationRequired: true, finish: "Grey", color: "Grey", dimensions: { width: "38\"", height: "42\"", depth: "38\"" }, weight: "240 lbs", voltage: "240V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-humidifier-wh", "CHS-HVAC-HUM-WH", "CHESS Whole-Home Bypass Humidifier", "hvac", "air-quality", "Humidifier",
    349, 4.4, 87,
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=500&fit=crop&q=80",
    "Bypass humidifier for forced-air systems. Covers up to 4,000 sq. ft. with automatic humidity control.",
    ["Covers up to 4,000 sq. ft.", "Bypass design — no fan needed", "Automatic humidistat", "Connects to furnace ductwork", "Low maintenance — 1 pad/year", "Manual or auto control"],
    { "Coverage": "Up to 4,000 sq. ft.", "Output": "17 gallons/day", "Type": "Bypass evaporative", "Pad": "Replace annually" },
    { warranty: "5 years", installationRequired: true, finish: "White", color: "White", dimensions: { width: "16\"", height: "16\"", depth: "10\"" }, weight: "12 lbs", voltage: "24V", compliance: ["UL"] }
  ),

  // ─── ELECTRICAL (8 products, 1 discount) ─────────────────────
  p("chs-elc-pnl-200a", "CHS-ELC-PNL-200A", "CHESS Smart Electrical Panel — 200A", "electrical", "panels-breakers", "Main Electrical Panel",
    2199, 4.5, 43,
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&h=500&fit=crop",
    "Smart electrical panel with per-circuit monitoring, remote control, and EV charger integration readiness.",
    ["200A main breaker", "40 circuit spaces", "Per-circuit energy monitoring", "Remote circuit control via app", "EV charger integration ready", "Built-in surge protection"],
    { "Amperage": "200A", "Circuits": "40 spaces / 80 poles", "Voltage": "120/240V", "Connectivity": "WiFi + Bluetooth" },
    { originalPrice: 2599, badge: "Smart Home", warranty: "10 years", commercial: true, bulkEligible: true, installationRequired: true, finish: "Powder-coated grey", color: "Grey", dimensions: { width: "16\"", height: "30\"", depth: "6\"" }, weight: "42 lbs", voltage: "120/240V", compliance: ["CSA", "UL 67"] }
  ),
  p("chs-elc-switch-decor", "CHS-ELC-SWT-DCR", "CHESS Decorator Switch & Outlet Kit (10-Pack)", "electrical", "switches-outlets", "Switch & Outlet Kit",
    89, 4.6, 567,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&q=85",
    "Decorator-style switches and outlets in screwless wall plates. 10-pack includes 6 outlets and 4 switches.",
    ["Screwless wall plates", "6 outlets + 4 switches", "Tamper-resistant outlets", "15A / 125V rated", "Matching white finish", "UL listed"],
    { "Pack": "10 (6 outlets + 4 switches)", "Rating": "15A / 125V", "Style": "Decorator screwless", "Color": "White" },
    { finish: "White", color: "White", dimensions: { width: "2.75\"", height: "4.5\"", depth: "1.5\"" }, weight: "3 lbs (pack)", voltage: "125V", compliance: ["UL", "CSA"] }
  ),
  p("chs-elc-smart-dimmer", "CHS-ELC-DIM-SM", "CHESS Smart Dimmer Switch — WiFi", "electrical", "smart-home", "Smart Dimmer",
    69, 4.5, 312,
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=500&fit=crop",
    "WiFi smart dimmer switch compatible with Alexa, Google Home, and Apple HomeKit. No hub required.",
    ["WiFi — no hub required", "Works with Alexa, Google, HomeKit", "Touch dimming + app control", "Scheduling & scenes", "Fade-on/off feature", "Neutral wire required"],
    { "Rating": "600W LED / 1000W incandescent", "Connectivity": "WiFi 2.4GHz", "Compatibility": "Alexa, Google, HomeKit" },
    { finish: "White", color: "White", dimensions: { width: "2.75\"", height: "4.5\"", depth: "1.5\"" }, weight: "0.3 lbs", voltage: "120V", compliance: ["UL", "FCC"] }
  ),
  p("chs-elc-wire-14-2", "CHS-ELC-WIR-14-2", "CHESS NMD90 Wire 14/2 — 75m Roll", "electrical", "wiring-cable", "Electrical Wire",
    89, 4.4, 423,
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&h=500&fit=crop&q=85",
    "NMD90 copper building wire for general residential wiring. 14/2 gauge with ground. 75-meter roll.",
    ["14/2 AWG with ground", "NMD90 rated", "Solid copper conductors", "75m (246 ft.) roll", "For 15A circuits", "CSA approved"],
    { "Gauge": "14/2 AWG + ground", "Type": "NMD90", "Length": "75m", "Conductor": "Solid copper", "Rating": "15A" },
    { finish: "Yellow jacket", color: "Yellow", dimensions: { width: "Roll", height: "Roll", depth: "Roll" }, weight: "18 lbs", voltage: "300V", compliance: ["CSA"] }
  ),
  p("chs-elc-gen-7500", "CHS-ELC-GEN-7500", "CHESS Portable Generator 7,500W", "electrical", "generators", "Portable Generator",
    1299, 4.5, 78,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&q=90",
    "Dual-fuel portable generator with electric start. 7,500W running / 9,500W peak. Transfer switch ready.",
    ["7,500W running / 9,500W peak", "Dual fuel — gas or propane", "Electric start with battery", "Transfer switch ready", "GFCI protected outlets", "8-hour runtime at 50% load"],
    { "Running Watts": "7,500W", "Peak Watts": "9,500W", "Fuel": "Gas / Propane", "Runtime": "8 hrs at 50%", "Start": "Electric" },
    { warranty: "3 years", finish: "Yellow/Black", color: "Yellow", dimensions: { width: "28\"", height: "26\"", depth: "26\"" }, weight: "195 lbs", voltage: "120/240V", compliance: ["CSA", "EPA"] }
  ),
  p("chs-elc-ev-48a", "CHS-ELC-EV-48A", "CHESS Level 2 EV Charger — 48A", "electrical", "ev-charging", "EV Charger",
    699, 4.7, 156,
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=500&fit=crop&q=80",
    "Hardwired Level 2 EV charger with 48A output, WiFi connectivity, and NEMA 3R outdoor rating.",
    ["48A / 11.5 kW output", "25 ft. cable with J1772 plug", "WiFi — app scheduling & monitoring", "NEMA 3R — indoor/outdoor", "Charge any EV brand", "Energy Star certified"],
    { "Amperage": "48A", "Power": "11.5 kW", "Cable": "25 ft.", "Connector": "J1772", "Rating": "NEMA 3R" },
    { warranty: "3 years", installationRequired: true, finish: "White", color: "White", dimensions: { width: "7\"", height: "13\"", depth: "4\"" }, weight: "18 lbs", voltage: "240V", compliance: ["UL", "Energy Star", "FCC"] }
  ),
  p("chs-elc-subpanel-60a", "CHS-ELC-SUB-60A", "CHESS Sub-Panel 60A — 12 Circuits", "electrical", "panels-breakers", "Sub-Panel",
    299, 4.4, 89,
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&h=500&fit=crop&q=90",
    "60-amp sub-panel for garage, workshop, or addition wiring. 12 circuit spaces with main lugs.",
    ["60A main lugs", "12 circuit spaces", "Indoor/outdoor rated (NEMA 3R)", "Copper bus bars", "Knockouts for various conduit sizes", "Ground/neutral bars included"],
    { "Amperage": "60A", "Circuits": "12 spaces / 24 poles", "Voltage": "120/240V", "Enclosure": "NEMA 3R" },
    { warranty: "5 years", installationRequired: true, finish: "Grey", color: "Grey", dimensions: { width: "14\"", height: "20\"", depth: "4\"" }, weight: "18 lbs", voltage: "120/240V", compliance: ["CSA", "UL"] }
  ),
  p("chs-elc-smart-hub", "CHS-ELC-HUB-SM", "CHESS Smart Home Hub — Zigbee/Z-Wave/WiFi", "electrical", "smart-home", "Smart Home Hub",
    199, 4.5, 234,
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=500&fit=crop&q=85",
    "Universal smart home hub supporting Zigbee, Z-Wave, and WiFi devices. Local processing for privacy.",
    ["Zigbee + Z-Wave + WiFi", "Local processing — no cloud required", "Supports 200+ devices", "Automation engine built-in", "Works with Alexa & Google", "Thread/Matter ready"],
    { "Protocols": "Zigbee, Z-Wave, WiFi, Thread", "Devices": "200+", "Processing": "Local", "Voice": "Alexa, Google" },
    { warranty: "2 years", finish: "White", color: "White", dimensions: { width: "4.5\"", height: "1.5\"", depth: "4.5\"" }, weight: "0.5 lbs", voltage: "5V USB-C", compliance: ["FCC", "UL"] }
  ),

  // ─── BUILDING MATERIALS (8 products, 1 discount) ─────────────
  p("chs-flr-eng-oak", "CHS-BLD-FLR-ENG-OAK", "CHESS Engineered Hardwood — White Oak, Wide Plank", "building-materials", "flooring", "Engineered Hardwood",
    8.99, 4.7, 312,
    "https://images.unsplash.com/photo-1615873968403-89e068629265?w=500&h=500&fit=crop",
    "Premium wide-plank engineered hardwood with wire-brushed white oak surface. Compatible with radiant heat.",
    ["7.5\" wide planks", "4mm wear layer — refinishable twice", "Click-lock installation", "Radiant heat compatible", "Low-VOC UV-cured finish", "All grade levels"],
    { "Species": "White Oak", "Width": "7.5\"", "Thickness": "5/8\"", "Wear Layer": "4mm", "Coverage": "23.3 sq. ft./box" },
    { priceUnit: "per sq. ft.", warranty: "25 years residential, 5 years commercial", commercial: true, bulkEligible: true, installationRequired: true, finish: "Wire-Brushed Matte", color: "Natural Oak", dimensions: { width: "7.5\"", height: "5/8\"", depth: "Up to 72\"" }, weight: "52 lbs/box", compliance: ["CARB Phase 2", "FloorScore"] }
  ),
  p("chs-tile-porc-24-wh", "CHS-BLD-TIL-PRC-24", "CHESS Porcelain Floor Tile 24x24\" — Calacatta", "building-materials", "tile", "Porcelain Tile",
    6.49, 4.6, 267,
    "https://images.unsplash.com/photo-1615873968403-89e068629265?w=500&h=500&fit=crop&q=80",
    "Large-format porcelain tile with realistic Calacatta marble look. Suitable for floors and walls.",
    ["24\" x 24\" large format", "Calacatta marble look", "Rectified edges", "PEI 4 — commercial rated", "Frost resistant", "Low water absorption < 0.5%"],
    { "Size": "24\" x 24\"", "Material": "Porcelain", "PEI Rating": "4", "Thickness": "3/8\"", "Coverage": "15.5 sq. ft./box" },
    { priceUnit: "per sq. ft.", commercial: true, bulkEligible: true, installationRequired: true, finish: "Polished", color: "White/Grey veined", dimensions: { width: "24\"", height: "3/8\"", depth: "24\"" }, weight: "45 lbs/box", compliance: ["ANSI A137.1"] }
  ),
  p("chs-counter-quartz-wh", "CHS-BLD-CTR-QTZ-WH", "CHESS Quartz Countertop — Calacatta White", "building-materials", "countertops", "Quartz Countertop",
    75, 4.8, 189,
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&q=80",
    "Engineered quartz countertop with Calacatta marble veining. Non-porous, stain-resistant, and heat-resistant.",
    ["93% natural quartz", "Non-porous — no sealing required", "Stain & scratch resistant", "Heat resistant to 400°F", "NSF certified for food prep", "Custom cut to order"],
    { "Material": "93% quartz + 7% resin", "Thickness": "3cm (1.18\")", "Edge Profiles": "8 options", "Lead Time": "2-3 weeks" },
    { originalPrice: 89, priceUnit: "per sq. ft.", warranty: "15 years", commercial: true, bulkEligible: true, installationRequired: true, finish: "Polished", color: "Calacatta White", dimensions: { width: "Custom", height: "3cm", depth: "Custom" }, weight: "Varies", compliance: ["NSF", "GREENGUARD"] }
  ),
  p("chs-cabinet-shaker-wh", "CHS-BLD-CAB-SHK-WH", "CHESS Shaker Base Cabinet 36\" — White", "building-materials", "cabinets", "Base Cabinet",
    549, 4.6, 156,
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&q=85",
    "Solid wood shaker-style base cabinet with soft-close hinges and full-extension drawers.",
    ["Solid maple face frame", "Plywood box construction", "Soft-close hinges & drawer slides", "Full-extension drawers", "Adjustable shelf", "Dovetail drawer boxes"],
    { "Width": "36\"", "Height": "34.5\"", "Depth": "24\"", "Material": "Maple + plywood", "Doors": "2", "Drawers": "1" },
    { warranty: "Lifetime hinges, 5 years cabinet", installationRequired: true, finish: "Painted White", color: "White", dimensions: { width: "36\"", height: "34.5\"", depth: "24\"" }, weight: "65 lbs", compliance: ["KCMA", "CARB Phase 2"] }
  ),
  p("chs-door-entry-fglass", "CHS-BLD-DR-ENT-FG", "CHESS Fiberglass Entry Door — Craftsman Style", "building-materials", "doors-windows", "Entry Door",
    1899, 4.7, 67,
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=500&fit=crop&q=80",
    "Insulated fiberglass entry door with Craftsman-style panels and decorative glass sidelites.",
    ["Fiberglass — won't warp, rot, or rust", "Polyurethane foam core — R-15", "Decorative glass sidelites", "Multi-point locking system", "Pre-hung in frame", "Paintable or stainable"],
    { "Material": "Fiberglass", "R-Value": "R-15", "Width": "36\" (door) + sidelites", "Lock": "Multi-point" },
    { warranty: "Lifetime limited", installationRequired: true, finish: "Primed", color: "White (primed)", dimensions: { width: "60\" with sidelites", height: "80\"", depth: "6.5\" jamb" }, weight: "120 lbs", compliance: ["Energy Star", "CSA"] }
  ),
  p("chs-window-casement", "CHS-BLD-WIN-CAS", "CHESS Casement Window — Triple-Pane", "building-materials", "doors-windows", "Casement Window",
    699, 4.6, 134,
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=500&fit=crop&q=85",
    "Triple-pane casement window with argon fill and Low-E coating. Energy Star Most Efficient rated.",
    ["Triple-pane glass", "Argon gas fill", "Low-E coating", "Vinyl frame — maintenance free", "Multi-point lock", "Energy Star Most Efficient"],
    { "Glass": "Triple-pane, argon, Low-E", "Frame": "Vinyl", "U-Factor": "0.18", "SHGC": "0.25" },
    { warranty: "20 years glass, lifetime frame", installationRequired: true, finish: "White vinyl", color: "White", dimensions: { width: "Custom", height: "Custom", depth: "5.5\" frame" }, weight: "Varies", compliance: ["Energy Star", "CSA"] }
  ),
  p("chs-insul-spray-closed", "CHS-BLD-INS-SPR-CL", "CHESS Closed-Cell Spray Foam Insulation Kit", "building-materials", "insulation", "Spray Foam Kit",
    799, 4.5, 89,
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=500&fit=crop&q=90",
    "DIY closed-cell spray foam insulation kit. Covers approximately 200 board feet at 1\" thickness.",
    ["Closed-cell formula — R-7 per inch", "Covers ~200 board feet at 1\"", "Air & moisture barrier", "Structural reinforcement", "Low GWP formula", "Includes gun, hose, nozzles"],
    { "Type": "Closed-cell", "R-Value": "R-7 per inch", "Coverage": "~200 board feet at 1\"", "Kit Includes": "Tanks, gun, hose, nozzles" },
    { warranty: "Lifetime when properly installed", finish: "Yellow foam", color: "Yellow", dimensions: { width: "Kit", height: "Kit", depth: "Kit" }, weight: "85 lbs (kit)", compliance: ["UL", "ICC-ES"] }
  ),
  p("chs-flr-lvp-grey", "CHS-BLD-FLR-LVP-GR", "CHESS Luxury Vinyl Plank — Weathered Grey Oak", "building-materials", "flooring", "Luxury Vinyl Plank",
    4.99, 4.5, 456,
    "https://images.unsplash.com/photo-1615873968403-89e068629265?w=500&h=500&fit=crop&q=85",
    "Waterproof luxury vinyl plank with rigid SPC core and attached pad. Ideal for kitchens, bathrooms, and basements.",
    ["100% waterproof SPC core", "Attached cork underlayment", "Click-lock installation", "Realistic wood-grain texture", "Commercial-rated wear layer", "Lifetime residential warranty"],
    { "Width": "7\"", "Length": "48\"", "Thickness": "6mm + 1mm pad", "Wear Layer": "20 mil", "Coverage": "23.6 sq. ft./box" },
    { priceUnit: "per sq. ft.", warranty: "Lifetime residential, 10 years commercial", commercial: true, bulkEligible: true, installationRequired: true, finish: "Embossed wood grain", color: "Grey", dimensions: { width: "7\"", height: "6mm", depth: "48\"" }, weight: "38 lbs/box", compliance: ["FloorScore", "CARB Phase 2"] }
  ),

  // ─── OUTDOOR (8 products, 1 discount) ────────────────────────
  p("chs-out-grill-6b", "CHS-OUT-GRL-6B", "CHESS Professional Built-In Grill — 6 Burner", "outdoor", "grills-cooking", "Built-In Gas Grill",
    3499, 4.8, 78,
    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&h=500&fit=crop",
    "Commercial-grade built-in grill with 6 stainless steel burners, rotisserie, and infrared sear zone.",
    ["6 burners — 96,000 BTU total", "Infrared rear rotisserie", "Infrared sear zone 16,000 BTU", "304 stainless steel throughout", "Halogen interior lighting", "Lifetime burner warranty"],
    { "Total BTU": "112,000", "Cooking Area": "1,056 sq. in.", "Burners": "6 main + sear + rotisserie", "Width": "42\"" },
    { originalPrice: 3999, warranty: "Lifetime burners, 5 years parts", commercial: true, bulkEligible: true, installationRequired: true, finish: "304 Stainless Steel", color: "Silver", dimensions: { width: "42\"", height: "23\"", depth: "26\"" }, weight: "185 lbs", compliance: ["CSA", "NSF"] }
  ),
  p("chs-out-dining-7pc", "CHS-OUT-DIN-7PC", "CHESS Teak Outdoor Dining Set — 7 Piece", "outdoor", "patio-furniture", "Outdoor Dining Set",
    3299, 4.7, 56,
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=500&fit=crop&q=80",
    "Grade-A teak 7-piece outdoor dining set. Extendable table with 6 stacking armchairs.",
    ["Grade-A plantation teak", "Extendable table 72-96\"", "6 stacking armchairs", "Mortise & tenon joinery", "Weathers to silver-grey patina", "Stainless steel hardware"],
    { "Material": "Grade-A teak", "Table": "72-96\" extendable", "Chairs": "6 stacking armchairs", "Set": "7 pieces" },
    { warranty: "5 years", finish: "Natural Teak", color: "Teak", dimensions: { width: "40\"", height: "30\"", depth: "72-96\"" }, weight: "185 lbs (set)", compliance: ["BIFMA"] }
  ),
  p("chs-out-firepit-42", "CHS-OUT-FP-42", "CHESS Gas Fire Pit Table 42\" — Concrete Grey", "outdoor", "fire-features", "Fire Pit Table",
    1299, 4.6, 134,
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=500&fit=crop&q=85",
    "Propane fire pit table with concrete-look GFRC top and hidden tank storage. 55,000 BTU output.",
    ["55,000 BTU output", "GFRC (glass fiber reinforced concrete)", "Hidden propane tank compartment", "Includes lava rocks & cover", "Electronic ignition", "CSA certified"],
    { "BTU": "55,000", "Diameter": "42\"", "Height": "24\"", "Fuel": "Propane (20 lb tank)", "Material": "GFRC" },
    { warranty: "3 years", finish: "Concrete Grey", color: "Grey", dimensions: { width: "42\"", height: "24\"", depth: "42\"" }, weight: "130 lbs", compliance: ["CSA"] }
  ),
  p("chs-out-sofa-sect-wkr", "CHS-OUT-SOF-SEC-WK", "CHESS All-Weather Wicker Sectional — 5 Piece", "outdoor", "patio-furniture", "Outdoor Sectional",
    2499, 4.7, 89,
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=500&fit=crop&q=90",
    "Modular outdoor sectional in all-weather PE wicker with Sunbrella cushions. Rust-proof aluminum frame.",
    ["All-weather PE wicker", "Sunbrella fabric cushions", "Rust-proof aluminum frame", "5-piece modular design", "Quick-dry foam cushions", "UV resistant"],
    { "Material": "PE wicker + aluminum", "Cushions": "Sunbrella fabric", "Pieces": "5 modular", "Seating": "6-7 people" },
    { warranty: "3 years frame, 5 years Sunbrella", finish: "Dark Brown Wicker", color: "Brown", dimensions: { width: "110\"", height: "32\"", depth: "86\"" }, weight: "165 lbs (set)", compliance: ["BIFMA"] }
  ),
  p("chs-out-light-path-sol", "CHS-OUT-LGT-PTH-SOL", "CHESS Solar Path Lights — Stainless (8-Pack)", "outdoor", "outdoor-lighting-ext", "Solar Path Light",
    129, 4.4, 345,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&q=95",
    "Stainless steel solar path lights with warm white LEDs. Auto on/off with dusk-to-dawn sensor.",
    ["Solar powered — no wiring", "Warm white LEDs (3000K)", "Stainless steel construction", "Auto dusk-to-dawn", "8-hour runtime", "8-pack"],
    { "Pack": "8", "Light": "Warm white 3000K", "Runtime": "8 hours", "Material": "Stainless steel", "Solar Panel": "Monocrystalline" },
    { warranty: "2 years", finish: "Stainless Steel", color: "Silver", dimensions: { width: "5\"", height: "16\"", depth: "5\"" }, weight: "6 lbs (pack)" }
  ),
  p("chs-out-deck-comp-grey", "CHS-OUT-DCK-CMP-GR", "CHESS Composite Decking Board — Coastal Grey", "outdoor", "decking", "Composite Decking",
    5.99, 4.6, 234,
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=500&fit=crop&q=95",
    "Capped composite decking with realistic wood grain. Fade, stain, and scratch resistant. 25-year warranty.",
    ["Capped polymer shell", "Realistic wood grain texture", "Fade & stain resistant", "Scratch resistant — Category 2", "Hidden fastener compatible", "25-year structural warranty"],
    { "Width": "5.5\"", "Length": "16 ft.", "Thickness": "1\"", "Material": "Capped composite", "Weight": "2.2 lbs/ft." },
    { priceUnit: "per linear ft.", warranty: "25 years structural, 25 years fade/stain", bulkEligible: true, finish: "Coastal Grey", color: "Grey", dimensions: { width: "5.5\"", height: "1\"", depth: "16 ft." }, weight: "35 lbs/board", compliance: ["ICC-ES", "ASTM"] }
  ),
  p("chs-out-fence-priv-6", "CHS-OUT-FNC-PRV-6", "CHESS Vinyl Privacy Fence Panel 6x8 ft.", "outdoor", "fencing-privacy", "Privacy Fence Panel",
    189, 4.5, 167,
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=500&fit=crop&q=92",
    "Maintenance-free vinyl privacy fence panel. UV-stabilized, won't rot, warp, or need painting.",
    ["6 ft. high x 8 ft. wide", "Vinyl — maintenance free", "UV stabilized", "Won't rot, warp, or crack", "Tongue & groove pickets", "Posts sold separately"],
    { "Height": "6 ft.", "Width": "8 ft.", "Material": "Vinyl", "Style": "Tongue & groove privacy" },
    { warranty: "Lifetime limited", finish: "White", color: "White", dimensions: { width: "8 ft.", height: "6 ft.", depth: "1.5\"" }, weight: "45 lbs", compliance: ["ASTM"] }
  ),
  p("chs-out-pergola-10x12", "CHS-OUT-PRG-10x12", "CHESS Cedar Pergola Kit 10x12 ft.", "outdoor", "patio-furniture", "Pergola Kit",
    2899, 4.7, 45,
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=500&fit=crop&q=88",
    "Western red cedar pergola kit with pre-cut components. Includes all hardware for DIY assembly.",
    ["Western red cedar — naturally rot resistant", "Pre-cut & pre-drilled", "All stainless steel hardware included", "10 ft. x 12 ft. footprint", "8 ft. clearance height", "Optional shade canopy available"],
    { "Size": "10 ft. x 12 ft.", "Height": "8 ft. clearance", "Material": "Western red cedar", "Assembly": "DIY — 2 people, 4-6 hours" },
    { warranty: "10 years", finish: "Natural Cedar", color: "Cedar", dimensions: { width: "12 ft.", height: "9 ft.", depth: "10 ft." }, weight: "350 lbs (kit)", compliance: ["CSA"] }
  ),

  // ─── COMMERCIAL & HOSPITALITY (8 products, 1 discount) ──────
  p("chs-com-desk-exec", "CHS-COM-DSK-EXEC", "CHESS Executive Standing Desk — Walnut", "commercial", "office-solutions", "Standing Desk",
    1299, 4.9, 167,
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=500&fit=crop",
    "Motorized sit-stand desk with solid walnut top and programmable height memory for executive offices.",
    ["Dual-motor height adjustment (25-51\")", "4 programmable presets", "Solid walnut desktop 1.5\" thick", "Integrated cable management", "Anti-collision sensor", "350 lbs lifting capacity"],
    { "Desktop": "72\" x 30\"", "Height Range": "25-51\"", "Lifting Capacity": "350 lbs", "Motors": "Dual" },
    { badge: "Top Rated", warranty: "10 years frame, 5 years electronics", commercial: true, bulkEligible: true, finish: "Natural Walnut", color: "Walnut", dimensions: { width: "72\"", height: "25-51\"", depth: "30\"" }, weight: "115 lbs", compliance: ["BIFMA", "GREENGUARD"] }
  ),
  p("chs-com-hotel-bed-qn", "CHS-COM-HTL-BED-QN", "CHESS Hospitality Bed Frame — Queen, Upholstered", "commercial", "hotel-furnishings", "Hotel Bed Frame",
    899, 4.7, 234,
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&h=500&fit=crop",
    "Commercial-grade upholstered bed frame designed for hospitality environments. Stain-resistant fabric.",
    ["Commercial-grade construction", "Stain-resistant performance fabric", "Reinforced steel frame", "Bolt-on headboard", "Stackable for storage", "Meets fire code NFPA 701"],
    { "Size": "Queen", "Frame": "Reinforced steel", "Fabric": "Performance polyester", "Fire Rating": "NFPA 701" },
    { warranty: "5 years commercial", commercial: true, bulkEligible: true, finish: "Charcoal Fabric", color: "Charcoal", dimensions: { width: "64\"", height: "48\"", depth: "84\"" }, weight: "95 lbs", compliance: ["BIFMA", "NFPA 701"] }
  ),
  p("chs-com-ref-reach-2d", "CHS-COM-REF-2D", "CHESS Commercial Reach-In Refrigerator — 2 Door", "commercial", "restaurant-equipment", "Commercial Refrigerator",
    3299, 4.6, 67,
    "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop&q=80",
    "NSF-certified 2-door reach-in refrigerator for commercial kitchens. 49 cu. ft. capacity with digital controls.",
    ["49 cu. ft. capacity", "2 solid doors — self-closing", "Digital temperature display", "Stainless steel interior & exterior", "Bottom-mount compressor", "Casters included"],
    { "Capacity": "49 cu. ft.", "Doors": "2 solid", "Temp Range": "33-41°F", "Compressor": "Bottom-mount", "Voltage": "115V / 60Hz" },
    { originalPrice: 3799, warranty: "3 years parts, 5 years compressor", commercial: true, bulkEligible: true, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "54\"", height: "82\"", depth: "33\"" }, weight: "340 lbs", voltage: "115V", compliance: ["NSF", "UL", "Energy Star"] }
  ),
  p("chs-com-chair-task", "CHS-COM-CHR-TSK", "CHESS Ergonomic Task Chair — Mesh Back", "commercial", "office-solutions", "Task Chair",
    499, 4.6, 312,
    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=500&fit=crop",
    "Ergonomic mesh-back task chair with adjustable lumbar, armrests, and seat depth. BIFMA certified.",
    ["Breathable mesh backrest", "Adjustable lumbar support", "4D adjustable armrests", "Seat depth adjustment", "Synchro-tilt mechanism", "BIFMA certified — 300 lbs"],
    { "Weight Capacity": "300 lbs", "Seat Height": "16-20\"", "Back Height": "22\"", "Armrests": "4D adjustable", "Tilt": "Synchro-tilt" },
    { warranty: "12 years", commercial: true, bulkEligible: true, finish: "Black Mesh / Black Frame", color: "Black", dimensions: { width: "27\"", height: "40-44\"", depth: "27\"" }, weight: "42 lbs", compliance: ["BIFMA", "GREENGUARD"] }
  ),
  p("chs-com-light-panel-2x4", "CHS-COM-LGT-PNL-2x4", "CHESS LED Flat Panel 2x4 ft. — 50W (4-Pack)", "commercial", "institutional", "LED Panel Light",
    299, 4.5, 189,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&q=80",
    "Commercial LED flat panel for drop ceilings. 50W replaces 150W fluorescent. DLC listed. Pack of 4.",
    ["50W — replaces 150W fluorescent", "5,000 lumens per panel", "4000K neutral white", "DLC listed for rebates", "0-10V dimmable", "50,000 hour lifespan"],
    { "Wattage": "50W", "Lumens": "5,000", "Color Temp": "4000K", "Size": "2 ft. x 4 ft.", "Pack": "4" },
    { warranty: "5 years", commercial: true, bulkEligible: true, installationRequired: true, finish: "White", color: "White", dimensions: { width: "24\"", height: "2\"", depth: "48\"" }, weight: "24 lbs (pack)", voltage: "120-277V", compliance: ["UL", "DLC"] }
  ),
  p("chs-com-exam-table", "CHS-COM-EXM-TBL", "CHESS Medical Exam Table — Power Adjustable", "commercial", "healthcare", "Exam Table",
    2499, 4.7, 45,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&q=85",
    "Power-adjustable medical exam table with memory positions and antimicrobial upholstery.",
    ["Power height adjustment", "4 memory positions", "Antimicrobial upholstery", "500 lb weight capacity", "Paper roll holder", "Foot control pedal"],
    { "Weight Capacity": "500 lbs", "Height Range": "18-37\"", "Width": "27\"", "Length": "72\"", "Upholstery": "Antimicrobial vinyl" },
    { warranty: "5 years", commercial: true, installationRequired: false, finish: "Grey Upholstery", color: "Grey", dimensions: { width: "27\"", height: "18-37\"", depth: "72\"" }, weight: "185 lbs", voltage: "120V", compliance: ["FDA", "UL"] }
  ),
  p("chs-com-desk-student", "CHS-COM-DSK-STU", "CHESS Adjustable Student Desk — Maple", "commercial", "education", "Student Desk",
    349, 4.5, 278,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&q=90",
    "Height-adjustable student desk with maple laminate top and book box. Suitable for K-12 classrooms.",
    ["Height adjustable 22-30\"", "Maple laminate top", "Built-in book box", "Steel frame — powder coated", "Rubber floor glides", "Stackable for storage"],
    { "Top Size": "24\" x 18\"", "Height Range": "22-30\"", "Material": "Maple laminate + steel", "Weight Capacity": "150 lbs" },
    { warranty: "10 years", commercial: true, bulkEligible: true, finish: "Maple / Black Frame", color: "Maple", dimensions: { width: "24\"", height: "22-30\"", depth: "18\"" }, weight: "28 lbs", compliance: ["BIFMA", "GREENGUARD"] }
  ),
  p("chs-com-locker-3tier", "CHS-COM-LCK-3T", "CHESS 3-Tier Steel Locker — 12\" Wide", "commercial", "institutional", "Steel Locker",
    249, 4.4, 156,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&q=92",
    "Heavy-gauge steel locker with 3 tiers. Ventilated doors and padlock-ready hasp.",
    ["Heavy-gauge steel construction", "3 tiers — 12\" wide", "Ventilated doors", "Padlock-ready hasp", "Coat hooks in each tier", "Powder-coated finish"],
    { "Width": "12\"", "Height": "72\"", "Depth": "18\"", "Tiers": "3", "Material": "Heavy-gauge steel" },
    { warranty: "5 years", commercial: true, bulkEligible: true, finish: "Grey Powder Coat", color: "Grey", dimensions: { width: "12\"", height: "72\"", depth: "18\"" }, weight: "65 lbs", compliance: ["ASTM"] }
  ),

  // ─── PARTS & ACCESSORIES (8 products, 1 discount) ───────────
  p("chs-part-filter-ref", "CHS-PRT-FLT-REF", "CHESS Refrigerator Water Filter — 3 Pack", "parts", "appliance-parts", "Water Filter",
    59, 4.6, 567,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop",
    "Replacement water filter for CHESS French door and side-by-side refrigerators. NSF 42 & 53 certified.",
    ["Fits CHESS French door & side-by-side", "NSF 42 & 53 certified", "Reduces chlorine, lead, mercury", "6-month filter life", "Easy twist-in installation", "3-pack"],
    { "Compatibility": "CHESS refrigerators", "Certification": "NSF 42 & 53", "Life": "6 months each", "Pack": "3" },
    { originalPrice: 79, warranty: "Satisfaction guaranteed", finish: "White", color: "White", dimensions: { width: "3\"", height: "8\"", depth: "3\"" }, weight: "2 lbs (pack)", compliance: ["NSF 42", "NSF 53"] }
  ),
  p("chs-part-handle-cab-br", "CHS-PRT-HDL-CAB-BR", "CHESS Cabinet Pull Handle — Brushed Brass (10-Pack)", "parts", "hardware-fasteners", "Cabinet Hardware",
    49, 4.5, 423,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=80",
    "Solid brass cabinet pull handles with 5\" center-to-center spacing. Brushed brass finish. 10-pack.",
    ["Solid brass construction", "5\" center-to-center", "Brushed brass finish", "Includes mounting screws", "Fits standard cabinets", "10-pack"],
    { "Material": "Solid brass", "Center-to-Center": "5\"", "Finish": "Brushed brass", "Pack": "10" },
    { finish: "Brushed Brass", color: "Gold", dimensions: { width: "5.5\"", height: "1.5\"", depth: "1\"" }, weight: "2.5 lbs (pack)" }
  ),
  p("chs-part-filter-hvac", "CHS-PRT-FLT-HVAC", "CHESS MERV 13 Furnace Filter 20x25x1\" (4-Pack)", "parts", "hvac-filters", "Furnace Filter",
    39, 4.5, 678,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=85",
    "MERV 13 pleated furnace filter. Captures allergens, dust, and fine particles. Replace every 90 days.",
    ["MERV 13 rating", "Captures pollen, dust, pet dander", "Electrostatically charged media", "90-day replacement interval", "Standard 20x25x1\" size", "4-pack"],
    { "Size": "20\" x 25\" x 1\"", "MERV Rating": "13", "Life": "90 days", "Pack": "4" },
    { warranty: "Satisfaction guaranteed", finish: "White", color: "White", dimensions: { width: "20\"", height: "25\"", depth: "1\"" }, weight: "4 lbs (pack)" }
  ),
  p("chs-part-bulb-led-a19", "CHS-PRT-BLB-LED-A19", "CHESS LED Bulb A19 9W 3000K (12-Pack)", "parts", "lighting-accessories", "LED Bulb",
    24, 4.6, 892,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=90",
    "Energy-efficient A19 LED bulb. 9W replaces 60W incandescent. Warm white 3000K. 12-pack.",
    ["9W — replaces 60W", "800 lumens", "3000K warm white", "25,000 hour lifespan", "Dimmable", "12-pack"],
    { "Wattage": "9W (60W equivalent)", "Lumens": "800", "Color Temp": "3000K", "Life": "25,000 hours", "Pack": "12" },
    { warranty: "5 years", finish: "Frosted", color: "White", dimensions: { width: "2.4\"", height: "4.4\"", depth: "2.4\"" }, weight: "2 lbs (pack)", voltage: "120V", compliance: ["UL", "Energy Star"] }
  ),
  p("chs-part-connector-pex", "CHS-PRT-CON-PEX", "CHESS PEX Crimp Fitting Kit — 100 Piece", "parts", "plumbing-parts", "PEX Fitting Kit",
    89, 4.4, 234,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=92",
    "Complete PEX crimp fitting assortment. Includes elbows, tees, couplings, and crimp rings for 1/2\" and 3/4\" PEX.",
    ["100-piece assortment", "1/2\" and 3/4\" sizes", "Brass construction", "Includes elbows, tees, couplings", "Crimp rings included", "Organized storage case"],
    { "Pieces": "100", "Sizes": "1/2\" and 3/4\"", "Material": "Brass", "Type": "Crimp" },
    { warranty: "Lifetime", finish: "Brass", color: "Gold", dimensions: { width: "Case", height: "Case", depth: "Case" }, weight: "5 lbs", compliance: ["CSA", "NSF"] }
  ),
  p("chs-part-outlet-gfci", "CHS-PRT-OUT-GFCI", "CHESS GFCI Outlet 15A — White (3-Pack)", "parts", "electrical-parts", "GFCI Outlet",
    39, 4.6, 345,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=95",
    "Tamper-resistant GFCI outlet with LED indicator and self-test function. Includes wall plates. 3-pack.",
    ["15A / 125V rated", "Tamper-resistant", "LED power indicator", "Self-test function", "Wall plates included", "3-pack"],
    { "Rating": "15A / 125V", "Type": "GFCI tamper-resistant", "Pack": "3", "Includes": "Wall plates" },
    { warranty: "5 years", finish: "White", color: "White", dimensions: { width: "2.75\"", height: "4.5\"", depth: "1.5\"" }, weight: "1.5 lbs (pack)", voltage: "125V", compliance: ["UL", "CSA"] }
  ),
  p("chs-part-knob-cab-bk", "CHS-PRT-KNB-CAB-BK", "CHESS Cabinet Knob — Matte Black (25-Pack)", "parts", "hardware-fasteners", "Cabinet Knob",
    39, 4.5, 534,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=88",
    "Solid zinc cabinet knobs in matte black finish. 1.25\" diameter. Includes mounting screws. 25-pack.",
    ["Solid zinc construction", "Matte black finish", "1.25\" diameter", "Mounting screws included", "Fits standard cabinets", "25-pack"],
    { "Material": "Solid zinc", "Diameter": "1.25\"", "Finish": "Matte black", "Pack": "25" },
    { finish: "Matte Black", color: "Black", dimensions: { width: "1.25\"", height: "1\"", depth: "1.25\"" }, weight: "3 lbs (pack)" }
  ),
  p("chs-part-supply-line", "CHS-PRT-SUP-LN", "CHESS Braided Stainless Supply Lines (2-Pack)", "parts", "plumbing-parts", "Supply Line",
    19, 4.5, 456,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=86",
    "Braided stainless steel supply lines for faucets. 3/8\" compression x 1/2\" FIP. 20\" length. 2-pack.",
    ["Braided stainless steel", "3/8\" comp x 1/2\" FIP", "20\" length", "Burst-resistant", "Lead-free brass fittings", "2-pack"],
    { "Length": "20\"", "Connections": "3/8\" comp x 1/2\" FIP", "Material": "Braided stainless", "Pack": "2" },
    { warranty: "Lifetime", finish: "Stainless Steel", color: "Silver", dimensions: { width: "20\"", height: "0.5\"", depth: "0.5\"" }, weight: "0.5 lbs", compliance: ["CSA", "NSF"] }
  ),
  p("chs-ref-bm-30-ss", "CHS-REF-BM-30-SS", "CHESS Bottom Mount Refrigerator 30\"", "appliances", "refrigeration", "Bottom Mount Refrigerator",
    1599, 4.5, 187,
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop&q=80",
    "Space-efficient bottom mount refrigerator with full-width pantry drawer and multi-airflow system.",
    ["Full-width pantry drawer", "Multi-airflow cooling", "LED interior lighting", "Adjustable glass shelves", "Door alarm", "Energy Star"],
    { "Capacity": "18.7 cu. ft.", "Width": "29.5\"", "Height": "67\"", "Depth": "33\"" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Stainless Steel", color: "Silver", dimensions: { width: "29.5\"", height: "67\"", depth: "33\"" }, weight: "210 lbs", voltage: "120V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-ref-col-24-wh", "CHS-REF-COL-24-WH", "CHESS Column Refrigerator 24\" Built-In", "appliances", "refrigeration", "Column Refrigerator",
    4299, 4.9, 89,
    "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop&q=80",
    "Panel-ready column refrigerator for custom kitchen integration. Precision temperature management.",
    ["Panel-ready design", "Precision temp control", "Theatre LED lighting", "Sabbath mode", "Air purification system", "Soft-close drawers"],
    { "Capacity": "13.6 cu. ft.", "Width": "23.75\"", "Height": "84\"", "Depth": "24\"" },
    { warranty: "5 years", commercial: true, bulkEligible: false, installationRequired: false, finish: "Panel Ready", color: "Custom", dimensions: { width: "23.75\"", height: "84\"", depth: "24\"" }, weight: "245 lbs", voltage: "120V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-rng-dual-48-ss", "CHS-RNG-DL-48-SS", "CHESS Pro Dual Fuel Range 48\"", "appliances", "cooking", "Dual Fuel Range",
    7999, 4.9, 67,
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&h=500&fit=crop&q=80",
    "Commercial-grade 48-inch dual fuel range with 6 burners, griddle, and double convection ovens.",
    ["6 sealed brass burners", "Infrared griddle", "Double convection ovens", "Continuous cast-iron grates", "Chromium griddle plate", "Commercial-grade construction"],
    { "Burners": "6 + griddle", "Oven Capacity": "4.4 + 2.4 cu. ft.", "Max BTU": "25,000", "Width": "47.9\"" },
    { warranty: "5 years", commercial: true, bulkEligible: true, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "47.9\"", height: "36\"", depth: "29\"" }, weight: "385 lbs", voltage: "240V", compliance: ["CSA", "UL"] }
  ),
  p("chs-mw-bi-30-ss", "CHS-MW-BI-30-SS", "CHESS Built-In Microwave Drawer 30\"", "appliances", "cooking", "Microwave Drawer",
    1499, 4.5, 134,
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&h=500&fit=crop&q=80",
    "Innovative microwave drawer design for ergonomic access. Sensor cooking with auto programs.",
    ["Drawer-style opening", "Sensor cooking", "10 auto programs", "Child lock", "Easy-clean interior", "Concealed controls"],
    { "Capacity": "1.2 cu. ft.", "Wattage": "950W", "Width": "30\"" },
    { warranty: "2 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "30\"", height: "15\"", depth: "23\"" }, weight: "65 lbs", voltage: "120V", compliance: ["CSA", "UL"] }
  ),
  p("chs-hood-wall-36-ss", "CHS-HD-WL-36-SS", "CHESS Wall Mount Range Hood 36\"", "appliances", "ventilation", "Wall Mount Hood",
    1299, 4.6, 178,
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&h=500&fit=crop&q=80",
    "Powerful wall-mounted range hood with 600 CFM blower, LED lighting, and dishwasher-safe filters.",
    ["600 CFM centrifugal blower", "4-speed electronic controls", "LED task lighting", "Dishwasher-safe baffle filters", "Delay-off timer", "Quiet operation 3.5 sones"],
    { "CFM": "600", "Speeds": "4", "Width": "36\"", "Noise": "3.5 sones" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "36\"", height: "18\"", depth: "20\"" }, weight: "42 lbs", voltage: "120V", compliance: ["CSA", "UL"] }
  ),
  p("chs-hood-island-42", "CHS-HD-IS-42-SS", "CHESS Island Mount Hood 42\" — Glass", "appliances", "ventilation", "Island Hood",
    2199, 4.7, 92,
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&h=500&fit=crop&q=80",
    "Stunning glass and stainless island mount hood with perimeter aspiration technology.",
    ["Perimeter aspiration system", "Tempered glass canopy", "Remote control included", "LED ambient lighting", "4 speeds + boost", "Auto heat sensor"],
    { "CFM": "750", "Width": "42\"", "Noise": "3.0 sones" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "Stainless Steel + Glass", color: "Silver", dimensions: { width: "42\"", height: "24\"", depth: "24\"" }, weight: "55 lbs", voltage: "120V", compliance: ["CSA", "UL"] }
  ),
  p("chs-wash-fl-27-wh", "CHS-WSH-FL-27-WH", "CHESS Front Load Washer 27\" — White", "appliances", "laundry", "Front Load Washer",
    1099, 4.6, 267,
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop&q=80",
    "High-efficiency front load washer with steam clean, allergen cycle, and vibration reduction.",
    ["Steam clean technology", "Allergen cycle", "Vibration reduction system", "12 wash cycles", "Delay start", "Energy Star certified"],
    { "Capacity": "5.2 cu. ft.", "RPM": "1300", "Width": "27\"", "Cycles": "12" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "White", color: "White", dimensions: { width: "27\"", height: "38.7\"", depth: "31.5\"" }, weight: "195 lbs", voltage: "120V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-dry-el-27-wh", "CHS-DRY-EL-27-WH", "CHESS Electric Dryer 27\" — White", "appliances", "laundry", "Electric Dryer",
    999, 4.5, 234,
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop&q=80",
    "Large capacity electric dryer with sensor dry, steam refresh, and wrinkle prevention.",
    ["Sensor dry technology", "Steam refresh cycle", "Wrinkle prevention", "13 dry cycles", "Reversible door", "Interior drum light"],
    { "Capacity": "7.4 cu. ft.", "Width": "27\"", "Cycles": "13" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "White", color: "White", dimensions: { width: "27\"", height: "38.7\"", depth: "30\"" }, weight: "130 lbs", voltage: "240V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-frz-up-21-ss", "CHS-FRZ-UP-21-SS", "CHESS Upright Freezer 21 cu. ft.", "appliances", "refrigeration", "Upright Freezer",
    1199, 4.4, 156,
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop&q=80",
    "Frost-free upright freezer with electronic controls and quick-freeze shelf.",
    ["Frost-free operation", "Electronic temperature control", "Quick-freeze shelf", "Door alarm", "LED interior lighting", "Lock with key"],
    { "Capacity": "21 cu. ft.", "Width": "32\"", "Height": "72\"" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Stainless Steel", color: "Silver", dimensions: { width: "32\"", height: "72\"", depth: "29\"" }, weight: "220 lbs", voltage: "120V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-wine-bi-24", "CHS-WN-BI-24-SS", "CHESS Built-In Wine Cooler 24\" Dual Zone", "appliances", "refrigeration", "Wine Cooler",
    2299, 4.8, 78,
    "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop&q=80",
    "Dual-zone wine cooler with UV-protected glass door and vibration-dampened shelves.",
    ["Dual independent zones", "UV-protected glass", "Vibration dampening", "Beechwood shelves", "Blue LED interior", "Touch controls"],
    { "Capacity": "46 bottles", "Zones": "2", "Temp Range": "41-64°F", "Width": "23.5\"" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "23.5\"", height: "34\"", depth: "24\"" }, weight: "115 lbs", voltage: "120V", compliance: ["CSA", "UL"] }
  ),
  p("chs-sofa-sec-l-gy", "CHS-SOF-SEC-L-GY", "CHESS L-Shaped Sectional Sofa — Charcoal", "furniture", "living-room", "Sectional Sofa",
    3499, 4.7, 156,
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&q=80",
    "Modular L-shaped sectional with high-resilience foam, removable covers, and solid hardwood frame.",
    ["Modular design — reconfigure anytime", "High-resilience foam cushions", "Removable washable covers", "Solid hardwood frame", "Sinuous spring support", "Stain-resistant fabric"],
    { "Seating": "5-6 persons", "Material": "Performance fabric", "Frame": "Kiln-dried hardwood" },
    { warranty: "5 years frame, 2 years fabric", commercial: false, bulkEligible: false, installationRequired: false, finish: "Fabric", color: "Charcoal", dimensions: { width: "112\"", height: "34\"", depth: "87\"" }, weight: "285 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-sofa-3s-cream", "CHS-SOF-3S-CR", "CHESS 3-Seater Sofa — Cream Bouclé", "furniture", "living-room", "3-Seater Sofa",
    2299, 4.8, 203,
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&q=80",
    "Elegant 3-seater sofa in premium bouclé fabric with down-blend cushions and brass legs.",
    ["Premium bouclé upholstery", "Down-blend seat cushions", "Solid brass legs", "Removable cushion covers", "No-sag spring base", "Arm bolster pillows included"],
    { "Seating": "3 persons", "Material": "Bouclé", "Legs": "Solid brass" },
    { warranty: "5 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Bouclé", color: "Cream", dimensions: { width: "86\"", height: "32\"", depth: "38\"" }, weight: "165 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-bed-kg-wal", "CHS-BED-KG-WAL", "CHESS King Platform Bed — Walnut", "furniture", "bedroom", "Platform Bed",
    2199, 4.7, 178,
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop&q=80",
    "Solid walnut platform bed with integrated headboard, USB charging ports, and under-bed storage.",
    ["Solid walnut construction", "Integrated headboard with shelf", "2 USB-C charging ports", "Under-bed storage drawers", "Slat system — no box spring needed", "Felt-lined drawers"],
    { "Size": "King (76x80\")", "Material": "Solid walnut", "Headboard Height": "48\"" },
    { warranty: "10 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Natural Walnut", color: "Walnut", dimensions: { width: "80\"", height: "48\"", depth: "86\"" }, weight: "220 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-bed-qn-oak", "CHS-BED-QN-OAK", "CHESS Queen Upholstered Bed — Oatmeal", "furniture", "bedroom", "Upholstered Bed",
    1699, 4.6, 234,
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop&q=80",
    "Queen upholstered bed with channel-tufted headboard and solid oak frame.",
    ["Channel-tufted headboard", "Performance linen upholstery", "Solid oak frame", "Center support rail", "Easy assembly", "Low-profile design"],
    { "Size": "Queen (60x80\")", "Material": "Oak + linen", "Headboard Height": "52\"" },
    { warranty: "5 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Linen", color: "Oatmeal", dimensions: { width: "64\"", height: "52\"", depth: "85\"" }, weight: "145 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-desk-exec-72", "CHS-DSK-EX-72-WL", "CHESS Executive Desk 72\" — Walnut", "furniture", "office", "Executive Desk",
    2899, 4.8, 89,
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=500&fit=crop&q=80",
    "Commanding 72-inch executive desk with integrated cable management and file drawers.",
    ["Solid walnut top", "Integrated cable management", "2 file drawers + 2 utility drawers", "Soft-close drawer slides", "Leveling feet", "Matching credenza available"],
    { "Width": "72\"", "Depth": "36\"", "Material": "Solid walnut" },
    { warranty: "10 years", commercial: true, bulkEligible: false, installationRequired: false, finish: "Natural Walnut", color: "Walnut", dimensions: { width: "72\"", height: "30\"", depth: "36\"" }, weight: "185 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-desk-stand-60", "CHS-DSK-ST-60-WH", "CHESS Electric Standing Desk 60\" — White", "furniture", "office", "Standing Desk",
    899, 4.7, 312,
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=500&fit=crop&q=80",
    "Dual-motor electric standing desk with memory presets and anti-collision system.",
    ["Dual-motor lift system", "4 memory height presets", "Anti-collision technology", "Cable management tray", "Height range 25.5-51\"", "350 lb capacity"],
    { "Width": "60\"", "Depth": "30\"", "Height Range": "25.5-51\"", "Capacity": "350 lbs" },
    { warranty: "5 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "White Laminate", color: "White", dimensions: { width: "60\"", height: "51\"", depth: "30\"" }, weight: "95 lbs", voltage: "120V", compliance: ["BIFMA", "UL"] }
  ),
  p("chs-tbl-din-ext-84", "CHS-TBL-DIN-84-OAK", "CHESS Extendable Dining Table 84\" — Oak", "furniture", "dining", "Dining Table",
    2499, 4.7, 145,
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop&q=80",
    "Solid white oak extendable dining table. Seats 6-10 with butterfly leaf extension.",
    ["Solid white oak construction", "Butterfly leaf extension", "Seats 6-10", "Self-storing leaf", "Rounded edges", "Protective lacquer finish"],
    { "Extended Length": "84\"", "Collapsed": "60\"", "Width": "40\"", "Seating": "6-10" },
    { warranty: "10 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Natural Oak", color: "Oak", dimensions: { width: "84\"", height: "30\"", depth: "40\"" }, weight: "165 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-chair-din-6pk", "CHS-CHR-DIN-6-GY", "CHESS Dining Chairs Set of 6 — Grey", "furniture", "dining", "Dining Chair Set",
    1299, 4.5, 198,
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop&q=80",
    "Set of 6 upholstered dining chairs with solid beech legs and stain-resistant fabric.",
    ["Set of 6 chairs", "Stain-resistant fabric", "Solid beech wood legs", "Padded seat and back", "Non-marking floor glides", "Stackable design"],
    { "Set": "6 chairs", "Material": "Beech + fabric", "Seat Height": "18\"" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Fabric + Beech", color: "Grey", dimensions: { width: "19\"", height: "34\"", depth: "22\"" }, weight: "72 lbs (set)", compliance: ["BIFMA"] }
  ),
  p("chs-cab-bath-36", "CHS-CAB-BTH-36-WH", "CHESS Bathroom Vanity Cabinet 36\" — White", "furniture", "bathroom-furniture", "Vanity Cabinet",
    1199, 4.6, 167,
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop&q=80",
    "Freestanding bathroom vanity with soft-close drawers, quartz top, and undermount sink.",
    ["Quartz countertop included", "Undermount ceramic sink", "Soft-close drawers", "Dovetail drawer construction", "Pre-drilled for 8\" faucet", "Water-resistant finish"],
    { "Width": "36\"", "Top": "Quartz", "Sink": "Undermount ceramic" },
    { warranty: "5 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "White", color: "White", dimensions: { width: "36\"", height: "34\"", depth: "22\"" }, weight: "125 lbs", compliance: ["KCMA"] }
  ),
  p("chs-shelf-book-72", "CHS-SHF-BK-72-OAK", "CHESS Bookshelf 72\" — Natural Oak", "furniture", "living-room", "Bookshelf",
    899, 4.6, 234,
    "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&h=500&fit=crop&q=80",
    "Tall 5-shelf bookcase in solid oak with adjustable shelves and anti-tip hardware.",
    ["Solid oak construction", "5 adjustable shelves", "Anti-tip wall anchor included", "50 lb per shelf capacity", "Natural grain finish", "Matching pieces available"],
    { "Shelves": "5 adjustable", "Material": "Solid oak", "Capacity": "50 lbs/shelf" },
    { warranty: "5 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Natural Oak", color: "Oak", dimensions: { width: "36\"", height: "72\"", depth: "14\"" }, weight: "85 lbs", compliance: ["BIFMA"] }
  ),
  p("chs-light-pend-drum", "CHS-LT-PD-DRM-BK", "CHESS Drum Pendant Light 24\" — Matte Black", "lighting", "pendant-lights", "Drum Pendant",
    349, 4.6, 189,
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&h=500&fit=crop&q=80",
    "Modern drum pendant with linen shade and matte black hardware. Dimmable with standard dimmer.",
    ["24\" linen drum shade", "Matte black hardware", "Dimmable", "Adjustable drop height", "3x E26 bulbs", "ETL listed"],
    { "Diameter": "24\"", "Drop": "12-48\" adjustable", "Bulbs": "3x E26" },
    { warranty: "2 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Matte Black + Linen", color: "Black", dimensions: { width: "24\"", height: "12\"", depth: "24\"" }, weight: "8 lbs", voltage: "120V", compliance: ["ETL", "CSA"] }
  ),
  p("chs-light-track-6", "CHS-LT-TRK-6-BN", "CHESS 6-Light Track Kit — Brushed Nickel", "lighting", "track-lighting", "Track Lighting",
    279, 4.5, 234,
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&h=500&fit=crop&q=80",
    "Flexible 6-light track kit with adjustable heads and integrated LED modules.",
    ["6 adjustable heads", "Integrated LED — 3000K", "Flexible track — bendable", "50,000 hour lifespan", "Dimmable", "Tool-free installation"],
    { "Heads": "6", "Color Temp": "3000K", "Lumens": "4200 total", "Length": "6 ft" },
    { warranty: "5 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Brushed Nickel", color: "Nickel", dimensions: { width: "72\"", height: "6\"", depth: "4\"" }, weight: "5 lbs", voltage: "120V", compliance: ["ETL", "CSA", "Energy Star"] }
  ),
  p("chs-light-vanity-3", "CHS-LT-VAN-3-CH", "CHESS 3-Light Vanity Bar — Chrome", "lighting", "vanity-lights", "Vanity Light",
    189, 4.6, 312,
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&h=500&fit=crop&q=80",
    "3-light vanity bar with frosted glass shades and polished chrome finish. ADA compliant.",
    ["Frosted glass shades", "Polished chrome finish", "ADA compliant", "Can mount up or down", "Dimmable", "UL damp rated"],
    { "Lights": "3", "Shade": "Frosted glass", "Width": "24\"" },
    { warranty: "2 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Chrome", color: "Chrome", dimensions: { width: "24\"", height: "8\"", depth: "6\"" }, weight: "6 lbs", voltage: "120V", compliance: ["ETL", "CSA", "ADA"] }
  ),
  p("chs-light-fan-52", "CHS-LT-FAN-52-WH", "CHESS Ceiling Fan with Light 52\" — White", "lighting", "ceiling-lights", "Ceiling Fan",
    399, 4.7, 267,
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&h=500&fit=crop&q=80",
    "52-inch ceiling fan with integrated LED light, remote control, and reversible motor.",
    ["Integrated LED light", "Remote control included", "Reversible motor", "3 speeds", "Energy Star certified", "Quiet DC motor"],
    { "Blade Span": "52\"", "Motor": "DC", "Speeds": "3 + reverse", "Lumens": "1800" },
    { warranty: "Lifetime motor", commercial: false, bulkEligible: false, installationRequired: true, finish: "Matte White", color: "White", dimensions: { width: "52\"", height: "14\"", depth: "52\"" }, weight: "22 lbs", voltage: "120V", compliance: ["ETL", "CSA", "Energy Star"] }
  ),
  p("chs-light-step-led", "CHS-LT-STP-LED-SS", "CHESS LED Step Light — Stainless", "lighting", "outdoor-lighting", "Step Light",
    69, 4.5, 345,
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&h=500&fit=crop&q=80",
    "Low-voltage LED step light for decks and stairs. IP65 rated for wet locations.",
    ["IP65 waterproof", "Low voltage 12V", "3000K warm white", "50,000 hour lifespan", "Stainless steel faceplate", "Fits standard junction box"],
    { "Voltage": "12V", "IP Rating": "IP65", "Color Temp": "3000K" },
    { warranty: "5 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Stainless Steel", color: "Silver", dimensions: { width: "4\"", height: "3\"", depth: "2.5\"" }, weight: "0.5 lbs", voltage: "12V", compliance: ["ETL", "CSA"] }
  ),
  p("chs-light-solar-path", "CHS-LT-SOL-PTH-BK", "CHESS Solar Path Lights (6-Pack)", "lighting", "outdoor-lighting", "Solar Path Light",
    129, 4.4, 456,
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&h=500&fit=crop&q=80",
    "Solar-powered LED path lights with auto dusk-to-dawn sensor. No wiring required.",
    ["Solar powered — no wiring", "Auto dusk-to-dawn", "8-hour runtime", "Stainless steel construction", "Ground stake included", "6-pack"],
    { "Pack": "6 lights", "Runtime": "8 hours", "Height": "16\"" },
    { warranty: "2 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Stainless Steel", color: "Silver", dimensions: { width: "5\"", height: "16\"", depth: "5\"" }, weight: "4 lbs (set)", compliance: ["CSA"] }
  ),
  p("chs-faucet-pull-ss", "CHS-FAU-PD-SS", "CHESS Pull-Down Kitchen Faucet — Stainless", "plumbing", "faucets", "Kitchen Faucet",
    349, 4.7, 289,
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop&q=80",
    "Single-handle pull-down kitchen faucet with dual spray modes and spot-resistant finish.",
    ["Pull-down spray head", "Dual spray modes", "Spot-resistant finish", "Ceramic disc valve", "Quick-connect installation", "ADA compliant"],
    { "Flow Rate": "1.8 GPM", "Spout Height": "15.5\"", "Reach": "9\"" },
    { warranty: "Lifetime", commercial: false, bulkEligible: false, installationRequired: false, finish: "Stainless Steel", color: "Silver", dimensions: { width: "10\"", height: "15.5\"", depth: "9\"" }, weight: "6 lbs", compliance: ["CSA", "NSF", "ADA"] }
  ),
  p("chs-faucet-touch-bk", "CHS-FAU-TCH-BK", "CHESS Touchless Kitchen Faucet — Matte Black", "plumbing", "faucets", "Touchless Faucet",
    549, 4.8, 167,
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop&q=80",
    "Motion-activated touchless kitchen faucet with magnetic docking spray head.",
    ["Motion sensor activation", "Magnetic docking spray", "Matte black PVD finish", "Spot-free coating", "Battery or AC powered", "Temperature memory"],
    { "Flow Rate": "1.5 GPM", "Sensor": "Infrared motion", "Power": "Battery/AC" },
    { warranty: "Lifetime", commercial: false, bulkEligible: false, installationRequired: false, finish: "Matte Black", color: "Black", dimensions: { width: "10\"", height: "16\"", depth: "9\"" }, weight: "7 lbs", voltage: "Battery/AC", compliance: ["CSA", "NSF", "ADA"] }
  ),
  p("chs-toilet-dual-wh", "CHS-TOI-DL-WH", "CHESS Dual Flush Toilet — White", "plumbing", "toilets", "Dual Flush Toilet",
    449, 4.6, 345,
    "https://images.unsplash.com/photo-1585058178215-33108215e3c8?w=500&h=500&fit=crop&q=80",
    "Water-efficient dual flush toilet with elongated comfort height bowl and soft-close seat.",
    ["Dual flush — 1.0/1.6 GPF", "Elongated comfort height", "Soft-close seat included", "Skirted trapway — easy clean", "WaterSense certified", "Quick-release seat"],
    { "Flush": "1.0/1.6 GPF", "Bowl": "Elongated", "Height": "Comfort (16.5\")" },
    { warranty: "Lifetime ceramic", commercial: false, bulkEligible: false, installationRequired: true, finish: "Vitreous China", color: "White", dimensions: { width: "15\"", height: "30\"", depth: "28\"" }, weight: "85 lbs", compliance: ["CSA", "WaterSense"] }
  ),
  p("chs-toilet-smart-wh", "CHS-TOI-SM-WH", "CHESS Smart Bidet Toilet — White", "plumbing", "toilets", "Smart Toilet",
    2499, 4.9, 89,
    "https://images.unsplash.com/photo-1585058178215-33108215e3c8?w=500&h=500&fit=crop&q=80",
    "Integrated smart toilet with heated seat, bidet wash, air dryer, and automatic lid.",
    ["Integrated bidet wash", "Heated seat with 3 levels", "Warm air dryer", "Automatic lid open/close", "Night light", "Remote control"],
    { "Flush": "1.28 GPF", "Features": "Bidet, heated seat, dryer", "Power": "120V" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "Vitreous China", color: "White", dimensions: { width: "15\"", height: "21\"", depth: "28\"" }, weight: "95 lbs", voltage: "120V", compliance: ["CSA", "WaterSense", "UL"] }
  ),
  p("chs-tub-free-67", "CHS-TUB-FR-67-WH", "CHESS Freestanding Soaking Tub 67\"", "plumbing", "bathtubs", "Freestanding Tub",
    2199, 4.8, 134,
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop&q=80",
    "Elegant freestanding acrylic soaking tub with center drain and integrated overflow.",
    ["Acrylic construction", "Center drain", "Integrated overflow", "Slip-resistant bottom", "Chrome drain included", "Insulated for heat retention"],
    { "Length": "67\"", "Width": "31\"", "Depth": "23\"", "Capacity": "58 gallons" },
    { warranty: "Lifetime", commercial: false, bulkEligible: false, installationRequired: true, finish: "Glossy White", color: "White", dimensions: { width: "67\"", height: "23\"", depth: "31\"" }, weight: "110 lbs", compliance: ["CSA", "IAPMO"] }
  ),
  p("chs-shower-sys-bk", "CHS-SHW-SYS-BK", "CHESS Thermostatic Shower System — Black", "plumbing", "shower-systems", "Shower System",
    899, 4.7, 178,
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop&q=80",
    "Complete thermostatic shower system with rain head, hand shower, and body jets.",
    ["12\" rain shower head", "Hand shower with slide bar", "4 body jets", "Thermostatic valve", "Anti-scald protection", "Matte black PVD finish"],
    { "Head": "12\" rain", "Valve": "Thermostatic", "Jets": "4 body jets" },
    { warranty: "Lifetime", commercial: false, bulkEligible: false, installationRequired: true, finish: "Matte Black", color: "Black", dimensions: { width: "12\"", height: "48\"", depth: "12\"" }, weight: "18 lbs", compliance: ["CSA", "ASME"] }
  ),
  p("chs-hvac-mini-12k", "CHS-HV-MN-12K", "CHESS Mini Split AC 12,000 BTU", "hvac", "air-conditioning", "Mini Split AC",
    1899, 4.7, 189,
    "https://images.unsplash.com/photo-1631545806609-35dab2cad4ea?w=500&h=500&fit=crop&q=80",
    "Ductless mini split with heat pump, WiFi control, and 22 SEER efficiency.",
    ["22 SEER efficiency", "Heat pump — heats and cools", "WiFi enabled", "Inverter compressor", "Whisper-quiet 19 dB", "Auto-restart after power outage"],
    { "BTU": "12,000", "SEER": "22", "Coverage": "550 sq. ft.", "Noise": "19 dB" },
    { warranty: "7 years compressor", commercial: true, bulkEligible: false, installationRequired: true, finish: "White", color: "White", dimensions: { width: "32\"", height: "11\"", depth: "8\"" }, weight: "22 lbs (indoor)", voltage: "240V", compliance: ["CSA", "Energy Star"] }
  ),
  p("chs-hvac-furnace-80k", "CHS-HV-FUR-80K", "CHESS High-Efficiency Gas Furnace 80,000 BTU", "hvac", "heating", "Gas Furnace",
    2499, 4.6, 145,
    "https://images.unsplash.com/photo-1631545806609-35dab2cad4ea?w=500&h=500&fit=crop&q=80",
    "96% AFUE modulating gas furnace with variable-speed blower and two-stage heating.",
    ["96% AFUE efficiency", "Modulating gas valve", "Variable-speed ECM blower", "Two-stage heating", "Stainless steel heat exchanger", "Lifetime heat exchanger warranty"],
    { "BTU": "80,000", "AFUE": "96%", "Stages": "2", "Blower": "Variable-speed ECM" },
    { warranty: "Lifetime heat exchanger", commercial: true, bulkEligible: false, installationRequired: true, finish: "Painted Steel", color: "Grey", dimensions: { width: "21\"", height: "40\"", depth: "28\"" }, weight: "135 lbs", voltage: "120V", compliance: ["CSA", "Energy Star"] }
  ),
  p("chs-hvac-tankless-199", "CHS-HV-TL-199K", "CHESS Tankless Water Heater 199,000 BTU", "hvac", "water-heaters", "Tankless Water Heater",
    1599, 4.7, 234,
    "https://images.unsplash.com/photo-1631545806609-35dab2cad4ea?w=500&h=500&fit=crop&q=80",
    "Condensing tankless water heater with 0.96 UEF and WiFi monitoring.",
    ["0.96 UEF efficiency", "11 GPM max flow", "WiFi monitoring", "Condensing technology", "Recirculation compatible", "Indoor/outdoor installation"],
    { "BTU": "199,000", "UEF": "0.96", "Flow": "11 GPM", "Type": "Condensing" },
    { warranty: "15 years heat exchanger", commercial: true, bulkEligible: false, installationRequired: true, finish: "Painted Steel", color: "Grey", dimensions: { width: "14\"", height: "24\"", depth: "10\"" }, weight: "45 lbs", voltage: "120V", compliance: ["CSA", "Energy Star"] }
  ),
  p("chs-hvac-dehumid-70", "CHS-HV-DH-70", "CHESS Whole-Home Dehumidifier 70 Pint", "hvac", "air-quality", "Dehumidifier",
    449, 4.5, 267,
    "https://images.unsplash.com/photo-1631545806609-35dab2cad4ea?w=500&h=500&fit=crop&q=80",
    "Whole-home dehumidifier with built-in pump, continuous drain, and digital humidistat.",
    ["70 pint/day capacity", "Built-in condensate pump", "Digital humidistat", "Continuous drain option", "Auto restart", "Washable filter"],
    { "Capacity": "70 pints/day", "Coverage": "4,500 sq. ft.", "Pump": "Built-in" },
    { warranty: "2 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "White", color: "White", dimensions: { width: "15\"", height: "25\"", depth: "12\"" }, weight: "45 lbs", voltage: "120V", compliance: ["CSA", "Energy Star"] }
  ),
  p("chs-hvac-hrv-200", "CHS-HV-HRV-200", "CHESS Heat Recovery Ventilator 200 CFM", "hvac", "air-quality", "HRV",
    1299, 4.6, 112,
    "https://images.unsplash.com/photo-1631545806609-35dab2cad4ea?w=500&h=500&fit=crop&q=80",
    "Energy-efficient HRV with aluminum core heat exchanger and boost mode.",
    ["200 CFM airflow", "Aluminum core — 80% recovery", "Boost mode", "Washable filters", "Defrost cycle", "Wall control included"],
    { "CFM": "200", "Recovery": "80%", "Core": "Aluminum" },
    { warranty: "5 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "Painted Steel", color: "White", dimensions: { width: "26\"", height: "12\"", depth: "26\"" }, weight: "55 lbs", voltage: "120V", compliance: ["CSA", "Energy Star"] }
  ),
  p("chs-elec-ev-48a", "CHS-EL-EV-48A", "CHESS Level 2 EV Charger 48A — NEMA 14-50", "electrical", "ev-charging", "EV Charger",
    699, 4.8, 178,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Smart Level 2 EV charger with WiFi, scheduling, and energy monitoring.",
    ["48A / 11.5 kW output", "WiFi enabled", "Scheduling via app", "Energy monitoring", "NEMA 14-50 plug", "25 ft cable"],
    { "Amps": "48A", "Output": "11.5 kW", "Cable": "25 ft", "Connector": "J1772" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "Matte Black", color: "Black", dimensions: { width: "7\"", height: "12\"", depth: "4\"" }, weight: "18 lbs", voltage: "240V", compliance: ["CSA", "UL", "Energy Star"] }
  ),
  p("chs-elec-gen-7500", "CHS-EL-GEN-7500", "CHESS Portable Generator 7,500W", "electrical", "generators", "Portable Generator",
    1299, 4.5, 145,
    "https://images.unsplash.com/photo-1558618666-fcd25c85e?w=500&h=500&fit=crop&q=80",
    "Dual-fuel portable generator with electric start and transfer switch ready.",
    ["7,500W running / 9,500W peak", "Dual fuel — gas or propane", "Electric start", "Transfer switch ready", "CO detection auto-shutoff", "12-hour runtime"],
    { "Running Watts": "7,500", "Peak Watts": "9,500", "Fuel": "Dual (gas/propane)", "Runtime": "12 hours" },
    { warranty: "3 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Orange/Black", color: "Orange", dimensions: { width: "27\"", height: "26\"", depth: "22\"" }, weight: "195 lbs", voltage: "120/240V", compliance: ["CSA", "EPA"] }
  ),
  p("chs-elec-solar-400", "CHS-EL-SOL-400", "CHESS Solar Panel 400W Monocrystalline", "electrical", "solar", "Solar Panel",
    299, 4.7, 89,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "High-efficiency 400W monocrystalline solar panel with half-cut cell technology.",
    ["400W output", "21.5% efficiency", "Half-cut cell technology", "Anti-reflective glass", "IP68 junction box", "25-year performance warranty"],
    { "Watts": "400W", "Efficiency": "21.5%", "Type": "Monocrystalline", "Cells": "144 half-cut" },
    { warranty: "25 years performance", commercial: true, bulkEligible: false, installationRequired: true, finish: "Black Frame", color: "Black", dimensions: { width: "41\"", height: "1.4\"", depth: "75\"" }, weight: "48 lbs", compliance: ["CSA", "UL", "IEC"] }
  ),
  p("chs-elec-battery-10", "CHS-EL-BAT-10KW", "CHESS Home Battery System 10 kWh", "electrical", "solar", "Battery System",
    5999, 4.8, 56,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Lithium iron phosphate home battery with 10 kWh capacity and integrated inverter.",
    ["10 kWh usable capacity", "LFP chemistry — 6000+ cycles", "Integrated hybrid inverter", "Backup power capable", "App monitoring", "Stackable to 40 kWh"],
    { "Capacity": "10 kWh", "Chemistry": "LiFePO4", "Cycles": "6000+", "Inverter": "5 kW" },
    { warranty: "10 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "White", color: "White", dimensions: { width: "24\"", height: "45\"", depth: "6\"" }, weight: "220 lbs", voltage: "120/240V", compliance: ["CSA", "UL"] }
  ),
  p("chs-bm-hardwood-oak", "CHS-BM-HW-OAK", "CHESS Engineered Hardwood — White Oak", "building-materials", "flooring", "Engineered Hardwood",
    7.49, 4.7, 312,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "7\" wide plank engineered white oak with UV-cured finish. 20-year residential warranty.",
    ["7\" wide planks", "5mm wear layer", "UV-cured matte finish", "Click-lock installation", "Radiant heat compatible", "FSC certified"],
    { "Width": "7\"", "Thickness": "5/8\"", "Wear Layer": "5mm", "Finish": "UV-cured matte" },
    { warranty: "20 years residential", commercial: false, bulkEligible: false, installationRequired: false, finish: "Natural White Oak", color: "Natural", dimensions: { width: "7\"", height: "5/8\"", depth: "72\"" }, weight: "2.8 lbs/sq.ft.", compliance: ["FSC", "CARB2"], priceUnit: "per sq. ft." }
  ),
  p("chs-bm-lvp-grey", "CHS-BM-LVP-GY", "CHESS Luxury Vinyl Plank — Greige Oak", "building-materials", "flooring", "Luxury Vinyl Plank",
    4.29, 4.6, 456,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Waterproof luxury vinyl plank with rigid SPC core and attached underlayment.",
    ["100% waterproof", "Rigid SPC core", "Attached cork underlayment", "Click-lock installation", "Scratch-resistant wear layer", "Lifetime residential warranty"],
    { "Width": "7\"", "Thickness": "6mm", "Core": "SPC rigid", "Wear Layer": "20 mil" },
    { warranty: "Lifetime residential", commercial: false, bulkEligible: false, installationRequired: false, finish: "Greige Oak", color: "Greige", dimensions: { width: "7\"", height: "6mm", depth: "48\"" }, weight: "2.1 lbs/sq.ft.", compliance: ["FloorScore", "CARB2"], priceUnit: "per sq. ft." }
  ),
  p("chs-bm-tile-marble", "CHS-BM-TL-MRB-WH", "CHESS Porcelain Tile — Carrara Marble Look", "building-materials", "tile", "Porcelain Tile",
    5.99, 4.7, 234,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "24x24\" polished porcelain tile with realistic Carrara marble veining.",
    ["24x24\" format", "Polished finish", "Rectified edges", "Frost-resistant", "Low water absorption", "Made in Italy"],
    { "Size": "24x24\"", "Finish": "Polished", "Material": "Porcelain", "Origin": "Italy" },
    { warranty: "Lifetime", commercial: false, bulkEligible: false, installationRequired: false, finish: "Polished", color: "White/Grey", dimensions: { width: "24\"", height: "3/8\"", depth: "24\"" }, weight: "4.5 lbs/tile", compliance: ["ANSI"], priceUnit: "per sq. ft." }
  ),
  p("chs-bm-quartz-calac", "CHS-BM-QZ-CAL", "CHESS Quartz Countertop — Calacatta", "building-materials", "countertops", "Quartz Countertop",
    79, 4.8, 167,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Premium engineered quartz with dramatic Calacatta veining. Non-porous and stain-resistant.",
    ["Non-porous surface", "Stain-resistant", "Heat-resistant to 400°F", "NSF food-safe certified", "Dramatic veining pattern", "Custom fabrication available"],
    { "Thickness": "3cm", "Material": "Engineered quartz", "Finish": "Polished" },
    { warranty: "Lifetime", commercial: true, bulkEligible: false, installationRequired: true, finish: "Polished", color: "White/Gold", dimensions: { width: "Custom", height: "3cm", depth: "Custom" }, weight: "20 lbs/sq.ft.", compliance: ["NSF", "Greenguard"], priceUnit: "per sq. ft." }
  ),
  p("chs-bm-insul-r24", "CHS-BM-INS-R24", "CHESS Mineral Wool Insulation R-24", "building-materials", "insulation", "Mineral Wool",
    1.89, 4.5, 289,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Fire-resistant mineral wool batt insulation. R-24 for 2x6 walls. Sound-dampening properties.",
    ["R-24 thermal value", "Fire-resistant — non-combustible", "Sound dampening NRC 1.0", "Moisture-resistant", "No off-gassing", "Friction-fit installation"],
    { "R-Value": "R-24", "Width": "15.25\"", "Thickness": "5.5\"", "Coverage": "59.7 sq.ft./bag" },
    { warranty: "Lifetime", commercial: false, bulkEligible: false, installationRequired: false, finish: "Natural", color: "Brown", dimensions: { width: "15.25\"", height: "5.5\"", depth: "47\"" }, weight: "0.8 lbs/sq.ft.", compliance: ["CSA", "ULC"], priceUnit: "per sq. ft." }
  ),
  p("chs-out-grill-6b", "CHS-OUT-GRL-6B-SS", "CHESS 6-Burner Gas Grill — Stainless", "outdoor", "outdoor-living", "Gas Grill",
    1999, 4.7, 178,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Professional 6-burner gas grill with infrared sear station and rotisserie kit.",
    ["6 main burners + sear station", "Infrared rear rotisserie burner", "900 sq. in. cooking area", "Stainless steel construction", "LED-lit control knobs", "Rotisserie kit included"],
    { "Burners": "6 + sear + rotisserie", "Cooking Area": "900 sq. in.", "BTU": "80,000 total" },
    { warranty: "10 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Stainless Steel", color: "Silver", dimensions: { width: "60\"", height: "48\"", depth: "24\"" }, weight: "185 lbs", compliance: ["CSA"] }
  ),
  p("chs-out-pergola-12", "CHS-OUT-PER-12-CD", "CHESS Cedar Pergola 12x10 ft", "outdoor", "outdoor-structures", "Pergola",
    3499, 4.6, 89,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Western red cedar pergola with adjustable louvered roof panels and integrated LED lighting.",
    ["Western red cedar", "Adjustable louvered roof", "Integrated LED lighting", "Powder-coated hardware", "Pre-cut for easy assembly", "Wind-rated to 90 mph"],
    { "Size": "12x10 ft", "Material": "Western red cedar", "Roof": "Adjustable louvers" },
    { warranty: "15 years", commercial: false, bulkEligible: false, installationRequired: true, finish: "Natural Cedar", color: "Cedar", dimensions: { width: "144\"", height: "96\"", depth: "120\"" }, weight: "450 lbs", compliance: ["IRC"] }
  ),
  p("chs-out-deck-comp", "CHS-OUT-DCK-CMP-GY", "CHESS Composite Decking — Coastal Grey", "outdoor", "decking", "Composite Decking",
    5.49, 4.6, 345,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Capped composite decking board with realistic wood grain. Fade, stain, and scratch resistant.",
    ["Capped polymer shell", "Realistic wood grain", "Fade-resistant 25 years", "Stain-resistant", "Scratch-resistant", "Hidden fastener compatible"],
    { "Width": "5.5\"", "Length": "16 ft", "Thickness": "1\"", "Material": "Capped composite" },
    { warranty: "25 years structural", commercial: false, bulkEligible: false, installationRequired: false, finish: "Coastal Grey", color: "Grey", dimensions: { width: "5.5\"", height: "1\"", depth: "192\"" }, weight: "2.2 lbs/ft", compliance: ["ICC-ES", "ASTM"], priceUnit: "per linear ft." }
  ),
  p("chs-out-fence-priv", "CHS-OUT-FNC-PRV-CD", "CHESS Cedar Privacy Fence Panel 6x8 ft", "outdoor", "fencing", "Fence Panel",
    189, 4.5, 267,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Pre-assembled western red cedar privacy fence panel. Dog-ear picket style.",
    ["Pre-assembled panel", "Western red cedar", "Dog-ear picket style", "6 ft tall x 8 ft wide", "Naturally rot-resistant", "Ready to stain or seal"],
    { "Size": "6x8 ft", "Material": "Western red cedar", "Style": "Dog-ear privacy" },
    { warranty: "5 years", commercial: false, bulkEligible: false, installationRequired: false, finish: "Natural Cedar", color: "Cedar", dimensions: { width: "96\"", height: "72\"", depth: "1.5\"" }, weight: "65 lbs", compliance: ["IRC"] }
  ),
  p("chs-com-ref-reach-2d", "CHS-COM-REF-2D-SS", "CHESS Commercial Reach-In Refrigerator 2-Door", "commercial", "commercial-refrigeration", "Commercial Refrigerator",
    3299, 4.7, 89,
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop&q=80",
    "NSF-certified 2-door reach-in refrigerator for commercial kitchens. Self-closing doors.",
    ["49 cu. ft. capacity", "NSF certified", "Self-closing doors", "Digital temperature display", "Bottom-mount compressor", "Stainless interior and exterior"],
    { "Capacity": "49 cu. ft.", "Doors": "2", "Temp Range": "33-41°F" },
    { warranty: "3 years parts, 5 years compressor", commercial: true, bulkEligible: true, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "54\"", height: "82\"", depth: "33\"" }, weight: "320 lbs", voltage: "120V", compliance: ["NSF", "UL", "Energy Star"] }
  ),
  p("chs-com-ice-500", "CHS-COM-ICE-500", "CHESS Commercial Ice Machine 500 lbs/day", "commercial", "commercial-refrigeration", "Ice Machine",
    4499, 4.6, 67,
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop&q=80",
    "Air-cooled modular ice machine producing 500 lbs of half-dice ice per day.",
    ["500 lbs/day production", "Half-dice ice", "Air-cooled condenser", "Antimicrobial components", "Auto cleaning cycle", "Bin not included"],
    { "Production": "500 lbs/day", "Ice Type": "Half-dice", "Cooling": "Air-cooled" },
    { warranty: "3 years parts, 5 years compressor", commercial: true, bulkEligible: true, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "30\"", height: "24\"", depth: "25\"" }, weight: "185 lbs", voltage: "120V", compliance: ["NSF", "UL", "Energy Star"] }
  ),
  p("chs-com-oven-conv", "CHS-COM-OVN-CNV", "CHESS Commercial Convection Oven — Full Size", "commercial", "commercial-cooking", "Convection Oven",
    5999, 4.8, 56,
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&h=500&fit=crop&q=80",
    "Full-size commercial convection oven with 10 rack positions and steam injection.",
    ["10 full-size sheet pan capacity", "Steam injection system", "Digital programmable controls", "50 recipe memory", "Auto-reversing fans", "Self-cleaning cycle"],
    { "Capacity": "10 full-size pans", "Steam": "Yes", "Programs": "50 memory" },
    { warranty: "2 years", commercial: true, bulkEligible: true, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "38\"", height: "72\"", depth: "40\"" }, weight: "450 lbs", voltage: "208/240V", compliance: ["NSF", "UL"] }
  ),
  p("chs-com-dishwash-ht", "CHS-COM-DW-HT", "CHESS Commercial High-Temp Dishwasher", "commercial", "commercial-cooking", "Commercial Dishwasher",
    7499, 4.7, 45,
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&h=500&fit=crop&q=80",
    "High-temperature door-type commercial dishwasher. 60 racks/hour capacity.",
    ["60 racks/hour", "High-temp sanitizing (180°F)", "Built-in booster heater", "Auto-fill and drain", "Stainless steel construction", "Energy Star certified"],
    { "Capacity": "60 racks/hour", "Sanitize Temp": "180°F", "Type": "Door-type" },
    { warranty: "2 years", commercial: true, bulkEligible: true, installationRequired: true, finish: "Stainless Steel", color: "Silver", dimensions: { width: "24\"", height: "67\"", depth: "26\"" }, weight: "285 lbs", voltage: "208/240V", compliance: ["NSF", "UL", "Energy Star"] }
  ),
  p("chs-part-filter-fridge", "CHS-PRT-FLT-RF", "CHESS Refrigerator Water Filter (3-Pack)", "parts", "filters", "Water Filter",
    49, 4.6, 567,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=80",
    "NSF-certified replacement water filter for CHESS refrigerators. 6-month lifespan per filter.",
    ["NSF 42 & 53 certified", "6-month lifespan each", "Reduces chlorine, lead, mercury", "Easy twist-and-lock", "Compatible with all CHESS fridges", "3-pack value"],
    { "Pack": "3 filters", "Lifespan": "6 months each", "Certification": "NSF 42 & 53" },
    { warranty: "1 year", commercial: false, bulkEligible: false, installationRequired: false, finish: "White", color: "White", dimensions: { width: "3\"", height: "8\"", depth: "3\"" }, weight: "1.5 lbs", compliance: ["NSF"] }
  ),
  p("chs-part-element-oven", "CHS-PRT-ELM-OVN", "CHESS Oven Bake Element — Universal", "parts", "heating-elements", "Bake Element",
    59, 4.4, 234,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=80",
    "Universal replacement bake element for CHESS electric ranges. 3000W.",
    ["3000W output", "Universal fit for CHESS ranges", "Chrome-plated steel", "Plug-in installation", "No tools required", "OEM quality"],
    { "Wattage": "3000W", "Voltage": "240V", "Fit": "Universal CHESS ranges" },
    { warranty: "1 year", commercial: false, bulkEligible: false, installationRequired: false, finish: "Chrome", color: "Silver", dimensions: { width: "19\"", height: "3\"", depth: "16\"" }, weight: "2 lbs", voltage: "240V", compliance: ["CSA", "UL"] }
  ),
  p("chs-part-gasket-fridge", "CHS-PRT-GSK-RF", "CHESS Refrigerator Door Gasket — Universal", "parts", "seals-gaskets", "Door Gasket",
    39, 4.3, 189,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=80",
    "Magnetic door gasket replacement for CHESS refrigerators. Maintains proper seal and efficiency.",
    ["Magnetic seal", "Universal CHESS fit", "Food-grade material", "Easy snap-in install", "Maintains energy efficiency", "Pre-formed corners"],
    { "Material": "Food-grade PVC", "Fit": "Universal CHESS fridges", "Install": "Snap-in" },
    { warranty: "1 year", commercial: false, bulkEligible: false, installationRequired: false, finish: "White", color: "White", dimensions: { width: "Custom", height: "Custom", depth: "1\"" }, weight: "0.8 lbs", compliance: ["NSF"] }
  ),
  p("chs-part-pump-dw", "CHS-PRT-PMP-DW", "CHESS Dishwasher Drain Pump Assembly", "parts", "pumps-motors", "Drain Pump",
    79, 4.5, 156,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=80",
    "OEM replacement drain pump assembly for CHESS dishwashers. Includes motor and impeller.",
    ["OEM quality", "Includes motor and impeller", "Direct replacement", "Pre-wired connector", "Quiet operation", "1-year warranty"],
    { "Type": "Drain pump assembly", "Fit": "CHESS dishwashers", "Motor": "Included" },
    { warranty: "1 year", commercial: false, bulkEligible: false, installationRequired: false, finish: "Black", color: "Black", dimensions: { width: "5\"", height: "4\"", depth: "5\"" }, weight: "1.5 lbs", voltage: "120V", compliance: ["CSA", "UL"] }
  ),
  p("chs-part-knob-range", "CHS-PRT-KNB-RNG-6", "CHESS Range Control Knobs (6-Pack) — Stainless", "parts", "knobs-handles", "Control Knobs",
    29, 4.4, 312,
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=80",
    "Replacement stainless steel control knobs for CHESS gas and electric ranges. Set of 6.",
    ["Set of 6 knobs", "Stainless steel finish", "Universal CHESS fit", "D-shaft compatible", "Heat-resistant", "Includes adapters"],
    { "Pack": "6 knobs", "Finish": "Stainless steel", "Fit": "Universal CHESS ranges" },
    { warranty: "1 year", commercial: false, bulkEligible: false, installationRequired: false, finish: "Stainless Steel", color: "Silver", dimensions: { width: "2\"", height: "1.5\"", depth: "2\"" }, weight: "0.5 lbs", compliance: ["CSA"] }
  ),
  p("chs-cook-ind-30-bk", "CHS-COOK-IND-30-BK", "CHESS Induction Cooktop 30 Inch", "appliances", "cooking", "Induction Cooktop",
    1299, 4.7, 156,
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&q=80",
    "Precision induction cooktop with 4 cooking zones, bridge element, and touch controls.",
    ["4 induction zones","Bridge element","Touch controls","Power boost","Timer function","Child lock"],
    {"width":"30\"","depth":"21\"","height":"2\"","weight":"42 lbs","voltage":"240V","warranty":"5 years"}),
  p("chs-cook-dw-36-ss", "CHS-COOK-DW-36-SS", "CHESS Double Wall Oven 36 Inch", "appliances", "cooking", "Double Wall Oven",
    3499, 4.6, 89,
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=500&fit=crop&q=80",
    "Professional double wall oven with true convection in both cavities and self-clean.",
    ["True convection both ovens","Self-clean","Meat probe","Sabbath mode","Soft-close doors","10.6 cu ft total"],
    {"width":"36\"","depth":"24\"","height":"51\"","weight":"285 lbs","voltage":"240V","warranty":"5 years"}),
  p("chs-cook-micro-24-ss", "CHS-COOK-MICRO-24-SS", "CHESS Built-In Microwave 24 Inch", "appliances", "cooking", "Built-In Microwave",
    699, 4.4, 234,
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&h=500&fit=crop&q=80",
    "Sleek built-in microwave with sensor cooking and trim kit included.",
    ["Sensor cooking","1.5 cu ft","1000W","Trim kit included","10 power levels","Quick start"],
    {"width":"24\"","depth":"19\"","height":"14\"","weight":"55 lbs","voltage":"120V","warranty":"3 years"}),
  p("chs-dw-18-ss", "CHS-DW-18-SS", "CHESS Compact Dishwasher 18 Inch", "appliances", "dishwashers", "Compact Dishwasher",
    849, 4.3, 167,
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop&q=80",
    "Space-saving 18-inch dishwasher perfect for condos and small kitchens.",
    ["8 place settings","6 wash cycles","Delay start","Stainless tub","Energy Star","Quiet 49dB"],
    {"width":"18\"","depth":"24\"","height":"34\"","weight":"95 lbs","voltage":"120V","warranty":"3 years"}),
  p("chs-dw-panel-24", "CHS-DW-PANEL-24", "CHESS Panel-Ready Dishwasher 24 Inch", "appliances", "dishwashers", "Panel-Ready Dishwasher",
    1399, 4.6, 78,
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop&q=80",
    "Custom panel-ready dishwasher for seamless kitchen integration.",
    ["Panel-ready design","16 place settings","Third rack","AutoDose","WiFi enabled","42dB ultra-quiet"],
    {"width":"24\"","depth":"24\"","height":"34\"","weight":"115 lbs","voltage":"120V","warranty":"5 years"}),
  p("chs-dry-elec-27", "CHS-DRY-ELEC-27", "CHESS Electric Dryer 27 Inch", "appliances", "laundry", "Electric Dryer",
    999, 4.5, 198,
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop&q=80",
    "High-capacity electric dryer with steam refresh and sensor dry technology.",
    ["8.0 cu ft capacity","Steam refresh","Sensor dry","12 cycles","Wrinkle prevent","Energy Star"],
    {"width":"27\"","depth":"31\"","height":"39\"","weight":"135 lbs","voltage":"240V","warranty":"3 years"}),
  p("chs-wash-fl-27", "CHS-WASH-FL-27", "CHESS Front Load Washer 27 Inch", "appliances", "laundry", "Front Load Washer",
    1099, 4.6, 176,
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop&q=80",
    "Premium front-load washer with steam clean and allergen cycle.",
    ["5.2 cu ft capacity","Steam clean","Allergen cycle","WiFi enabled","1400 RPM spin","Energy Star"],
    {"width":"27\"","depth":"32\"","height":"39\"","weight":"185 lbs","voltage":"120V","warranty":"5 years"}),
  p("chs-wash-tl-27", "CHS-WASH-TL-27", "CHESS Top Load Washer 27 Inch", "appliances", "laundry", "Top Load Washer",
    799, 4.4, 245,
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop&q=80",
    "Efficient top-load washer with deep fill option and built-in faucet.",
    ["5.0 cu ft capacity","Deep fill option","Built-in faucet","12 cycles","Soft close lid","Energy Star"],
    {"width":"27\"","depth":"28\"","height":"44\"","weight":"145 lbs","voltage":"120V","warranty":"3 years"}),
  p("chs-fur-sec-mod", "CHS-FUR-SEC-MOD", "CHESS Modular Sectional 5-Piece", "furniture", "living-room", "Modular Sectional",
    3299, 4.7, 67,
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&q=80",
    "Fully modular 5-piece sectional with performance fabric and reversible cushions.",
    ["5 modular pieces","Performance fabric","Reversible cushions","Solid hardwood frame","Sinuous springs","10-year warranty"],
    {"width":"120\"","depth":"90\"","height":"34\"","weight":"280 lbs","material":"Performance polyester","warranty":"10 years"}),
  p("chs-fur-rec-pwr", "CHS-FUR-REC-PWR", "CHESS Power Recliner with USB", "furniture", "living-room", "Power Recliner",
    1599, 4.5, 134,
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop&q=80",
    "Luxurious power recliner with USB charging, lumbar support, and memory foam.",
    ["Power recline","USB charging","Lumbar support","Memory foam","Top grain leather","Zero-wall design"],
    {"width":"36\"","depth":"40\"","height":"42\"","weight":"125 lbs","material":"Top grain leather","warranty":"5 years"}),
  p("chs-fur-bed-k-plat", "CHS-FUR-BED-K-PLAT", "CHESS King Platform Bed Frame", "furniture", "bedroom", "King Platform Bed",
    1299, 4.6, 189,
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop&q=80",
    "Modern king platform bed with upholstered headboard and under-bed storage.",
    ["Upholstered headboard","Under-bed storage","No box spring needed","Solid wood slats","Linen fabric","Easy assembly"],
    {"width":"80\"","depth":"86\"","height":"48\"","weight":"165 lbs","material":"Solid wood + linen","warranty":"5 years"}),
  p("chs-fur-dress-6dr", "CHS-FUR-DRESS-6DR", "CHESS 6-Drawer Double Dresser", "furniture", "bedroom", "6-Drawer Dresser",
    1099, 4.5, 145,
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop&q=80",
    "Solid wood double dresser with soft-close drawers and dovetail joints.",
    ["6 soft-close drawers","Dovetail joints","Solid maple","Anti-tip hardware","Felt-lined top drawers","Natural finish"],
    {"width":"62\"","depth":"20\"","height":"34\"","weight":"145 lbs","material":"Solid maple","warranty":"10 years"}),
  p("chs-fur-din-ext-8", "CHS-FUR-DIN-EXT-8", "CHESS Extendable Dining Table Seats 8", "furniture", "dining", "Extendable Dining Table",
    1899, 4.6, 98,
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop&q=80",
    "Solid oak extendable dining table with butterfly leaf, seats 6-8.",
    ["Butterfly leaf extension","Seats 6-8","Solid white oak","Trestle base","Scratch resistant finish","Self-storing leaf"],
    {"width":"72-96\"","depth":"42\"","height":"30\"","weight":"185 lbs","material":"Solid white oak","warranty":"10 years"}),
  p("chs-fur-din-chair-set", "CHS-FUR-DIN-CHAIR-SET", "CHESS Upholstered Dining Chairs Set of 4", "furniture", "dining", "Dining Chair Set",
    899, 4.4, 212,
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop&q=80",
    "Set of 4 upholstered dining chairs with solid wood legs and stain-resistant fabric.",
    ["Set of 4","Stain-resistant fabric","Solid wood legs","Padded seats","Ergonomic back","Easy assembly"],
    {"width":"20\"","depth":"22\"","height":"36\"","weight":"15 lbs each","material":"Polyester + beech","warranty":"3 years"}),
  p("chs-fur-desk-exec", "CHS-FUR-DESK-EXEC", "CHESS Executive Standing Desk", "furniture", "office", "Standing Desk",
    1199, 4.7, 167,
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=500&fit=crop&q=80",
    "Electric sit-stand desk with dual motors, programmable presets, and cable management.",
    ["Dual motor lift","4 memory presets","Cable management tray","Anti-collision","28-48 inch range","350 lb capacity"],
    {"width":"60\"","depth":"30\"","height":"28-48\"","weight":"95 lbs","material":"Bamboo + steel","warranty":"5 years"}),
  p("chs-fur-chair-ergo", "CHS-FUR-CHAIR-ERGO", "CHESS Ergonomic Office Chair", "furniture", "office", "Ergonomic Office Chair",
    899, 4.6, 234,
    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=500&fit=crop&q=80",
    "Full-mesh ergonomic chair with adjustable lumbar, headrest, and 4D armrests.",
    ["Full mesh back","Adjustable lumbar","Adjustable headrest","4D armrests","Seat depth adjust","12-year warranty"],
    {"width":"27\"","depth":"27\"","height":"46-52\"","weight":"52 lbs","material":"Mesh + aluminum","warranty":"12 years"}),
  p("chs-lt-pend-drum", "CHS-LT-PEND-DRUM", "CHESS Drum Pendant Light 24 Inch", "lighting", "pendants", "Drum Pendant",
    449, 4.5, 189,
    "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&h=500&fit=crop&q=80",
    "Elegant drum pendant with linen shade and adjustable drop height.",
    ["Linen shade","Adjustable height","3 x E26 bulbs","Dimmable","UL listed","Brushed nickel hardware"],
    {"width":"24\"","height":"12\"","drop":"12-48\"","weight":"12 lbs","bulbType":"E26","warranty":"5 years"}),
  p("chs-lt-pend-island", "CHS-LT-PEND-ISLAND", "CHESS Linear Island Pendant 48 Inch", "lighting", "pendants", "Island Pendant",
    799, 4.6, 112,
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&h=500&fit=crop&q=80",
    "Modern linear pendant perfect for kitchen islands with 5 adjustable lights.",
    ["5 adjustable lights","Matte black finish","Adjustable height","LED compatible","UL listed","Hardwire install"],
    {"width":"48\"","height":"8\"","drop":"12-60\"","weight":"18 lbs","bulbType":"E26","warranty":"5 years"}),
  p("chs-lt-chan-mod", "CHS-LT-CHAN-MOD", "CHESS Modern Sputnik Chandelier", "lighting", "chandeliers", "Sputnik Chandelier",
    599, 4.4, 156,
    "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=500&h=500&fit=crop&q=80",
    "Mid-century modern sputnik chandelier with 12 arms and brass finish.",
    ["12 arms","Brass finish","Dimmable","LED compatible","UL listed","Adjustable chain"],
    {"width":"28\"","height":"28\"","drop":"12-48\"","weight":"15 lbs","bulbType":"E12","warranty":"5 years"}),
  p("chs-lt-rec-6pk", "CHS-LT-REC-6PK", "CHESS LED Recessed Lights 6-Pack", "lighting", "recessed", "LED Recessed Light Pack",
    199, 4.7, 456,
    "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=500&h=500&fit=crop&q=80",
    "Ultra-slim LED recessed lights with selectable color temperature, 6-pack.",
    ["6-pack","Selectable 3000K/4000K/5000K","IC rated","Dimmable","Energy Star","Easy retrofit"],
    {"width":"6\"","depth":"1\"","wattage":"12W each","lumens":"1100 each","warranty":"5 years"}),
  p("chs-lt-wall-sconce", "CHS-LT-WALL-SCONCE", "CHESS Modern Wall Sconce Pair", "lighting", "wall-lights", "Wall Sconce Pair",
    279, 4.5, 234,
    "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&h=500&fit=crop&q=80",
    "Pair of modern wall sconces with frosted glass shades and brushed brass.",
    ["Set of 2","Frosted glass","Brushed brass","Dimmable","UL listed","ADA compliant"],
    {"width":"5\"","depth":"6\"","height":"12\"","weight":"3 lbs each","bulbType":"E26","warranty":"5 years"}),
  p("chs-lt-fan-52", "CHS-LT-FAN-52", "CHESS Ceiling Fan with Light 52 Inch", "lighting", "ceiling-fans", "Ceiling Fan with Light",
    399, 4.5, 312,
    "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=500&h=500&fit=crop&q=80",
    "Quiet DC motor ceiling fan with integrated LED light and remote control.",
    ["DC motor","Integrated LED","Remote control","6 speeds","Reversible","Damp rated"],
    {"width":"52\"","height":"14\"","weight":"22 lbs","airflow":"5800 CFM","warranty":"10 years"}),
  p("chs-pl-fau-pull", "CHS-PL-FAU-PULL", "CHESS Pull-Down Kitchen Faucet", "plumbing", "kitchen-faucets", "Pull-Down Kitchen Faucet",
    349, 4.6, 289,
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop&q=80",
    "Single-handle pull-down faucet with magnetic docking and spot-resist finish.",
    ["Magnetic docking","Spot-resist stainless","Single handle","Power clean spray","Deck plate included","ADA compliant"],
    {"height":"15.5\"","reach":"9.5\"","flow":"1.5 GPM","connections":"3/8\"","warranty":"Lifetime"}),
  p("chs-pl-fau-pot", "CHS-PL-FAU-POT", "CHESS Pot Filler Wall Mount", "plumbing", "kitchen-faucets", "Pot Filler",
    499, 4.5, 123,
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop&q=80",
    "Wall-mounted pot filler with dual joint swing arm and ceramic disc valves.",
    ["Dual joint swing","Ceramic disc valves","Wall mount","Matte black finish","Lead-free brass","ADA compliant"],
    {"reach":"22\"","flow":"4.0 GPM","connections":"1/2\"","warranty":"Lifetime"}),
  p("chs-pl-show-rain", "CHS-PL-SHOW-RAIN", "CHESS Rainfall Shower System", "plumbing", "shower-systems", "Rainfall Shower System",
    899, 4.7, 167,
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop&q=80",
    "Complete rainfall shower system with 12-inch head, hand shower, and body jets.",
    ["12\" rain head","Hand shower","4 body jets","Thermostatic valve","Brushed nickel","Anti-scald"],
    {"headSize":"12\"","flow":"2.5 GPM","connections":"1/2\"","warranty":"10 years"}),
  p("chs-pl-tub-free", "CHS-PL-TUB-FREE", "CHESS Freestanding Soaking Tub 67 Inch", "plumbing", "bathtubs", "Freestanding Soaking Tub",
    2499, 4.8, 89,
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=500&h=500&fit=crop&q=80",
    "Elegant freestanding acrylic soaking tub with chrome overflow and drain.",
    ["Acrylic construction","Chrome overflow","Center drain","Slotted overflow","60 gallon capacity","Leveling feet"],
    {"width":"67\"","depth":"30\"","height":"23\"","weight":"88 lbs","capacity":"60 gal","warranty":"10 years"}),
  p("chs-pl-van-48", "CHS-PL-VAN-48", "CHESS Bathroom Vanity 48 Inch", "plumbing", "vanities", "Bathroom Vanity",
    1699, 4.6, 134,
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop&q=80",
    "Solid wood bathroom vanity with quartz top, undermount sink, and soft-close drawers.",
    ["Quartz countertop","Undermount sink","Soft-close drawers","Solid birch","Pre-drilled for faucet","Backsplash included"],
    {"width":"48\"","depth":"22\"","height":"34\"","weight":"165 lbs","material":"Solid birch + quartz","warranty":"5 years"}),
  p("chs-pl-toilet-dual", "CHS-PL-TOILET-DUAL", "CHESS Dual Flush Elongated Toilet", "plumbing", "toilets", "Dual Flush Toilet",
    549, 4.5, 278,
    "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=500&h=500&fit=crop&q=80",
    "WaterSense certified dual flush toilet with comfort height and slow-close seat.",
    ["Dual flush 1.1/1.6 GPF","Comfort height","Slow-close seat","WaterSense","Elongated bowl","Easy install"],
    {"width":"15\"","depth":"28\"","height":"31\"","weight":"85 lbs","flush":"1.1/1.6 GPF","warranty":"10 years"}),
  p("chs-hvac-mini-18k", "CHS-HVAC-MINI-18K", "CHESS Mini Split 18000 BTU", "hvac", "mini-splits", "Mini Split 18K BTU",
    2299, 4.6, 134,
    "https://images.unsplash.com/photo-1631545806609-35dab21f3cb4?w=500&h=500&fit=crop&q=80",
    "High-efficiency mini split heat pump with WiFi control and 22 SEER rating.",
    ["18000 BTU","22 SEER","WiFi control","Heat pump","Inverter compressor","Self-cleaning"],
    {"btu":"18000","seer":"22","voltage":"230V","refrigerant":"R410A","warranty":"7 years"}),
  p("chs-hvac-furn-96", "CHS-HVAC-FURN-96", "CHESS High Efficiency Gas Furnace 96%", "hvac", "furnaces", "Gas Furnace 96% AFUE",
    2899, 4.5, 89,
    "https://images.unsplash.com/photo-1631545806609-35dab21f3cb4?w=500&h=500&fit=crop&q=80",
    "Two-stage gas furnace with 96% AFUE efficiency and variable speed blower.",
    ["96% AFUE","Two-stage heating","Variable speed blower","80000 BTU","Stainless heat exchanger","Energy Star"],
    {"btu":"80000","afue":"96%","voltage":"120V","gasType":"Natural gas","warranty":"10 years"}),
  p("chs-hvac-hrv-200", "CHS-HVAC-HRV-200", "CHESS Heat Recovery Ventilator 200 CFM", "hvac", "ventilation", "Heat Recovery Ventilator",
    1599, 4.4, 67,
    "https://images.unsplash.com/photo-1631545806609-35dab21f3cb4?w=500&h=500&fit=crop&q=80",
    "Energy-efficient HRV with up to 84% heat recovery and MERV 13 filtration.",
    ["200 CFM","84% heat recovery","MERV 13 filter","Defrost control","Low noise","CSA certified"],
    {"cfm":"200","recovery":"84%","voltage":"120V","warranty":"5 years"}),
  p("chs-hvac-tank-50", "CHS-HVAC-TANK-50", "CHESS Tank Water Heater 50 Gallon", "hvac", "water-heaters", "Tank Water Heater 50 Gal",
    1299, 4.5, 198,
    "https://images.unsplash.com/photo-1631545806609-35dab21f3cb4?w=500&h=500&fit=crop&q=80",
    "High-recovery 50-gallon gas water heater with electronic ignition.",
    ["50 gallon","40000 BTU","Electronic ignition","Glass-lined tank","Brass drain valve","Energy Star"],
    {"capacity":"50 gal","btu":"40000","recovery":"43 GPH","voltage":"120V","warranty":"12 years"}),
  p("chs-el-panel-200a", "CHS-EL-PANEL-200A", "CHESS Main Breaker Panel 200A 40-Space", "electrical", "panels", "Main Breaker Panel 200A",
    399, 4.6, 234,
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&h=500&fit=crop&q=80",
    "Indoor main breaker panel with 200A capacity and 40 spaces for circuits.",
    ["200A main breaker","40 spaces","Copper bus bars","UL listed","NEMA 1 rated","Knockouts included"],
    {"amperage":"200A","spaces":"40","voltage":"120/240V","warranty":"10 years"}),
  p("chs-el-ev-charger", "CHS-EL-EV-CHARGER", "CHESS Level 2 EV Charger 48A", "electrical", "ev-charging", "Level 2 EV Charger",
    699, 4.7, 312,
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=500&h=500&fit=crop&q=80",
    "Smart Level 2 EV charger with WiFi, scheduling, and NEMA 14-50 plug.",
    ["48A / 11.5kW","WiFi enabled","Scheduling","NEMA 14-50","25ft cable","UL listed"],
    {"amperage":"48A","power":"11.5kW","cable":"25 ft","voltage":"240V","warranty":"3 years"}),
  p("chs-el-gen-22kw", "CHS-EL-GEN-22KW", "CHESS Standby Generator 22kW", "electrical", "generators", "Standby Generator 22kW",
    5999, 4.5, 56,
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&h=500&fit=crop&q=80",
    "Whole-house standby generator with automatic transfer switch and natural gas.",
    ["22kW output","Auto transfer switch","Natural gas/LP","Quiet operation","WiFi monitoring","5-year warranty"],
    {"power":"22kW","fuel":"Natural gas/LP","voltage":"240V","noise":"67 dB","warranty":"5 years"}),
  p("chs-el-solar-10kw", "CHS-EL-SOLAR-10KW", "CHESS Solar Panel Kit 10kW", "electrical", "solar", "Solar Panel Kit 10kW",
    14999, 4.6, 34,
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=500&fit=crop&q=80",
    "Complete 10kW solar panel system with microinverters and monitoring.",
    ["10kW system","25 x 400W panels","Microinverters","Monitoring system","25-year panel warranty","CEC listed"],
    {"power":"10kW","panels":"25 x 400W","inverter":"Microinverters","warranty":"25 years"}),
  p("chs-bm-floor-eng", "CHS-BM-FLOOR-ENG", "CHESS Engineered Hardwood White Oak", "building-materials", "flooring", "Engineered Hardwood",
    8.99, 4.6, 345,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Premium engineered white oak hardwood flooring with click-lock installation.",
    ["White oak veneer","Click-lock install","7.5 inch wide planks","Wire brushed finish","20 sq ft/box","25-year warranty"],
    {"width":"7.5\"","thickness":"1/2\"","length":"48\"","coverage":"20 sq ft/box","warranty":"25 years"}),
  p("chs-bm-tile-porcelain", "CHS-BM-TILE-PORC", "CHESS Porcelain Floor Tile 24x24", "building-materials", "tile", "Porcelain Floor Tile",
    5.49, 4.5, 456,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Large format porcelain tile with natural stone look and rectified edges.",
    ["24x24 inch","Rectified edges","Stone look","Frost resistant","PEI 5 rated","15.5 sq ft/box"],
    {"width":"24\"","length":"24\"","thickness":"3/8\"","coverage":"15.5 sq ft/box","warranty":"Lifetime"}),
  p("chs-bm-counter-quartz", "CHS-BM-COUNTER-QTZ", "CHESS Quartz Countertop Slab", "building-materials", "countertops", "Quartz Countertop Slab",
    75, 4.7, 189,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Premium quartz countertop slab with polished finish, price per square foot.",
    ["Polished finish","Non-porous","Stain resistant","Heat resistant","NSF certified","Lifetime warranty"],
    {"thickness":"3cm","finish":"Polished","priceUnit":"per sq ft","warranty":"Lifetime"}),
  p("chs-bm-insul-r24", "CHS-BM-INSUL-R24", "CHESS Mineral Wool Insulation R-24", "building-materials", "insulation", "Mineral Wool R-24",
    89, 4.4, 267,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Fire-resistant mineral wool batt insulation for 2x6 walls.",
    ["R-24 value","Fire resistant","Sound absorbing","Moisture resistant","No off-gassing","59.7 sq ft/bag"],
    {"rValue":"R-24","width":"15.25\"","thickness":"5.5\"","coverage":"59.7 sq ft/bag","warranty":"Lifetime"}),
  p("chs-bm-deck-comp", "CHS-BM-DECK-COMP", "CHESS Composite Decking Board 16ft", "building-materials", "decking", "Composite Decking Board",
    45, 4.5, 312,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Capped composite decking board with realistic wood grain and fade resistance.",
    ["Capped polymer","Wood grain texture","Fade resistant","Stain resistant","Hidden fastener compatible","25-year warranty"],
    {"width":"5.5\"","length":"16 ft","thickness":"1\"","warranty":"25 years"}),
  p("chs-out-grill-6b", "CHS-OUT-GRILL-6B", "CHESS 6-Burner Gas Grill with Rotisserie", "outdoor", "grills", "6-Burner Gas Grill",
    1999, 4.6, 167,
    "https://images.unsplash.com/photo-1529690840038-6e5b8d22e0f3?w=500&h=500&fit=crop&q=80",
    "Premium stainless steel 6-burner gas grill with rotisserie and side burner.",
    ["6 main burners","Rotisserie kit","Side burner","72000 BTU","Stainless steel","900 sq in cooking area"],
    {"burners":"6 + side","btu":"72000","cookingArea":"900 sq in","fuel":"Propane/NG","warranty":"10 years"}),
  p("chs-out-patio-7pc", "CHS-OUT-PATIO-7PC", "CHESS 7-Piece Patio Dining Set", "outdoor", "patio-furniture", "7-Piece Patio Set",
    2499, 4.5, 89,
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=500&h=500&fit=crop&q=80",
    "All-weather wicker 7-piece patio dining set with cushions and glass-top table.",
    ["7 pieces","All-weather wicker","Sunbrella cushions","Glass-top table","Rust-free aluminum","UV resistant"],
    {"tableSize":"72x42\"","chairs":"6","material":"Wicker + aluminum","warranty":"5 years"}),
  p("chs-out-pergola-12", "CHS-OUT-PERGOLA-12", "CHESS Aluminum Pergola 12x10 with Louvered Roof", "outdoor", "structures", "Louvered Pergola",
    4999, 4.7, 45,
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=500&h=500&fit=crop&q=80",
    "Motorized louvered roof pergola with integrated LED lighting and rain sensor.",
    ["Motorized louvers","Integrated LED","Rain sensor","Powder-coated aluminum","Remote control","Wind rated 90mph"],
    {"width":"12 ft","depth":"10 ft","height":"8 ft","material":"Aluminum","warranty":"15 years"}),
  p("chs-out-heater-46k", "CHS-OUT-HEATER-46K", "CHESS Patio Heater 46000 BTU", "outdoor", "heating", "Patio Heater",
    399, 4.4, 234,
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=500&h=500&fit=crop&q=80",
    "Commercial-grade patio heater with 46000 BTU output and safety tilt switch.",
    ["46000 BTU","Safety tilt switch","Wheels included","Stainless steel","18ft heat radius","CSA certified"],
    {"btu":"46000","fuel":"Propane","heatRadius":"18 ft","height":"87\"","warranty":"3 years"}),
  p("chs-com-ref-reach-2", "CHS-COM-REF-REACH-2", "CHESS Commercial Reach-In Refrigerator 2-Door", "commercial", "commercial-refrigeration", "Reach-In Refrigerator",
    3999, 4.6, 78,
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&q=80",
    "NSF certified 2-door commercial reach-in refrigerator with digital controls.",
    ["49 cu ft","2 solid doors","Digital controls","Self-closing doors","NSF certified","Energy Star"],
    {"capacity":"49 cu ft","voltage":"115V","refrigerant":"R290","warranty":"5 years"}),
  p("chs-com-ice-500", "CHS-COM-ICE-500", "CHESS Commercial Ice Machine 500 lb/day", "commercial", "commercial-cooking", "Commercial Ice Machine",
    4499, 4.5, 56,
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&q=80",
    "High-production ice machine producing 500 lbs of ice per day with storage bin.",
    ["500 lb/day","275 lb storage bin","Air cooled","Self-cleaning","NSF certified","Energy Star"],
    {"production":"500 lb/day","storage":"275 lb","voltage":"115V","warranty":"5 years"}),
  p("chs-com-sink-3comp", "CHS-COM-SINK-3COMP", "CHESS 3-Compartment Commercial Sink", "commercial", "commercial-plumbing", "3-Compartment Sink",
    1299, 4.4, 123,
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&q=80",
    "NSF certified 3-compartment stainless steel sink with drainboards.",
    ["3 compartments","Drainboards","18 gauge stainless","Faucet included","NSF certified","Adjustable legs"],
    {"width":"90\"","depth":"24\"","height":"43\"","bowlSize":"18x18x14\"","warranty":"5 years"}),
  p("chs-part-filter-fridge", "CHS-PART-FILTER-FR", "CHESS Refrigerator Water Filter 3-Pack", "parts", "filters", "Refrigerator Water Filter",
    59, 4.6, 567,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "OEM replacement water filter for CHESS refrigerators, 3-pack with 6-month life each.",
    ["3-pack","6-month life each","NSF 42/53 certified","Reduces chlorine","Easy twist install","Compatible with all CHESS fridges"],
    {"quantity":"3","lifespan":"6 months each","certification":"NSF 42/53","warranty":"1 year"}),
  p("chs-part-rack-dw", "CHS-PART-RACK-DW", "CHESS Dishwasher Upper Rack Assembly", "parts", "appliance-parts", "Dishwasher Rack Assembly",
    129, 4.3, 189,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "OEM replacement upper rack assembly with adjustable tines and rollers.",
    ["OEM replacement","Adjustable tines","Rollers included","Nylon coated","Universal fit CHESS models","Easy install"],
    {"compatibility":"All CHESS dishwashers","warranty":"1 year"}),
  p("chs-part-knob-range", "CHS-PART-KNOB-SET", "CHESS Range Control Knob Set of 5", "parts", "appliance-parts", "Range Control Knob Set",
    49, 4.5, 345,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Replacement stainless steel control knob set for CHESS ranges.",
    ["Set of 5","Stainless steel","Universal fit","Easy install","Heat resistant","OEM quality"],
    {"quantity":"5","material":"Stainless steel","compatibility":"All CHESS ranges","warranty":"1 year"}),
  p("chs-part-hose-wash", "CHS-PART-HOSE-WASH", "CHESS Washing Machine Hose Set", "parts", "appliance-parts", "Washer Hose Set",
    39, 4.7, 456,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "Braided stainless steel washing machine hoses with auto-shutoff connectors.",
    ["Set of 2","Braided stainless","Auto-shutoff","6 ft length","Burst proof","Universal fit"],
    {"quantity":"2","length":"6 ft","material":"Braided stainless","warranty":"10 years"}),
  p("chs-part-bulb-oven", "CHS-PART-BULB-OVEN", "CHESS Oven Light Bulb 2-Pack", "parts", "appliance-parts", "Oven Light Bulb",
    19, 4.4, 678,
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop&q=80",
    "High-temperature oven light bulbs rated for 500F, 2-pack.",
    ["2-pack","40W equivalent","500F rated","E26 base","Clear glass","Universal fit"],
    {"quantity":"2","wattage":"40W","maxTemp":"500F","base":"E26","warranty":"1 year"}),
];

// ═══════════════════════════════════════════════════════════════
// DYNAMIC COMPUTED CATEGORIES
// ═══════════════════════════════════════════════════════════════

export const categories: Category[] = categoryDefs.map((def) => {
  const catProducts = products.filter((p) => p.category === def.slug);
  return {
    ...def,
    productCount: catProducts.length,
    subcategoriesWithCounts: def.subcategories.map((sub) => ({
      ...sub,
      count: catProducts.filter((p) => p.subcategory === sub.slug).length,
    })),
  };
});

// ─── DYNAMIC HELPER FUNCTIONS ──────────────────────────────────

export function getProductsByCategory(slug: string): Product[] {
  if (slug === "all") return products;
  return products.filter((p) => p.category === slug);
}

export function getProductsBySubcategory(catSlug: string, subSlug: string): Product[] {
  return products.filter((p) => p.category === catSlug && p.subcategory === subSlug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  // One featured from each category (first product)
  const seen = new Set<string>();
  return products.filter((p) => {
    if (seen.has(p.category)) return false;
    seen.add(p.category);
    return true;
  }).slice(0, 10);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// ─── BUNDLE SYSTEMS ────────────────────────────────────────────

export const bundles = [
  {
    id: "bundle-kitchen-3pc",
    name: "Complete Kitchen Suite — 3 Piece",
    description: "French door refrigerator, gas range, and dishwasher in matching stainless steel.",
    products: ["chs-ref-fd-36-ss", "chs-rng-gs-30-ss", "chs-dw-bi-24-ss"],
    bundlePrice: 6499,
    get individualPrice() { return this.products.reduce((sum, id) => sum + (getProductById(id)?.price || 0), 0); },
    get savings() { return this.individualPrice - this.bundlePrice; },
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    id: "bundle-condo-pkg",
    name: "Full Condo Package",
    description: "Everything needed for a complete condo fit-out — appliances, lighting, and plumbing.",
    products: ["chs-ref-fd-36-ss", "chs-rng-gs-30-ss", "chs-dw-bi-24-ss", "chs-fct-kn-br", "chs-lgt-pnd-md-bk"],
    bundlePrice: 7299,
    get individualPrice() { return this.products.reduce((sum, id) => sum + (getProductById(id)?.price || 0), 0); },
    get savings() { return this.individualPrice - this.bundlePrice; },
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
  },
  {
    id: "bundle-hotel-room",
    name: "Hotel Room Package",
    description: "Standardized hotel room furnishing and fixture package for hospitality projects.",
    products: ["chs-bed-kng-wl", "chs-lgt-pnd-md-bk", "chs-fct-kn-br", "chs-com-hotel-bed-qn"],
    bundlePrice: 2999,
    get individualPrice() { return this.products.reduce((sum, id) => sum + (getProductById(id)?.price || 0), 0); },
    get savings() { return this.individualPrice - this.bundlePrice; },
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
  },
];

// ─── CART STORE ────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

let cartItems: CartItem[] = [];
let cartListeners: (() => void)[] = [];

export function getCart(): CartItem[] {
  return [...cartItems];
}

export function getCartCount(): number {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(): number {
  return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function addToCart(product: Product, quantity: number = 1) {
  const existing = cartItems.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartItems.push({ product, quantity });
  }
  notifyCartListeners();
}

export function removeFromCart(productId: string) {
  cartItems = cartItems.filter(item => item.product.id !== productId);
  notifyCartListeners();
}

export function updateCartQuantity(productId: string, quantity: number) {
  const item = cartItems.find(item => item.product.id === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      notifyCartListeners();
    }
  }
}

export function clearCart() {
  cartItems = [];
  notifyCartListeners();
}

export function subscribeToCart(listener: () => void) {
  cartListeners.push(listener);
  return () => {
    cartListeners = cartListeners.filter(l => l !== listener);
  };
}

function notifyCartListeners() {
  cartListeners.forEach(l => l());
}

// ─── WISHLIST STORE ────────────────────────────────────────────

let wishlistItems: string[] = [];
let wishlistListeners: (() => void)[] = [];

export function getWishlist(): string[] {
  return [...wishlistItems];
}

export function toggleWishlist(productId: string) {
  if (wishlistItems.includes(productId)) {
    wishlistItems = wishlistItems.filter(id => id !== productId);
  } else {
    wishlistItems.push(productId);
  }
  wishlistListeners.forEach(l => l());
}

export function isInWishlist(productId: string): boolean {
  return wishlistItems.includes(productId);
}

export function subscribeToWishlist(listener: () => void) {
  wishlistListeners.push(listener);
  return () => {
    wishlistListeners = wishlistListeners.filter(l => l !== listener);
  };
}

// ─── STATS ─────────────────────────────────────────────────────

export function getTotalProductCount(): number {
  return products.length;
}

export function getTotalCategoryCount(): number {
  return categories.length;
}

export function getDiscountedProducts(): Product[] {
  return products.filter(p => p.originalPrice !== undefined);
}

export function getProductsOnSale(): Product[] {
  return products.filter(p => p.originalPrice && p.originalPrice > p.price);
}

export function getProductsByPriceRange(min: number, max: number): Product[] {
  return products.filter(p => p.price >= min && p.price <= max);
}

export function getAvailableFinishes(categorySlug: string): string[] {
  const finishes = new Set<string>();
  getProductsByCategory(categorySlug).forEach(p => {
    if (p.finish) finishes.add(p.finish);
  });
  return Array.from(finishes).sort();
}

export function getAvailableColors(categorySlug: string): string[] {
  const colors = new Set<string>();
  getProductsByCategory(categorySlug).forEach(p => {
    if (p.color) colors.add(p.color);
  });
  return Array.from(colors).sort();
}

export function getSubcategoryProducts(categorySlug: string, subcategorySlug: string): Product[] {
  return products.filter(p => p.category === categorySlug && p.subcategory === subcategorySlug);
}
