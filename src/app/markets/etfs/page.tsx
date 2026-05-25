import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Crypto ETFs',
  description: 'Cryptocurrency ETFs — track Bitcoin ETF, Ethereum ETF, and crypto-linked exchange-traded fund performance and flows.',
});

export default function CryptoETFsPage() {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4 mb-4">Crypto ETFs</h1>
      <p className="text-lg text-gray-700">
        Track the performance of cryptocurrency ETFs including spot Bitcoin ETFs, Ethereum ETFs, and other crypto-linked exchange-traded funds with real-time prices and flow data.
      </p>
    </main>
  );
}
