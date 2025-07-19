import { Activity } from '@/types/Home.types';
import { RiDropLine, RiEditLine } from '@remixicon/react';

interface RecentActivityProps {
  activities: Activity[];
}

/**
 * 最近のアクティビティ表示コンポーネント
 *
 * 水やりや観察記録の履歴を表示
 */
export default function RecentActivity({ activities }: RecentActivityProps) {
  // サンプルデータ（実際のデータがない場合）
  const sampleActivities: Activity[] = [
    {
      id: '1',
      type: 'watering',
      plantName: 'サンセベリア',
      timeAgo: '1日前',
    },
    {
      id: '2',
      type: 'observation',
      plantName: 'ポトス',
      timeAgo: '2日前',
    },
  ];

  const displayActivities =
    activities.length > 0 ? activities : sampleActivities;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        最近のアクティビティ
      </h3>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
        <div className="space-y-4">
          {displayActivities.map(activity => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                {activity.type === 'watering' ? (
                  <RiDropLine className="w-4 h-4 text-primary" />
                ) : (
                  <RiEditLine className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {activity.plantName}
                  {activity.type === 'watering' ? 'に水やり' : 'の観察記録'}
                </p>
                <p className="text-xs text-gray-500">{activity.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
