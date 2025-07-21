'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { usePlantDetails } from '@/hooks/usePlantDetails';
import { usePhotos } from '@/hooks/usePhotos';
import Image from 'next/image';
import { getStorageUrl } from '@/lib/storage';

interface PlantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PlantDetailPage({ params }: PlantDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const plantId = parseInt(resolvedParams.id);
  
  const { plant, isLoading: plantLoading, error: plantError } = usePlantDetails(plantId);
  const { photos, isLoading: photosLoading, error: photosError } = usePhotos(plantId);

  if (plantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">植物情報を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (plantError || !plant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">エラーが発生しました</h1>
          <p className="text-gray-600 mb-4">植物情報の取得に失敗しました</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{plant.name}</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="p-4">
        {/* 植物基本情報 */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">植物名</p>
              <p className="font-medium">{plant.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">種類</p>
              <p className="font-medium">{plant.plant_types?.name || '未設定'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">購入日</p>
              <p className="font-medium">{plant.purchase_date || '未設定'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">現在の状態</p>
              <p className="font-medium">{plant.current_status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">高さ</p>
              <p className="font-medium">{plant.height ? `${plant.height}cm` : '未設定'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">水やり頻度</p>
              <p className="font-medium">{plant.watering_schedule}日に1回</p>
            </div>
            {plant.memo && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">メモ</p>
                <p className="font-medium">{plant.memo}</p>
              </div>
            )}
          </div>
        </div>

        {/* 写真セクション */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">写真</h2>
          
          {photosLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">写真を読み込んでいます...</p>
            </div>
          ) : photosError ? (
            <div className="text-center py-8">
              <p className="text-red-600">写真の読み込みに失敗しました</p>
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <Image
                    src={getStorageUrl(photo.file_path)}
                    alt={`${plant.name}の写真`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(photo.created_at!).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
              <p className="text-gray-500">まだ写真がありません</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}