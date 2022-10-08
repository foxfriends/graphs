import { useEffect } from "react";

export function useResize(
  element: HTMLElement | undefined | null,
  callback: ResizeObserverCallback,
) {
  useEffect(() => {
    if (element) {
      const observer = new ResizeObserver(callback);
      observer.observe(element);
      return () => observer.unobserve(element);
    }
  }, [element, callback]);
}
