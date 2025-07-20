'use client';

import { UseFormRegister } from 'react-hook-form';

interface NotesSectionProps {
  register: UseFormRegister<any>;
  error?: string;
}

export default function NotesSection({ register, error }: NotesSectionProps) {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 lg:text-xl">
        メモ・特記事項
      </h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
        <textarea
          placeholder="植物の特徴、購入した理由、注意点など..."
          rows={4}
          {...register('notes')}
          className={`w-full px-4 py-3 border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all ${
            error ? 'border-red-300' : 'border-gray-200'
          }`}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
