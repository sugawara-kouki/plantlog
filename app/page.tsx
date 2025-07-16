import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-plant-dark mb-4">
          Plant Log へようこそ
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          植物の成長記録と世話の管理をシンプルに
        </p>
        <div className="space-x-4">
          <Link href="/plants" className="plant-button">
            植物一覧
          </Link>
          <Link href="/about" className="plant-button">
            このアプリについて
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="plant-card">
          <h3 className="text-xl font-semibold text-plant-dark mb-2">
            植物管理
          </h3>
          <p className="text-gray-600">
            植物の基本情報、水やり履歴、成長記録を管理
          </p>
        </div>
        <div className="plant-card">
          <h3 className="text-xl font-semibold text-plant-dark mb-2">
            水やりリマインダー
          </h3>
          <p className="text-gray-600">
            植物に合った水やりスケジュールでリマインダー
          </p>
        </div>
        <div className="plant-card">
          <h3 className="text-xl font-semibold text-plant-dark mb-2">
            成長記録
          </h3>
          <p className="text-gray-600">写真付きで植物の成長を記録・振り返り</p>
        </div>
      </div>
    </div>
  );
}
