'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { userAtom, isLoadingAtom } from '@/store/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useSetAtom(userAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);

      // ログアウト時の処理
      if (event === 'SIGNED_OUT') {
        // ログイン画面以外にいる場合はログイン画面にリダイレクト
        // replaceを使用してブラウザ履歴をリプレースし、戻るボタンで認証ページに戻れないようにする
        if (pathname !== '/login' && pathname !== '/signup') {
          router.replace('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setIsLoading, router, pathname]);

  return <>{children}</>;
}
