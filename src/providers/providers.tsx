'use client';

import { QueryProvider } from './query-provider';
import { JotaiProvider } from './jotai-provider';
import { AuthProvider } from '@/components/providers/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <AuthProvider>
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </JotaiProvider>
  );
}
