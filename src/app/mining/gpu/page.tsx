import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Zap, DollarSign, Thermometer, Cpu } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'GPU Mining',
  description: 'Best GPUs for mining in 2025. Compare hashrate, power consumption, and profitability for NVIDIA and AMD graphics cards.',
});

const gpus = [
  { name: 'NVIDIA RTX 4090', algo: 'Ethash', hashrate: '126 MH/s', power: 350, efficiency: '2.78 MH/W', cost: 1800, memory: '24GB GDDR6X', profit: '$3.20/day' },
  { name: 'NVIDIA RTX 4080', algo: 'Ethash', hashrate: '85 MH/s', power: 250, efficiency: '2.94 MH/W', cost: 1200, memory: '16GB GDDR6X', profit: '$2.15/day' },
  { name: 'NVIDIA RTX 4070 Ti', algo: 'Ethash', hashrate: '65 MH/s', power: 200, efficiency: '3.08 MH/W', cost: 800, memory: '12GB GDDR6X', profit: '$1.65/day' },
  { name: 'NVIDIA RTX 3090', algo: 'Ethash', hashrate: '120 MH/s', power: 350, efficiency: '2.92 MH/W', cost: 1500, memory: '24GB GDDR6X', profit: '$3.05/day' },
  { name: 'NVIDIA RTX 3080', algo: 'Ethash', hashrate: '100 MH/s', power: 320, efficiency: '3.13 MH/W', cost: 700, memory: '10GB GDDR6X', profit: '$2.55/day' },
  { name: 'NVIDIA RTX 3070', algo: 'Ethash', hashrate: '62 MH/s', power: 220, efficiency: '3.54 MH/W', cost: 500, memory: '8GB GDDR6', profit: '$1.58/day' },
  { name: 'NVIDIA RTX 3060 Ti', algo: 'Ethash', hashrate: '50 MH/s', power: 180, efficiency: '3.60 MH/W', cost: 400, memory: '8GB GDDR6', profit: '$1.27/day' },
  { name: 'AMD RX 7900 XTX', algo: 'Ethash', hashrate: '95 MH/s', power: 300, efficiency: '3.17 MH/W', cost: 1000, memory: '24GB GDDR6', profit: '$2.42/day' },
  { name: 'AMD RX 6900 XT', algo: 'Ethash', hashrate: '65 MH/s', power: 250, efficiency: '3.85 MH/W', cost: 650, memory: '16GB GDDR6', profit: '$1.65/day' },
  { name: 'AMD RX 6800 XT', algo: 'Ethash', hashrate: '64 MH/s', power: 200, efficiency: '3.13 MH/W', cost: 550, memory: '16GB GDDR6', profit: '$1.63/day' },
  { name: 'AMD RX 6700 XT', algo: 'Ethash', hashrate: '48 MH/s', power: 150, efficiency: '3.13 MH/W', cost: 350, memory: '12GB GDDR6', profit: '$1.22/day' },
  { name: 'Intel Arc A770', algo: 'Ethash', hashrate: '42 MH/s', power: 225, efficiency: '5.36 MH/W', cost: 330, memory: '16GB GDDR6', profit: '$1.07/day' },
];

export default function MiningGpuPage() {
  return (
    <div className="space-y-8">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">GPU Mining</h1>
        <p className="text-muted-foreground mt-1">Compare the best graphics cards for mining in 2025. Hashrate, power efficiency, and profitability for NVIDIA, AMD, and Intel GPUs.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-bitcoin">12</p><p className="text-xs text-muted-foreground">GPUs Compared</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-bitcoin">RTX 4090</p><p className="text-xs text-muted-foreground">Best Performance</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-bitcoin">RX 6900 XT</p><p className="text-xs text-muted-foreground">Best Efficiency</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-bitcoin">$1-3/day</p><p className="text-xs text-muted-foreground">Estimated Profit</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>GPU Mining Comparison</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-3">GPU</th><th className="text-right p-3">Memory</th><th className="text-right p-3">Hashrate</th><th className="text-right p-3">Power</th><th className="text-right p-3">Efficiency</th><th className="text-right p-3">Est. Profit</th><th className="text-right p-3">Cost</th>
                </tr>
              </thead>
              <tbody>
                {gpus.map((g) => (
                  <tr key={g.name} className="border-b border-muted/50 hover:bg-muted/30">
                    <td className="p-3 font-medium">{g.name}</td>
                    <td className="p-3 text-right text-muted-foreground">{g.memory}</td>
                    <td className="p-3 text-right font-mono">{g.hashrate}</td>
                    <td className="p-3 text-right">{g.power}W</td>
                    <td className="p-3 text-right text-crypto-green">{g.efficiency}</td>
                    <td className="p-3 text-right font-medium">{g.profit}</td>
                    <td className="p-3 text-right">${g.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">GPU Mining Tips</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground"><strong className="text-foreground">Dual Mining:</strong> Some GPUs can mine two coins simultaneously (e.g., ETH + ALPH) to increase profits by 10-20%.</p>
            <p className="text-muted-foreground"><strong className="text-foreground">Undervolting:</strong> Reduce power consumption by 20-30% with minimal hashrate loss using MSI Afterburner or AMD Adrenalin.</p>
            <p className="text-muted-foreground"><strong className="text-foreground">Memory OC:</strong> Overclocking VRAM often gives the biggest hashrate boost. GDDR6X runs hot — keep temps under 100°C.</p>
            <p className="text-muted-foreground"><strong className="text-foreground">ETH PoS:</strong> Since Ethereum switched to Proof of Stake, GPU miners now focus on ETC, Kaspa, Ergo, Ravencoin, and other GPU-friendly coins.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Best Mining OS</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center"><span>Hive OS</span><Badge>$3/month</Badge></div>
            <div className="flex justify-between items-center"><span>SimpleMining</span><Badge>$2/month</Badge></div>
            <div className="flex justify-between items-center"><span>RaveOS</span><Badge>Free</Badge></div>
            <div className="flex justify-between items-center"><span>Minerstat</span><Badge>$1.50/month</Badge></div>
            <div className="flex justify-between items-center"><span>Windows 10/11</span><Badge>Free (license)</Badge></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
