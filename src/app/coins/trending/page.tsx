import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Trending Coins',
  description: 'Discover the most trending cryptocurrencies right now.',
});

export default function TrendingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trending Coins</h1>
        <p className="text-muted-foreground mt-1">
          The most searched and discussed cryptocurrencies right now.
        </p>
      </div>
      <p className="text-muted-foreground">View trending coins on the main coins page with trending filter.</p>
    </div>
  );
}
