'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePhotos } from '@/hooks/usePhotos';
import { getStorageUrl } from '@/lib/storage';

interface PlantImageProps {
  plantId: number;
  plantName: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallbackSrc?: string;
}

export default function PlantImage({
  plantId,
  plantName,
  className = '',
  width = 400,
  height = 300,
  priority = false,
  fallbackSrc,
}: PlantImageProps) {
  const [imageError, setImageError] = useState(false);
  const { photos, isLoading } = usePhotos(plantId);

  // 最新の写真を取得（photosは作成日時の降順でソート済み）
  const latestPhoto = photos?.[0];

  if (isLoading) {
    return (
      <div
        className={`bg-gray-100 animate-pulse flex items-center justify-center ${className}`}
      >
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // 画像が存在しないか、エラーが発生した場合のフォールバック
  if (!latestPhoto || imageError) {
    return (
      <div
        className={`bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center ${className}`}
      >
        {fallbackSrc ? (
          <Image
            src={fallbackSrc}
            alt={plantName}
            width={width}
            height={height}
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="text-center">
            <svg
              className="w-12 h-12 text-green-500 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"
              />
            </svg>
            <p className="text-sm text-green-600 font-medium">{plantName}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Image
      src={getStorageUrl(latestPhoto.file_path)}
      alt={`${plantName}の写真`}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      priority={priority}
      onError={() => setImageError(true)}
    />
  );
}
