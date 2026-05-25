import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import GlobalStatsClient from './global-stats-client';

export const metadata: Metadata = generateSEO({
  title: 'Global Crypto Stats',
  description: 'Real-time global cryptocurrency market statistics and metrics.',
});

export default function GlobalStatsRoute() {
  return <GlobalStatsClient />;
}
