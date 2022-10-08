interface PropagationStoppable {
  stopPropagation(): void;
}

export function stopPropagation<E extends PropagationStoppable>(
  handler: (event: E) => unknown,
) {
  return (event) => {
    event.stopPropagation();
    return handler(event);
  };
}
