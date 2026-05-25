import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'AI Tokens',
  description: 'Artificial intelligence crypto tokens and blockchain AI projects.',
});

export default function AiTokensPage() {
  return <CoinsPage />;
}
