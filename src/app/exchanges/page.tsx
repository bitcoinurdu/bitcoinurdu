import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { ExchangesHubClient } from './exchanges-hub-client';

export const metadata: Metadata = generateSEO({
  title: 'Cryptocurrency Exchanges',
  description: 'Compare top cryptocurrency exchanges by trading volume, fees, supported assets, and user ratings. Browse centralized and decentralized exchanges.',
});

export default function ExchangesPage() {
  return <ExchangesHubClient />;
}
