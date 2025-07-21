import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/supabase';
import { useAuthValidation } from './useAuthValidation';
import type { Database } from '@/lib/database.types';

type Plant = Database['public']['Tables']['plants']['Row'] & {
  plant_types?: Database['public']['Tables']['plant_types']['Row'] | null;
};

export function usePlantDetails(plantId: number) {
  const { validateAuth } = useAuthValidation();

  const {
    data: plant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: async (): Promise<Plant> => {
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error || 'Authentication required');
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
            care_difficulty,
            created_at
          )
        `
        )
        .eq('id', plantId)
        .eq('user_id', authResult.userId!)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Plant not found');

      return data;
    },
    enabled: !!plantId,
  });

  return {
    plant,
    isLoading,
    error,
  };
}
