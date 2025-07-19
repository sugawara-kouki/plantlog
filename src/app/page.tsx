'use client';

import { usePlants } from '@/hooks/usePlants';
import { usePlantTypes } from '@/hooks/usePlantTypes';
import Home from '@/components/Home';

export default function HomePage() {
  const {
    data: plants,
    isLoading: plantsLoading,
    error: plantsError,
  } = usePlants();
  const { isLoading: typesLoading, error: typesError } = usePlantTypes();

  if (plantsLoading || typesLoading) {
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
      id: plant.id,
      name: plant.name,
      type: plant.plant_types?.name || '未設定',
      registeredDate: new Date(plant.registered_date)
        .toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\//g, '.'),
      lastRecord: '3日前', // TODO: Calculate from actual data
      status: 'healthy' as const, // TODO: Calculate from actual data
      statusText: '元気',
    })) || [];

  // Get plants that need watering (mock for now)
  const todaysTasks = myPlants
    .filter((_, index) => index === 0)
    .map(plant => ({
      ...plant,
      status: 'watering_due' as const,
      statusText: '水やり予定',
    }));

  const statistics = {
    totalPlants: plants?.length || 0,
    monthlyRecords: 12, // TODO: Calculate from actual data
    wateringDue: todaysTasks.length,
  };

  const recentActivity = [
    {
      id: '1',
      type: 'watering' as const,
      plantName: 'サンセベリア',
      timeAgo: '1日前',
    },
    {
      id: '2',
      type: 'observation' as const,
      plantName: 'ポトス',
      timeAgo: '2日前',
    },
  ];

  const handleRegisterPlant = () => {
    console.log('植物を登録');
    // TODO: Navigate to plant registration page
  };

  const handleAddRecord = () => {
    console.log('記録する');
    // TODO: Navigate to record entry page
  };

  const handleManageWatering = () => {
    console.log('水やり管理');
    // TODO: Navigate to watering management page
  };

  const handleCompleteTask = (plantId: string) => {
    console.log('タスク完了:', plantId);
    // TODO: Mark watering task as complete
  };

  const handleEditPlant = (plantId: string) => {
    console.log('植物編集:', plantId);
    // TODO: Navigate to plant edit page
  };

  const handleWaterPlant = (plantId: string) => {
    console.log('水やり:', plantId);
    // TODO: Record watering
  };

  return (
    <Home
      myPlants={myPlants}
      todaysTasks={todaysTasks}
      statistics={statistics}
      recentActivity={recentActivity}
      onRegisterPlant={handleRegisterPlant}
      onAddRecord={handleAddRecord}
      onManageWatering={handleManageWatering}
      onCompleteTask={handleCompleteTask}
      onEditPlant={handleEditPlant}
      onWaterPlant={handleWaterPlant}
    />
  );
}
