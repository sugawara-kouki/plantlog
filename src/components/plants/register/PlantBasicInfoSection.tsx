'use client';

import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import PlantTypeSelect from './PlantTypeSelect';
import { PlantFormData } from '@/types/PlantForm.types';

interface PlantBasicInfoSectionProps {
  register: UseFormRegister<PlantFormData>;
  errors: FieldErrors<PlantFormData>;
  setValue: UseFormSetValue<PlantFormData>;
  watch: UseFormWatch<PlantFormData>;
}

export default function PlantBasicInfoSection({
  register,
  errors,
  setValue,
  watch,
}: PlantBasicInfoSectionProps) {
  return (
    <div className="lg:col-span-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 lg:text-xl">
        基本情報
      </h2>

      <div className="space-y-6">
        {/* Plant Name */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            植物名 *
          </label>
          <input
            type="text"
            placeholder="例: モンステラ"
            {...register('name')}
            className={`w-full px-4 py-3 border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
              errors.name ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">
              {errors.name.message as string}
            </p>
          )}
        </div>

        {/* Plant Type */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            植物の種類 *
          </label>
          <PlantTypeSelect
            value={watch('plant_type_id')}
            onChange={value => setValue('plant_type_id', value)}
            error={errors.plant_type_id?.message as string}
          />
        </div>

        {/* Purchase Date */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            購入日 *
          </label>
          <input
            type="date"
            {...register('purchase_date')}
            className={`w-full px-4 py-3 border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
              errors.purchase_date ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.purchase_date && (
            <p className="mt-2 text-sm text-red-600">
              {errors.purchase_date.message as string}
            </p>
          )}
        </div>

        {/* Initial Height */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            現在の高さ（任意）
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              placeholder="15"
              {...register('initial_height_cm', { valueAsNumber: true })}
              className={`flex-1 px-4 py-3 border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.initial_height_cm ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            <span className="text-gray-500 font-medium">cm</span>
          </div>
          {errors.initial_height_cm && (
            <p className="mt-2 text-sm text-red-600">
              {errors.initial_height_cm.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
