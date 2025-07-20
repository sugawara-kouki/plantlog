import Link from 'next/link';
import { RiAddLine, RiEditLine } from '@remixicon/react';

interface QuickActionsProps {
  onAddRecord?: () => void;
  onManageWatering?: () => void;
  isMobile?: boolean;
}

/**
 * クイックアクションボタンコンポーネント
 *
 * モバイル版とデスクトップ版で異なるレイアウトを提供
 */
export default function QuickActions({
  onAddRecord,
  onManageWatering,
  isMobile = false,
}: QuickActionsProps) {
  if (isMobile) {
    return (
      <div className="mb-8 lg:hidden">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/plants/register"
            className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary transition-colors shadow-card hover:shadow-card-hover block"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <RiAddLine className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                植物を登録
              </span>
            </div>
          </Link>
          <button
            onClick={onAddRecord}
            className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary transition-colors shadow-card hover:shadow-card-hover"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <RiEditLine className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                記録する
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        クイックアクション
      </h3>
      <div className="space-y-3">
        <Link
          href="/plants/register"
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors font-medium block text-center"
        >
          植物を登録
        </Link>
        <button
          onClick={onAddRecord}
          className="w-full bg-white border border-gray-200 py-3 px-4 rounded-lg hover:border-primary transition-colors font-medium"
        >
          記録する
        </button>
        <button
          onClick={onManageWatering}
          className="w-full bg-white border border-gray-200 py-3 px-4 rounded-lg hover:border-primary transition-colors font-medium"
        >
          水やり管理
        </button>
      </div>
    </div>
  );
}
