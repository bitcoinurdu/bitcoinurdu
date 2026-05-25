import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MINING_HARDWARE } from '@/lib/mining/data';
import type { MiningHardware } from '@/lib/mining/data';
import { MinerDetailClient } from './miner-detail-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MINING_HARDWARE.map((m) => ({ slug: m.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hw = MINING_HARDWARE.find(m => m.id === slug);
  if (!hw) return { title: 'Miner Not Found' };
  return {
    title: `${hw.model} - Mining Hardware Details`,
    description: `${hw.model} by ${hw.manufacturer}. ${hw.hashrate} ${hw.hashrateUnit}, ${hw.power}W. Live profitability estimates powered by real-time data.`,
  };
}

export default async function MinerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const hw = MINING_HARDWARE.find(m => m.id === slug);
  if (!hw) notFound();
  return <MinerDetailClient hardware={hw} />;
}
