import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Market Indices',
  description: 'Global market indices — track S&P 500, NASDAQ, FTSE, Nikkei, and major worldwide index performance.',
});

export default function MarketIndicesPage() {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4 mb-4">Market Indices</h1>
      <p className="text-lg text-gray-700">
        Monitor real-time performance of major global stock market indices including S&P 500, NASDAQ 100, FTSE 100, Nikkei 225, and more.
      </p>
    </main>
  );
}
