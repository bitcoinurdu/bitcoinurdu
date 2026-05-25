import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'Mining Coins',
  description: 'Mineable cryptocurrencies and proof-of-work mining tokens.',
});

export default function MiningPage() {
  return <CoinsPage />;
}
