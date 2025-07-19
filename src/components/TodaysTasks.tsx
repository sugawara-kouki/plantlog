import { Plant } from '@/types/Home.types';
import { RiPlantFill, RiInformationLine } from '@remixicon/react';

interface TodaysTasksProps {
  tasks: Plant[];
  onCompleteTask?: (plantId: string) => void;
}

/**
 * 今日のタスク表示コンポーネント
 *
 * 水やりが必要な植物のリストを表示
 */
export default function TodaysTasks({
  tasks,
  onCompleteTask,
}: TodaysTasksProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              今日のタスク
            </h3>
            <p className="text-sm text-gray-600">
              水やりが必要な植物があります
            </p>
          </div>
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <RiInformationLine className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <RiPlantFill className="w-4 h-4 text-primary" />
                </div>
                <span className="text-gray-900 font-medium">{task.name}</span>
              </div>
              <button
                onClick={() => onCompleteTask?.(task.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                完了
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
