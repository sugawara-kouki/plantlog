'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePlant } from '@/hooks/usePlants';
import { usePhotos } from '@/hooks/usePhotos';
import type { Database } from '@/lib/database.types';
import AppHeader from '@/components/layout/AppHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';

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
  photo: z
    .object({
      file: z.instanceof(File),
      url: z.string(),
      path: z.string(),
    })
    .optional(),
});

type PlantRegisterFormData = z.infer<typeof plantRegisterSchema>;

export default function PlantRegisterForm() {
  const router = useRouter();
  const createPlant = useCreatePlant();
  const { createPhoto } = usePhotos();

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

      // 植物を作成し、作成されたplant_idを取得
      const createdPlant = await createPlant.mutateAsync(submitData);

      // 画像がアップロードされている場合、photosテーブルに登録
      if (data.photo && createdPlant) {
        await createPhoto.mutateAsync({
          plant_id: createdPlant.id,
          file_path: data.photo.path,
          file_name: data.photo.file.name,
          file_size: data.photo.file.size,
          mime_type: data.photo.file.type,
        });
      }

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
      />

      {/* メインコンテンツ */}
      <main className="max-w-sm mx-auto px-4 py-6 lg:max-w-6xl lg:px-8 lg:py-8">
        <form className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-12 lg:space-y-0">
          <PhotoUploadSection
            onChange={uploadResult => setValue('photo', uploadResult)}
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
      </main>

      <BottomNavigation />
    </div>
  );
}
