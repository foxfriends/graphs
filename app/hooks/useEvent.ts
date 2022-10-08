import { useEffect } from "react";

type EventTargetEmitter = Pick<
  EventTarget,
  "addEventListener" | "removeEventListener"
>;

export function useEvent(
  eventTarget: EventTargetEmitter | undefined,
  event: string,
  callback: EventListenerOrEventListenerObject | undefined,
) {
  useEffect(() => {
    if (callback) {
      eventTarget?.addEventListener(event, callback);
      return () => eventTarget?.removeEventListener(event, callback);
    }
  }, [eventTarget, callback, event]);
}
