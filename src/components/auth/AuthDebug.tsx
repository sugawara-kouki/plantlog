'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/supabase';
import { Session, AuthError } from '@supabase/supabase-js';

interface SessionInfo {
  session: Session | null;
  error: AuthError | null;
  event?: string;
}

export function AuthDebug() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [cookies, setCookies] = useState<string>('');

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await auth.getSession();
      setSessionInfo({ session, error });
    };

    checkSession();

    // クッキーを取得
    if (typeof window !== 'undefined') {
      setCookies(document.cookie);
    }

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      setSessionInfo({ session, error: null, event });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg mt-4">
      <h3 className="font-bold text-gray-800 mb-2">🔍 認証デバッグ情報</h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>セッション状態:</strong>
          <pre className="bg-white p-2 rounded mt-1 text-xs overflow-auto max-h-32">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>

        <div>
          <strong>ブラウザクッキー:</strong>
          <pre className="bg-white p-2 rounded mt-1 text-xs overflow-auto max-h-20">
            {cookies || 'クッキーなし'}
          </pre>
        </div>

        <div>
          <strong>Supabase URL:</strong>
          <code className="bg-white px-1 rounded">
            {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </code>
        </div>
      </div>

      <button
        onClick={() => {
          // デバッグ用の情報表示（開発環境でのみ有効）
          if (process.env.NODE_ENV === 'development') {
            alert(
              `Session: ${JSON.stringify(sessionInfo, null, 2)}\nCookies: ${cookies}`
            );
          }
        }}
        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
      >
        デバッグ情報確認
      </button>
    </div>
  );
}
