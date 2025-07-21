import PlantRegisterForm from '@/components/plants/register/PlantRegisterForm';

export default function PlantRegisterPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      <PlantRegisterForm />
    </div>
  );
}

export function generateMetadata() {
  return {
    title: '植物を登録 - 植物観察日記',
  };
}
