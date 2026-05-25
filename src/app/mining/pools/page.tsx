import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Mining Pools',
  description: 'Compare mining pools by fee structure, payout methods, and supported algorithms.',
});

export default function MiningPoolsPage() {
  return (
    <div className="space-y-6">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining Pools</h1>
        <p className="text-muted-foreground mt-1">Compare mining pools by fee structure, payout methods, and supported algorithms.</p>
      </div>
    </div>
  );
}
