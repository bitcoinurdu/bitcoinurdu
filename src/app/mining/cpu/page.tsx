import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'CPU Mining',
  description: 'CPU mineable coins like Monero (RandomX) and other proof-of-work algorithms suitable for processors.',
});

export default function CpuMiningPage() {
  return (
    <div className="space-y-6">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">CPU Mining</h1>
        <p className="text-muted-foreground mt-1">CPU mineable coins like Monero (RandomX) and other proof-of-work algorithms suitable for processors.</p>
      </div>
    </div>
  );
}
