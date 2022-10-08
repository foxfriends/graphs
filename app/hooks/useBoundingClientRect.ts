import { useCallback, useEffect, useState } from "react";
import { useResize } from "./useResize.ts";
import { useEvent } from "./useEvent.ts";

export function useBoundingClientRect(
  element: HTMLElement | undefined | null,
): DOMRect | undefined {
  const [rect, setRect] = useState(element?.getBoundingClientRect());
  const resize = useCallback(
    () => setRect(element?.getBoundingClientRect()),
    [element],
  );
  useResize(element, resize);
  useEffect(resize, [resize]);
  useEvent(window, "resize", resize);
  return rect;
}
