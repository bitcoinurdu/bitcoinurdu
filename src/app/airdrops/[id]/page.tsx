import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { AirdropDetailClient } from './airdrop-detail-client';

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return generateSEO({
    title: `${params.id} Airdrop`,
    description: `Details about the ${params.id} airdrop.`,
  });
}

export async function generateStaticParams() {
  return [
    { id: 'layerzero' },
    { id: 'zksync' },
    { id: 'scroll' },
    { id: 'linea' },
    { id: 'monad' },
    { id: 'eigenlayer' },
  ];
}

export default function AirdropDetailPage({ params }: { params: { id: string } }) {
  return <AirdropDetailClient id={params.id} />;
}
