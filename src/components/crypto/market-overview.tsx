'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchGlobalMarketData } from '@/lib/api/crypto';
import { formatCurrency, formatNumber } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Globe, Coins, BarChart3, TrendingUp } from 'lucide-react';

export function MarketOverview() {
  const { currency } = useAppStore();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalMarketData().then((result) => {
      setData(result as unknown as Record<string, unknown>);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    );
  }

  const globalData = data as Record<string, unknown> | undefined;
  const marketData = globalData?.data as Record<string, unknown> | undefined;
  const marketCap = (marketData?.total_market_cap as Record<string, number>)?.usd || 0;
  const volume = (marketData?.total_volume as Record<string, number>)?.usd || 0;
  const btcDominance = ((marketData?.market_cap_percentage as Record<string, number>)?.btc || 0).toFixed(1);
  const activeCryptos = marketData?.active_cryptocurrencies || 0;
  const marketCapChange = (marketData?.market_cap_change_percentage_24h_usd as number) || 0;

  const stats = [
    {
      label: 'Market Cap',
      value: formatCurrency(marketCap, currency),
      change: marketCapChange,
      icon: Globe,
    },
    {
      label: '24h Volume',
      value: formatCurrency(volume, currency),
      icon: BarChart3,
    },
    {
      label: 'BTC Dominance',
      value: `${btcDominance}%`,
      icon: Coins,
    },
    {
      label: 'Active Coins',
      value: formatNumber(activeCryptos as number, 0),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className="text-lg font-semibold">{stat.value}</p>
          {stat.change !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              {stat.change >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-crypto-green" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-crypto-red" />
              )}
              <Badge variant={stat.change >= 0 ? 'green' : 'red'}>
                {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}%
              </Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
