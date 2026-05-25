import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'GPU Mining',
  description: 'GPU mining rigs and profitability for Ethereum Classic, Ravencoin, and other GPU-mineable coins.',
});

export default function GpuMiningPage() {
  return (
    <div className="space-y-6">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">GPU Mining</h1>
        <p className="text-muted-foreground mt-1">GPU mining rigs and profitability for Ethereum Classic, Ravencoin, and other GPU-mineable coins.</p>
      </div>
    </div>
  );
}
