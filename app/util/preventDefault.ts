interface DefaultPreventable {
  preventDefault(): void;
}

export function preventDefault<E extends DefaultPreventable>(
  handler: (event: E) => unknown,
) {
  return (event) => {
    event.preventDefault();
    return handler(event);
  };
}
