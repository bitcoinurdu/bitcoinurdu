import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import JobsClient from './jobs-client';

export const metadata: Metadata = generateSEO({
  title: 'Crypto & Web3 Jobs',
  description: 'Latest crypto, blockchain, and Web3 jobs worldwide.',
});

export default function JobsPage() {
  return <JobsClient />;
}
