import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'New Coin Launches',
  description: 'Recently launched cryptocurrencies and new token listings.',
});

export default function LaunchesPage() {
  return <CoinsPage />;
}
