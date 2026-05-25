import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Cookies Policy',
  description: 'How we use cookies and similar tracking technologies on BitcoinUrdu.',
});

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/" className="text-sm text-bitcoin hover:underline">&larr; Back to Home</Link>
      <div>
        <h1 className="text-3xl font-bold">Cookies Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">How we use cookies and similar tracking technologies on BitcoinUrdu.</p>
      </div>
    </div>
  );
}
