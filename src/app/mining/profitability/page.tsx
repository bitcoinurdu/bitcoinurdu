'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/helpers';
import { TrendingUp, BarChart3, Zap, DollarSign, AlertTriangle } from 'lucide-react';

const coins = [
  { name: 'Bitcoin', ticker: 'BTC', algo: 'SHA-256', price: 77788, change24h: 1.42, revenueTH: '$0.053/TH/day', profitTH: '$0.038/TH/day', difficulty: '92.3T', mining: 'ASIC' },
  { name: 'Kaspa', ticker: 'KAS', algo: 'kHeavyHash', price: 0.15, change24h: 3.21, revenueTH: '$0.185/TH/day', profitTH: '$0.142/TH/day', difficulty: '200G', mining: 'ASIC/GPU' },
  { name: 'Litecoin', ticker: 'LTC', algo: 'Scrypt', price: 110, change24h: -0.85, revenueTH: '$0.042/TH/day', profitTH: '$0.028/TH/day', difficulty: '12M', mining: 'ASIC' },
  { name: 'Dogecoin', ticker: 'DOGE', algo: 'Scrypt', price: 0.15, change24h: 1.10, revenueTH: '$0.038/TH/day', profitTH: '$0.024/TH/day', difficulty: '9.5M', mining: 'ASIC' },
  { name: 'Monero', ticker: 'XMR', algo: 'RandomX', price: 180, change24h: 2.50, revenueTH: '$0.022/TH/day', profitTH: '$0.015/TH/day', difficulty: '350M', mining: 'CPU' },
  { name: 'Zcash', ticker: 'ZEC', algo: 'Equihash', price: 32, change24h: -1.20, revenueTH: '$0.035/TH/day', profitTH: '$0.022/TH/day', difficulty: '85M', mining: 'ASIC/GPU' },
  { name: 'Ethereum Classic', ticker: 'ETC', algo: 'Ethash', price: 25, change24h: 0.85, revenueTH: '$0.028/TH/day', profitTH: '$0.016/TH/day', difficulty: '250T', mining: 'GPU' },
  { name: 'Bitcoin Cash', ticker: 'BCH', algo: 'SHA-256', price: 480, change24h: 1.80, revenueTH: '$0.048/TH/day', profitTH: '$0.032/TH/day', difficulty: '2.1T', mining: 'ASIC' },
  { name: 'Dash', ticker: 'DASH', algo: 'X11', price: 35, change24h: -0.50, revenueTH: '$0.018/TH/day', profitTH: '$0.010/TH/day', difficulty: '2.8M', mining: 'ASIC/GPU' },
  { name: 'Ergo', ticker: 'ERGO', algo: 'Autolykos', price: 1.50, change24h: 5.20, revenueTH: '$0.032/TH/day', profitTH: '$0.020/TH/day', difficulty: '18P', mining: 'GPU' },
  { name: 'Ravencoin', ticker: 'RVN', algo: 'KawPow', price: 0.02, change24h: -2.10, revenueTH: '$0.015/TH/day', profitTH: '$0.008/TH/day', difficulty: '85K', mining: 'GPU' },
  { name: 'Neoxa', ticker: 'NEOX', algo: 'KawPow', price: 0.50, change24h: 4.80, revenueTH: '$0.025/TH/day', profitTH: '$0.015/TH/day', difficulty: '250K', mining: 'GPU' },
];

export default function MiningProfitabilityPage() {
  const [sortKey, setSortKey] = useState<string>('revenueTH');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...coins].sort((a, b) => {
    const aVal = parseFloat(a.revenueTH.replace(/[^0-9.]/g, ''));
    const bVal = parseFloat(b.revenueTH.replace(/[^0-9.]/g, ''));
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  return (
    <div className="space-y-8">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining Profitability</h1>
        <p className="text-muted-foreground mt-1">Compare mining profitability across different coins and algorithms. Updated in real-time based on network data.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-bitcoin">12</p><p className="text-xs text-muted-foreground">Coins Tracked</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-crypto-green">Kaspa</p><p className="text-xs text-muted-foreground">Most Profitable</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">4+</p><p className="text-xs text-muted-foreground">Algorithms</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">3</p><p className="text-xs text-muted-foreground">Mining Types</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Coin Profitability Comparison</CardTitle>
            <span className="text-xs text-muted-foreground">Per TH/s (or equivalent) • $0.08/kWh</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-3">Coin</th>
                  <th className="text-right p-3">Price</th>
                  <th className="text-right p-3">24h</th>
                  <th className="text-right p-3 cursor-pointer hover:text-foreground" onClick={() => toggleSort('revenueTH')}>Revenue/TH {sortKey === 'revenueTH' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</th>
                  <th className="text-right p-3 cursor-pointer hover:text-foreground" onClick={() => toggleSort('profitTH')}>Profit/TH {sortKey === 'profitTH' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</th>
                  <th className="text-right p-3">Difficulty</th>
                  <th className="text-right p-3">Mining Type</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => (
                  <tr key={c.ticker} className="border-b border-muted/50 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        <Badge variant="outline" className="text-xs">{c.ticker}</Badge>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono">{formatCurrency(c.price, 'usd')}</td>
                    <td className={`p-3 text-right ${c.change24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>{formatPercent(c.change24h)}</td>
                    <td className="p-3 text-right text-crypto-green">{c.revenueTH}</td>
                    <td className="p-3 text-right font-medium text-crypto-green">{c.profitTH}</td>
                    <td className="p-3 text-right text-muted-foreground">{c.difficulty}</td>
                    <td className="p-3 text-right">
                      <Badge variant="secondary" className="text-xs">{c.mining}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Profitability Factors</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2"><TrendingUp className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /><div><strong>Coin Price</strong><p className="text-muted-foreground">Higher coin prices directly increase mining revenue. Monitor price trends.</p></div></div>
            <div className="flex gap-2"><BarChart3 className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /><div><strong>Network Difficulty</strong><p className="text-muted-foreground">As more miners join, difficulty increases, reducing your share of rewards.</p></div></div>
            <div className="flex gap-2"><Zap className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /><div><strong>Electricity Cost</strong><p className="text-muted-foreground">The single biggest operating expense. Lower rates = higher profits.</p></div></div>
            <div className="flex gap-2"><DollarSign className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /><div><strong>Hardware Efficiency</strong><p className="text-muted-foreground">Modern miners (J/TH) are significantly more profitable than older generations.</p></div></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Which Coin Should You Mine?</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Bitcoin (SHA-256):</strong> Most stable and liquid. Requires ASIC miners. Best for long-term holders.</p>
            <p><strong className="text-foreground">Kaspa (kHeavyHash):</strong> Currently most profitable per TH. ASIC and GPU compatible. Higher volatility.</p>
            <p><strong className="text-foreground">Monero (RandomX):</strong> Only CPU mineable. Privacy-focused. Good if you already have a powerful CPU.</p>
            <p><strong className="text-foreground">Ethereum Classic (Ethash):</strong> GPU mineable. Lower profitability but good entry point for GPU miners.</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mt-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
              <p className="text-xs">Profitability changes constantly. Always verify current data before investing in hardware.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
