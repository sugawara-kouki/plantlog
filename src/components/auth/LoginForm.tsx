'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { auth } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { RiGoogleFill, RiGithubFill } from '@remixicon/react';

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
          <RiGoogleFill className="w-5 h-5 text-blue-500" />
          <span className="text-gray-700 font-medium">Googleでログイン</span>
        </button>

        <button
          onClick={handleGitHubLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RiGithubFill className="w-5 h-5 text-gray-900" />
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
