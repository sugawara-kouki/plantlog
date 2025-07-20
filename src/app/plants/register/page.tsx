import PlantRegisterForm from '@/components/plants/register/PlantRegisterForm';

export default function PlantRegisterPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      <main className="max-w-sm mx-auto px-4 pb-6 lg:max-w-4xl lg:px-8 lg:pb-8">
        <PlantRegisterForm />
      </main>
    </div>
  );
}

export function generateMetadata() {
  return {
    title: '植物を登録 - 植物観察日記',
  };
}
