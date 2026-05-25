import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Bonds Market',
  description: 'Global bond market data — track government bonds, corporate bonds, and sovereign bond yields worldwide.',
});

export default function BondsMarketPage() {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4 mb-4">Bonds Market</h1>
      <p className="text-lg text-gray-700">
        Access global bond market data including government bond yields, corporate bond rates, and sovereign debt instruments from major economies.
      </p>
    </main>
  );
}
