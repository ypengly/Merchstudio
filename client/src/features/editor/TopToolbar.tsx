import { useState } from "react";
import { Link } from "react-router-dom";
import { Undo2, Redo2, Save, Download, Share2, ArrowLeft, Check } from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";
import { api } from "@/services/api";

export default function TopToolbar() {
  const { design, undo, redo, save, saveStatus, historyIndex, history } = useEditorStore();
  const [showExport, setShowExport] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  async function handleShare() {
    if (!design) return;
    const res = await api.post<{ url: string }>(`/designs/${design.id}/share`);
    setShareUrl(`${window.location.origin}${res.url}`);
  }

  return (
    <header className="h-14 border-b border-line bg-paper flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 rounded-control hover:bg-panel">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="font-display font-semibold">{design?.name ?? "Untitled design"}</span>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={undo} disabled={historyIndex <= 0} className="p-2 rounded-control hover:bg-panel disabled:opacity-40">
          <Undo2 className="w-4 h-4" />
        </button>
        <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-control hover:bg-panel disabled:opacity-40">
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-steel w-16 text-right">
          {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? (
            <span className="inline-flex items-center gap-1 text-cobalt">
              <Check className="w-3 h-3" /> Saved
            </span>
          ) : null}
        </span>
        <button onClick={save} className="px-3 py-1.5 rounded-control border border-line hover:bg-panel text-sm font-medium inline-flex items-center gap-1.5">
          <Save className="w-3.5 h-3.5" /> Save
        </button>
        <button onClick={handleShare} className="px-3 py-1.5 rounded-control border border-line hover:bg-panel text-sm font-medium inline-flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
        <button
          onClick={() => setShowExport(true)}
          className="px-3 py-1.5 rounded-control bg-ink text-paper hover:bg-ink/90 text-sm font-medium inline-flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {shareUrl && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50" onClick={() => setShareUrl(null)}>
          <div className="bg-paper rounded-card p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <p className="font-display font-semibold text-lg">Shareable link</p>
            <p className="mt-2 text-sm text-steel">Anyone with this link can view (not edit) this design.</p>
            <input readOnly value={shareUrl} className="mt-4 w-full border border-line rounded-control px-3 py-2 text-sm" onFocus={(e) => e.target.select()} />
            <button onClick={() => setShareUrl(null)} className="mt-4 w-full py-2 rounded-control bg-ink text-paper text-sm font-medium">
              Done
            </button>
          </div>
        </div>
      )}

      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </header>
  );
}

function ExportDialog({ onClose }: { onClose: () => void }) {
  const [format, setFormat] = useState<"PNG" | "JPG">("PNG");
  const [resolution, setResolution] = useState<"Standard" | "High Resolution">("Standard");
  const [background, setBackground] = useState<"Product" | "Transparent">("Product");

  function handleExport() {
    // Client-side export: pull the current stage out of the DOM and download it.
    const stage = document.querySelector("canvas");
    if (!stage) return;
    const link = document.createElement("a");
    link.download = `design.${format.toLowerCase()}`;
    link.href = (stage as HTMLCanvasElement).toDataURL(format === "PNG" ? "image/png" : "image/jpeg", resolution === "High Resolution" ? 1 : 0.8);
    link.click();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-paper rounded-card p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <p className="font-display font-semibold text-lg">Export design</p>

        <div className="mt-5">
          <p className="text-sm font-medium mb-2">Format</p>
          <div className="flex gap-2">
            {(["PNG", "JPG"] as const).map((f) => (
              <OptionButton key={f} active={format === f} onClick={() => setFormat(f)} label={f} />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Resolution</p>
          <div className="flex gap-2">
            {(["Standard", "High Resolution"] as const).map((r) => (
              <OptionButton key={r} active={resolution === r} onClick={() => setResolution(r)} label={r} />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Background</p>
          <div className="flex gap-2">
            {(["Product", "Transparent"] as const).map((b) => (
              <OptionButton key={b} active={background === b} onClick={() => setBackground(b)} label={b} />
            ))}
          </div>
        </div>

        <button onClick={handleExport} className="mt-6 w-full py-3 rounded-control bg-cobalt text-white font-medium hover:bg-cobalt-dark">
          Export
        </button>
      </div>
    </div>
  );
}

function OptionButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-control border text-sm font-medium ${active ? "border-cobalt bg-cobalt-light text-cobalt" : "border-line"}`}
    >
      {label}
    </button>
  );
}
