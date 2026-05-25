'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Cpu, DollarSign, Hash, Zap, BarChart3, ExternalLink, Info, RefreshCw, TrendingUp, X, ChevronDown, Filter, Database } from 'lucide-react';
import { useAppStore } from '@/stores';
import { convertCurrency, getCurrencySymbol } from '@/lib/currency';
import { MINING_HARDWARE } from '@/lib/mining/data';
import type { MiningHardware } from '@/lib/mining/data';
import { COIN_MAP } from '@/lib/mining-api';
import { fetchBTCData, fetchCoinPriceWithCache, calcGrossDaily, getMfrStyle, getMfrInitials, REFERENCE_PRICES } from '@/lib/mining/realtime-service';

const ELEC_RATE_DEFAULT = 0.08;

function getUnique<T>(arr: T[], fn: (item: T) => string): string[] {
  return [...new Set(arr.map(fn))].sort();
}

function FilterDropdown({ label, options, selected, onChange, onClear }: {
  label: string; options: string[]; selected: string; onChange: (v: string) => void; onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all backdrop-blur-md ${selected ? 'bg-bitcoin/10 border-bitcoin/30 text-bitcoin' : 'bg-white/5 dark:bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20'}`}
      >
        <Filter className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{label}</span>
        {selected && <span className="text-bitcoin font-medium truncate max-w-[80px]">: {selected}</span>}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 w-56 max-h-72 overflow-y-auto rounded-xl border bg-card shadow-lg p-2">
            <div className="flex items-center justify-between px-2 py-1 border-b mb-1">
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
              {selected && <button onClick={() => { onClear(); setOpen(false); }} className="text-xs text-bitcoin hover:underline">Clear</button>}
            </div>
            <button onClick={() => { onChange(''); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!selected ? 'bg-bitcoin/10 text-bitcoin font-medium' : 'hover:bg-muted'}`}
            >All {label}s</button>
            {options.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selected === opt ? 'bg-bitcoin/10 text-bitcoin font-medium' : 'hover:bg-muted'}`}
              >{opt}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function MiningClient() {
  const { currency } = useAppStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ASIC'>('all');
  const [brandFilter, setBrandFilter] = useState('');
  const [algoFilter, setAlgoFilter] = useState('');
  const [coinFilter, setCoinFilter] = useState('');
  const [sortBy, setSortBy] = useState<'profit' | 'hashrate' | 'efficiency' | 'cost'>('profit');
  const [liveProfits, setLiveProfits] = useState<Record<string, { netDaily: number; grossDaily: number; paybackDays: number }>>({});
  const [coinPrices, setCoinPrices] = useState<Record<string, { usd: number; usd_24h_change?: number }>>({});
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState<'live' | 'cached' | 'fallback'>('live');

  const allBrands = useMemo(() => getUnique(MINING_HARDWARE, h => h.manufacturer), []);
  const allAlgos = useMemo(() => getUnique(MINING_HARDWARE, h => h.algorithm), []);
  const allCoins = useMemo(() => {
    const set = new Set<string>();
    MINING_HARDWARE.forEach(h => h.coins.forEach(c => set.add(c.ticker)));
    return [...set].sort();
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const uniqueIds = [...new Set(MINING_HARDWARE.flatMap(h => h.coins.map(c => COIN_MAP[c.ticker]?.coingeckoId).filter((x): x is string => !!x)))];
        const [btcDiff, prices] = await Promise.all([
          fetchBTCData(),
          Promise.all(uniqueIds.map(async (id) => {
            const data = await fetchCoinPriceWithCache(id);
            return { id, data };
          })),
        ]);
        if (!mounted) return;

        const priceMap: Record<string, { usd: number; usd_24h_change?: number }> = {};
        prices.forEach(p => { if (p.data) priceMap[p.id] = { usd: p.data.usd, usd_24h_change: p.data.usd_24h_change }; });
        setCoinPrices(priceMap);

        const profitMap: Record<string, { netDaily: number; grossDaily: number; paybackDays: number }> = {};
        const btcPrice = priceMap['bitcoin']?.usd || 65000;
        const difficulty = btcDiff.difficulty > 0 ? btcDiff.difficulty : 92300000000000;
        const blockReward = btcDiff.blockReward || 3.125;

        MINING_HARDWARE.forEach(h => {
          const primaryCoin = h.coins[0];
          const coinInfo = primaryCoin ? COIN_MAP[primaryCoin.ticker] : null;
          const refPrice = primaryCoin ? (REFERENCE_PRICES[primaryCoin.ticker] || btcPrice) : btcPrice;
          const cp = coinInfo ? (priceMap[coinInfo.coingeckoId]?.usd || refPrice) : btcPrice;
          const r = calcGrossDaily(h, cp, difficulty, blockReward);
          profitMap[h.id] = { netDaily: r.netDailyUsd, grossDaily: r.grossUsd, paybackDays: r.paybackDays };
        });
        setLiveProfits(profitMap);
        setDataStatus(btcDiff.source === 'live' && prices.some(p => p.data) ? 'live' : btcDiff.source === 'fallback' ? 'fallback' : 'cached');
      } catch {
        if (!mounted) return;
        const fallback: Record<string, { netDaily: number; grossDaily: number; paybackDays: number }> = {};
        MINING_HARDWARE.forEach(h => { fallback[h.id] = { netDaily: 0, grossDaily: 0, paybackDays: 9999 }; });
        setLiveProfits(fallback);
        setDataStatus('fallback');
      }
      if (mounted) setLoading(false);
    };
    load();
    const interval = setInterval(load, 120000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const filtered = useMemo(() => MINING_HARDWARE
    .filter((h) => {
      const q = search.toLowerCase().trim();
      if (q && !h.model.toLowerCase().includes(q) && !h.manufacturer.toLowerCase().includes(q) &&
          !h.algorithm.toLowerCase().includes(q) && !h.algorithmFull.toLowerCase().includes(q) &&
          !h.coins.some(c => c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) &&
          !h.id.toLowerCase().includes(q)) return false;
      return true;
    })
    .filter((h) => typeFilter === 'all' || h.type === typeFilter)
    .filter((h) => !brandFilter || h.manufacturer.toLowerCase() === brandFilter.toLowerCase())
    .filter((h) => !algoFilter || h.algorithm.toLowerCase() === algoFilter.toLowerCase())
    .filter((h) => !coinFilter || h.coins.some(c => c.ticker.toLowerCase() === coinFilter.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'profit': return (liveProfits[b.id]?.netDaily || 0) - (liveProfits[a.id]?.netDaily || 0);
        case 'hashrate': return b.hashrate - a.hashrate;
        case 'efficiency': return a.efficiency - b.efficiency;
        case 'cost': return a.cost - b.cost;
        default: return 0;
      }
    }), [search, typeFilter, brandFilter, algoFilter, coinFilter, sortBy, liveProfits]);

  const sym = getCurrencySymbol(currency);
  const convertCost = (usd: number) => convertCurrency(usd, 'USD', currency);

  const stats = useMemo(() => ({
    total: MINING_HARDWARE.length,
    asicCount: MINING_HARDWARE.filter(h => h.type === 'ASIC').length,
    gpuCount: MINING_HARDWARE.filter(h => h.type === 'GPU').length,
    avgProfit: Object.values(liveProfits).reduce((s, p) => s + p.netDaily, 0) / (Object.keys(liveProfits).length || 1),
    totalTh: MINING_HARDWARE.reduce((s, h) => {
      const u = h.hashrateUnit;
      const v = h.hashrate;
      if (u === 'PH/s') return s + v * 1000;
      if (u === 'TH/s') return s + v;
      if (u === 'GH/s') return s + v / 1000;
      if (u === 'MH/s') return s + v / 1e6;
      return s;
    }, 0),
  }), [liveProfits]);

  const activeFilters = [brandFilter, algoFilter, coinFilter].filter(Boolean).length + (typeFilter !== 'all' ? 1 : 0);

  return (
    <div className="w-full max-w-full px-2 md:px-8 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold">⛏️ Mining Hardware Comparison</h1>
          <p className="text-muted-foreground text-sm mt-1">📊 Real-time profitability — {stats.total} miners tracked live</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 sm:mt-0">
          {loading ? (
            <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin" /> Loading...</span>
          ) : (
            <span className={`flex items-center gap-1 ${dataStatus === 'live' ? 'text-crypto-green' : 'text-yellow-500'}`}>
              <Database className="h-3 w-3" />
              {dataStatus === 'live' ? 'Live data' : 'Cached'}
              <RefreshCw className="h-3 w-3 ml-1 cursor-pointer hover:text-foreground" onClick={() => window.location.reload()} />
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/10"><CardContent className="pt-4"><div className="flex items-center gap-3">
          <Cpu className="h-8 w-8 text-bitcoin" /><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">🖥️ Total Miners</p></div>
        </div></CardContent></Card>
        <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/10"><CardContent className="pt-4"><div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-yellow-500" /><div><p className="text-2xl font-bold">{stats.asicCount}</p><p className="text-xs text-muted-foreground">⚡ ASIC</p></div>
        </div></CardContent></Card>
        <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/10"><CardContent className="pt-4"><div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-purple-500" /><div><p className="text-2xl font-bold">{stats.gpuCount}</p><p className="text-xs text-muted-foreground">🎮 GPU/Other</p></div>
        </div></CardContent></Card>
        <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/10"><CardContent className="pt-4"><div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-crypto-green" /><div><p className="text-2xl font-bold">{sym}{convertCost(stats.avgProfit).toFixed(2)}</p><p className="text-xs text-muted-foreground">💰 Avg Daily Net</p></div>
        </div></CardContent></Card>
        <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/10"><CardContent className="pt-4"><div className="flex items-center gap-3">
          <Hash className="h-8 w-8 text-blue-500" /><div><p className="text-2xl font-bold">~{stats.totalTh.toFixed(0)}</p><p className="text-xs text-muted-foreground">🔗 TH/s Total</p></div>
        </div></CardContent></Card>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="🔍 Search by model, brand, algorithm, coin..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/10" />
          </div>
          <div className="flex gap-2">
            {(['all', 'ASIC'] as const).map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all backdrop-blur-md border ${
                  typeFilter === t
                    ? 'bg-bitcoin/20 border-bitcoin/30 text-bitcoin shadow-sm'
                    : 'bg-white/5 dark:bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20'
                }`}
              >{t === 'all' ? '🔀 All' : '⚡ ASIC'}</button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-xl border bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/10 text-sm">
            <option value="profit">📈 Sort: Net Profit</option>
            <option value="hashrate">🔗 Sort: Hashrate</option>
            <option value="efficiency">⚡ Sort: Efficiency</option>
            <option value="cost">💵 Sort: Cost</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown label="🏭 Brand" options={allBrands} selected={brandFilter} onChange={setBrandFilter} onClear={() => setBrandFilter('')} />
          <FilterDropdown label="⚙️ Algorithm" options={allAlgos} selected={algoFilter} onChange={setAlgoFilter} onClear={() => setAlgoFilter('')} />
          <FilterDropdown label="🪙 Coin" options={allCoins} selected={coinFilter} onChange={setCoinFilter} onClear={() => setCoinFilter('')} />
          {activeFilters > 0 && (
            <button onClick={() => { setBrandFilter(''); setAlgoFilter(''); setCoinFilter(''); setTypeFilter('all'); setSearch(''); }}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-bitcoin hover:bg-bitcoin/10 transition-colors"
            ><X className="h-3.5 w-3.5" /> 🧹 Clear ({activeFilters})</button>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} of {MINING_HARDWARE.length} miners</span>
        </div>
      </div>

      <div className="rounded-xl border bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-3 font-medium whitespace-nowrap">Miner</th>
                <th className="text-left py-3 px-3 font-medium whitespace-nowrap hidden sm:table-cell">Coin</th>
                <th className="text-right py-3 px-3 font-medium whitespace-nowrap">Hashrate</th>
                <th className="text-right py-3 px-3 font-medium whitespace-nowrap hidden md:table-cell">Power</th>
                <th className="text-right py-3 px-3 font-medium whitespace-nowrap hidden sm:table-cell">Starting From</th>
                <th className="text-right py-3 px-3 font-medium whitespace-nowrap">Gross</th>
                <th className="text-right py-3 px-3 font-medium whitespace-nowrap hidden lg:table-cell">Elec</th>
                <th className="text-right py-3 px-3 font-medium whitespace-nowrap">Net <span className="text-crypto-green">/day</span></th>
                <th className="text-right py-3 px-3 font-medium whitespace-nowrap hidden lg:table-cell">Payback</th>
                <th className="text-right py-3 px-3 font-medium whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => {
                const primaryCoin = h.coins[0];
                const profit = liveProfits[h.id];
                const gross = profit?.grossDaily || 0;
                const net = profit?.netDaily || 0;
                const payback = profit?.paybackDays || 9999;
                const elecCost = (h.power / 1000) * 24 * ELEC_RATE_DEFAULT;
                const cp = coinPrices[primaryCoin?.ticker === 'BTC' ? 'bitcoin' : (COIN_MAP[primaryCoin?.ticker || '']?.coingeckoId || '')];
                const change24h = cp?.usd_24h_change;
                const initials = getMfrInitials(h.manufacturer);
                const mfrColor = getMfrStyle(h.manufacturer);

                return (
                  <tr key={h.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => window.location.href = `/mining/miners/${h.id}`}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${mfrColor} flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm leading-tight truncate max-w-[180px]">{h.model}</p>
                          <p className="text-[11px] text-muted-foreground">{h.manufacturer} · {h.algorithm}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {h.coins.slice(0, 2).map(c => (
                          <Badge key={c.ticker} variant="outline" className="text-[10px] px-1.5 py-0">{c.ticker}</Badge>
                        ))}
                        {h.coins.length > 2 && <span className="text-[10px] text-muted-foreground">+{h.coins.length - 2}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <p className="font-semibold text-sm">{h.hashrate} <span className="text-muted-foreground text-[11px]">{h.hashrateUnit}</span></p>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap hidden md:table-cell">
                      <p className="text-sm">{h.power}W</p>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap hidden sm:table-cell">
                      <p className="text-sm"><span className="text-[10px] text-muted-foreground">from </span>{sym}{convertCost(h.cost).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {loading ? <p className="text-sm text-muted-foreground">...</p> : (
                        <div>
                          <p className="font-semibold text-sm">{sym}{convertCost(gross).toFixed(2)}</p>
                          {change24h !== undefined && (
                            <p className={`text-[10px] ${change24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                              {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap hidden lg:table-cell">
                      <p className="text-sm text-muted-foreground">{sym}{convertCost(elecCost).toFixed(2)}</p>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <p className={`font-bold text-sm ${net >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                        {loading ? '...' : `${sym}${convertCost(net).toFixed(2)}`}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap hidden lg:table-cell">
                      <Badge variant={payback < 730 ? 'default' : 'secondary'} className="text-[10px]">
                        {payback < 365 ? `${payback}d` : `${(payback / 365).toFixed(1)}y`}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/mining/miners/${h.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-bitcoin/15 border border-bitcoin/30 text-bitcoin hover:bg-bitcoin hover:text-white transition-all shadow-sm" onClick={(e) => e.stopPropagation()}>
                        View <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="py-16 text-center text-muted-foreground">
                  <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No miners match your filters</p>
                  <p className="text-xs mt-1">Try adjusting search or clearing filters</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl border bg-white/5 dark:bg-white/5 backdrop-blur-md border-white/10">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">📖 How mining profitability is calculated</p>
            <p>💰 Daily gross = (hashrate in TH/s × 86400 × block reward) ÷ (network difficulty × 2³²) × coin price. ⚡ Electricity = power (kW) × 24h × ${ELEC_RATE_DEFAULT}/kWh. 📊 Net = gross − electricity. 🟠 BTC difficulty from Mempool.space. 💹 Prices from CoinGecko. 🔄 Data refreshes every 2 minutes.</p>
          </div>
        </div>
      </div>


    </div>
  );
}
