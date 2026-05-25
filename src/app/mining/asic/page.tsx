import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import MiningHardwareDashboard from './asic-dashboard';

export const metadata: Metadata = generateSEO({
  title: 'ASIC Mining Hardware - Profitability Calculator',
  description: 'Professional ASIC mining hardware comparison. Compare Antminer, IceRiver, GoldShell and more. View real gross/net daily profit and payback.',
});

export default function AsicMiningPage() {
  return <MiningHardwareDashboard />;
}
