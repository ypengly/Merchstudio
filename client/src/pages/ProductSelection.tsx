import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { api } from "@/services/api";
import type { Design, Product, ProductVariant } from "@/types";

export default function ProductSelection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Product[]>("/products").then((data) => {
      setProducts(data);
      if (data[0]) {
        setSelected(data[0]);
        setVariant(data[0].variants[0] ?? null);
      }
    });
  }, []);

  function choose(product: Product) {
    setSelected(product);
    setVariant(product.variants[0] ?? null);
  }

  async function startDesigning() {
    if (!selected) return;
    setIsCreating(true);
    setError(null);
    try {
      const design = await api.post<Design>("/designs", {
        name: `${selected.name} design`,
        productId: selected.id,
        variantId: variant?.id,
      });
      navigate(`/editor/${design.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start a new design");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold">Choose a product</h1>
        <p className="mt-2 text-steel">Pick what you're designing for — you can switch products later.</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => choose(product)}
              className={`text-left border rounded-card p-5 transition-colors ${
                selected?.id === product.id ? "border-cobalt bg-cobalt-light" : "border-line hover:bg-panel"
              }`}
            >
              <div className="aspect-square bg-panel rounded-panel flex items-center justify-center mb-4">
                <span className="text-steel text-sm">Preview</span>
              </div>
              <p className="font-display font-semibold">{product.name}</p>
              <div className="mt-2 flex gap-1.5">
                {product.variants.map((v) => (
                  <span key={v.id} className="w-4 h-4 rounded-full border border-line" style={{ backgroundColor: v.colorHex }} />
                ))}
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-10 border-t border-line pt-8">
            <p className="font-medium">Color</p>
            <div className="mt-3 flex gap-3">
              {selected.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  className={`w-9 h-9 rounded-full border-2 ${variant?.id === v.id ? "border-cobalt" : "border-line"}`}
                  style={{ backgroundColor: v.colorHex }}
                  aria-label={v.colorName}
                  title={v.colorName}
                />
              ))}
            </div>

            {error && <p className="mt-4 text-sm text-signal">{error}</p>}

            <button
              onClick={startDesigning}
              disabled={isCreating}
              className="mt-8 px-6 py-3 rounded-control bg-cobalt text-white font-medium hover:bg-cobalt-dark transition-colors disabled:opacity-60"
            >
              {isCreating ? "Setting up…" : `Start designing this ${selected.name}`}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
