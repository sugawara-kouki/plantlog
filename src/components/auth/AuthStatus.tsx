'use client';

import { useAtom } from 'jotai';
import { userAtom, isLoadingAtom } from '@/store/auth';
import { auth } from '@/lib/supabase';

export function AuthStatus() {
  const [user] = useAtom(userAtom);
  const [isLoading] = useAtom(isLoadingAtom);

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">認証状態を確認中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">ログインしていません</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-800 font-medium">ログイン中</p>
          <p className="text-green-600 text-sm">メール: {user.email}</p>
          <p className="text-green-600 text-sm">ユーザーID: {user.id}</p>
          <p className="text-green-600 text-sm">
            最終ログイン:{' '}
            {user.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString('ja-JP')
              : '不明'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
