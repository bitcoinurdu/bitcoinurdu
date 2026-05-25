import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import AdvertiseClient from './advertise-client';

export const metadata: Metadata = generateSEO({
  title: 'Advertise on BitcoinUrdu',
  description: 'Reach the world\'s largest crypto audience with premium ad placements.',
});

export default function AdvertisePage() {
  return <AdvertiseClient />;
}
