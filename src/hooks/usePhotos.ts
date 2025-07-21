import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabase';
import { useAuthValidation } from './useAuthValidation';
import type { Database } from '@/lib/database.types';

type Photo = Database['public']['Tables']['photos']['Row'];
type NewPhoto = Database['public']['Tables']['photos']['Insert'];

interface CreatePhotoParams {
  plant_id: number;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
}

export function usePhotos(plantId?: number) {
  const { validateAuth } = useAuthValidation();
  const queryClient = useQueryClient();

  // 植物の写真一覧を取得
  const {
    data: photos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['photos', plantId],
    queryFn: async (): Promise<Photo[]> => {
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error || 'Authentication required');
      }

      let query = db.photos().select('*');

      if (plantId) {
        query = query.eq('plant_id', plantId);
      }

      const { data, error } = await query
        .eq('user_id', authResult.userId!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!plantId,
  });

  // 写真を作成
  const createPhoto = useMutation({
    mutationFn: async (params: CreatePhotoParams): Promise<Photo> => {
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error || 'Authentication required');
      }

      const newPhoto: NewPhoto = {
        user_id: authResult.userId!,
        plant_id: params.plant_id,
        observation_id: null,
        file_path: params.file_path,
        file_name: params.file_name,
        file_size: params.file_size,
        mime_type: params.mime_type,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .photos()
        .insert(newPhoto)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // 写真関連のクエリを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });

  // 写真を削除
  const deletePhoto = useMutation({
    mutationFn: async (photoId: number): Promise<void> => {
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error || 'Authentication required');
      }

      const { error } = await db
        .photos()
        .delete()
        .eq('id', photoId)
        .eq('user_id', authResult.userId!);

      if (error) throw error;
    },
    onSuccess: () => {
      // 写真関連のクエリを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });

  return {
    photos,
    isLoading,
    error,
    createPhoto,
    deletePhoto,
  };
}
