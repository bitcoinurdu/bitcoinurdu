import { Metadata } from 'next';
import { AlertsPage } from '@/components/alerts/alerts-page';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Price Alerts',
  description: 'Set price alerts for cryptocurrencies and get notified.',
});

export default function AlertsRoute() {
  return <AlertsPage />;
}
