import { max, min } from "ramda";

export function minmax(values: number[]) {
  return [values.reduce(min), values.reduce(max)];
}
