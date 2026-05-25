import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'Memecoins',
  description: 'Trending memecoins and community-driven cryptocurrency tokens.',
});

export default function MemecoinsPage() {
  return <CoinsPage />;
}
