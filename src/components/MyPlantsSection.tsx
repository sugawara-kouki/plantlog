import { Plant } from '@/types/Home.types';
import PlantCard from './PlantCard';

interface MyPlantsSectionProps {
  plants: Plant[];
  onEditPlant?: (plantId: string) => void;
  onWaterPlant?: (plantId: string) => void;
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
}: MyPlantsSectionProps) {
  // サンプルデータ（実際のデータがない場合）
  const samplePlants: Plant[] = [
    {
      id: 'sample-1',
      name: 'モンステラ',
      type: 'モンステラ',
      registeredDate: '2024.01.15',
      lastRecord: '3日前',
      status: 'watering_due',
      statusText: '水やり予定',
    },
    {
      id: 'sample-2',
      name: 'サンセベリア',
      type: 'サンセベリア',
      registeredDate: '2024.02.01',
      lastRecord: '1日前',
      status: 'healthy',
      statusText: '元気',
    },
  ];

  const displayPlants = plants.length > 0 ? plants : samplePlants;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">
          私の植物
        </h3>
        <button className="text-primary hover:text-primary-dark transition-colors text-sm font-medium">
          すべて見る
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {displayPlants.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onEdit={onEditPlant}
            onWater={onWaterPlant}
          />
        ))}
      </div>
    </div>
  );
}
