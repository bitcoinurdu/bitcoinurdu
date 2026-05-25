import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Mining Profitability',
  description: 'Live mining profitability estimates for ASICs, GPUs, and CPUs across all major coins.',
});

export default function MiningProfitabilityPage() {
  return (
    <div className="space-y-6">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining Profitability</h1>
        <p className="text-muted-foreground mt-1">Live mining profitability estimates for ASICs, GPUs, and CPUs across all major coins.</p>
      </div>
    </div>
  );
}
