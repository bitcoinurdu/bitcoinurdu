import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinsPage } from '@/components/crypto/coins-page';

export const metadata: Metadata = generateSEO({
  title: 'Crypto Events Calendar',
  description: 'Upcoming crypto events, token unlocks, and important dates.',
});

export default function CalendarPage() {
  return <CoinsPage />;
}
