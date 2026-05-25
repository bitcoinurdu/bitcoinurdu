import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Press Releases',
  description: 'Official press releases — latest announcements, partnerships, and updates from BitcoinUrdu and the crypto industry.',
});

export default function PressReleasePage() {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4 mb-4">Press Releases</h1>
      <p className="text-lg text-gray-700">
        Stay updated with official press releases from BitcoinUrdu and major crypto industry announcements, partnerships, product launches, and company updates.
      </p>
    </main>
  );
}
