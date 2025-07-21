'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  date?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  date,
}: ImageModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // ページスクロールを無効化
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      // ページスクロールを復元
      document.body.style.overflow = 'unset';
    }

    // クリーンアップ
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* バックドロップ */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-75' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div
        className={`relative max-w-4xl max-h-[90vh] w-full mx-auto transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors group"
          aria-label="画像を閉じる"
        >
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 画像コンテナ */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={800}
              height={600}
              className="w-full h-auto max-h-[70vh] object-contain"
              priority
            />

            {/* 画像情報オーバーレイ */}
            {date && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="text-white">
                  <p className="text-sm opacity-90 mb-1">撮影日</p>
                  <p className="text-lg font-medium">{date}</p>
                </div>
              </div>
            )}
          </div>

          {/* キャプション */}
          <div className="p-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {imageAlt}
            </h3>
            <p className="text-sm text-gray-500">
              画像をタップまたはESCキーで閉じることができます
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
