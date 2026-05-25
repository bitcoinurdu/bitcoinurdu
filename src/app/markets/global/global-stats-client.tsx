'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, TrendingUp, Coins, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/stores';

export default function GlobalStatsClient() {
  const { currency } = useAppStore();
  const [globalData, setGlobalData] = useState<Record<string, unknown> | null>(null);
  const [fgiData, setFgiData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [globalRes, fgiRes] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/global'),
        fetch('https://api.alternative.me/fng/?limit=7'),
      ]);
      if (globalRes.ok) {
        const data = await globalRes.json();
        setGlobalData(data.data);
      }
      if (fgiRes.ok) {
        const data = await fgiRes.json();
        setFgiData(data);
      }
      setLastUpdate(new Date());
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = globalData as Record<string, unknown> | undefined;
  const mcap = (data?.total_market_cap as Record<string, number>)?.usd || 0;
  const volume = (data?.total_volume as Record<string, number>)?.usd || 0;
  const btcDom = ((data?.market_cap_percentage as Record<string, number>)?.btc || 0).toFixed(1);
  const ethDom = ((data?.market_cap_percentage as Record<string, number>)?.eth || 0).toFixed(1);
  const activeCoins = data?.active_cryptocurrencies || 0;
  const markets = data?.markets || 0;
  const mcapChange = (data?.market_cap_change_percentage_24h_usd as number) || 0;

  const fgiArray = (fgiData as Record<string, Record<string, string>[]>)?.data || [];
  const currentFgi = fgiArray[0];
  const fgiValue = currentFgi ? parseInt(currentFgi.value) : 50;
  const fgiLabel = currentFgi?.value_classification || 'Neutral';

  const formatNum = (n: number) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toLocaleString()}`;
  };

  const stats = [
    { label: 'Total Market Cap', value: formatNum(mcap), change: mcapChange, icon: Globe, color: 'text-bitcoin' },
    { label: '24h Volume', value: formatNum(volume), icon: BarChart3, color: 'text-crypto-blue' },
    { label: 'BTC Dominance', value: `${btcDom}%`, icon: Coins, color: 'text-bitcoin' },
    { label: 'ETH Dominance', value: `${ethDom}%`, icon: Coins, color: 'text-crypto-purple' },
    { label: 'Active Cryptos', value: Number(activeCoins).toLocaleString(), icon: Activity, color: 'text-crypto-green' },
    { label: 'Active Markets', value: Number(markets).toLocaleString(), icon: TrendingUp, color: 'text-crypto-blue' },
  ];

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading global stats...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/markets" className="p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Globe className="h-6 w-6 text-bitcoin" />
              Global Crypto Stats
            </h1>
            <p className="text-sm text-muted-foreground">Real-time market overview</p>
          </div>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
            {'change' in stat && stat.change !== undefined && (
              <p className={`text-xs mt-1 ${stat.change >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}% (24h)
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Fear & Greed Index */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Fear & Greed Index (7 Days)</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <p className={`text-5xl font-bold ${fgiValue >= 50 ? 'text-crypto-green' : 'text-crypto-red'}`}>{fgiValue}</p>
            <p className={`text-lg font-medium mt-1 ${fgiValue >= 50 ? 'text-crypto-green' : 'text-crypto-red'}`}>{fgiLabel}</p>
          </div>
        </div>
        <div className="flex gap-1 justify-center">
          {fgiArray.map((d: Record<string, string>, i: number) => {
            const v = parseInt(d.value);
            const color = v >= 75 ? 'bg-green-500' : v >= 50 ? 'bg-green-400' : v >= 25 ? 'bg-red-400' : 'bg-red-500';
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-12 rounded ${color}`} />
                <span className="text-[10px] text-muted-foreground">{v}</span>
              </div>
            );
          })}
        </div>
      </div>

      {lastUpdate && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          Last updated: {lastUpdate.toLocaleString()}
        </p>
      )}
    </div>
  );
}
