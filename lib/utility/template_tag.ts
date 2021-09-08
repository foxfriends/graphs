export function identity(
  segments: TemplateStringsArray,
  ...interpolations: string[]
): string {
  return segments.reduce((str, segment, i) =>
    str + interpolations[i - 1] + segment
  );
}
