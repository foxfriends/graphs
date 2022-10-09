import { useCallback, useMemo, useState } from "react";
import { deletePath, getPath, hasPath, setPath } from "~/util/cache.ts";

// deno-fmt-ignore
export function useCache() {
  const [cache, setCache] = useState({});
  const set = useCallback((path, value) => setCache((cache) => setPath(path, value, cache)), []);
  const del = useCallback((path) => setCache((cache) => deletePath(path, cache)), []);
  const get = useCallback((path) => getPath(path, cache), [cache]);
  const has = useCallback((path) => hasPath(path, cache), [cache]);
  return useMemo(() => ({ get, has, set, del }), [get, set, del, has]);
}
