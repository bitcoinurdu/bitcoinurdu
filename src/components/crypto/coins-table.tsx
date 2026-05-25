'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCoins } from '@/lib/api/crypto';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Coin } from '@/types';

const ITEMS_PER_PAGE = 100;

export function CoinsTable() {
  const { currency, watchlist, toggleWatchlist } = useAppStore();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchCoins(page, ITEMS_PER_PAGE, currency).then((data) => {
      setCoins(data);
      if (data.length > 0) {
        setTotalCoins(data[0].market_cap_rank ? data[0].market_cap_rank + (ITEMS_PER_PAGE - data.length) : 15000);
      }
      setLoading(false);
    });
  }, [page, currency]);

  const totalPages = Math.ceil(totalCoins / ITEMS_PER_PAGE);
  const startNum = (page - 1) * ITEMS_PER_PAGE + 1;
  const endNum = startNum + coins.length - 1;

  if (loading) {
    return (
      <div className="rounded-xl border bg-card">
        <div className="p-4">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12 ml-auto" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20 hidden lg:block" />
                <Skeleton className="h-4 w-20 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Cryptocurrency Prices by Market Cap</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="py-3 px-3 text-left font-medium w-10">#</th>
              <th className="py-3 px-2 text-left font-medium w-10"></th>
              <th className="py-3 px-3 text-left font-medium min-w-[200px]">Coin</th>
              <th className="py-3 px-3 text-right font-medium">Price</th>
              <th className="py-3 px-3 text-right font-medium hidden sm:table-cell">1h</th>
              <th className="py-3 px-3 text-right font-medium">24h</th>
              <th className="py-3 px-3 text-right font-medium hidden md:table-cell">7d</th>
              <th className="py-3 px-3 text-right font-medium hidden lg:table-cell">24h Volume</th>
              <th className="py-3 px-3 text-right font-medium hidden lg:table-cell">Market Cap</th>
              <th className="py-3 px-3 text-center font-medium hidden xl:table-cell w-32">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr
                key={coin.id}
                className="border-b last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-3 text-sm text-muted-foreground">
                  {coin.market_cap_rank || '-'}
                </td>
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
                <td className="py-3 px-3">
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
                <td className="py-3 px-3 text-right font-medium">
                  {formatCurrency(coin.current_price, currency)}
                </td>
                <td className="py-3 px-3 text-right hidden sm:table-cell">
                  <PriceChange value={coin.price_change_percentage_1h_in_currency} />
                </td>
                <td className="py-3 px-3 text-right">
                  <PriceChange value={coin.price_change_percentage_24h} />
                </td>
                <td className="py-3 px-3 text-right hidden md:table-cell">
                  <PriceChange value={coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_7d} />
                </td>
                <td className="py-3 px-3 text-right hidden lg:table-cell">
                  {formatCurrency(coin.total_volume, currency)}
                </td>
                <td className="py-3 px-3 text-right hidden lg:table-cell">
                  {formatCurrency(coin.market_cap, currency)}
                </td>
                <td className="py-3 px-3 hidden xl:table-cell">
                  <Sparkline coinId={coin.id} positive={(coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_7d ?? 0) >= 0} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t">
        <p className="text-sm text-muted-foreground">
          Showing {startNum} to {endNum} of {totalCoins} results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                  page === pageNum
                    ? 'bg-bitcoin text-white'
                    : 'hover:bg-muted'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
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
      {formatPercent(Math.abs(num))}
    </span>
  );
}

function Sparkline({ coinId, positive }: { coinId: string; positive: boolean }) {
  const color = positive ? '#0ECB81' : '#F6465D';
  const points = Array.from({ length: 7 }, () => Math.random() * 20 + 10);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const svgPoints = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - ((p - min) / range) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex justify-center">
      <svg width="100" height="30" viewBox="0 0 100 30" className="opacity-80">
        <polyline
          points={svgPoints}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
