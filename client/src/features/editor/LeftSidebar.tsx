import { useRef, useState } from "react";
import { Type, Upload, Shapes, Sparkles, LayoutTemplate, Palette } from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";
import { api } from "@/services/api";
import type { ProductVariant } from "@/types";

type Tab = "templates" | "text" | "uploads" | "graphics" | "shapes" | "background";

const TABS: { id: Tab; label: string; icon: typeof Type }[] = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "text", label: "Text", icon: Type },
  { id: "uploads", label: "Uploads", icon: Upload },
  { id: "graphics", label: "Graphics", icon: Sparkles },
  { id: "shapes", label: "Shapes", icon: Shapes },
  { id: "background", label: "Color", icon: Palette },
];

const TEXT_PRESETS = [
  { name: "Bold", fontFamily: "Space Grotesk", fontSize: 48, fontWeight: "700" },
  { name: "Minimal", fontFamily: "Inter", fontSize: 28, letterSpacing: 1 },
  { name: "Streetwear", fontFamily: "Space Grotesk", fontSize: 56, fontWeight: "700", letterSpacing: -1 },
  { name: "Modern", fontFamily: "Inter", fontSize: 34, fontWeight: "600" },
];

export default function LeftSidebar() {
  const [tab, setTab] = useState<Tab>("text");
  const { addElement, product, variant, setVariant } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelected(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const upload = await api.upload<{ url: string }>("/uploads", formData);
      addElement("IMAGE", { props: { src: upload.url }, width: 200, height: 200 });
    } finally {
      setUploading(false);
    }
  }

  return (
    <aside className="w-64 border-r border-line bg-paper flex flex-col">
      <div className="grid grid-cols-3 gap-1 p-2 border-b border-line">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center gap-1 py-2 rounded-control text-[11px] font-medium transition-colors ${
              tab === id ? "bg-cobalt-light text-cobalt" : "text-steel hover:bg-panel"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "text" && (
          <div>
            <button
              onClick={() => addElement("TEXT")}
              className="w-full py-3 rounded-control border border-line hover:bg-panel font-medium mb-4"
            >
              Add a text box
            </button>
            <p className="text-xs font-medium text-steel mb-2">Presets</p>
            <div className="space-y-2">
              {TEXT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() =>
                    addElement("TEXT", {
                      props: { text: preset.name, fontFamily: preset.fontFamily, fontSize: preset.fontSize, fill: "#1A1A18" },
                    })
                  }
                  className="w-full text-left px-3 py-2.5 rounded-control border border-line hover:bg-panel"
                  style={{ fontFamily: preset.fontFamily }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "uploads" && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-8 rounded-control border-2 border-dashed border-line hover:bg-panel text-sm text-steel"
            >
              {uploading ? "Uploading…" : "Click to upload an image"}
            </button>
            <p className="mt-2 text-xs text-steel">PNG, JPG, WEBP, or SVG.</p>
          </div>
        )}

        {tab === "shapes" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => addElement("SHAPE", { props: { fill: "#2F5DFF" } })}
              className="aspect-square rounded-control border border-line hover:bg-panel flex items-center justify-center"
            >
              <div className="w-10 h-10 bg-cobalt" />
            </button>
            <button
              onClick={() => addElement("SHAPE", { props: { fill: "#FF5A1F", rounded: true } })}
              className="aspect-square rounded-control border border-line hover:bg-panel flex items-center justify-center"
            >
              <div className="w-10 h-10 rounded-full bg-signal" />
            </button>
          </div>
        )}

        {tab === "graphics" && (
          <p className="text-sm text-steel">
            Graphics load from the shared library — browse categories like stars, badges, and decorative marks once
            your admin has added assets.
          </p>
        )}

        {tab === "templates" && (
          <p className="text-sm text-steel">Starting from a blank canvas. Templates you pick during setup pre-fill this design.</p>
        )}

        {tab === "background" && product && (
          <div>
            <p className="text-xs font-medium text-steel mb-2">Product color</p>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v: ProductVariant) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  className={`w-10 h-10 rounded-full border-2 ${variant?.id === v.id ? "border-cobalt" : "border-line"}`}
                  style={{ backgroundColor: v.colorHex }}
                  title={v.colorName}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
