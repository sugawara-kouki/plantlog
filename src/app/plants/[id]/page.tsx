'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiErrorWarningLine, RiSearchLine, RiImageLine } from '@remixicon/react';
import { usePlantDetails } from '@/hooks/usePlantDetails';
import { usePhotos } from '@/hooks/usePhotos';
import Image from 'next/image';
import { getStorageUrl } from '@/lib/storage';
import AppHeader from '@/components/layout/AppHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ImageModal from '@/components/common/ImageModal';
import type { Database } from '@/lib/database.types';

type Photo = Database['public']['Tables']['photos']['Row'];

interface PlantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PlantDetailPage({ params }: PlantDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const plantId = parseInt(resolvedParams.id);

  const {
    plant,
    isLoading: plantLoading,
    error: plantError,
  } = usePlantDetails(plantId);
  const {
    photos,
    isLoading: photosLoading,
    error: photosError,
  } = usePhotos(plantId);

  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
    date: string;
  } | null>(null);

  const handleImageClick = (photo: Photo, plantName: string) => {
    setSelectedImage({
      src: getStorageUrl(photo.file_path),
      alt: `${plantName}の写真`,
      date: new Date(photo.created_at!)
        .toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\//g, '.'),
    });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (plantLoading) {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
        <AppHeader
          variant="page"
          title="読み込み中..."
          showBackButton={true}
          showNavigation={false}
          showUserDropdown={false}
        />
        <div className="max-w-sm mx-auto px-4 py-6 lg:max-w-6xl lg:px-8 lg:py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600">植物情報を読み込んでいます...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (plantError || !plant) {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
        <AppHeader
          variant="page"
          title="エラー"
          showBackButton={true}
          showNavigation={false}
          showUserDropdown={false}
        />
        <div className="max-w-sm mx-auto px-4 py-6 lg:max-w-6xl lg:px-8 lg:py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <RiErrorWarningLine className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-bold text-red-600 mb-2">
                エラーが発生しました
              </h1>
              <p className="text-gray-600 mb-6">植物情報の取得に失敗しました</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      <AppHeader
        variant="page"
        title={plant.name}
        showBackButton={true}
        showNavigation={false}
        showUserDropdown={false}
      />

      {/* メインコンテンツ */}
      <main className="max-w-sm mx-auto px-4 py-6 lg:max-w-6xl lg:px-8 lg:py-8">
        {/* 植物基本情報 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 lg:text-xl">
            基本情報
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">植物名</p>
                <p className="text-gray-900 font-medium">{plant.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">種類</p>
                <p className="text-gray-900 font-medium">
                  {plant.plant_types?.name || '未設定'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">購入日</p>
                <p className="text-gray-900 font-medium">
                  {plant.purchase_date
                    ? new Date(plant.purchase_date)
                        .toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                        .replace(/\//g, '.')
                    : '未設定'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  現在の状態
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    plant.current_status === '元気'
                      ? 'text-green-800 bg-green-100'
                      : plant.current_status === '心配' ||
                          plant.current_status === '元気がない'
                        ? 'text-yellow-800 bg-yellow-100'
                        : 'text-gray-800 bg-gray-100'
                  }`}
                >
                  {plant.current_status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">高さ</p>
                <p className="text-gray-900 font-medium">
                  {plant.height ? `${plant.height}cm` : '未設定'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  水やり頻度
                </p>
                <p className="text-gray-900 font-medium">
                  {plant.watering_schedule}日に1回
                </p>
              </div>
            </div>
            {plant.memo && (
              <div className="lg:col-span-2 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-2">メモ</p>
                <p className="text-gray-900 leading-relaxed">{plant.memo}</p>
              </div>
            )}
          </div>
        </div>

        {/* 写真セクション */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 lg:text-xl">
            写真ギャラリー
          </h2>

          {photosLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600">写真を読み込んでいます...</p>
            </div>
          ) : photosError ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <RiErrorWarningLine className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">
                写真の読み込みに失敗しました
              </p>
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {photos.map(photo => (
                <div
                  key={photo.id}
                  className="group cursor-pointer"
                  onClick={() => handleImageClick(photo, plant.name)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300">
                    <Image
                      src={getStorageUrl(photo.file_path)}
                      alt={`${plant.name}の写真`}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* ホバーオーバーレイ - 軽やかなアクセント */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* 軽いグラデーションオーバーレイ */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                      {/* 右上の拡大アイコン */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                          <RiSearchLine className="w-4 h-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                      {new Date(photo.created_at!)
                        .toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                        .replace(/\//g, '.')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <RiImageLine className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                まだ写真がありません
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                植物の成長記録として写真を撮影して、思い出を残しましょう
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 画像モーダル */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={closeModal}
        imageSrc={selectedImage?.src || ''}
        imageAlt={selectedImage?.alt || ''}
        date={selectedImage?.date}
      />

      <BottomNavigation />
    </div>
  );
}
