import { User } from '@/types/Home.types';
import { RiPlantFill, RiArrowDownSLine } from '@remixicon/react';

interface HeaderProps {
  user: User;
}

/**
 * アプリケーションのヘッダーコンポーネント
 *
 * ロゴ、ナビゲーション、ユーザープロフィールを表示
 */
export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-sm mx-auto px-4 py-4 lg:max-w-6xl lg:px-8 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center lg:w-12 lg:h-12">
              <RiPlantFill className="w-6 h-6 text-white lg:w-7 lg:h-7" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                植物観察日記
              </h1>
              <p className="text-xs text-gray-500 lg:text-sm">
                Plant Care Journal
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-6">
            <a
              href="#"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              ダッシュボード
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              植物一覧
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              記録
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              水やり
            </a>
          </nav>

          {/* User Profile */}
          <div className="relative">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors lg:px-3 lg:py-2 lg:border lg:border-gray-200 lg:rounded-lg lg:hover:border-primary">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.initial}
                </span>
              </div>
              <span className="hidden lg:inline text-sm font-medium">
                {user.name}
              </span>
              <RiArrowDownSLine className="w-4 h-4 text-gray-500 hidden lg:inline" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
