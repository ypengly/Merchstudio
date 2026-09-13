import { Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown } from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";

export default function LayersPanel() {
  const { elements, selectedId, select, updateElement, reorder } = useEditorStore();
  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="text-xs font-medium text-steel uppercase tracking-wide mb-3">Layers</p>
      {sorted.length === 0 ? (
        <p className="text-sm text-steel">No layers yet — add text, an image, or a shape.</p>
      ) : (
        <ul className="space-y-1">
          {sorted.map((el) => (
            <li
              key={el.id}
              onClick={() => select(el.id)}
              className={`flex items-center gap-2 px-2 py-2 rounded-control cursor-pointer text-sm ${
                selectedId === el.id ? "bg-cobalt-light text-cobalt" : "hover:bg-panel"
              }`}
            >
              <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { isHidden: !el.isHidden }); }} className="shrink-0">
                {el.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { isLocked: !el.isLocked }); }} className="shrink-0">
                {el.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
              <span className="flex-1 truncate">{el.type === "TEXT" ? el.props.text || "Text" : el.name}</span>
              <button onClick={(e) => { e.stopPropagation(); reorder(el.id, "up"); }} className="shrink-0">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); reorder(el.id, "down"); }} className="shrink-0">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
