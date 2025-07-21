'use client';

import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { usePlants } from '@/hooks/usePlants';
import { usePlantTypes } from '@/hooks/usePlantTypes';
import { isAuthenticatedAtom, isLoadingAtom } from '@/store/auth';
import Home from '@/components/home/Home';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isAuthLoading] = useAtom(isLoadingAtom);

  const {
    data: plants,
    isLoading: plantsLoading,
    error: plantsError,
  } = usePlants();
  const { isLoading: typesLoading, error: typesError } = usePlantTypes();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading || plantsLoading || typesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            植物観察日記
          </h1>
          <p className="text-gray-600">データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (plantsError || typesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            エラーが発生しました
          </h1>
          <p className="text-gray-600">
            {plantsError?.message ||
              typesError?.message ||
              'データの取得に失敗しました'}
          </p>
        </div>
      </div>
    );
  }

  // Transform plants data for Home component
  const myPlants =
    plants?.map(plant => ({
      id: plant.id.toString(),
      name: plant.name,
      type: plant.plant_types?.name || '未設定',
      registeredDate: plant.purchase_date
        ? new Date(plant.purchase_date)
            .toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/\//g, '.')
        : '未設定',
      lastRecord: '3日前', // TODO: Calculate from actual data
      status:
        plant.current_status === '元気'
          ? ('healthy' as const)
          : plant.current_status === '心配' ||
              plant.current_status === '元気がない'
            ? ('attention_needed' as const)
            : ('healthy' as const),
      statusText: plant.current_status || '普通',
    })) || [];

  // Get plants that need watering today
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks =
    plants
      ?.filter(plant => plant.next_watering_date === today)
      .map(plant => ({
        id: plant.id.toString(),
        name: plant.name,
        type: plant.plant_types?.name || '未設定',
        registeredDate: plant.purchase_date
          ? new Date(plant.purchase_date)
              .toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/\//g, '.')
          : '未設定',
        lastRecord: '3日前',
        status: 'watering_due' as const,
        statusText: '水やり予定',
      })) || [];

  const statistics = {
    totalPlants: plants?.length || 0,
    monthlyRecords: 12, // TODO: Calculate from actual observation records
    wateringDue: todaysTasks.length,
  };

  // TODO: Get actual recent activity from database
  const recentActivity = [
    {
      id: '1',
      type: 'watering' as const,
      plantName: plants?.[0]?.name || 'サンセベリア',
      timeAgo: '1日前',
    },
    {
      id: '2',
      type: 'observation' as const,
      plantName: plants?.[1]?.name || 'ポトス',
      timeAgo: '2日前',
    },
  ];

  const handleAddRecord = () => {
    // TODO: Navigate to record entry page
  };

  const handleManageWatering = () => {
    // TODO: Navigate to watering management page
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCompleteTask = (_plantId: string) => {
    // TODO: Mark watering task as complete
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditPlant = (_plantId: string) => {
    // TODO: Navigate to plant edit page
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleWaterPlant = (_plantId: string) => {
    // TODO: Record watering
  };

  const handleViewPlantDetails = (plantId: string) => {
    router.push(`/plants/${plantId}`);
  };

  return (
    <Home
      myPlants={myPlants}
      todaysTasks={todaysTasks}
      statistics={statistics}
      recentActivity={recentActivity}
      onAddRecord={handleAddRecord}
      onManageWatering={handleManageWatering}
      onCompleteTask={handleCompleteTask}
      onEditPlant={handleEditPlant}
      onWaterPlant={handleWaterPlant}
      onViewPlantDetails={handleViewPlantDetails}
    />
  );
}
