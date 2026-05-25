'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCoins } from '@/lib/api/crypto';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight, Star, TrendingUp } from 'lucide-react';
import type { Coin } from '@/types';

export function TopCoinsTable() {
  const { currency, watchlist, toggleWatchlist } = useAppStore();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoins(1, 15).then((data) => {
      setCoins(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-bitcoin" />
            Top Cryptocurrencies by Market Cap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20 ml-auto" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-bitcoin" />
            Top Cryptocurrencies by Market Cap
          </CardTitle>
          <Link
            href="/coins"
            className="text-sm text-bitcoin hover:underline"
          >
            View All →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="py-3 px-2 text-left font-medium w-10">#</th>
                <th className="py-3 px-2 text-left font-medium w-10"></th>
                <th className="py-3 px-2 text-left font-medium">Coin</th>
                <th className="py-3 px-2 text-right font-medium">Price</th>
                <th className="py-3 px-2 text-right font-medium hidden sm:table-cell">1h</th>
                <th className="py-3 px-2 text-right font-medium">24h</th>
                <th className="py-3 px-2 text-right font-medium hidden md:table-cell">7d</th>
                <th className="py-3 px-2 text-right font-medium hidden lg:table-cell">Market Cap</th>
                <th className="py-3 px-2 text-right font-medium hidden lg:table-cell">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr
                  key={coin.id}
                  className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-2 text-sm text-muted-foreground">{index + 1}</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => toggleWatchlist(coin.id)}
                      className="text-muted-foreground hover:text-bitcoin transition-colors"
                    >
                      <Star
                        className={`h-4 w-4 ${watchlist.includes(coin.id) ? 'fill-bitcoin text-bitcoin' : ''}`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-2">
                    <Link
                      href={`/coins/${coin.id}`}
                      className="flex items-center gap-3 hover:text-bitcoin transition-colors"
                    >
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                      <div>
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-xs text-muted-foreground ml-2 uppercase">
                          {coin.symbol}
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-right font-medium">
                    {formatCurrency(coin.current_price, currency)}
                  </td>
                  <td className="py-3 px-2 text-right hidden sm:table-cell">
                    <PriceChange value={coin.price_change_percentage_1h_in_currency} />
                  </td>
                  <td className="py-3 px-2 text-right">
                    <PriceChange value={coin.price_change_percentage_24h} />
                  </td>
                  <td className="py-3 px-2 text-right hidden md:table-cell">
                    <PriceChange value={coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_7d} />
                  </td>
                  <td className="py-3 px-2 text-right hidden lg:table-cell">
                    {formatCurrency(coin.market_cap, currency)}
                  </td>
                  <td className="py-3 px-2 text-right hidden lg:table-cell">
                    {formatCurrency(coin.total_volume, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceChange({ value }: { value: number | undefined }) {
  const num = value || 0;
  if (num === 0) return <span className="text-muted-foreground">-</span>;
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${
        num >= 0 ? 'text-crypto-green' : 'text-crypto-red'
      }`}
    >
      {num >= 0 ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      )}
      {formatPercent(Math.abs(num))}
    </span>
  );
}
