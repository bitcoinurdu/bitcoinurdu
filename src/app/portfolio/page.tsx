import { Metadata } from 'next';
import { PortfolioPage } from '@/components/portfolio/portfolio-page';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Portfolio Tracker',
  description: 'Track your cryptocurrency portfolio with real-time PNL calculations.',
});

export default function PortfolioRoute() {
  return <PortfolioPage />;
}
