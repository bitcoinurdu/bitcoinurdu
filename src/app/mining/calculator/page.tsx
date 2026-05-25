import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Mining Calculator',
  description: 'Calculate mining profitability based on hashrate, power consumption, and electricity costs.',
});

export default function MiningCalculatorPage() {
  return (
    <div className="space-y-6">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining Calculator</h1>
        <p className="text-muted-foreground mt-1">Calculate mining profitability based on hashrate, power consumption, and electricity costs.</p>
      </div>
    </div>
  );
}
