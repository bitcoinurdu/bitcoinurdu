'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { MainpageAd } from '@/components/ads/ad-slots';
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  TrendingUp,
  TrendingDown,
  Zap,
  Droplets,
  Brain,
  BarChart3,
  ExternalLink,
  Pickaxe,
  Globe,
  Shield,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { getLiveRates, convertCurrency, getCurrencySymbol } from '@/lib/currency';

const PER_PAGE = 50;

interface HomePageClientProps {
  globalData: Record<string, unknown> | null;
  coins: (Record<string, unknown> & { usd_price: number })[];
  trendingData: Record<string, unknown> | null;
  fearGreedData: Record<string, unknown> | null;
  tickerCoins: (Record<string, unknown> & { usd_price: number })[];
}

export default function HomePageClient({
  globalData,
  coins,
  trendingData,
  fearGreedData,
  tickerCoins,
}: HomePageClientProps) {
  const { currency } = useAppStore();
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1, PKR: 278.50, EUR: 0.92, GBP: 0.79, AED: 3.67, SAR: 3.75, INR: 83.50 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers' | 'hot'>('all');
  const [liveCoins, setLiveCoins] = useState<(Record<string, unknown> & { usd_price: number })[]>(coins);
  const [liveGlobal, setLiveGlobal] = useState<Record<string, unknown> | null>(globalData);
  const [liveFgi, setLiveFgi] = useState<Record<string, unknown> | null>(fearGreedData);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveRates().then((r) => setRates(r)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [fgiRes, globalRes] = await Promise.all([
          fetch('https://api.alternative.me/fng/?limit=1'),
          fetch('https://api.coingecko.com/api/v3/global'),
        ]);
        if (fgiRes.ok) {
          const fgiData = await fgiRes.json();
          setLiveFgi(fgiData);
        }
        if (globalRes.ok) {
          const globalResData = await globalRes.json();
          setLiveGlobal(globalResData.data);
        }
      } catch {}
    };
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch('/api/coins?per_page=250&order=asc');
        if (res.ok) {
          const data = await res.json();
          if (data.coins && data.coins.length > 0) {
            const sorted = (data.coins as unknown as (Record<string, unknown> & { usd_price: number })[])
              .filter(c => (c.market_cap as number) > 0)
              .sort((a, b) => ((b.market_cap as number) || 0) - ((a.market_cap as number) || 0));
            if (sorted.length > 0) {
              setLiveCoins(sorted);
              setLastUpdate(new Date());
              setLoading(false);
              return;
            }
          }
        }
      } catch {}
      setLoading(false);
    };
    fetchCoins();
    const interval = setInterval(fetchCoins, 120000);
    return () => clearInterval(interval);
  }, [coins]);

  const data = (liveGlobal || globalData)?.data as Record<string, unknown> | undefined;
  const marketCapUSD = (data?.total_market_cap as Record<string, number>)?.usd || 0;
  const volumeUSD = (data?.total_volume as Record<string, number>)?.usd || 0;
  const btcDom = ((data?.market_cap_percentage as Record<string, number>)?.btc || 0).toFixed(1);
  const ethDom = ((data?.market_cap_percentage as Record<string, number>)?.eth || 0).toFixed(1);
  const activeCoins = data?.active_cryptocurrencies || 0;
  const mcapChange = ((data?.market_cap_change_percentage_24h_usd as number) || 0).toFixed(2);

  const fgiData = (liveFgi || fearGreedData) as Record<string, unknown[]> | undefined;
  const fgiArray = fgiData?.data as Record<string, string>[] | undefined;
  const fgi = fgiArray?.[0];
  const fgiValue = fgi ? parseInt(fgi.value) : 50;
  const fgiLabel = fgi?.value_classification || 'Neutral';

  const displayCoins = liveCoins.length > 0 ? liveCoins : coins;

  let filtered = displayCoins.filter((c) =>
    (c.name as string).toLowerCase().includes(search.toLowerCase()) ||
    (c.symbol as string).toLowerCase().includes(search.toLowerCase())
  );

  if (filter === 'gainers') {
    filtered = [...filtered].sort((a, b) => ((b.price_change_percentage_24h as number) || 0) - ((a.price_change_percentage_24h as number) || 0));
  } else if (filter === 'losers') {
    filtered = [...filtered].sort((a, b) => ((a.price_change_percentage_24h as number) || 0) - ((b.price_change_percentage_24h as number) || 0));
  } else if (filter === 'hot') {
    filtered = [...filtered].sort((a, b) => ((b.total_volume as number) || 0) - ((a.total_volume as number) || 0));
  }

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pagedCoins = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* TOP TICKER BAR - hidden on mobile */}
      <div className="hidden lg:block bg-[#0d0d14] border-b border-[#1e1e2e] text-xs">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between h-8 px-4 gap-4">
          <div className="flex items-center gap-4 text-gray-500">
            <span>Market Cap: <span className="text-gray-100 font-medium">{formatPrice(marketCapUSD, 'USD')}</span></span>
            <span>24h Vol: <span className="text-gray-100 font-medium">{formatPrice(volumeUSD, 'USD')}</span></span>
            <span>BTC: <span className="text-orange-400 font-medium">{btcDom}%</span></span>
            <span>ETH: <span className="text-blue-400 font-medium">{ethDom}%</span></span>
            <span>Coins: <span className="text-gray-100 font-medium">{activeCoins.toLocaleString()}</span></span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <Link href="/advertise" className="hover:text-orange-400 transition-colors">Advertise</Link>
            <Link href="/api-docs" className="hover:text-orange-400 transition-colors">API</Link>
            <Link href="/donate" className="hover:text-orange-400 transition-colors">Donate</Link>
            <Link href="/status" className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              All Systems Operational
            </Link>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero-bg pt-12 pb-8 px-4">
        <div className="max-w-screen-xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
            Live Market Data &bull; Real-Time Updates
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-4 text-white leading-tight">
            The World's Elite{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Crypto Platform</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Live prices, mining tools, airdrops, analysis &mdash; {`\u0633\u0628 \u06A9\u0686\u06BE \u0627\u0631\u062F\u0648 \u0645\u06CC\u06BA`}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/coins" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20">
              Explore Markets <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/mining" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e1e2e] text-gray-200 font-semibold text-sm hover:bg-[#2a2a3e] border border-[#2a2a3e] transition-all">
              <Pickaxe className="h-4 w-4" /> Mining
            </Link>
            <Link href="/mining/calculator" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e1e2e] text-gray-200 font-semibold text-sm hover:bg-[#2a2a3e] border border-[#2a2a3e] transition-all">
              <Zap className="h-4 w-4" /> Mining Calc
            </Link>
          </div>
        </div>

        {/* QUICK LINK CARDS */}
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Link href="/airdrops" className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4 flex items-center gap-3 hover:border-orange-500/30 hover:bg-[#1a1a2a] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#1e1e2e] flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-100">Airdrops</div>
              <div className="text-xs text-gray-500">Free crypto</div>
            </div>
          </Link>
          <Link href="/mining" className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4 flex items-center gap-3 hover:border-orange-500/30 hover:bg-[#1a1a2a] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#1e1e2e] flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
              <Pickaxe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-100">Mining</div>
              <div className="text-xs text-gray-500">Mine crypto</div>
            </div>
          </Link>
          <Link href="/analysis" className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4 flex items-center gap-3 hover:border-orange-500/30 hover:bg-[#1a1a2a] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#1e1e2e] flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-100">Analysis</div>
              <div className="text-xs text-gray-500">Market insights</div>
            </div>
          </Link>
          <Link href="/portfolio" className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4 flex items-center gap-3 hover:border-orange-500/30 hover:bg-[#1a1a2a] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#1e1e2e] flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-100">Portfolio</div>
              <div className="text-xs text-gray-500">Track assets</div>
            </div>
          </Link>
        </div>
      </section>

      <main className="max-w-screen-xl mx-auto px-4 pb-16">
        {/* STATS CARDS */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-[#12121a] border border-[#1e1e2e] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4">
              <p className="text-xs text-gray-500 mb-1">Total Market Cap</p>
              <p className="text-lg font-bold text-white">{formatPrice(marketCapUSD, 'USD')}</p>
              <p className={`text-xs ${parseFloat(mcapChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(mcapChange) >= 0 ? '\u25B2' : '\u25BC'} {mcapChange}%
              </p>
            </div>
            <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4">
              <p className="text-xs text-gray-500 mb-1">24h Volume</p>
              <p className="text-lg font-bold text-white">{formatPrice(volumeUSD, 'USD')}</p>
            </div>
            <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4">
              <p className="text-xs text-gray-500 mb-1">BTC Dominance</p>
              <p className="text-lg font-bold text-orange-400">{btcDom}%</p>
            </div>
            <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4">
              <p className="text-xs text-gray-500 mb-1">ETH Dominance</p>
              <p className="text-lg font-bold text-blue-400">{ethDom}%</p>
            </div>
            <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4">
              <p className="text-xs text-gray-500 mb-1">Active Coins</p>
              <p className="text-lg font-bold text-white">{activeCoins.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4">
              <p className="text-xs text-gray-500 mb-1">Fear &amp; Greed</p>
              <p className="text-lg font-bold text-yellow-400">{fgiValue}</p>
              <p className="text-xs text-gray-400">{fgiLabel}</p>
            </div>
          </div>
        )}

        {/* COINS TABLE */}
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] mb-8 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#1e1e2e]">
            <h2 className="text-lg font-bold font-display text-white">Cryptocurrency Prices</h2>
            <div className="flex gap-1">
              {(['all', 'gainers', 'losers', 'hot'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    filter === f
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-500 hover:text-gray-200 hover:bg-[#1e1e2e]'
                  }`}
                >
                  {f === 'gainers' && <TrendingUp className="h-3 w-3 inline mr-1" />}
                  {f === 'losers' && <TrendingDown className="h-3 w-3 inline mr-1" />}
                  {f === 'hot' && <Zap className="h-3 w-3 inline mr-1" />}
                  {f === 'hot' ? 'Hot' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-b border-[#1e1e2e]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search coin..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0d0d14] border border-[#1e1e2e] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0d0d14]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Market Cap</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Volume</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">7d Chart</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(10)].map((_, i) => (
                    <tr key={i} className="border-b border-[#1e1e2e]">
                      <td className="px-4 py-4" colSpan={7}>
                        <div className="h-8 rounded-lg bg-[#1e1e2e] animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : pagedCoins.length > 0 ? (
                  pagedCoins.map((c, i) => (
                    <tr key={c.id as string} className="border-b border-[#1e1e2e] hover:bg-[#0d0d14] transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">{(c.market_cap_rank as number) ?? (i + 1)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/coins/${c.id}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                          <Image src={c.image as string} alt={c.symbol as string} width={24} height={24} className="rounded-full" />
                          <div>
                            <div className="font-medium text-sm text-gray-100">{(c.symbol as string).toUpperCase()}</div>
                            <div className="text-[11px] text-gray-500">{c.name as string}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-sm text-gray-100">
                        {formatPrice(convertCurrency(c.current_price as number, 'USD', currency), currency)}
                      </td>
                      <td className={`px-4 py-3 text-right text-sm ${pctClass(c.price_change_percentage_24h as number)}`}>
                        {pctStr(c.price_change_percentage_24h as number)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-300 hidden md:table-cell">
                        {formatPrice(convertCurrency(c.market_cap as number, 'USD', currency), currency)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-500 hidden lg:table-cell">
                        {formatPrice(convertCurrency(c.total_volume as number, 'USD', currency), currency)}
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        {(() => {
                          const chg = c.price_change_percentage_7d_in_currency as number | undefined;
                          if (chg === undefined || chg === null) return <span className="text-gray-600 text-xs">--</span>;
                          const pct = Math.min(Math.abs(chg) / 10, 1);
                          const w = Math.max(4, pct * 40);
                          return (
                            <svg width="40" height="16" className="inline-block">
                              <rect x={20 - w / 2} y={16 - (0.5 + (chg >= 0 ? 1 : 0)) * 14} width={w} height={14} rx={2} fill={chg >= 0 ? '#22c55e' : '#ef4444'} opacity={0.4 + 0.6 * pct} />
                            </svg>
                          );
                        })()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-gray-500">No coins found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between p-4 border-t border-[#1e1e2e]">
              <div className="text-xs text-gray-500">
                Showing {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs rounded-lg bg-[#1e1e2e] border border-[#2a2a3e] text-gray-400 disabled:opacity-50 hover:bg-[#2a2a3e] transition-colors"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <span className="px-3 py-1.5 text-xs text-gray-500">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs rounded-lg bg-[#1e1e2e] border border-[#2a2a3e] text-gray-400 disabled:opacity-50 hover:bg-[#2a2a3e] transition-colors"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-[#1e1e2e] text-center">
            <Link href="/coins" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-[#1e1e2e] border border-[#2a2a3e] text-gray-200 hover:bg-[#2a2a3e] transition-all">
              View All Coins <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-6 hover:border-orange-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1e1e2e] flex items-center justify-center mb-4 text-green-400">
              <Pickaxe className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Mining Profitability</h3>
            <p className="text-sm text-gray-400 mb-4">Calculate ASIC &amp; GPU mining profits with real-time electricity costs.</p>
            <Link href="/mining/calculator" className="text-sm text-orange-400 font-medium hover:text-orange-300 flex items-center gap-1 group">
              Calculate Now <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-6 hover:border-orange-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1e1e2e] flex items-center justify-center mb-4 text-blue-400">
              <Droplets className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Airdrop Hunter</h3>
            <p className="text-sm text-gray-400 mb-4">Find active airdrops, check eligibility, and claim free tokens.</p>
            <Link href="/airdrops" className="text-sm text-orange-400 font-medium hover:text-orange-300 flex items-center gap-1 group">
              Hunt Airdrops <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-6 hover:border-orange-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1e1e2e] flex items-center justify-center mb-4 text-purple-400">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Crypto Analysis</h3>
            <p className="text-sm text-gray-400 mb-4">Market insights, technical analysis, and on-chain data at your fingertips.</p>
            <Link href="/analysis" className="text-sm text-orange-400 font-medium hover:text-orange-300 flex items-center gap-1 group">
              View Analysis <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function formatPrice(n: number, cur: string): string {
  if (!n || isNaN(n)) return `${getCurrencySymbol(cur)}0`;
  const s = getCurrencySymbol(cur);
  if (n >= 1e12) return `${s}${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${s}${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${s}${(n / 1e6).toFixed(2)}M`;
  if (n >= 1) return `${s}${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  return `${s}${n.toFixed(6)}`;
}

function pctClass(v: number | undefined): string {
  if (!v && v !== 0) return 'text-gray-500';
  return v >= 0 ? 'text-green-400' : 'text-red-400';
}

function pctStr(v: number | undefined): string {
  if (!v && v !== 0) return '\u2014';
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
}
