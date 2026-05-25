import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'Real World Assets (RWA)',
  description: 'Tokenized real-world assets and RWA cryptocurrency projects.',
});

export default function RWAPage() {
  return <CoinsPage />;
}
