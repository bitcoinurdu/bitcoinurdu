import type { Metadata } from 'next';
import { AsicMinersClient } from './asic-miners-client';

export const metadata: Metadata = {
  title: 'ASIC Miners - Live Mining Profitability | BitcoinUrdu',
  description: 'Compare ASIC miners from Bitmain, MicroBT, Canaan, and more. Live profitability, hashrate, efficiency, and prices from ASL Miners.',
};

export default function MiningPage() {
  return <AsicMinersClient />;
}
