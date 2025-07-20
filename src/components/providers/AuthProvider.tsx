'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { auth } from '@/lib/supabase';
import { userAtom, isLoadingAtom } from '@/store/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useSetAtom(userAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);

  useEffect(() => {
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setIsLoading]);

  return <>{children}</>;
}
