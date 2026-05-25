import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { RoiCalculatorContent } from './calculator-content';

export const metadata: Metadata = generateSEO({
  title: 'ROI Calculator',
  description: 'Calculate return on investment for any cryptocurrency trade. See profit, loss, ROI percentage, and annualized returns.',
});

export default function RoiCalculatorPage() {
  return <RoiCalculatorContent />;
}
