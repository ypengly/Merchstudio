import { create } from "zustand";
import type { Design, DesignElement, ElementType, Product, ProductVariant } from "@/types";
import { api } from "@/services/api";

interface EditorState {
  design: Design | null;
  product: Product | null;
  variant: ProductVariant | null;
  elements: DesignElement[];
  selectedId: string | null;
  history: DesignElement[][];
  historyIndex: number;
  saveStatus: "idle" | "saving" | "saved";

  loadDesign: (designId: string) => Promise<void>;
  addElement: (type: ElementType, partial?: Partial<DesignElement>) => void;
  updateElement: (id: string, patch: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
  select: (id: string | null) => void;
  reorder: (id: string, direction: "front" | "back" | "up" | "down") => void;
  setVariant: (variant: ProductVariant) => void;
  undo: () => void;
  redo: () => void;
  save: () => Promise<void>;
}

let tempIdCounter = 0;
const tempId = () => `tmp-${Date.now()}-${tempIdCounter++}`;

function pushHistory(state: EditorState, elements: DesignElement[]) {
  const trimmed = state.history.slice(0, state.historyIndex + 1);
  trimmed.push(elements);
  return { history: trimmed, historyIndex: trimmed.length - 1 };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  design: null,
  product: null,
  variant: null,
  elements: [],
  selectedId: null,
  history: [],
  historyIndex: -1,
  saveStatus: "idle",

  loadDesign: async (designId) => {
    const design = await api.get<Design>(`/designs/${designId}`);
    const elements = design.elements ?? [];
    set({
      design,
      product: design.product ?? null,
      variant: design.variant ?? null,
      elements,
      selectedId: null,
      history: [elements],
      historyIndex: 0,
    });
  },

  addElement: (type, partial = {}) => {
    const state = get();
    const el: DesignElement = {
      id: tempId(),
      type,
      name: partial.name ?? (type === "TEXT" ? "Text layer" : "New layer"),
      zIndex: state.elements.length,
      isLocked: false,
      isHidden: false,
      x: 150,
      y: 150,
      width: type === "TEXT" ? 240 : 150,
      height: type === "TEXT" ? 60 : 150,
      rotation: 0,
      opacity: 1,
      props: type === "TEXT" ? { text: "Your text", fontFamily: "Inter", fontSize: 32, fill: "#1A1A18", align: "left" } : {},
      ...partial,
    };
    const elements = [...state.elements, el];
    set({ elements, selectedId: el.id, ...pushHistory(state, elements) });
  },

  updateElement: (id, patch) => {
    const state = get();
    const elements = state.elements.map((el) => (el.id === id ? { ...el, ...patch, props: { ...el.props, ...patch.props } } : el));
    set({ elements });
  },

  removeElement: (id) => {
    const state = get();
    const elements = state.elements.filter((el) => el.id !== id);
    set({ elements, selectedId: null, ...pushHistory(state, elements) });
  },

  select: (id) => set({ selectedId: id }),

  reorder: (id, direction) => {
    const state = get();
    const sorted = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((el) => el.id === id);
    if (idx === -1) return;

    if (direction === "front") sorted.push(sorted.splice(idx, 1)[0]);
    else if (direction === "back") sorted.unshift(sorted.splice(idx, 1)[0]);
    else if (direction === "up" && idx < sorted.length - 1) [sorted[idx], sorted[idx + 1]] = [sorted[idx + 1], sorted[idx]];
    else if (direction === "down" && idx > 0) [sorted[idx], sorted[idx - 1]] = [sorted[idx - 1], sorted[idx]];

    const elements = sorted.map((el, i) => ({ ...el, zIndex: i }));
    set({ elements, ...pushHistory(state, elements) });
  },

  setVariant: (variant) => set({ variant }),

  undo: () => {
    const state = get();
    if (state.historyIndex <= 0) return;
    const newIndex = state.historyIndex - 1;
    set({ elements: state.history[newIndex], historyIndex: newIndex });
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;
    const newIndex = state.historyIndex + 1;
    set({ elements: state.history[newIndex], historyIndex: newIndex });
  },

  save: async () => {
    const state = get();
    if (!state.design) return;
    set({ saveStatus: "saving" });
    try {
      await api.put(`/designs/${state.design.id}`, {
        elements: state.elements.map(({ id, ...rest }) => (id.startsWith("tmp-") ? rest : { id, ...rest })),
        variantId: state.variant?.id,
      });
      set({ saveStatus: "saved" });
    } catch {
      set({ saveStatus: "idle" });
    }
  },
}));
