import { Statistics } from '@/types/Home.types';

interface StatisticsCardProps {
  statistics: Statistics;
}

/**
 * 統計情報表示カード
 *
 * 植物数、記録数、水やり予定数を表示
 */
export default function StatisticsCard({ statistics }: StatisticsCardProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">統計</h3>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">登録植物数</span>
            <span className="text-lg font-semibold text-gray-900">
              {statistics.totalPlants}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">今月の記録</span>
            <span className="text-lg font-semibold text-gray-900">
              {statistics.monthlyRecords}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">水やり予定</span>
            <span className="text-lg font-semibold text-primary">
              {statistics.wateringDue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
