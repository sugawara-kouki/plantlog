import { Plant } from '@/types/Home.types';
import { RiPlantFill, RiEditLine, RiDropLine } from '@remixicon/react';

interface PlantCardProps {
  plant: Plant;
  onEdit?: (plantId: string) => void;
  onWater?: (plantId: string) => void;
  onViewDetails?: (plantId: string) => void;
}

/**
 * 植物情報表示カード
 *
 * 植物の基本情報と操作ボタンを表示
 */
export default function PlantCard({ plant, onEdit, onWater, onViewDetails }: PlantCardProps) {
  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary transition-colors shadow-card hover:shadow-card-hover cursor-pointer"
      onClick={() => onViewDetails?.(plant.id)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <RiPlantFill className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{plant.name}</h4>
            <p className="text-sm text-gray-500">{plant.registeredDate}</p>
          </div>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            plant.status === 'watering_due'
              ? 'text-primary bg-primary/10'
              : 'text-gray-600 bg-gray-100'
          }`}
        >
          {plant.statusText}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          最終記録: {plant.lastRecord}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(plant.id);
            }}
            className="text-gray-400 hover:text-primary transition-colors"
            aria-label={`${plant.name}を編集`}
          >
            <RiEditLine className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWater?.(plant.id);
            }}
            className="text-gray-400 hover:text-primary transition-colors"
            aria-label={`${plant.name}に水やり`}
          >
            <RiDropLine className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
