'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Cpu, Zap, DollarSign, TrendingUp, Hash, ExternalLink, Gauge, Database, RefreshCw, AlertCircle, BarChart3, ShoppingCart, Info, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores';
import { convertCurrency, getCurrencySymbol } from '@/lib/currency';
import type { MiningHardware } from '@/lib/mining/data';
import { COIN_MAP } from '@/lib/mining-api';
import { MINER_ANNOUNCEMENT } from '@/lib/mining/announcement';
import { fetchBTCData, fetchCoinPriceWithCache, calcGrossDaily } from '@/lib/mining/realtime-service';

interface Props {
  hardware: MiningHardware;
}

export function MinerDetailClient({ hardware: hw }: Props) {
  const { currency } = useAppStore();
  const [elecCost, setElecCost] = useState(0.08);
  const [profit, setProfit] = useState({ grossUsd: 0, powerCostUsd: 0, netDailyUsd: 0, paybackDays: 9999, earningsBtc: 0 });
  const [coinPrice, setCoinPrice] = useState(0);
  const [coinChange, setCoinChange] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState<'live' | 'cached' | 'fallback'>('live');
  const [activeTab, setActiveTab] = useState('overview');

  const primaryCoin = hw.coins[0];
  const coinInfo = primaryCoin ? COIN_MAP[primaryCoin.ticker] : null;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [btcDiff, priceData] = await Promise.all([
          fetchBTCData(),
          coinInfo ? fetchCoinPriceWithCache(coinInfo.coingeckoId) : null,
        ]);
        if (!mounted) return;
        const coinPriceUsd = priceData?.usd || 65000;
        setCoinPrice(coinPriceUsd);
        setCoinChange(priceData?.usd_24h_change);

        const r = calcGrossDaily(hw, coinPriceUsd, btcDiff.difficulty, btcDiff.blockReward);
        setProfit(r);

        if (btcDiff.source === 'live' && priceData) setDataStatus('live');
        else if (btcDiff.source === 'fallback' || !priceData) setDataStatus('fallback');
        else setDataStatus('cached');
      } catch {
        if (!mounted) return;
        const r = calcGrossDaily(hw, 65000, 92300000000000, 3.125);
        setProfit(r);
        setCoinPrice(65000);
        setDataStatus('fallback');
      }
      if (mounted) setLoading(false);
    };
    load();
    const interval = setInterval(load, 120000);
    return () => { mounted = false; clearInterval(interval); };
    }, [hw, elecCost, coinInfo, primaryCoin?.ticker]);

  const sym = getCurrencySymbol(currency);
  const convertCost = (usd: number) => convertCurrency(usd, 'USD', currency);

  const netYearly = profit.netDailyUsd * 365;
  const grossDaily = profit.grossUsd;
  const grossMonthly = profit.grossUsd * 30;
  const grossYearly = profit.grossUsd * 365;
  const netMonthly = profit.netDailyUsd * 30;
  const powerCostDaily = profit.powerCostUsd;
  const powerCostMonthly = profit.powerCostUsd * 30;
  const powerCostYearly = profit.powerCostUsd * 365;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/mining" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to Mining Hardware
      </Link>

      {MINER_ANNOUNCEMENT.enabled && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${
          MINER_ANNOUNCEMENT.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
          MINER_ANNOUNCEMENT.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
          MINER_ANNOUNCEMENT.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
          'bg-blue-500/10 border-blue-500/30'
        }`}>
          <div className="flex-1">
            <p className="text-sm font-semibold">{MINER_ANNOUNCEMENT.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{MINER_ANNOUNCEMENT.message}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {loading ? (
            <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin" /> Loading live data...</span>
          ) : (
            <span className={`flex items-center gap-1 ${
              dataStatus === 'live' ? 'text-crypto-green' :
              dataStatus === 'fallback' ? 'text-yellow-500' : 'text-blue-400'
            }`}>
              <Database className="h-3 w-3" />
              {dataStatus === 'live' ? 'Live' : dataStatus === 'fallback' ? 'Fallback (offline)' : 'Cached'}
              <RefreshCw className="h-3 w-3 ml-1 cursor-pointer hover:text-foreground" onClick={() => window.location.reload()} />
            </span>
          )}
        </div>
        {coinPrice > 0 && (
          <div className="text-xs text-muted-foreground">
            {primaryCoin?.ticker || 'BTC'}: ${coinPrice.toLocaleString()} {coinChange !== undefined && (
              <span className={coinChange >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>
                {coinChange >= 0 ? '+' : ''}{coinChange.toFixed(2)}%
              </span>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-card via-card to-muted/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${hw.type === 'ASIC' ? 'bg-bitcoin/10' : 'bg-purple-500/10'}`}>
              {hw.type === 'ASIC' ? <Cpu className="h-8 w-8 text-bitcoin" /> : <Hash className="h-8 w-8 text-purple-500" />}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{hw.model}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="secondary">{hw.manufacturer}</Badge>
                <Badge variant="outline">{hw.type}</Badge>
                <Badge variant="outline">{hw.algorithm}</Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Net Profit Estimate</p>
            {loading ? (
              <p className="text-3xl font-bold text-muted-foreground animate-pulse">---</p>
            ) : (
              <p className={`text-3xl font-bold ${profit.netDailyUsd >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {sym}{convertCost(profit.netDailyUsd).toFixed(2)}<span className="text-sm text-muted-foreground">/day</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">{hw.releaseDate} release</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Gauge className="h-4 w-4" /> Hashrate</div>
            <p className="text-xl font-bold">{hw.hashrate} <span className="text-sm font-normal text-muted-foreground">{hw.hashrateUnit}</span></p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Zap className="h-4 w-4" /> Power Draw</div>
            <p className="text-xl font-bold">{hw.power} <span className="text-sm font-normal text-muted-foreground">{hw.powerUnit}</span></p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><TrendingUp className="h-4 w-4" /> Efficiency</div>
            <p className="text-xl font-bold">{hw.efficiency} <span className="text-sm font-normal text-muted-foreground">{hw.efficiencyUnit}</span></p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><DollarSign className="h-4 w-4" /> Capital Cost</div>
            <p className="text-xl font-bold">{sym}{convertCost(hw.cost).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-muted/20 border text-xs text-muted-foreground flex items-center gap-2">
          <Database className="h-3.5 w-3.5 shrink-0" />
          <span>
            Earnings calculated using live network difficulty
            {dataStatus === 'live' ? ' from Mempool.space' : ''} and coin price from CoinGecko.
            {dataStatus === 'fallback' ? ' Using cached values — data may be stale.' : ''}
          </span>
        </div>
      </div>

      <div className="border-b border-border mb-6">
        <div className="flex gap-0 -mb-px overflow-x-auto">
          {[{ id: 'overview', label: 'Profitability', icon: TrendingUp },
            { id: 'specs', label: 'Specifications', icon: Cpu },
            { id: 'vendors', label: 'Where to Buy', icon: ShoppingCart },
            { id: 'coins', label: 'Minable Coins', icon: Hash },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-bitcoin text-bitcoin'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-bitcoin" /> Live Profitability Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label className="text-sm font-medium mb-1 block">Electricity Cost ($/kWh)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.01"
                  max="0.50"
                  step="0.01"
                  value={elecCost}
                  onChange={(e) => setElecCost(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-bold text-bitcoin min-w-[80px] text-right">${elecCost.toFixed(2)}</span>
              </div>
            </div>
            <div className="mb-4 p-3 rounded-lg bg-muted/20 border text-xs text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>
                Daily earnings = (hashrate × 86400 × block reward) ÷ (difficulty × 2³²) × coin price.
                {profit.earningsBtc > 0 && ` Est. ${profit.earningsBtc.toFixed(8)} BTC/day`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Metric</th>
                    <th className="text-right py-3 px-4 font-medium">Daily</th>
                    <th className="text-right py-3 px-4 font-medium">Monthly</th>
                    <th className="text-right py-3 px-4 font-medium">Yearly</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Gross Income</td>
                    <td className="py-3 px-4 text-right text-crypto-green">{sym}{convertCost(grossDaily).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-crypto-green">{sym}{convertCost(grossMonthly).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-crypto-green">{sym}{convertCost(grossYearly).toFixed(2)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-muted-foreground">Electricity Cost</td>
                    <td className="py-3 px-4 text-right text-crypto-red">{sym}{convertCost(powerCostDaily).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-crypto-red">{sym}{convertCost(powerCostMonthly).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-crypto-red">{sym}{convertCost(powerCostYearly).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-lg">Net Profit</td>
                    <td className={`py-3 px-4 text-right font-bold text-lg ${profit.netDailyUsd >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {sym}{convertCost(profit.netDailyUsd).toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold text-lg ${netMonthly >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {sym}{convertCost(netMonthly).toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold text-lg ${netYearly >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {sym}{convertCost(netYearly).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Payback Period:</span>
                <Badge variant={profit.paybackDays < 730 ? 'default' : 'secondary'}>
                  {profit.paybackDays < 365
                    ? `${profit.paybackDays} days (${(profit.paybackDays / 30).toFixed(1)} mo)`
                    : `${(profit.paybackDays / 365).toFixed(1)} years`}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Coin Price:</span>
                <Badge variant="outline">${coinPrice.toLocaleString()}</Badge>
              </div>
              {profit.earningsBtc > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Daily BTC:</span>
                  <Badge variant="outline">{profit.earningsBtc.toFixed(8)} BTC</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'specs' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5 text-bitcoin" /> Full Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Manufacturer', value: hw.manufacturer },
                { label: 'Model', value: hw.model },
                { label: 'Type', value: hw.type },
                { label: 'Algorithm', value: `${hw.algorithm} (${hw.algorithmFull})` },
                { label: 'Hashrate', value: `${hw.hashrate} ${hw.hashrateUnit}` },
                { label: 'Power Consumption', value: `${hw.power} ${hw.powerUnit}` },
                { label: 'Efficiency', value: `${hw.efficiency} ${hw.efficiencyUnit}` },
                { label: 'Dimensions', value: hw.dimensions },
                { label: 'Noise Level', value: hw.noise },
                { label: 'Voltage', value: hw.voltage },
                { label: 'Weight', value: hw.weight },
                { label: 'Release Date', value: hw.releaseDate },
              ].map((spec) => (
                <div key={spec.label} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{spec.label}</span>
                  <span className="text-sm font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'vendors' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-bitcoin" /> Where to Buy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Bitmain Official', url: 'https://shop.bitmain.com' },
                { name: 'Asic Miner Value', url: 'https://www.asicminervalue.com' },
                { name: 'Miner Bros', url: 'https://minerbros.com' },
                { name: 'Coin Mining Central', url: 'https://coinminingcentral.com' },
                { name: 'Crypto Miner Bros', url: 'https://cryptominerbros.com' },
              ].map((vendor) => (
                <a key={vendor.name} href={vendor.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 transition-all group"
                >
                  <span className="text-sm font-medium group-hover:text-bitcoin transition-colors">{vendor.name}</span>
                  <span className="flex items-center gap-1.5 text-xs text-bitcoin bg-bitcoin/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    Visit <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-bitcoin/5 to-transparent border border-bitcoin/10 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Prices and availability vary by vendor. Click to compare and find the best deal.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'coins' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5 text-bitcoin" /> Minable Coins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {hw.coins.map((coin) => (
                <Link
                  key={coin.ticker}
                  href={`/coins/${coin.ticker.toLowerCase()}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-card hover:bg-accent transition-colors"
                >
                  <span className="font-bold text-bitcoin">{coin.ticker}</span>
                  <span className="text-sm text-muted-foreground">{coin.name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-yellow-600"><AlertCircle className="h-4 w-4" /> Risk Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p><strong>Not Financial Advice:</strong> All profitability estimates shown on this page are for informational purposes only. They are calculated using current network difficulty, block rewards, and coin prices from public APIs. Actual earnings may differ significantly due to changing network difficulty, pool fees (typically 1-4%), hardware variations, and market volatility.</p>
          <p><strong>No Guarantee of Returns:</strong> Mining profitability can change rapidly. Past performance and current estimates do not guarantee future results. Hardware prices are manufacturer MSRP or estimated market prices — actual retail prices vary. Always factor in shipping, customs, electricity rate changes, and mining pool fees.</p>
          <p><strong>DYOR:</strong> This data is provided "as-is" from Mempool.space, CoinGecko, and reference sites. Verify all numbers independently before making purchase decisions. Cryptocurrency mining carries substantial financial risk — never invest more than you can afford to lose.</p>
        </CardContent>
      </Card>

    </div>
  );
}
