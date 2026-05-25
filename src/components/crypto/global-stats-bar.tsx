'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, formatNumber } from '@/lib/utils/helpers';
import { ArrowUpRight, ArrowDownRight, Flame, Activity, Coins, TrendingUp } from 'lucide-react';

interface LocalStats {
  totalCoins: number;
  totalMarketCap: number;
  totalVolume: number;
  lastUpdated: string;
}

export function GlobalStatsBar({ initialData }: { initialData: Record<string, unknown> | null }) {
  const [localStats, setLocalStats] = useState<LocalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/data/coins-market.json')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        let totalCoins = 0;
        let totalMarketCap = 0;
        let totalVolume = 0;
        for (const page of data.pages || []) {
          totalCoins += page.count || 0;
          for (const coin of page.coins || []) {
            totalMarketCap += coin.market_cap || 0;
            totalVolume += coin.total_volume || 0;
          }
        }
        setLocalStats({
          totalCoins,
          totalMarketCap,
          totalVolume,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const data = initialData?.data as Record<string, unknown> | undefined;

  const marketCap = data
    ? (data.total_market_cap as Record<string, number>)?.usd || localStats?.totalMarketCap || 0
    : localStats?.totalMarketCap || 0;

  const volume = data
    ? (data.total_volume as Record<string, number>)?.usd || localStats?.totalVolume || 0
    : localStats?.totalVolume || 0;

  const btcDominance = ((data?.market_cap_percentage as Record<string, number>)?.btc || 0).toFixed(1);
  const ethDominance = ((data?.market_cap_percentage as Record<string, number>)?.eth || 0).toFixed(2);
  const marketCapChange = (data?.market_cap_change_percentage_24h_usd as number) || 0;

  const activeCryptos = data
    ? data.active_cryptocurrencies || localStats?.totalCoins || 0
    : localStats?.totalCoins || 0;

  const activeExchanges = data?.markets || 0;

  if (loading && !data && !localStats) {
    return (
      <div className="border-b bg-muted/30 py-2">
        <div className="w-full max-w-full px-2 md:px-8 mx-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>⏳ Loading market data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-muted/30 py-2">
      <div className="w-full max-w-full px-2 md:px-8 mx-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Coins className="h-3 w-3" />
          🪙 Tracked: <span className="text-foreground font-medium">{formatNumber(activeCryptos as number, 0)}</span>
        </span>
        <span className="hidden sm:inline">
          🏛️ Exchanges: <span className="text-foreground font-medium">{formatNumber(activeExchanges as number, 0)}</span>
        </span>
        <span className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          💰 Market Cap: <span className="text-foreground font-medium">{formatCurrency(marketCap, 'USD')}</span>
          <span className={`ml-1 inline-flex items-center ${marketCapChange >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
            {marketCapChange >= 0 ? <ArrowUpRight className="h-3 w-3 inline" /> : <ArrowDownRight className="h-3 w-3 inline" />}
            {Math.abs(marketCapChange).toFixed(1)}%
          </span>
        </span>
        <span className="hidden md:inline">
          📊 24h Vol: <span className="text-foreground font-medium">{formatCurrency(volume, 'USD')}</span>
        </span>
        <span className="hidden lg:inline">
          👑 Dominance:
          <span className="ml-1 text-foreground font-medium">BTC {btcDominance}%</span>
          <span className="ml-1 text-foreground font-medium">ETH {ethDominance}%</span>
        </span>
        <Link href="/coins/trending" className="hidden xl:inline text-bitcoin hover:underline flex items-center gap-1">
          <Flame className="h-3 w-3" />
          Trending
        </Link>
        {localStats && (
          <span className="hidden xl:inline text-muted-foreground">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            Local: {localStats.totalCoins.toLocaleString()} coins
          </span>
        )}
      </div>
    </div>
  );
}
