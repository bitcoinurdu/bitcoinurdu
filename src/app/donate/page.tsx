import { Metadata } from 'next';
import { DonatePage } from '@/components/donate/donate-page';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Donate',
  description: 'Support BitcoinUrdu with cryptocurrency donations.',
});

export default function DonateRoute() {
  return <DonatePage />;
}
