import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { MarketHeatmapPage } from '@/components/crypto/market-heatmap-page';

export const metadata: Metadata = generateSEO({
  title: 'Market Heatmap',
  description: 'Interactive crypto market heatmap showing price movements across all cryptocurrencies.',
});

export default function HeatmapRoute() {
  return <MarketHeatmapPage />;
}
