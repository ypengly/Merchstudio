import { useEditorStore } from "@/stores/editorStore";
import LayersPanel from "@/features/editor/LayersPanel";

const FONTS = ["Inter", "Space Grotesk", "Georgia", "Courier New"];

export default function RightSidebar() {
  const { elements, selectedId, updateElement, removeElement } = useEditorStore();
  const el = elements.find((e) => e.id === selectedId);

  return (
    <aside className="w-72 border-l border-line bg-paper flex flex-col">
      <div className="p-4 border-b border-line">
        <p className="text-xs font-medium text-steel uppercase tracking-wide mb-3">Properties</p>
        {!el ? (
          <p className="text-sm text-steel">Select a layer on the canvas to edit it.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Field label="X">
                <input type="number" value={Math.round(el.x)} onChange={(e) => updateElement(el.id, { x: Number(e.target.value) })} className="input" />
              </Field>
              <Field label="Y">
                <input type="number" value={Math.round(el.y)} onChange={(e) => updateElement(el.id, { y: Number(e.target.value) })} className="input" />
              </Field>
              <Field label="Width">
                <input type="number" value={Math.round(el.width)} onChange={(e) => updateElement(el.id, { width: Number(e.target.value) })} className="input" />
              </Field>
              <Field label="Height">
                <input type="number" value={Math.round(el.height)} onChange={(e) => updateElement(el.id, { height: Number(e.target.value) })} className="input" />
              </Field>
              <Field label="Rotation">
                <input type="number" value={Math.round(el.rotation)} onChange={(e) => updateElement(el.id, { rotation: Number(e.target.value) })} className="input" />
              </Field>
              <Field label="Opacity">
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={el.opacity}
                  onChange={(e) => updateElement(el.id, { opacity: Number(e.target.value) })}
                  className="input"
                />
              </Field>
            </div>

            {el.type === "TEXT" && (
              <div className="space-y-3 pt-3 border-t border-line">
                <Field label="Text">
                  <textarea
                    value={el.props.text ?? ""}
                    onChange={(e) => updateElement(el.id, { props: { text: e.target.value } })}
                    className="input h-16 resize-none"
                  />
                </Field>
                <Field label="Font">
                  <select value={el.props.fontFamily ?? "Inter"} onChange={(e) => updateElement(el.id, { props: { fontFamily: e.target.value } })} className="input">
                    {FONTS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Size">
                    <input type="number" value={el.props.fontSize ?? 32} onChange={(e) => updateElement(el.id, { props: { fontSize: Number(e.target.value) } })} className="input" />
                  </Field>
                  <Field label="Color">
                    <input type="color" value={el.props.fill ?? "#1A1A18"} onChange={(e) => updateElement(el.id, { props: { fill: e.target.value } })} className="input h-9 p-1" />
                  </Field>
                </div>
                <Field label="Alignment">
                  <div className="flex gap-1">
                    {(["left", "center", "right"] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => updateElement(el.id, { props: { align } })}
                        className={`flex-1 py-1.5 text-xs rounded-control border ${
                          el.props.align === align ? "border-cobalt bg-cobalt-light text-cobalt" : "border-line"
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!el.props.italic} onChange={(e) => updateElement(el.id, { props: { italic: e.target.checked } })} />
                  Italic
                </label>
              </div>
            )}

            {el.type === "SHAPE" && (
              <Field label="Fill color">
                <input type="color" value={el.props.fill ?? "#2F5DFF"} onChange={(e) => updateElement(el.id, { props: { fill: e.target.value } })} className="input h-9 p-1" />
              </Field>
            )}

            <button onClick={() => removeElement(el.id)} className="w-full py-2 rounded-control border border-line text-signal hover:bg-signal-light text-sm font-medium">
              Delete layer
            </button>
          </div>
        )}
      </div>

      <LayersPanel />

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #E4E3DE;
          border-radius: 8px;
          padding: 0.375rem 0.5rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          border-color: #2F5DFF;
        }
      `}</style>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-steel">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
