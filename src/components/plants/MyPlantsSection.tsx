import Link from 'next/link';
import { Plant } from '@/types/Home.types';
import PlantCard from './PlantCard';

interface MyPlantsSectionProps {
  plants: Plant[];
  onEditPlant?: (plantId: string) => void;
  onWaterPlant?: (plantId: string) => void;
  onViewPlantDetails?: (plantId: string) => void;
}

/**
 * 私の植物セクション
 *
 * 登録済み植物の一覧を表示
 */
export default function MyPlantsSection({
  plants,
  onEditPlant,
  onWaterPlant,
  onViewPlantDetails,
}: MyPlantsSectionProps) {
  const displayPlants = plants.length > 0 ? plants : [];

  // 登録済みの植物が存在しない場合の表示
  if (displayPlants.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">
            私の植物
          </h3>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            まだ植物が登録されていません
          </h4>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            最初の植物を登録して、観察記録を始めましょう
          </p>
          <Link
            href="/plants/register"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            植物を登録する
          </Link>
        </div>
      </div>
    );
  }

  // 植物が取得できた場合の表示
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">
          私の植物
        </h3>
        <Link
          href="/plants"
          className="text-primary hover:text-primary-dark transition-colors text-sm font-medium"
        >
          すべて見る
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {displayPlants.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onEdit={onEditPlant}
            onWater={onWaterPlant}
            onViewDetails={onViewPlantDetails}
          />
        ))}
      </div>
    </div>
  );
}
