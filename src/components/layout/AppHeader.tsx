'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/auth';
import { auth } from '@/lib/supabase';
import {
  RiPlantFill,
  RiArrowDownSLine,
  RiLogoutBoxLine,
  RiArrowLeftLine,
} from '@remixicon/react';

interface AppHeaderProps {
  variant?: 'home' | 'page';
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showNavigation?: boolean;
}

/**
 * 統一アプリケーションヘッダー
 *
 * ホームページと各ページで共通利用可能な柔軟なヘッダーコンポーネント
 */
export default function AppHeader({
  variant = 'home',
  title,
  subtitle,
  showBackButton = false,
  showNavigation = true,
}: AppHeaderProps) {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await auth.signOut();
    setIsDropdownOpen(false);
  };

  const handleBack = () => {
    router.back();
  };

  // モバイル判定とリサイズ対応
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // クリック外でドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (isMobile) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // ユーザー名の最初の文字を取得
  const getUserInitial = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // 表示名を取得
  const getUserDisplayName = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'ユーザー';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div
        className={`mx-auto px-4 py-4 lg:px-8 lg:py-6 ${
          variant === 'home' ? 'max-w-sm lg:max-w-6xl' : 'max-w-sm lg:max-w-4xl'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Back Button (for page variant) */}
            {showBackButton && (
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-primary transition-colors"
                type="button"
              >
                <RiArrowLeftLine className="w-6 h-6" />
              </button>
            )}

            {/* Logo & Title */}
            {variant === 'home' ? (
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
            ) : (
              <div>
                <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 lg:text-base">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Center - Desktop Navigation (home variant only) */}
          {variant === 'home' && showNavigation && (
            <nav className="hidden lg:flex lg:items-center lg:space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                ホーム
              </Link>
              <Link
                href="/plants"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                植物一覧
              </Link>
              <span className="text-gray-400 font-medium cursor-not-allowed">
                記録
              </span>
              <span className="text-gray-400 font-medium cursor-not-allowed">
                水やり
              </span>
            </nav>
          )}

          {/* Right Section - User Profile */}
          <div className="relative" ref={dropdownRef}>
            <div className={isMobile ? '' : 'group'}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors lg:px-3 lg:py-2 lg:border lg:border-gray-200 lg:rounded-xl lg:hover:border-primary"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getUserInitial()}
                  </span>
                </div>
                <span className="hidden lg:inline text-sm font-medium">
                  {getUserDisplayName()}
                </span>
                <RiArrowDownSLine 
                  className={`w-4 h-4 text-gray-500 hidden lg:inline transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 z-50 ${
                isMobile 
                  ? (isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible')
                  : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
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
      </div>
    </header>
  );
}
