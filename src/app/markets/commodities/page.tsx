import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Commodities' });

export default function CommoditiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Commodities</h1>
        <p className="text-muted-foreground mt-1">Gold, Silver, Oil, Gas prices.</p>
      </div>
      <p className="text-muted-foreground">View commodities on the main markets page.</p>
    </div>
  );
}
