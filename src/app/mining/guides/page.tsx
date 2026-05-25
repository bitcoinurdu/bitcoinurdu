import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Mining Guides',
  description: 'Step-by-step mining tutorials for beginners and advanced miners covering setup, optimization, and troubleshooting.',
});

export default function MiningGuidesPage() {
  return (
    <div className="space-y-6">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining Guides</h1>
        <p className="text-muted-foreground mt-1">Step-by-step mining tutorials for beginners and advanced miners covering setup, optimization, and troubleshooting.</p>
      </div>
    </div>
  );
}
