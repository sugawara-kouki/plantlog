import PlantCard from '@/components/PlantCard';
import { Plant } from '@/types/plant';

// Sample data - in a real app, this would come from a database
const samplePlants: Plant[] = [
  {
    id: '1',
    name: 'ポトス',
    species: 'Epipremnum aureum',
    location: 'リビング',
    lastWatered: new Date('2024-01-10'),
    nextWatering: new Date('2024-01-13'),
    status: 'healthy',
    notes: '元気に育っています',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'モンステラ',
    species: 'Monstera deliciosa',
    location: '寝室',
    lastWatered: new Date('2024-01-08'),
    nextWatering: new Date('2024-01-15'),
    status: 'needs_attention',
    notes: '葉が少し黄色くなってきました',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-08'),
  },
];

export default function PlantsPage() {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-plant-dark mb-4">植物一覧</h1>
        <p className="text-gray-600">
          あなたの植物の状態をチェックしましょう
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="plant-button">
          新しい植物を追加
        </button>
      </div>
    </div>
  );
}