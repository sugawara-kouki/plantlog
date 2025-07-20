import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/auth';

/**
 * 認証状態変更時のキャッシュクリア
 *
 * ユーザーログイン・ログアウト時に全てのユーザー固有データのキャッシュをクリアする
 * これにより、前のユーザーのデータが次のユーザーに表示されることを防ぐ
 */
export function useAuthCache() {
  const [user] = useAtom(userAtom);
  const queryClient = useQueryClient();

  useEffect(() => {
    // ユーザー状態が変更された時（ログイン・ログアウト・ユーザー切り替え）
    // 全てのユーザー関連キャッシュをクリア
    queryClient.invalidateQueries({
      predicate: query => {
        const queryKey = query.queryKey;
        // ユーザー固有データのキャッシュをクリア
        return (
          queryKey.includes('plants') ||
          queryKey.includes('observations') ||
          queryKey.includes('watering') ||
          queryKey.includes('photos') ||
          queryKey.includes('user-profile')
        );
      },
    });

    // さらに確実にするため、全キャッシュをクリア
    if (user?.id) {
      // 新しいユーザーでログインした場合は全キャッシュクリア
      queryClient.clear();
    }
  }, [user?.id, queryClient]);
}
