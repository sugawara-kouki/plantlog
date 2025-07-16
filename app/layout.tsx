import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plant Log - 植物日記',
  description: 'Track your plants growth and care routine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen p-8 bg-linear-to-br from-plant-light to-white">
          {children}
        </main>
      </body>
    </html>
  );
}