import { Metadata } from 'next';
import { VirtualizedCoinsTable } from '@/components/crypto/virtualized-coins-table';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Cryptocurrency Prices',
  description: 'Live cryptocurrency prices for 15,984 coins. Market cap, volume, and real-time data.',
});

export default function CoinsRoute() {
  return <VirtualizedCoinsTable />;
}
