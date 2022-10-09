import { equals, head, pipe } from "ramda";
import { List } from "immutable";

type Cache = {
  value?: unknown;
  children?: List<[unknown, Cache]>;
};

const keyEq = (val: unknown) => pipe(head, equals(val));

export function setPath<K extends readonly unknown[], T>(
  path: K,
  value: T,
  cache: Cache,
): Cache {
  if (path.length === 0) return { ...cache, value };

  const children = cache.children ?? new List();
  const childIndex = children.findIndex(keyEq(path[0]));
  const child = childIndex === -1 ? {} : children.get(childIndex)[1];
  const updatedChild = setPath(path.slice(1), value, child);
  const updatedChildren = childIndex === -1
    ? children.push([path[0], updatedChild])
    : children.set(childIndex, [path[0], updatedChild]);
  return { ...cache, children: updatedChildren };
}

export function getPath<K extends readonly unknown[], T>(
  path: K,
  cache: Cache,
): T | undefined {
  if (path.length === 0) return cache.value as T | undefined;
  const child = cache.children?.find(keyEq(path[0]))?.[1];
  return child && getPath(path.slice(1), child);
}

export function hasPath<K extends readonly unknown[]>(
  path: K,
  cache: Cache,
): boolean {
  if (path.length === 0) return "value" in cache;
  const child = cache.children?.find(keyEq(path[0]))?.[1];
  return !!child && hasPath(path.slice(1), child);
}

export function deletePath<K extends readonly unknown[]>(
  path: K,
  cache: Cache,
): Cache {
  if (path.length === 0) return { children: cache.children };
  const childIndex = cache.children?.findIndex(keyEq(path[0])) ?? -1;
  if (childIndex === -1) return;
  const updatedChild = deletePath(path.slice(1), children.get(childIndex)[1]);
  const updatedChildren = cache.children.set(childIndex, [
    path[0],
    updatedChild,
  ]);
  return { ...cache, children: updatedChildren };
}
