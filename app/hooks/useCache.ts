import { equals, head, pipe } from "ramda";
import { useCallback, useMemo, useState } from "react";
import { List } from "immutable";

type Cache = {
  value?: unknown;
  children?: List<[unknown, Cache]>;
};

const keyEq = (val: unknown) => pipe(head, equals(val));

function setPath<K extends readonly unknown[], T>(
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

function getPath<K extends readonly unknown[], T>(
  path: K,
  cache: Cache,
): T | undefined {
  if (path.length === 0) return cache.value as T | undefined;
  const child = cache.children?.find(keyEq(path[0]))?.[1];
  return child && getPath(path.slice(1), child);
}

function hasPath<K extends readonly unknown[]>(path: K, cache: Cache): boolean {
  if (path.length === 0) return "value" in cache;
  const child = cache.children?.find(keyEq(path[0]))?.[1];
  return !!child && hasPath(path.slice(1), child);
}

function deletePath<K extends readonly unknown[]>(
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

// deno-fmt-ignore
export function useCache() {
  const [cache, setCache] = useState({});
  const set = useCallback((path, value) => setCache((cache) => setPath(path, value, cache)), []);
  const del = useCallback((path) => setCache((cache) => deletePath(path, cache)), []);
  const get = useCallback((path) => getPath(path, cache), [cache]);
  const has = useCallback((path) => hasPath(path, cache), [cache]);
  return useMemo(() => ({ get, has, set, del }), [get, set, del, has]);
}
