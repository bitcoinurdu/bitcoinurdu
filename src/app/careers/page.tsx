import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Careers at BitcoinUrdu',
  description: 'Join our team and help build the future of cryptocurrency information.',
});

export default function CareersPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/" className="text-sm text-bitcoin hover:underline">&larr; Back to Home</Link>
      <div>
        <h1 className="text-3xl font-bold">Careers at BitcoinUrdu</h1>
        <p className="text-sm text-muted-foreground mt-2">Join our team and help build the future of cryptocurrency information.</p>
      </div>
    </div>
  );
}
