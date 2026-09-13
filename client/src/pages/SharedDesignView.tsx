import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { DesignElement, Product, ProductVariant } from "@/types";

interface SharedPayload {
  name: string;
  product: Product;
  variant: ProductVariant | null;
  elements: DesignElement[];
}

export default function SharedDesignView() {
  const { token } = useParams();
  const [data, setData] = useState<SharedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/shared/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("This shared design is unavailable");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-steel">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-steel">Loading…</div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-line px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold">MerchStudio</Link>
        <span className="text-sm text-steel">Read-only preview</span>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">{data.name}</h1>
        <p className="mt-2 text-steel">{data.product?.name}{data.variant ? ` · ${data.variant.colorName}` : ""}</p>
        <div
          className="mt-8 mx-auto aspect-[4/5] max-w-sm rounded-card border border-line flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: data.variant?.colorHex ?? "#FAFAF9" }}
        >
          {data.elements
            .filter((el) => el.type === "TEXT" && !el.isHidden)
            .map((el) => (
              <span
                key={el.id}
                style={{
                  position: "absolute",
                  left: `${(el.x / (data.product?.designAreaWidth ?? 1000)) * 100}%`,
                  top: `${(el.y / (data.product?.designAreaHeight ?? 1200)) * 100}%`,
                  fontFamily: el.props.fontFamily,
                  color: el.props.fill,
                  fontSize: 16,
                }}
              >
                {el.props.text}
              </span>
            ))}
        </div>
      </main>
    </div>
  );
}
