import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useCache } from "./useCache.ts";

const QueryCacheContext = createContext({});

type Props = {
  children: ReactNode;
};

export function QueryCacheProvider({ children }: Props) {
  const cache = useCache();

  return (
    <QueryCacheContext.Provider value={cache}>
      {children}
    </QueryCacheContext.Provider>
  );
}

export type QueryResult<T, E> = {
  data?: T;
  error?: E;
  isLoading: boolean;
};

export function useQueryCache() {
  return useContext(QueryCacheContext);
}

export function useQuery<Params extends readonly unknown[], T, E = unknown>(
  query: (...params: Params) => T,
  params: Params,
): T | unknown {
  const cache = useQueryCache();

  useEffect(() => {
    void (async () => {
      if (cache.has([query, ...params])) {
        return;
      }

      try {
        cache.set([query, ...params], { isLoading: true });
        const data = await query(...params);
        cache.set([query, ...params], { data, isLoading: false });
      } catch (error: E) {
        cache.set([query, ...params], { error, isLoading: false });
      }
    })();
  }, [query, ...params]);

  return useMemo(() => cache.get([query, ...params]) ?? { isLoading: false }, [
    cache,
    query,
    ...params,
  ]);
}
