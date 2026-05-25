import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import BlogPostPage from './blog-post-client';

const ALL_IDS = [
  'bitcoin-halving-2026',
  'bitcoin-etf-approved',
  'defi-yield-strategies',
  'crypto-global-guide',
  'layer2-comparison',
  'airdrop-strategy',
  'bitcoin-price-prediction-2025',
  'solana-vs-ethereum-2026',
  'crypto-security-guide',
  'defi-risks-rewards',
  'nft-market-2026',
  'crypto-tax-guide',
  'web3-gaming-future',
  'stablecoin-guide',
  'bitcoin-mining-2026',
];

export function generateStaticParams() {
  return ALL_IDS.map((id) => ({ id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return generateSEO({
    title: `Blog Post: ${params.id}`,
    description: 'Read the latest crypto blog posts and guides on BitcoinUrdu.',
  });
}

export default function BlogPostRoute({ params }: { params: { id: string } }) {
  return <BlogPostPage params={params} />;
}
