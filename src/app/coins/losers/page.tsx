import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Top Losers' });

export default function LosersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Top Losers</h1>
        <p className="text-muted-foreground mt-1">Cryptocurrencies with the biggest price drop in the last 24 hours.</p>
      </div>
      <p className="text-muted-foreground">View top losers on the main coins page.</p>
    </div>
  );
}
