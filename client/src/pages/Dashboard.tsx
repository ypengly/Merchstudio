import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Star, Trash2, Copy } from "lucide-react";
import Navbar from "@/components/Navbar";
import { api } from "@/services/api";
import type { Design } from "@/types";

type SortOption = "recent" | "name";

export default function Dashboard() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sort === "name") params.set("sort", "name");
      const data = await api.get<Design[]>(`/designs?${params.toString()}`);
      setDesigns(favoritesOnly ? data.filter((d) => d.isFavorite) : data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, favoritesOnly]);

  async function toggleFavorite(design: Design) {
    await api.put(`/designs/${design.id}`, { isFavorite: !design.isFavorite });
    load();
  }

  async function duplicate(design: Design) {
    const copy = await api.post<Design>(`/designs/${design.id}/duplicate`, {});
    navigate(`/editor/${copy.id}`);
  }

  async function remove(design: Design) {
    if (!confirm(`Delete "${design.name}"? This can't be undone.`)) return;
    await api.delete(`/designs/${design.id}`);
    load();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold">Your designs</h1>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-control bg-cobalt text-white font-medium hover:bg-cobalt-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> New design
          </Link>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-steel absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search designs"
              className="w-full pl-9 pr-3 py-2 rounded-control border border-line focus:border-cobalt outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-control border border-line px-3 py-2"
          >
            <option value="recent">Recently edited</option>
            <option value="name">Name</option>
          </select>
          <button
            onClick={() => setFavoritesOnly((v) => !v)}
            className={`px-4 py-2 rounded-control border font-medium transition-colors ${
              favoritesOnly ? "bg-signal-light border-signal text-signal" : "border-line hover:bg-panel"
            }`}
          >
            Favorites
          </button>
        </div>

        {isLoading ? (
          <p className="mt-10 text-steel">Loading your designs…</p>
        ) : designs.length === 0 ? (
          <div className="mt-16 text-center border border-dashed border-line rounded-card py-20">
            <p className="font-display text-xl font-semibold">Nothing here yet</p>
            <p className="mt-2 text-steel">Start your first design and it'll show up on this page.</p>
            <Link
              to="/products"
              className="mt-6 inline-block px-5 py-2.5 rounded-control bg-ink text-paper font-medium hover:bg-ink/90 transition-colors"
            >
              Choose a product
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {designs.map((design) => (
              <div key={design.id} className="group border border-line rounded-card overflow-hidden bg-paper hover:shadow-card transition-shadow">
                <button onClick={() => navigate(`/editor/${design.id}`)} className="block w-full text-left">
                  <div className="aspect-[4/3] bg-panel flex items-center justify-center">
                    {design.thumbnailUrl ? (
                      <img src={design.thumbnailUrl} alt={design.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-steel text-sm">{design.product?.name ?? "Design"}</span>
                    )}
                  </div>
                </button>
                <div className="p-4 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{design.name}</p>
                    <p className="text-xs text-steel">{design.product?.name}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleFavorite(design)} aria-label="Favorite" className="p-1.5 rounded-control hover:bg-panel">
                      <Star className={`w-4 h-4 ${design.isFavorite ? "fill-signal text-signal" : "text-steel"}`} />
                    </button>
                    <button onClick={() => duplicate(design)} aria-label="Duplicate" className="p-1.5 rounded-control hover:bg-panel">
                      <Copy className="w-4 h-4 text-steel" />
                    </button>
                    <button onClick={() => remove(design)} aria-label="Delete" className="p-1.5 rounded-control hover:bg-panel">
                      <Trash2 className="w-4 h-4 text-steel" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
