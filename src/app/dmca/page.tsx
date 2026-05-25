import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'DMCA Policy',
  description: 'Copyright infringement notification and takedown procedures for BitcoinUrdu.',
});

export default function DmcaPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/" className="text-sm text-bitcoin hover:underline">&larr; Back to Home</Link>
      <div>
        <h1 className="text-3xl font-bold">DMCA Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">Copyright infringement notification and takedown procedures for BitcoinUrdu.</p>
      </div>
    </div>
  );
}
