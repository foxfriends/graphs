import { type ReactNode, useEffect, useState } from "react";
import { add, mergeWith, subtract } from "ramda";
import { useEvent } from "~/hooks/useEvent.ts";
import { useMousePosition } from "~/hooks/useMousePosition.ts";
import { currentTarget } from "~/util/currentTarget.ts";
import { stopPropagation } from "~/util/stopPropagation.ts";

type Props = {
  children: ReactNode;
};

const addPos = mergeWith(add);
const subPos = mergeWith(subtract);

export default function Movable({ children }: Props) {
  const [panStartPosition, setPanStartPosition] = useState(null);
  const [resizeStartPosition, setResizeStartPosition] = useState(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const [size, setSize] = useState({ x: 500, y: 500 });
  const mousePosition = useMousePosition();

  const startPanning = () => setPanStartPosition(mousePosition);
  const startResizing = () => setResizeStartPosition(mousePosition);

  const totalTranslate = panStartPosition
    ? addPos(translate, subPos(mousePosition, panStartPosition))
    : translate;

  const { x: width, y: height } = resizeStartPosition
    ? addPos(size, subPos(mousePosition, resizeStartPosition))
    : size;

  const stop = () => {
    if (panStartPosition) {
      setTranslate(addPos(subPos(mousePosition, panStartPosition)));
      setPanStartPosition(null);
    }
    if (resizeStartPosition) {
      setSize(addPos(subPos(mousePosition, resizeStartPosition)));
      setResizeStartPosition(null);
    }
  };
  useEvent(window, "mouseup", stop);

  const transform = `translate(${totalTranslate.x}px, ${totalTranslate.y}px)`;

  return (
    <div
      className="movable-canvas"
      onMouseDown={startPanning}
    >
      <div className="movable" style={{ transform }}>
        <div style={{ width, height }}>
          {children}
        </div>
        <div
          className="movable-handle"
          onMouseDown={currentTarget(stopPropagation(startResizing))}
        />
      </div>
    </div>
  );
}
