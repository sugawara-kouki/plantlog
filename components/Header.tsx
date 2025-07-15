import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-plant-green text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🌱</div>
            <Link href="/" className="text-2xl font-bold hover:text-plant-light transition-colors">
              Plant Log
            </Link>
          </div>
          <nav className="space-x-6">
            <Link href="/" className="hover:text-plant-light transition-colors">
              ホーム
            </Link>
            <Link href="/plants" className="hover:text-plant-light transition-colors">
              植物一覧
            </Link>
            <Link href="/about" className="hover:text-plant-light transition-colors">
              このアプリについて
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}