import { RiHome5Fill, RiPlantLine, RiEditLine, RiDropLine } from '@remixicon/react';

/**
 * モバイル用ボトムナビゲーション
 *
 * 主要機能への素早いアクセスを提供
 */
export default function BottomNavigation() {
  return (
    <>
      {/* Bottom Navigation (Mobile only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="max-w-sm mx-auto px-4">
          <div className="flex justify-around py-3">
            <a href="#" className="flex flex-col items-center space-y-1 py-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <RiHome5Fill className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-primary font-medium">ホーム</span>
            </a>
            <a href="#" className="flex flex-col items-center space-y-1 py-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <RiPlantLine className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">植物</span>
            </a>
            <a href="#" className="flex flex-col items-center space-y-1 py-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <RiEditLine className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">記録</span>
            </a>
            <a href="#" className="flex flex-col items-center space-y-1 py-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <RiDropLine className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">水やり</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Bottom padding for navigation (Mobile only) */}
      <div className="h-20 lg:hidden"></div>
    </>
  );
}
