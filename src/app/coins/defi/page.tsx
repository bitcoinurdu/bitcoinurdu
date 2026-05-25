import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'DeFi Coins',
  description: 'Decentralized finance tokens and DeFi cryptocurrency projects.',
});

export default function DeFiPage() {
  return <CoinsPage />;
}
