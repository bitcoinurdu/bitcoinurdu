import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Retroactive Airdrops',
  description: 'Retroactive airdrop claims — check eligibility and claim retroactive rewards from past protocol interactions.',
});

export default function RetroactiveAirdropsPage() {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4 mb-4">Retroactive Airdrops</h1>
      <p className="text-lg text-gray-700">
        Find retroactive airdrop opportunities from protocols rewarding early users. Check your wallet eligibility and claim tokens you&apos;ve earned from past on-chain activity.
      </p>
    </main>
  );
}
