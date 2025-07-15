export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-plant-dark mb-4">
          Plant Log について
        </h1>
        <p className="text-lg text-gray-600">
          植物愛好家のための成長記録アプリ
        </p>
      </div>

      <div className="space-y-8">
        <div className="plant-card">
          <h2 className="text-2xl font-semibold text-plant-dark mb-4">
            このアプリの目的
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Plant Log は植物の世話を忘れがちな現代人のために開発された、
            シンプルで使いやすい植物管理アプリです。
            水やりのタイミングを逃したり、植物の状態変化を見逃したりしないよう、
            デジタルツールでサポートします。
          </p>
        </div>

        <div className="plant-card">
          <h2 className="text-2xl font-semibold text-plant-dark mb-4">
            主な機能
          </h2>
          <ul className="text-gray-600 space-y-2">
            <li>• 植物の基本情報管理</li>
            <li>• 水やりスケジュール管理</li>
            <li>• 成長記録の写真付き日記</li>
            <li>• 植物の健康状態トラッキング</li>
            <li>• リマインダー機能</li>
          </ul>
        </div>

        <div className="plant-card">
          <h2 className="text-2xl font-semibold text-plant-dark mb-4">
            技術仕様
          </h2>
          <div className="text-gray-600">
            <p className="mb-2">このアプリは以下の技術で構築されています：</p>
            <ul className="space-y-1">
              <li>• Next.js 15</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• React 18</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}