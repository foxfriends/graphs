export function identity(segments: string[], ...interpolations: string[]) {
  return segments.reduce((str, segment, i) =>
    str + interpolations[i - 1] + segment
  );
}
