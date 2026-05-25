import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Forex Rates' });

export default function ForexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Forex Rates</h1>
        <p className="text-muted-foreground mt-1">USD, EUR, GBP, PKR, AED, SAR, INR exchange rates.</p>
      </div>
      <p className="text-muted-foreground">View forex rates on the main markets page.</p>
    </div>
  );
}
