'use client';

import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { isAuthenticatedAtom } from '@/store/auth';
import Link from 'next/link';
import { RiPlantFill } from '@remixicon/react';

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
            <RiPlantFill className="w-6 h-6 text-white lg:w-10 lg:h-10" />
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
