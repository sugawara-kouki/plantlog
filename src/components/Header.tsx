import { useAtom } from 'jotai';
import { userAtom } from '@/store/auth';
import { auth } from '@/lib/supabase';
import {
  RiPlantFill,
  RiArrowDownSLine,
  RiLogoutBoxLine,
} from '@remixicon/react';

/**
 * アプリケーションのヘッダーコンポーネント
 *
 * ロゴ、ナビゲーション、ユーザープロフィールを表示
 */
export default function Header() {
  const [user] = useAtom(userAtom);

  const handleLogout = async () => {
    await auth.signOut();
  };

  // ユーザー名の最初の文字を取得（表示用）
  const getUserInitial = () => {
    if (!user?.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  // 表示名を取得（メールアドレスの@より前の部分）
  const getUserDisplayName = () => {
    if (!user?.email) return 'ゲスト';
    return user.email.split('@')[0];
  };
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
          <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors lg:px-3 lg:py-2 lg:border lg:border-gray-200 lg:rounded-lg lg:hover:border-primary">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getUserInitial()}
                </span>
              </div>
              <span className="hidden lg:inline text-sm font-medium">
                {getUserDisplayName()}
              </span>
              <RiArrowDownSLine className="w-4 h-4 text-gray-500 hidden lg:inline" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <RiLogoutBoxLine className="w-4 h-4 mr-2" />
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
