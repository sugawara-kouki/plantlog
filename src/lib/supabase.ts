import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// 認証関連のヘルパー関数
export const auth = supabase.auth;

// 型安全なテーブルアクセス
export const db = {
  plants: () => supabase.from('plants'),
  plantTypes: () => supabase.from('plant_types'),
  observationRecords: () => supabase.from('observation_records'),
  wateringRecords: () => supabase.from('watering_records'),
  photos: () => supabase.from('photos'),
  editHistory: () => supabase.from('edit_history'),
};

// ストレージ
export const storage = supabase.storage;
