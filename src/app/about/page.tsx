import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import AboutClient from './about-client';

export const metadata: Metadata = generateSEO({
  title: 'About Us',
  description: "Learn about BitcoinUrdu - The World's Elite Multi-lingual Crypto Platform.",
});

export default function AboutPage() {
  return <AboutClient />;
}
