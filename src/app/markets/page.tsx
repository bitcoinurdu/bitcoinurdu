import { Metadata } from 'next';
import { MarketsPage } from '@/components/markets/markets-page';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Global Markets',
  description: 'Track global markets including stocks, forex, commodities, and crypto.',
});

export default function MarketsRoute() {
  return <MarketsPage />;
}
