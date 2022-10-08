import { DependencyList, EffectCallback, useEffect, useRef } from "react";
import * as d3 from "d3";

export function useD3(effect: EffectCallback, deps?: DependencyList) {
  const ref = useRef();

  useEffect(() => {
    effect(d3.select(ref.current));
    return () => {};
  }, [...deps]);

  return ref;
}
