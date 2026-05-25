import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Testnet Airdrops',
  description: 'Crypto airdrops on testnet — claim free test tokens from upcoming blockchain projects before mainnet launch.',
});

export default function TestnetAirdropsPage() {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4 mb-4">Testnet Airdrops</h1>
      <p className="text-lg text-gray-700">
        Explore active and upcoming testnet airdrops from promising blockchain projects. Participate in testnets, complete tasks, and earn free test tokens that may convert to mainnet rewards.
      </p>
    </main>
  );
}
