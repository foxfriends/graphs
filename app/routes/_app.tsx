import { type ReactNode, useRef } from "react";
import { QueryCacheProvider } from "~/hooks/useQuery.tsx";

export default function App({ children }: { children: ReactNode }) {
  return (
    <QueryCacheProvider>
      {children}
    </QueryCacheProvider>
  );
}
