'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePlant } from '@/hooks/usePlants';
import type { Database } from '@/lib/database.types';
import { PlantFormData } from '@/types/PlantForm.types';
import AppHeader from '@/components/layout/AppHeader';

type NewPlantInput = Omit<
  Database['public']['Tables']['plants']['Insert'],
  'user_id'
>;
import PhotoUploadSection from './PhotoUploadSection';
import PlantBasicInfoSection from './PlantBasicInfoSection';
import WateringScheduleSection from './WateringScheduleSection';
import NotesSection from './NotesSection';
import CareTipsSection from './CareTipsSection';
import SubmitButtonsSection from './SubmitButtonsSection';

const plantRegisterSchema = z.object({
  name: z.string().min(1, '植物名は必須です'),
  plant_type_id: z.number().min(1, '植物の種類を選択してください'),
  purchase_date: z.string().min(1, '購入日は必須です'),
  initial_height_cm: z.number().optional(),
  watering_frequency_days: z.number().min(1, '水やりの頻度を選択してください'),
  next_watering_date: z.string().optional(),
  notes: z.string().optional(),
  photo: z.any().optional(),
});

type PlantRegisterFormData = PlantFormData;

export default function PlantRegisterForm() {
  const router = useRouter();
  const createPlant = useCreatePlant();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PlantRegisterFormData>({
    resolver: zodResolver(plantRegisterSchema),
    defaultValues: {
      watering_frequency_days: 7,
    },
  });

  const onSubmit = async (data: PlantRegisterFormData) => {
    try {
      const submitData: NewPlantInput = {
        name: data.name,
        type_id: data.plant_type_id,
        purchase_date: data.purchase_date,
        height: data.initial_height_cm || null,
        watering_schedule: data.watering_frequency_days,
        next_watering_date: data.next_watering_date || null,
        memo: data.notes || null,
        current_status: '元気',
        created_at: new Date().toISOString(),
      };

      await createPlant.mutateAsync(submitData);

      router.push('/plants');
    } catch {
      // TODO: 今後はトースト表示などにする
    }
  };

  const handleRegister = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <div>
      <AppHeader
        variant="page"
        title="植物を登録"
        subtitle="新しい植物を家族に迎えましょう"
        showBackButton={true}
        showNavigation={false}
        showUserDropdown={false}
      />

      <form className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-12 lg:space-y-0">
        <PhotoUploadSection
          onChange={file => setValue('photo', file)}
          error={errors.photo?.message as string}
        />

        <PlantBasicInfoSection
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
        />

        <WateringScheduleSection register={register} errors={errors} />

        <NotesSection register={register} error={errors.notes?.message} />

        <CareTipsSection />

        <SubmitButtonsSection
          onRegister={handleRegister}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}
