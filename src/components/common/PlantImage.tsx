'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RiImageLine, RiPlantFill } from '@remixicon/react';
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
        <RiImageLine className="w-8 h-8 text-gray-400" />
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
            <RiPlantFill className="w-12 h-12 text-green-500 mx-auto mb-2" />
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
