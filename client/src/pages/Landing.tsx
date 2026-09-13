import { Link } from "react-router-dom";
import { Shirt, Type, Image as ImageIcon, Layers, Palette, Download, Check } from "lucide-react";
import Navbar from "@/components/Navbar";

const PRODUCTS = [
  { name: "T-Shirt", note: "Front & back" },
  { name: "Hoodie", note: "Front & back" },
  { name: "Sweatshirt", note: "Front & back" },
  { name: "Tote Bag", note: "Single side" },
  { name: "Cap", note: "Front panel" },
  { name: "Mug", note: "Wraparound" },
];

const TEMPLATE_CATEGORIES = [
  { name: "Streetwear", swatch: "#1A1A18" },
  { name: "Business", swatch: "#2F5DFF" },
  { name: "Events", swatch: "#FF5A1F" },
  { name: "Fashion", swatch: "#6B6D76" },
  { name: "Funny & Casual", swatch: "#2B3A55" },
];

const STEPS = [
  { title: "Choose a product", body: "Start from a T-shirt, hoodie, tote, cap, or mug — pick your base color." },
  { title: "Customize it", body: "Add text, upload artwork, or drop in graphics. Drag, resize, and layer until it's right." },
  { title: "Export & share", body: "Save your design, export print-ready artwork, or send a link so others can see it." },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    features: ["3 saved designs", "Standard exports", "Basic products", "Core templates"],
  },
  {
    name: "Pro",
    price: "$7.99",
    highlighted: true,
    features: [
      "Unlimited designs",
      "High-resolution & transparent exports",
      "Full template & graphics library",
      "No MerchStudio branding",
      "Design history",
    ],
  },
  {
    name: "Business",
    price: "$19.99",
    features: ["Everything in Pro", "Shared team workspace", "Shared brand assets", "Commercial export options"],
  },
];

const FAQS = [
  { q: "Do I need design experience?", a: "No. The editor is built around dragging, typing, and choosing — templates give you a head start." },
  { q: "Can I use my own artwork?", a: "Yes. Upload PNG, JPG, WEBP, or SVG files and position them anywhere on the design area." },
  { q: "What happens to my free designs if I don't upgrade?", a: "They stay saved. You just won't be able to start new ones past the free limit until you free up space or upgrade." },
  { q: "Can I sell what I make?", a: "Business plans include commercial export options intended for resale and client work." },
];

function ShirtMockup() {
  return (
    <div className="relative">
      <svg viewBox="0 0 360 420" className="w-72 md:w-96 drop-shadow-xl">
        <path
          d="M120 20 L150 10 Q180 30 210 10 L240 20 L300 55 L275 105 L245 90 L245 400 Q180 415 115 400 L115 90 L85 105 L55 55 Z"
          fill="#FAFAF9"
          stroke="#1A1A18"
          strokeWidth="3"
        />
        <rect x="140" y="150" width="100" height="120" rx="4" fill="#2F5DFF" opacity="0.08" />
        <text x="190" y="200" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="28" fill="#1A1A18">
          MADE
        </text>
        <text x="190" y="230" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="28" fill="#FF5A1F">
          BY YOU
        </text>
      </svg>
      <div className="absolute -bottom-4 -left-6 bg-paper border border-line rounded-panel shadow-card px-4 py-3 rotate-[-4deg]">
        <p className="text-xs text-steel">Design area</p>
        <p className="font-display font-semibold">1000 × 1200 px</p>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            Design merch that actually looks like something.
          </h1>
          <p className="mt-6 text-lg text-steel max-w-md">
            Pick a shirt, hoodie, or tote. Add your text, art, or logo. See it on the product instantly, then export
            artwork you can print or hand off to a supplier.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-control bg-cobalt text-white font-medium hover:bg-cobalt-dark transition-colors"
            >
              Design your merch
            </Link>
            <a href="#how-it-works" className="px-6 py-3 rounded-control font-medium hover:bg-panel transition-colors">
              See how it works
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <ShirtMockup />
        </div>
      </section>

      {/* Supported products */}
      <section id="products" className="border-t border-line bg-panel/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold">Six products, one editor.</h2>
          <p className="mt-2 text-steel max-w-lg">Every product shares the same tools, so switching between them costs nothing.</p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRODUCTS.map((p) => (
              <div key={p.name} className="bg-paper border border-line rounded-panel p-6">
                <Shirt className="w-6 h-6 text-cobalt" strokeWidth={1.75} />
                <p className="mt-4 font-display font-semibold text-lg">{p.name}</p>
                <p className="text-sm text-steel">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold">Choose, customize, export.</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title} className="border-t-2 border-ink pt-4">
              <p className="font-display text-sm text-steel">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-display font-semibold text-xl">{step.title}</p>
              <p className="mt-2 text-steel">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-display text-3xl font-semibold">Built for people who aren't designers.</h2>
            <p className="mt-4 text-steel max-w-md">
              Fonts, colors, and layouts that already work together, so the thing you make looks intentional —
              not thrown together at the last minute.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Type, label: "Type presets" },
              { icon: ImageIcon, label: "Your own artwork" },
              { icon: Layers, label: "Real layer control" },
              { icon: Palette, label: "Saved brand colors" },
              { icon: Download, label: "Print-ready exports" },
              { icon: Shirt, label: "True-to-print preview" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-signal mt-0.5" strokeWidth={1.75} />
                <p className="font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="border-t border-line bg-panel/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold">Templates for every occasion.</h2>
          <div className="mt-10 flex flex-wrap gap-4">
            {TEMPLATE_CATEGORIES.map((t) => (
              <div key={t.name} className="bg-paper border border-line rounded-panel px-6 py-8 flex-1 min-w-[160px]">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: t.swatch }} />
                <p className="mt-4 font-display font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold">Simple pricing.</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-card p-8 border ${
                plan.highlighted ? "border-cobalt bg-cobalt-light" : "border-line bg-paper"
              }`}
            >
              <p className="font-display font-semibold text-xl">{plan.name}</p>
              <p className="mt-2">
                <span className="font-display text-4xl font-semibold">{plan.price}</span>
                {plan.price !== "$0" && <span className="text-steel">/month</span>}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-cobalt mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`mt-8 block text-center py-3 rounded-control font-medium transition-colors ${
                  plan.highlighted ? "bg-cobalt text-white hover:bg-cobalt-dark" : "bg-ink text-paper hover:bg-ink/90"
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold">Questions.</h2>
          <div className="mt-8 divide-y divide-line">
            {FAQS.map((f) => (
              <div key={f.q} className="py-6">
                <p className="font-display font-semibold">{f.q}</p>
                <p className="mt-2 text-steel">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display font-semibold">MerchStudio</p>
          <p className="text-sm text-steel">A simple, beautiful design studio for making merchandise.</p>
        </div>
      </footer>
    </div>
  );
}
