import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'API Documentation',
  description: 'Developer documentation and API reference for BitcoinUrdu.',
});

export default function ApiDocsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/" className="text-sm text-bitcoin hover:underline">&larr; Back to Home</Link>
      <div>
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="text-sm text-muted-foreground mt-2">Developer documentation and API reference for BitcoinUrdu.</p>
      </div>
    </div>
  );
}
