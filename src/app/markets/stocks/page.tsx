import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Stock Markets' });

export default function StocksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Markets</h1>
        <p className="text-muted-foreground mt-1">US, UK, UAE, PK, IN, CN, JP stock markets.</p>
      </div>
      <p className="text-muted-foreground">View stocks on the main markets page.</p>
    </div>
  );
}
