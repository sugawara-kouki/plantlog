import { Plant } from '@/types/plant';
import { formatDate, getDaysUntilNextWatering } from '@/utils/dateUtils';
import { getStatusColor, getStatusText } from '@/utils/plantUtils';

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const daysUntilWatering = getDaysUntilNextWatering(plant.nextWatering);
  const statusColor = getStatusColor(plant.status);
  const statusText = getStatusText(plant.status);

  return (
    <div className="plant-card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-plant-dark">{plant.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {statusText}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-medium">種類:</span> {plant.species}
        </p>
        <p>
          <span className="font-medium">場所:</span> {plant.location}
        </p>
        <p>
          <span className="font-medium">最後の水やり:</span> {formatDate(plant.lastWatered)}
        </p>
        <p>
          <span className="font-medium">次の水やり:</span> {formatDate(plant.nextWatering)}
          {daysUntilWatering !== null && (
            <span className={`ml-2 ${daysUntilWatering <= 0 ? 'text-red-600' : 'text-green-600'}`}>
              ({daysUntilWatering <= 0 ? '今日' : `${daysUntilWatering}日後`})
            </span>
          )}
        </p>
      </div>
      
      {plant.notes && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
          <p className="font-medium text-gray-700">メモ:</p>
          <p className="text-gray-600">{plant.notes}</p>
        </div>
      )}
      
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors">
          水やり記録
        </button>
        <button className="flex-1 bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600 transition-colors">
          編集
        </button>
      </div>
    </div>
  );
}