import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'Compare Coins',
  description: 'Compare cryptocurrencies side by side for price, market cap, volume, and more.',
});

export default function ComparePage() {
  return <CoinsPage />;
}
