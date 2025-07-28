'use client';

import { useState, useEffect } from 'react';
import { RiArrowDownSLine } from '@remixicon/react';
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
      } catch {
        // TODO: 今後はトースト表示などにする
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
      <div className="relative">
        <select
          value={value || ''}
          onChange={e => onChange(Number(e.target.value))}
          className={`w-full px-4 py-3 pr-10 border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none bg-white ${
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
        <RiArrowDownSLine 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
