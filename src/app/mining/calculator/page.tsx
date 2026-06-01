'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils/helpers';
import { Calculator, Zap, Clock, BarChart3, TrendingUp } from 'lucide-react';

const miners = [
  { id: 'antminer-s21-pro', name: 'Antminer S21 Pro', algo: 'SHA-256', coin: 'BTC', hashrate: 234, unit: 'TH/s', power: 3510, cost: 5500 },
  { id: 'antminer-s21', name: 'Antminer S21', algo: 'SHA-256', coin: 'BTC', hashrate: 200, unit: 'TH/s', power: 3500, cost: 4200 },
  { id: 'antminer-s21-hyd', name: 'Antminer S21 Hydro', algo: 'SHA-256', coin: 'BTC', hashrate: 335, unit: 'TH/s', power: 5360, cost: 8500 },
  { id: 'whatsminer-m60s', name: 'Whatsminer M60S', algo: 'SHA-256', coin: 'BTC', hashrate: 194, unit: 'TH/s', power: 3164, cost: 5100 },
  { id: 'whatsminer-m56s', name: 'Whatsminer M56S', algo: 'SHA-256', coin: 'BTC', hashrate: 150, unit: 'TH/s', power: 2700, cost: 3800 },
  { id: 'antminer-s19-pro', name: 'Antminer S19 Pro', algo: 'SHA-256', coin: 'BTC', hashrate: 110, unit: 'TH/s', power: 3250, cost: 2800 },
  { id: 'antminer-ks5-pro', name: 'Antminer KS5 Pro', algo: 'KHeavyHash', coin: 'KAS', hashrate: 21, unit: 'TH/s', power: 3150, cost: 3500 },
  { id: 'antminer-ks7', name: 'Antminer KS7', algo: 'KHeavyHash', coin: 'KAS', hashrate: 4.8, unit: 'TH/s', power: 2800, cost: 4500 },
  { id: 'iceRiver-ks7', name: 'IceRiver KS7', algo: 'KHeavyHash', coin: 'KAS', hashrate: 3.6, unit: 'TH/s', power: 3400, cost: 4200 },
  { id: 'antminer-l7', name: 'Antminer L7', algo: 'Scrypt', coin: 'LTC', hashrate: 9.5, unit: 'GH/s', power: 3425, cost: 7800 },
  { id: 'goldshell-lt7', name: 'GoldShell LT7', algo: 'Scrypt', coin: 'LTC', hashrate: 9.8, unit: 'GH/s', power: 3500, cost: 6500 },
  { id: 'antminer-z15-pro', name: 'Antminer Z15 Pro', algo: 'Equihash', coin: 'ZEC', hashrate: 840, unit: 'KH/s', power: 2780, cost: 7999 },
  { id: 'antminer-z15', name: 'Antminer Z15', algo: 'Equihash', coin: 'ZEC', hashrate: 420, unit: 'KH/s', power: 1510, cost: 2999 },
];

const COIN_NETWORK: Record<string, { networkHPS: number; blockTimeSec: number; blockReward: number; coingeckoId: string }> = {
  'SHA-256': { networkHPS: 750e18, blockTimeSec: 600, blockReward: 3.125, coingeckoId: 'bitcoin' },
  'KHeavyHash': { networkHPS: 850e18, blockTimeSec: 1, blockReward: 56.94, coingeckoId: 'kaspa' },
  'Scrypt': { networkHPS: 800e12, blockTimeSec: 150, blockReward: 6.25, coingeckoId: 'litecoin' },
  'Equihash': { networkHPS: 16.4e15, blockTimeSec: 75, blockReward: 1.25, coingeckoId: 'zcash' },
};

function normalizeToHs(hashrate: number, unit: string): number {
  switch (unit) {
    case 'PH/s': return hashrate * 1e15;
    case 'TH/s': return hashrate * 1e12;
    case 'GH/s': return hashrate * 1e9;
    case 'MH/s': return hashrate * 1e6;
    case 'KH/s': return hashrate * 1e3;
    default: return hashrate;
  }
}

export default function MiningCalculatorPage() {
  const [selectedMiner, setSelectedMiner] = useState(miners[0].id);
  const [elecRate, setElecRate] = useState(0.08);
  const [poolFee, setPoolFee] = useState(2);
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const ids = Object.values(COIN_NETWORK).map(c => c.coingeckoId).join(',');
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          const p: Record<string, number> = {};
          for (const [algo, info] of Object.entries(COIN_NETWORK)) {
            p[algo] = d[info.coingeckoId]?.usd || 0;
          }
          setPrices(p);
        }
      })
      .catch(() => {});
  }, []);

  const miner = miners.find((m) => m.id === selectedMiner) || miners[0];
  const netData = COIN_NETWORK[miner.algo] || COIN_NETWORK['SHA-256'];
  const coinPrice = prices[miner.algo] || 0;

  const minerHs = normalizeToHs(miner.hashrate, miner.unit);
  const minerShare = netData.networkHPS > 0 ? minerHs / netData.networkHPS : 0;
  const blocksPerDay = netData.blockTimeSec > 0 ? 86400 / netData.blockTimeSec : 0;
  const earningsCoin = minerShare * blocksPerDay * netData.blockReward;
  const earningsUsd = earningsCoin * coinPrice;
  const poolFeeDed = earningsUsd * (poolFee / 100);
  const powerCost = (miner.power / 1000) * 24 * elecRate;
  const netDaily = earningsUsd - poolFeeDed - powerCost;
  const netMonthly = netDaily * 30;
  const netYearly = netDaily * 365;
  const paybackDays = netDaily > 0.01 ? Math.ceil(miner.cost / netDaily) : Infinity;

  return (
    <div className="space-y-8">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>

      <div>
        <h1 className="text-3xl font-bold">Mining Profitability Calculator</h1>
        <p className="text-muted-foreground mt-1">Calculate mining profitability for any ASIC miner with live network data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-bitcoin" /> Calculator Inputs</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">ASIC Miner</label>
                <select value={selectedMiner} onChange={(e) => setSelectedMiner(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50">
                  {miners.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} — {m.hashrate} {m.unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Electricity Rate — ${elecRate.toFixed(2)}/kWh</label>
                <input type="range" value={elecRate * 100} onChange={(e) => setElecRate(Number(e.target.value) / 100)} min={1} max={30} step={0.5}
                  className="w-full accent-bitcoin" />
                <div className="flex justify-between text-xs text-muted-foreground"><span>$0.01</span><span>$0.30</span></div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{miner.coin} Price (USD)</label>
                <input type="number" value={coinPrice || ''} onChange={(e) => {
                  const v = Number(e.target.value) || 0;
                  setPrices(prev => ({ ...prev, [miner.algo]: v }));
                }}
                  placeholder={coinPrice > 0 ? String(coinPrice) : 'Loading...'}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Pool Fee — {poolFee}%</label>
                <input type="range" value={poolFee} onChange={(e) => setPoolFee(Number(e.target.value))} min={0} max={5} step={0.5}
                  className="w-full accent-bitcoin" />
                <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span>5%</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Hardware Specs</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Hashrate</span><span>{miner.hashrate} {miner.unit}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Power</span><span>{miner.power}W</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Algorithm</span><span>{miner.algo}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Coin</span><span>{miner.coin}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Hardware Cost</span><span>{formatCurrency(miner.cost, 'usd')}</span></div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="pt-4 text-center"><Zap className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold">{formatCurrency(netDaily, 'usd')}</p><p className="text-xs text-muted-foreground">Daily Profit</p></CardContent></Card>
            <Card><CardContent className="pt-4 text-center"><BarChart3 className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold">{formatCurrency(netMonthly, 'usd')}</p><p className="text-xs text-muted-foreground">Monthly Profit</p></CardContent></Card>
            <Card><CardContent className="pt-4 text-center"><TrendingUp className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold">{formatCurrency(netYearly, 'usd')}</p><p className="text-xs text-muted-foreground">Yearly Profit</p></CardContent></Card>
            <Card><CardContent className="pt-4 text-center"><Clock className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold">{paybackDays === Infinity ? '∞' : paybackDays}</p><p className="text-xs text-muted-foreground">Payback Days</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Detailed Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b"><span className="text-muted-foreground">Gross Revenue (daily)</span><span>{formatCurrency(earningsUsd, 'usd')}</span></div>
                <div className="flex justify-between pb-2 border-b"><span className="text-muted-foreground">{miner.coin} per day</span><span>{formatNumber(earningsCoin, 8)}</span></div>
                <div className="flex justify-between pb-2 border-b"><span className="text-muted-foreground">Pool Fee ({poolFee}%)</span><span className="text-crypto-red">-{formatCurrency(poolFeeDed, 'usd')}</span></div>
                <div className="flex justify-between pb-2 border-b"><span className="text-muted-foreground">Electricity ({miner.power}W × 24h × ${elecRate.toFixed(2)}/kWh)</span><span className="text-crypto-red">-{formatCurrency(powerCost, 'usd')}</span></div>
                <div className="flex justify-between pt-1 font-semibold"><span>Net Daily Profit</span><span className={netDaily >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>{formatCurrency(netDaily, 'usd')}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hardware Cost</span><span>{formatCurrency(miner.cost, 'usd')}</span></div>
                <div className="flex justify-between pt-1 font-semibold"><span>Return on Investment</span><span>{paybackDays === Infinity ? '—' : `${((netYearly / miner.cost) * 100).toFixed(0)}% APR`}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Monthly Projection (Year 1)</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2">Month</th><th className="text-right py-2">Revenue</th><th className="text-right py-2">Power</th><th className="text-right py-2">Pool Fee</th><th className="text-right py-2">Net Profit</th><th className="text-right py-2">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 12 }, (_, i) => {
                      const rev = earningsUsd * 30;
                      const pow = powerCost * 30;
                      const fee = poolFeeDed * 30;
                      const net = rev - pow - fee;
                      const cum = net * (i + 1) - miner.cost;
                      return (
                        <tr key={i} className="border-b border-muted/50">
                          <td className="py-2">Month {i + 1}</td>
                          <td className="text-right">{formatCurrency(rev, 'usd')}</td>
                          <td className="text-right text-crypto-red">-{formatCurrency(pow, 'usd')}</td>
                          <td className="text-right text-crypto-red">-{formatCurrency(fee, 'usd')}</td>
                          <td className={`text-right font-medium ${net >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>{formatCurrency(net, 'usd')}</td>
                          <td className={`text-right ${cum >= 0 ? 'text-crypto-green' : 'text-muted-foreground'}`}>{formatCurrency(cum, 'usd')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
