import { PlantStatus } from '@/types/plant';

export function getStatusColor(status: PlantStatus): string {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800';
    case 'needs_attention':
      return 'bg-yellow-100 text-yellow-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusText(status: PlantStatus): string {
  switch (status) {
    case 'healthy':
      return '健康';
    case 'needs_attention':
      return '注意';
    case 'critical':
      return '緊急';
    default:
      return '不明';
  }
}

export function getDefaultWateringInterval(species: string): number {
  // Default watering intervals in days by species
  const intervals: Record<string, number> = {
    'Epipremnum aureum': 7, // ポトス
    'Monstera deliciosa': 7, // モンステラ
    'Sansevieria trifasciata': 14, // サンスベリア
    'Ficus benjamina': 5, // ベンジャミン
    default: 7,
  };

  return intervals[species] || intervals.default;
}

export function calculateNextWateringDate(lastWatered: Date, species: string): Date {
  const interval = getDefaultWateringInterval(species);
  const nextWatering = new Date(lastWatered);
  nextWatering.setDate(nextWatering.getDate() + interval);
  return nextWatering;
}