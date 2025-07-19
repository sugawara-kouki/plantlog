'use client';

import { QueryProvider } from './query-provider';
import { JotaiProvider } from './jotai-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <QueryProvider>{children}</QueryProvider>
    </JotaiProvider>
  );
}
