import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'Watchlist',
  description: 'Track your favorite coins and monitor their prices in real time.',
});

export default function WatchlistPage() {
  return <CoinsPage />;
}
