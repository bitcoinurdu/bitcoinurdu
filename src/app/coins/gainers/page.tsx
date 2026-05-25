import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Top Gainers' });

export default function GainersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Top Gainers</h1>
        <p className="text-muted-foreground mt-1">Cryptocurrencies with the highest price increase in the last 24 hours.</p>
      </div>
      <p className="text-muted-foreground">View top gainers on the main coins page.</p>
    </div>
  );
}
