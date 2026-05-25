import { Metadata } from 'next';
import { AirdropsPage } from '@/components/airdrops/airdrops-page';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Crypto Airdrops',
  description: 'Discover active and upcoming crypto airdrops. Check eligibility and claim free tokens.',
});

export default function AirdropsRoute() {
  return <AirdropsPage />;
}
