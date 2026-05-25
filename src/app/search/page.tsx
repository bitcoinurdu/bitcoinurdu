import { Metadata } from 'next';
import { Suspense } from 'react';
import { generateSEO } from '@/lib/seo';
import SearchPageClient from './search-client';

export const metadata: Metadata = generateSEO({ title: 'Search', description: 'Search coins, airdrops, markets, and more.' });

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading search...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
