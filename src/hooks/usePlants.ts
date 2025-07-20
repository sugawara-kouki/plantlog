import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import { useAuthValidation } from './useAuthValidation';

// 型定義
// type Plant = Database['public']['Tables']['plants']['Row'];
type NewPlant = Database['public']['Tables']['plants']['Insert'];
type UpdatePlant = Database['public']['Tables']['plants']['Update'];

// クエリキー定数（ユーザーIDを含める）
export const getPlantsQueryKey = (userId?: string) =>
  ['plants', userId] as const;
export const getPlantQueryKey = (plantId: number, userId?: string) =>
  ['plants', plantId, userId] as const;

// 植物一覧取得
export function usePlants() {
  const { user, validateAuth } = useAuthValidation();

  // ログイン中のユーザの登録した植物を取得する
  return useQuery({
    queryKey: getPlantsQueryKey(user?.id),
    queryFn: async () => {
      // 認証チェックを実行
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error!);
      }

      const { data, error } = await db
        .plants()
        .select(
          `
          *,
          plant_types (
            id,
            name,
            scientific_name,
            care_difficulty
          )
        `
        )
        .eq('user_id', authResult.userId!) // セッションのユーザーIDを使用
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    },
    enabled: !!user?.id, // ユーザーが認証されている場合のみクエリを実行
    retry: false, // 認証エラーの場合はリトライしない
  });
}

// 特定の植物取得
export function usePlant(plantId: number) {
  const { user, validateAuth } = useAuthValidation();

  return useQuery({
    queryKey: getPlantQueryKey(plantId, user?.id),
    queryFn: async () => {
      // 認証チェックを実行
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error!);
      }

      const { data, error } = await db
        .plants()
        .select(
          `
          *,
          plant_types (
            id,
            name,
            scientific_name,
            care_difficulty
          )
        `
        )
        .eq('id', plantId)
        .eq('user_id', authResult.userId!) // ユーザー所有の植物のみ取得
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!plantId && !!user?.id, // plantIdとユーザー認証の両方が必要
    retry: false,
  });
}

// 植物作成用の型（user_idを除外）
type NewPlantInput = Omit<NewPlant, 'user_id'>;

// 植物作成
export function useCreatePlant() {
  const queryClient = useQueryClient();
  const { validateAuth } = useAuthValidation();

  return useMutation({
    mutationFn: async (newPlant: NewPlantInput) => {
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error!);
      }

      // ユーザーIDを確実に設定
      const plantData: NewPlant = {
        ...newPlant,
        user_id: authResult.userId!, // セッションのユーザーIDを使用
      };

      const { data, error } = await db
        .plants()
        .insert(plantData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: data => {
      // より精密なキャッシュ無効化
      queryClient.invalidateQueries({
        queryKey: getPlantsQueryKey(data.user_id),
      });
    },
  });
}

// 植物更新
export function useUpdatePlant() {
  const queryClient = useQueryClient();
  const { validateAuth } = useAuthValidation();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdatePlant & { id: number }) => {
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error!);
      }

      const { data, error } = await db
        .plants()
        .update(updateData)
        .eq('id', id)
        .eq('user_id', authResult.userId!) // セキュリティ：自分の植物のみ更新
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: data => {
      // 特定ユーザーのキャッシュのみ無効化
      queryClient.invalidateQueries({
        queryKey: getPlantsQueryKey(data.user_id),
      });
      queryClient.invalidateQueries({
        queryKey: getPlantQueryKey(data.id, data.user_id),
      });
    },
  });
}

// 植物削除
export function useDeletePlant() {
  const queryClient = useQueryClient();
  const { validateAuth } = useAuthValidation();

  return useMutation({
    mutationFn: async (plantId: number) => {
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error!);
      }

      // セキュリティ：削除前に所有者確認
      const { data: plant, error: fetchError } = await db
        .plants()
        .select('user_id')
        .eq('id', plantId)
        .eq('user_id', authResult.userId!)
        .single();

      if (fetchError)
        throw new Error('植物が見つからないか、アクセス権限がありません。');

      const { error } = await db
        .plants()
        .delete()
        .eq('id', plantId)
        .eq('user_id', authResult.userId!);

      if (error) throw error;

      return { plantId, userId: plant.user_id };
    },
    onSuccess: ({ userId }) => {
      // 削除されたユーザーのキャッシュのみ無効化
      queryClient.invalidateQueries({
        queryKey: getPlantsQueryKey(userId),
      });
    },
  });
}
