import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

// 型定義
type Plant = Database['public']['Tables']['plants']['Row']
type NewPlant = Database['public']['Tables']['plants']['Insert']
type UpdatePlant = Database['public']['Tables']['plants']['Update']

// クエリキー定数
export const PLANTS_QUERY_KEY = ['plants'] as const

// 植物一覧取得
export function usePlants() {
  return useQuery({
    queryKey: PLANTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await db.plants()
        .select(`
          *,
          plant_types (
            id,
            name,
            scientific_name,
            care_difficulty
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

// 特定の植物取得
export function usePlant(plantId: number) {
  return useQuery({
    queryKey: ['plants', plantId] as const,
    queryFn: async () => {
      const { data, error } = await db.plants()
        .select(`
          *,
          plant_types (
            id,
            name,
            scientific_name,
            care_difficulty
          )
        `)
        .eq('id', plantId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!plantId, // plantIdがある時のみ実行
  })
}

// 植物作成
export function useCreatePlant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newPlant: NewPlant) => {
      const { data, error } = await db.plants()
        .insert(newPlant)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // 植物一覧を無効化してリフレッシュ
      queryClient.invalidateQueries({ queryKey: PLANTS_QUERY_KEY })
    },
  })
}

// 植物更新
export function useUpdatePlant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdatePlant & { id: number }) => {
      const { data, error } = await db.plants()
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (updatedPlant) => {
      // 関連するクエリを無効化
      queryClient.invalidateQueries({ queryKey: PLANTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['plants', updatedPlant.id] })
    },
  })
}

// 植物削除
export function useDeletePlant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (plantId: number) => {
      const { error } = await db.plants()
        .delete()
        .eq('id', plantId)

      if (error) throw error
    },
    onSuccess: () => {
      // 植物一覧を無効化してリフレッシュ
      queryClient.invalidateQueries({ queryKey: PLANTS_QUERY_KEY })
    },
  })
}