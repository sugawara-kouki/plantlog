'use client';

import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { isAuthenticatedAtom } from '@/store/auth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    router.push('/');
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            植物観察日記
          </h1>
          <p className="text-gray-600">あなたの植物の成長を記録しましょう</p>
        </div>

        <LoginForm onSuccess={handleLoginSuccess} />

        <div className="text-center">
          <p className="text-gray-600">
            アカウントをお持ちでない場合は
            <Link
              href="/signup"
              className="text-green-500 hover:text-green-600 transition-colors font-medium ml-1"
            >
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
