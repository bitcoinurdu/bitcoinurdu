import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Zap, DollarSign, CheckCircle } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'CPU Mining',
  description: 'CPU mining guide for 2025. Learn which CPUs are best for RandomX, VerusHash, and other CPU-friendly algorithms.',
});

const cpus = [
  { name: 'AMD Ryzen Threadripper 7995WX', cores: 96, hashrate: '42 KH/s', algo: 'RandomX', power: 350, profit: '$2.80/day', cost: 9999 },
  { name: 'AMD Ryzen 9 7950X', cores: 16, hashrate: '18.5 KH/s', algo: 'RandomX', power: 230, profit: '$1.20/day', cost: 700 },
  { name: 'AMD Ryzen 9 5950X', cores: 16, hashrate: '16.2 KH/s', algo: 'RandomX', power: 200, profit: '$1.05/day', cost: 500 },
  { name: 'AMD Ryzen 9 5900X', cores: 12, hashrate: '13.5 KH/s', algo: 'RandomX', power: 165, profit: '$0.88/day', cost: 400 },
  { name: 'Intel Core i9-14900K', cores: 24, hashrate: '10.5 KH/s', algo: 'RandomX', power: 253, profit: '$0.68/day', cost: 600 },
  { name: 'Intel Core i9-13900K', cores: 24, hashrate: '9.8 KH/s', algo: 'RandomX', power: 240, profit: '$0.64/day', cost: 500 },
  { name: 'AMD Ryzen 7 7800X3D', cores: 8, hashrate: '8.2 KH/s', algo: 'RandomX', power: 120, profit: '$0.53/day', cost: 450 },
  { name: 'AMD Ryzen 5 7600', cores: 6, hashrate: '6.5 KH/s', algo: 'RandomX', power: 90, profit: '$0.42/day', cost: 200 },
];

const algos = [
  { name: 'RandomX', coin: 'Monero (XMR)', desc: 'ASIC-resistant, CPU-only algorithm. Best for higher-end AMD Ryzen CPUs with large L3 cache.' },
  { name: 'VerusHash', coin: 'VerusCoin (VRSC)', desc: 'Mobile and CPU-friendly. Low power consumption, supports smartphone mining.' },
  { name: 'GhostRider', coin: 'Ravencoin (RVN)', desc: 'Multi-algorithm hash. Good for CPUs with AVX2 support.' },
  { name: 'yespower', coin: 'Yenten (YTN)', desc: 'Lightweight algorithm optimized for CPUs. Low memory usage.' },
];

export default function MiningCpuPage() {
  return (
    <div className="space-y-8">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">CPU Mining</h1>
        <p className="text-muted-foreground mt-1">Is CPU mining profitable in 2025? Compare processors for RandomX and other CPU-friendly algorithms.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Best CPUs for Mining</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-3">CPU</th><th className="text-right p-3">Cores</th><th className="text-right p-3">RandomX</th><th className="text-right p-3">Power</th><th className="text-right p-3">Est. Profit</th><th className="text-right p-3">Cost</th>
                </tr>
              </thead>
              <tbody>
                {cpus.map((c) => (
                  <tr key={c.name} className="border-b border-muted/50 hover:bg-muted/30">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 text-right">{c.cores}</td>
                    <td className="p-3 text-right font-mono">{c.hashrate}</td>
                    <td className="p-3 text-right">{c.power}W</td>
                    <td className="p-3 text-right text-crypto-green">{c.profit}</td>
                    <td className="p-3 text-right">${c.cost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>CPU-Friendly Algorithms</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {algos.map((a) => (
              <div key={a.name} className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-crypto-green shrink-0 mt-0.5" />
                <div><p className="font-medium">{a.name} <Badge variant="outline" className="text-xs ml-1">{a.coin}</Badge></p><p className="text-sm text-muted-foreground">{a.desc}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>CPU Mining Tips</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Large Cache Matters:</strong> AMD Ryzen CPUs with 3D V-Cache (X3D series) perform significantly better on RandomX.</p>
            <p><strong className="text-foreground">Memory:</strong> Fast DDR5 RAM improves hashrate by 3-5% on RandomX. Use dual-channel mode.</p>
            <p><strong className="text-foreground">Cooling:</strong> CPU mining generates heat. A good air cooler or AIO is essential for sustained operation.</p>
            <p><strong className="text-foreground">Profitability:</strong> CPU mining is generally less profitable than ASIC or GPU mining, but if you already own a PC, it's free money.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
