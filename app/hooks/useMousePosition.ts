import { useState } from "react";
import { useEvent } from "./useEvent.ts";

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEvent(window, "mousemove", (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  });
  return mousePosition;
}
