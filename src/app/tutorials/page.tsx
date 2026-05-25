import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Tutorials',
  description: 'Crypto tutorials — step-by-step guides for wallets, exchanges, DeFi protocols, and crypto tools.',
});

export default function TutorialsPage() {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4 mb-4">Tutorials</h1>
      <p className="text-lg text-gray-700">
        Follow step-by-step tutorials to master crypto wallets, exchanges, DeFi protocols, NFT marketplaces, and essential blockchain tools.
      </p>
    </main>
  );
}
