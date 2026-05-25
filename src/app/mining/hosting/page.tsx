import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Mining Hosting',
  description: 'Professional mining hosting services with colocation, maintenance, and competitive power rates.',
});

export default function MiningHostingPage() {
  return (
    <div className="space-y-6">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining Hosting</h1>
        <p className="text-muted-foreground mt-1">Professional mining hosting services with colocation, maintenance, and competitive power rates.</p>
      </div>
    </div>
  );
}
