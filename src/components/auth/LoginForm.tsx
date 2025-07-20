'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { auth } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

const loginSchema = z.object({
  email: z.email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        throw signInError;
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof AuthError
          ? getAuthErrorMessage(err)
          : 'ログインに失敗しました';

      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      const errorMessage =
        err instanceof AuthError
          ? getAuthErrorMessage(err)
          : 'Googleログインに失敗しました';

      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      const errorMessage =
        err instanceof AuthError
          ? getAuthErrorMessage(err)
          : 'GitHubログインに失敗しました';

      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        ログイン
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-3 border placeholder:text-gray-300 text-gray-800 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            パスワード
          </label>
          <input
            {...register('password')}
            type="password"
            placeholder="パスワードを入力"
            className="w-full px-4 py-3 border placeholder:text-gray-300 text-gray-800 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="w-4 h-4 text-primary border-gray-300 rounded-sm focus:ring-primary"
              disabled={isLoading}
            />
            <span className="text-gray-600">ログイン状態を保持</span>
          </label>
          <a
            href="/auth/forgot-password"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            パスワードを忘れた場合
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">または</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285f4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34a853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#ea4335"
              d="M12 1C7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53 1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1z"
            />
          </svg>
          <span className="text-gray-700 font-medium">Googleでログイン</span>
        </button>

        <button
          onClick={handleGitHubLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5 text-gray-900"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="text-gray-700 font-medium">GitHubでログイン</span>
        </button>
      </div>
    </div>
  );
}

function getAuthErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'メールアドレスまたはパスワードが正しくありません';
    case 'Email not confirmed':
      return 'メールアドレスの確認が完了していません';
    case 'Too many requests':
      return 'リクエストが多すぎます。しばらく待ってから再度お試しください';
    default:
      return 'ログインに失敗しました。しばらく待ってから再度お試しください';
  }
}
