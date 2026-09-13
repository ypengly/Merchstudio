import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductsPanel from "@/features/admin/ProductsPanel";
import TemplatesPanel from "@/features/admin/TemplatesPanel";
import GraphicsPanel from "@/features/admin/GraphicsPanel";
import UsersPanel from "@/features/admin/UsersPanel";
import StatsPanel from "@/features/admin/StatsPanel";

type Tab = "stats" | "products" | "templates" | "graphics" | "users";

const TABS: { id: Tab; label: string }[] = [
  { id: "stats", label: "Statistics" },
  { id: "products", label: "Products" },
  { id: "templates", label: "Templates" },
  { id: "graphics", label: "Graphics" },
  { id: "users", label: "Users" },
];

export default function Admin() {
  const [tab, setTab] = useState<Tab>("stats");

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold">Admin</h1>
        <div className="mt-6 flex gap-1 border-b border-line">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.id ? "border-cobalt text-cobalt" : "border-transparent text-steel hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-8">
          {tab === "stats" && <StatsPanel />}
          {tab === "products" && <ProductsPanel />}
          {tab === "templates" && <TemplatesPanel />}
          {tab === "graphics" && <GraphicsPanel />}
          {tab === "users" && <UsersPanel />}
        </div>
      </div>
    </div>
  );
}
