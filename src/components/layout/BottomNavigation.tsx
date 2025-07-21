'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiHome5Fill,
  RiPlantLine,
  RiEditLine,
  RiDropLine,
} from '@remixicon/react';

/**
 * モバイル用ボトムナビゲーション
 *
 * 主要機能への素早いアクセスを提供
 */
export default function BottomNavigation() {
  const pathname = usePathname();

  // ナビゲーション項目の定義
  const navigationItems = [
    {
      href: '/',
      icon: RiHome5Fill,
      label: 'ホーム',
      isActive: pathname === '/',
    },
    {
      href: '/plants',
      icon: RiPlantLine,
      label: '植物',
      isActive: pathname.startsWith('/plants'),
    },
    {
      href: '/records',
      icon: RiEditLine,
      label: '記録',
      isActive: pathname.startsWith('/records'),
      disabled: true, // まだ実装されていない
    },
    {
      href: '/watering',
      icon: RiDropLine,
      label: '水やり',
      isActive: pathname.startsWith('/watering'),
      disabled: true, // まだ実装されていない
    },
  ];

  return (
    <>
      {/* Bottom Navigation (Mobile only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="max-w-sm mx-auto px-4">
          <div className="flex justify-around py-3">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = item.isActive;
              const isDisabled = item.disabled;

              if (isDisabled) {
                return (
                  <div
                    key={item.href}
                    className="flex flex-col items-center space-y-1 py-2 opacity-50"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-300" />
                    </div>
                    <span className="text-xs text-gray-300">{item.label}</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center space-y-1 py-2"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-primary' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs ${
                      isActive ? 'text-primary font-medium' : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom padding for navigation (Mobile only) */}
      <div className="h-20 lg:hidden"></div>
    </>
  );
}
