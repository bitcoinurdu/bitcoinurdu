import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { DcaCalculatorContent } from './calculator-content';

export const metadata: Metadata = generateSEO({
  title: 'DCA Calculator',
  description: 'Dollar cost averaging calculator for cryptocurrency investments. Plan recurring investments and see projected returns.',
});

export default function DcaCalculatorPage() {
  return <DcaCalculatorContent />;
}
