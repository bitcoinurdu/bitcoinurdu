import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import TokenUnlocksClient from './token-unlocks-client';

export const metadata: Metadata = generateSEO({
  title: 'Token Unlocks Schedule',
  description: 'Upcoming crypto token unlocks, vesting schedules, and release dates.',
});

export default function TokenUnlocksPage() {
  return <TokenUnlocksClient />;
}
