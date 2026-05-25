import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CompoundInterestContent } from './calculator-content';

export const metadata: Metadata = generateSEO({
  title: 'Compound Interest Calculator',
  description: 'Calculate compound interest on your crypto investments. Adjust principal, interest rate, compounding frequency, and time period.',
});

export default function CompoundInterestPage() {
  return <CompoundInterestContent />;
}
