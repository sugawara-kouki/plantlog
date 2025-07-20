import { useAtom } from 'jotai';
import { userAtom } from '@/store/auth';
import { auth } from '@/lib/supabase';

/**
 * 認証状態の検証結果の型定義
 */
export interface AuthValidationResult {
  isValid: boolean;
  userId: string | null;
  error: string | null;
}

/**
 * 認証チェック用のカスタムフック
 * なぜこれが必要？→ 各クエリで同じ認証ロジックを重複させるのを防ぐため
 */
export function useAuthValidation() {
  const [user] = useAtom(userAtom);

  /**
   * 認証状態を検証する関数
   * @returns {Promise<AuthValidationResult>} 認証状態の検証結果
   */
  const validateAuth = async (): Promise<AuthValidationResult> => {
    try {
      // Step 1: ユーザー状態チェック
      if (!user?.id) {
        return {
          isValid: false,
          userId: null,
          error: '認証が必要です。ログインしてください。',
        };
      }

      // Step 2: Supabaseセッション確認
      const {
        data: { session },
        error: authError,
      } = await auth.getSession();

      if (authError || !session) {
        return {
          isValid: false,
          userId: null,
          error: '認証セッションが無効です。再ログインしてください。',
        };
      }

      // Step 3: セッション整合性チェック
      if (session.user.id !== user.id) {
        return {
          isValid: false,
          userId: null,
          error: 'ユーザー認証情報が一致しません。',
        };
      }

      // すべてOK
      return {
        isValid: true,
        userId: session.user.id,
        error: null,
      };
    } catch {
      return {
        isValid: false,
        userId: null,
        error: '認証チェック中にエラーが発生しました。',
      };
    }
  };

  return {
    user,
    validateAuth,
    isLoggedIn: !!user?.id,
  };
}
