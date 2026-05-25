import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'Gaming & Metaverse',
  description: 'Blockchain gaming tokens and metaverse cryptocurrency projects.',
});

export default function GamingPage() {
  return <CoinsPage />;
}
