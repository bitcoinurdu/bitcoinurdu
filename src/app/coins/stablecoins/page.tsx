import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'Stablecoins',
  description: 'Price-stable cryptocurrencies pegged to fiat currencies or assets.',
});

export default function StablecoinsPage() {
  return <CoinsPage />;
}
