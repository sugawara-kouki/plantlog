import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/supabase';
// import type { Database } from '@/lib/database.types';

// 型定義
// type PlantType = Database['public']['Tables']['plant_types']['Row'];

// 植物種類一覧取得
export function usePlantTypes() {
  return useQuery({
    queryKey: ['plant-types'] as const,
    queryFn: async () => {
      const { data, error } = await db
        .plantTypes()
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 60 * 60 * 1000, // 1時間キャッシュ（マスターデータなので長め）
  });
}
