import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import ConverterClient from './converter-client';

export const metadata: Metadata = generateSEO({
  title: 'Currency & Gold Converter',
  description: 'Convert between USD, PKR, EUR, GBP, Gold and Silver in real-time.',
});

export default function ConverterRoute() {
  return <ConverterClient />;
}
