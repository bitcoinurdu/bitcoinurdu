import { Metadata } from 'next';
import { AirdropCheckerPage } from '@/components/airdrops/airdrop-checker';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Airdrop Checker',
  description: 'Check your wallet for eligible airdrops and unclaimed rewards.',
});

export default function AirdropCheckerRoute() {
  return <AirdropCheckerPage />;
}
