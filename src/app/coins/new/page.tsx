import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'New Listings' });

export default function NewCoinsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Listings</h1>
        <p className="text-muted-foreground mt-1">Recently listed cryptocurrencies on major exchanges.</p>
      </div>
      <p className="text-muted-foreground">New listings data is available on the main coins page.</p>
    </div>
  );
}
