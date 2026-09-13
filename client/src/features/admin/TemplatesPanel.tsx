import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Template } from "@/types";

const CATEGORIES = ["STREETWEAR", "BUSINESS", "EVENTS", "FASHION", "FUNNY_CASUAL"];

export default function TemplatesPanel() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isPremium, setIsPremium] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const data = await api.get<Template[]>("/admin/templates");
      setTemplates(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createTemplate() {
    await api.post("/templates", {
      name,
      category,
      isPremium,
      previewUrl: "/templates/placeholder.png",
      snapshot: { elements: [] },
    });
    setName("");
    setShowForm(false);
    load();
  }

  async function togglePremium(template: Template) {
    await api.put(`/templates/${template.id}`, { isPremium: !template.isPremium });
    load();
  }

  async function toggleEnabled(template: Template) {
    await api.put(`/templates/${template.id}`, { isEnabled: !(template.isEnabled ?? true) });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Templates</h2>
        <button onClick={() => setShowForm((v) => !v)} className="px-4 py-2 rounded-control bg-ink text-paper text-sm font-medium">
          {showForm ? "Cancel" : "Add template"}
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
                  {c.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm flex items-center gap-2 pb-2">
            <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
            Premium
          </label>
          <button onClick={createTemplate} disabled={!name} className="px-4 py-2 rounded-control bg-cobalt text-white text-sm font-medium disabled:opacity-50">
            Create
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="mt-6 text-steel text-sm">Loading…</p>
      ) : (
        <div className="mt-6 divide-y divide-line border border-line rounded-panel overflow-hidden">
          {templates.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-steel">{t.category.replace("_", " ")}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePremium(t)} className="text-sm px-3 py-1.5 rounded-control border border-line hover:bg-panel">
                  {t.isPremium ? "Premium" : "Free"}
                </button>
                <button onClick={() => toggleEnabled(t)} className="text-sm px-3 py-1.5 rounded-control border border-line hover:bg-panel">
                  {t.isEnabled === false ? "Enable" : "Disable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
