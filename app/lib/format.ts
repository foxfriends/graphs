export function format<T>(
  segments: TemplateStringsArray,
  ...interpolations: (data: T) => string,
): (T) => string {
  return (data) => segments.reduce((str, segment, i) =>
    str + interpolations[i - 1](data) + segment
  );
}
