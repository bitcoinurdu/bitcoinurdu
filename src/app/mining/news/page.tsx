import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Mining News',
  description: 'Latest mining industry news including hardware releases, policy changes, and market trends.',
});

export default function MiningNewsPage() {
  return (
    <div className="space-y-6">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining News</h1>
        <p className="text-muted-foreground mt-1">Latest mining industry news including hardware releases, policy changes, and market trends.</p>
      </div>
    </div>
  );
}
