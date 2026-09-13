import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Product, ProductCategory } from "@/types";

const CATEGORIES: ProductCategory[] = ["TSHIRT", "HOODIE", "SWEATSHIRT", "TOTE_BAG", "CAP", "MUG"];

export default function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("TSHIRT");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    try {
      const data = await api.get<Product[]>("/admin/products");
      setProducts(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createProduct() {
    setError(null);
    try {
      await api.post("/products", { name, category, designAreaWidth: 1000, designAreaHeight: 1200 });
      setName("");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create product");
    }
  }

  async function toggleEnabled(product: Product & { isEnabled?: boolean }) {
    await api.put(`/products/${product.id}`, { isEnabled: !(product.isEnabled ?? true) });
    load();
  }

  async function addVariant(product: Product) {
    const colorName = prompt("Color name (e.g. Forest Green)");
    if (!colorName) return;
    const colorHex = prompt("Hex value (e.g. #2F5DFF)", "#1A1A18") ?? "#1A1A18";
    const frontImage = prompt("Front mockup image URL", "/mockups/placeholder-front.png") ?? "";
    await api.post(`/products/${product.id}/variants`, { colorName, colorHex, frontImage });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Products</h2>
        <button onClick={() => setShowForm((v) => !v)} className="px-4 py-2 rounded-control bg-ink text-paper text-sm font-medium">
          {showForm ? "Cancel" : "Add product"}
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
            <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)} className="border border-line rounded-control px-3 py-2">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <button onClick={createProduct} disabled={!name} className="px-4 py-2 rounded-control bg-cobalt text-white text-sm font-medium disabled:opacity-50">
            Create
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-signal">{error}</p>}

      {isLoading ? (
        <p className="mt-6 text-steel text-sm">Loading…</p>
      ) : (
        <div className="mt-6 divide-y divide-line border border-line rounded-panel overflow-hidden">
          {products.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-steel">{p.category.replace("_", " ")} · {p.variants.length} color{p.variants.length === 1 ? "" : "s"}</p>
                <div className="mt-1 flex gap-1">
                  {p.variants.map((v) => (
                    <span key={v.id} className="w-3.5 h-3.5 rounded-full border border-line" style={{ backgroundColor: v.colorHex }} title={v.colorName} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => addVariant(p)} className="text-sm px-3 py-1.5 rounded-control border border-line hover:bg-panel">
                  Add color
                </button>
                <button onClick={() => toggleEnabled(p)} className="text-sm px-3 py-1.5 rounded-control border border-line hover:bg-panel">
                  {(p as any).isEnabled === false ? "Enable" : "Disable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
