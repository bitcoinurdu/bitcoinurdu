import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { ConverterContent } from './converter-content';

export const metadata: Metadata = generateSEO({
  title: 'Crypto Converter',
  description: 'Convert between cryptocurrencies and fiat currencies instantly. Supports BTC, ETH, USDT, USD, PKR, EUR and more.',
});

export default function CryptoConverterPage() {
  return <ConverterContent />;
}
