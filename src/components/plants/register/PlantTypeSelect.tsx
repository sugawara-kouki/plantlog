'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';

interface PlantType {
  id: number;
  name: string;
  scientific_name?: string | null;
  care_difficulty?: string | null;
}

interface PlantTypeSelectProps {
  value?: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function PlantTypeSelect({
  value,
  onChange,
  error,
}: PlantTypeSelectProps) {
  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlantTypes = async () => {
      try {
        const { data, error } = await db
          .plantTypes()
          .select('id, name, scientific_name, care_difficulty')
          .order('name');

        if (error) throw error;
        setPlantTypes(data || []);
      } catch (error) {
        console.error('植物種類の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantTypes();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
        <span className="text-gray-500">読み込み中...</span>
      </div>
    );
  }

  return (
    <div>
      <select
        value={value || ''}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full px-4 py-3 border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      >
        <option value="">選択してください</option>
        {plantTypes.map(type => (
          <option key={type.id} value={type.id}>
            {type.name}
            {type.scientific_name && ` (${type.scientific_name})`}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
