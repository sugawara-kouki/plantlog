'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlants } from '@/hooks/usePlants';
import { usePlantTypes } from '@/hooks/usePlantTypes';
import AppHeader from '@/components/layout/AppHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function PlantsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');

  const {
    data: plants,
    isLoading: plantsLoading,
    error: plantsError,
  } = usePlants();
  const { data: plantTypes } = usePlantTypes();

  // フィルタリングとソート
  const filteredAndSortedPlants = plants
    ?.filter(plant => {
      const matchesSearch = plant.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === 'all' ||
        plant.plant_types?.id.toString() === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return (
            new Date(b.created_at!).getTime() -
            new Date(a.created_at!).getTime()
          );
        case 'status':
          return (a.current_status || '').localeCompare(b.current_status || '');
        default:
          return 0;
      }
    });

  const handlePlantClick = (plantId: number) => {
    router.push(`/plants/${plantId}`);
  };

  const handleAddPlant = () => {
    router.push('/plants/register');
  };

  if (plantsLoading) {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
        <AppHeader
          variant="page"
          title="植物一覧"
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
              <p className="text-gray-600">植物一覧を読み込んでいます...</p>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (plantsError) {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
        <AppHeader
          variant="page"
          title="植物一覧"
          showBackButton={true}
          showNavigation={false}
          showUserDropdown={false}
        />
        <div className="max-w-sm mx-auto px-4 py-6 lg:max-w-6xl lg:px-8 lg:py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-red-600 mb-2">
                エラーが発生しました
              </h1>
              <p className="text-gray-600 mb-6">植物一覧の取得に失敗しました</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      <AppHeader
        variant="page"
        title="植物一覧"
        showBackButton={true}
        showNavigation={false}
        showUserDropdown={false}
      />

      {/* メインコンテンツ */}
      <main className="max-w-sm mx-auto px-4 py-6 lg:max-w-6xl lg:px-8 lg:py-8">
        {/* 検索・フィルタセクション */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 検索ボックス */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                植物名で検索
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="植物名を入力..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* 種類フィルタ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                植物の種類
              </label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">すべて</option>
                {plantTypes?.map(type => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ソート */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                並び順
              </label>
              <select
                value={sortBy}
                onChange={e =>
                  setSortBy(e.target.value as 'name' | 'date' | 'status')
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date">登録日順</option>
                <option value="name">名前順</option>
                <option value="status">状態順</option>
              </select>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                登録植物数
              </h2>
              <p className="text-3xl font-bold text-primary">
                {filteredAndSortedPlants?.length || 0}
                <span className="text-lg text-gray-500 ml-1">株</span>
              </p>
            </div>
            <button
              onClick={handleAddPlant}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              植物を追加
            </button>
          </div>
        </div>

        {/* 植物一覧 */}
        {!filteredAndSortedPlants || filteredAndSortedPlants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-card text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedType !== 'all'
                ? '条件に一致する植物が見つかりません'
                : 'まだ植物を登録していません'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedType !== 'all'
                ? '検索条件を変更してお試しください'
                : '最初の植物を登録して観察を始めましょう'}
            </p>
            <button
              onClick={handleAddPlant}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
            >
              植物を登録する
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedPlants.map(plant => (
              <div
                key={plant.id}
                onClick={() => handlePlantClick(plant.id)}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {plant.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {plant.plant_types?.name || '未設定'}
                    </p>
                  </div>
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
                    {plant.current_status || '普通'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">購入日</span>
                    <span className="text-sm font-medium text-gray-900">
                      {plant.purchase_date
                        ? new Date(plant.purchase_date)
                            .toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                            .replace(/\//g, '.')
                        : '未設定'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">高さ</span>
                    <span className="text-sm font-medium text-gray-900">
                      {plant.height ? `${plant.height}cm` : '未設定'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">水やり頻度</span>
                    <span className="text-sm font-medium text-gray-900">
                      {plant.watering_schedule}日に1回
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      登録日:{' '}
                      {new Date(plant.created_at!).toLocaleDateString('ja-JP')}
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
