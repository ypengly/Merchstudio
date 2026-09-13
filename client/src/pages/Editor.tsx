import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEditorStore } from "@/stores/editorStore";
import TopToolbar from "@/features/editor/TopToolbar";
import LeftSidebar from "@/features/editor/LeftSidebar";
import Canvas from "@/features/editor/Canvas";
import RightSidebar from "@/features/editor/RightSidebar";

const AUTOSAVE_DELAY_MS = 1500;

export default function Editor() {
  const { designId } = useParams();
  const { loadDesign, elements, save, design } = useEditorStore();
  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (designId) loadDesign(designId);
  }, [designId, loadDesign]);

  // Debounced autosave whenever elements change after the initial load.
  useEffect(() => {
    if (!design) return;
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => save(), AUTOSAVE_DELAY_MS);
    return () => clearTimeout(autosaveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  if (!design) {
    return (
      <div className="h-screen flex items-center justify-center text-steel">
        Loading your design…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <TopToolbar />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </div>
    </div>
  );
}
