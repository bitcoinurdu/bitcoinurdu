import { Metadata } from 'next';
import { LearnBitcoinPage } from '@/components/learn/learn-bitcoin-page';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Learn Bitcoin',
  description: 'Complete Bitcoin and cryptocurrency learning center from beginner to pro.',
});

export default function LearnBitcoinRoute() {
  return <LearnBitcoinPage />;
}
