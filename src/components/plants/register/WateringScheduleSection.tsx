'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface WateringScheduleSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const frequencyOptions = [
  { value: 3, label: '3日に1回' },
  { value: 5, label: '5日に1回' },
  { value: 7, label: '1週間に1回' },
  { value: 10, label: '10日に1回' },
  { value: 14, label: '2週間に1回' },
];

export default function WateringScheduleSection({
  register,
  errors,
}: WateringScheduleSectionProps) {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 lg:text-xl">
        水やり設定
      </h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              水やりの頻度 *
            </label>
            <select
              {...register('watering_frequency_days', { valueAsNumber: true })}
              className={`w-full px-4 py-3 border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.watering_frequency_days
                  ? 'border-red-300'
                  : 'border-gray-200'
              }`}
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.watering_frequency_days && (
              <p className="mt-2 text-sm text-red-600">
                {errors.watering_frequency_days.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              初回水やり日
            </label>
            <input
              type="date"
              {...register('next_watering_date')}
              className={`w-full px-4 py-3 border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.next_watering_date ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.next_watering_date && (
              <p className="mt-2 text-sm text-red-600">
                {errors.next_watering_date.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
