'use client';

import { formatCurrency } from '@/lib/utils/helpers';
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3 } from 'lucide-react';

export function MarketHighlights({ initialData }: { initialData: Record<string, unknown> | null }) {
  if (!initialData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-6">
            <div className="h-4 w-32 bg-muted rounded mb-3" />
            <div className="h-8 w-48 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const data = initialData.data as Record<string, unknown> | undefined;
  if (!data) return null;

  const marketCap = (data.total_market_cap as Record<string, number>)?.usd || 0;
  const volume = (data.total_volume as Record<string, number>)?.usd || 0;
  const marketCapChange = (data.market_cap_change_percentage_24h_usd as number) || 0;

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3">
        The global cryptocurrency market cap today is{' '}
        <span className="text-foreground font-medium">{formatCurrency(marketCap, 'usd')}</span>,
        a <span className={marketCapChange >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>
          {marketCapChange >= 0 ? '+' : ''}{marketCapChange.toFixed(1)}%
        </span>{' '}
        change in the last 24 hours.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className={`ml-auto inline-flex items-center gap-1 text-sm font-medium ${marketCapChange >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
              {marketCapChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {Math.abs(marketCapChange).toFixed(1)}%
            </span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(marketCap, 'usd')}</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">24h Trading Volume</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(volume, 'usd')}</p>
        </div>
      </div>
    </div>
  );
}
