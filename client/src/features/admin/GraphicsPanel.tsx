import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Graphic } from "@/types";

const CATEGORIES = [
  "STARS", "HEARTS", "ARROWS", "BADGES", "ABSTRACT", "SPORTS", "TRAVEL", "MUSIC", "FOOD", "ANIMALS", "DECORATIVE",
];

export default function GraphicsPanel() {
  const [graphics, setGraphics] = useState<Graphic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [assetUrl, setAssetUrl] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const data = await api.get<Graphic[]>("/admin/graphics");
      setGraphics(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createGraphic() {
    await api.post("/graphics", { name, category, assetUrl, isPremium });
    setName("");
    setAssetUrl("");
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Graphics</h2>
        <button onClick={() => setShowForm((v) => !v)} className="px-4 py-2 rounded-control bg-ink text-paper text-sm font-medium">
          {showForm ? "Cancel" : "Add graphic"}
        </button>
      </div>

      {showForm && (
        <div className="mt-4 border border-line rounded-panel p-4 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="block text-steel text-xs mb-1">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="border border-line rounded-control px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="block text-steel text-xs mb-1">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-line rounded-control px-3 py-2">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-steel text-xs mb-1">Asset URL (SVG/PNG)</span>
            <input value={assetUrl} onChange={(e) => setAssetUrl(e.target.value)} className="border border-line rounded-control px-3 py-2 w-56" />
          </label>
          <label className="text-sm flex items-center gap-2 pb-2">
            <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
            Premium
          </label>
          <button onClick={createGraphic} disabled={!name || !assetUrl} className="px-4 py-2 rounded-control bg-cobalt text-white text-sm font-medium disabled:opacity-50">
            Create
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="mt-6 text-steel text-sm">Loading…</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {graphics.map((g) => (
            <div key={g.id} className="border border-line rounded-panel p-4">
              <p className="font-medium text-sm truncate">{g.name}</p>
              <p className="text-xs text-steel">{g.category}{g.isPremium ? " · Premium" : ""}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
