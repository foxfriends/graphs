export function currentTarget<E extends Event>(
  handler: (event: E) => unknown,
) {
  return (event) => {
    if (event.currentTarget === event.target) {
      return handler(event);
    }
  };
}
