import { useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer, Group } from "react-konva";
import Konva from "konva";
import { useEditorStore } from "@/stores/editorStore";
import type { DesignElement } from "@/types";
import { useKonvaImage } from "@/hooks/useKonvaImage";

const STAGE_WIDTH = 640;
const STAGE_HEIGHT = 720;

function ImageNode({ el, ...rest }: { el: DesignElement; [key: string]: any }) {
  const image = useKonvaImage(el.props.src);
  return <KonvaImage image={image} {...rest} />;
}

function ElementNode({ el }: { el: DesignElement }) {
  const { select, updateElement } = useEditorStore();
  const shapeRef = useRef<Konva.Node>(null);

  const common = {
    id: el.id,
    x: el.x,
    y: el.y,
    width: el.width,
    height: el.height,
    rotation: el.rotation,
    opacity: el.opacity,
    draggable: !el.isLocked,
    onClick: () => select(el.id),
    onTap: () => select(el.id),
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => updateElement(el.id, { x: e.target.x(), y: e.target.y() }),
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target as Konva.Node;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
      updateElement(el.id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        width: Math.max(20, el.width * scaleX),
        height: Math.max(20, el.height * scaleY),
      });
    },
    ref: shapeRef as any,
  };

  if (el.isHidden) return null;

  if (el.type === "TEXT") {
    return (
      <Text
        {...common}
        text={el.props.text ?? "Text"}
        fontFamily={el.props.fontFamily ?? "Inter"}
        fontSize={el.props.fontSize ?? 32}
        fontStyle={el.props.italic ? "italic" : "normal"}
        fill={el.props.fill ?? "#1A1A18"}
        align={el.props.align ?? "left"}
        letterSpacing={el.props.letterSpacing ?? 0}
        lineHeight={el.props.lineHeight ?? 1.2}
      />
    );
  }

  if (el.type === "SHAPE") {
    return <Rect {...common} fill={el.props.fill ?? "#2F5DFF"} cornerRadius={el.props.rounded ? el.width / 2 : 0} />;
  }

  // IMAGE and GRAPHIC both render as images (graphics are just pre-made image assets)
  return <ImageNode el={el} {...common} />;
}

export default function Canvas() {
  const { elements, selectedId, select, variant, product } = useEditorStore();
  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!transformerRef.current || !layerRef.current) return;
    const node = selectedId ? layerRef.current.findOne(`#${selectedId}`) : null;
    transformerRef.current.nodes(node ? [node] : []);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, elements]);

  const areaWidth = product?.designAreaWidth ?? 500;
  const areaHeight = product?.designAreaHeight ?? 600;
  const scale = Math.min((STAGE_WIDTH - 80) / areaWidth, (STAGE_HEIGHT - 80) / areaHeight);
  const offsetX = (STAGE_WIDTH - areaWidth * scale) / 2;
  const offsetY = (STAGE_HEIGHT - areaHeight * scale) / 2;

  return (
    <div className="flex-1 flex items-center justify-center bg-panel">
      <div className="bg-paper rounded-card shadow-card border border-line">
        <Stage
          ref={stageRef}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) select(null);
          }}
        >
          <Layer>
            {/* Garment surface */}
            <Rect x={0} y={0} width={STAGE_WIDTH} height={STAGE_HEIGHT} fill={variant?.colorHex ?? "#FAFAF9"} />
            {/* Printable design area guide */}
            <Rect
              x={offsetX}
              y={offsetY}
              width={areaWidth * scale}
              height={areaHeight * scale}
              stroke="#E4E3DE"
              dash={[6, 6]}
              strokeWidth={1}
            />
          </Layer>
          <Layer ref={layerRef} x={offsetX} y={offsetY} scaleX={scale} scaleY={scale} clipWidth={areaWidth} clipHeight={areaHeight}>
            <Group>
              {[...elements]
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((el) => (
                  <ElementNode key={el.id} el={el} />
                ))}
            </Group>
            <Transformer ref={transformerRef} rotateEnabled boundBoxFunc={(_, box) => box} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
