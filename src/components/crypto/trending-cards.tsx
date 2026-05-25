'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Flame, ArrowRight } from 'lucide-react';

export function TrendingCards({ initialCoins }: { initialCoins: Record<string, unknown>[] }) {
  const { currency } = useAppStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Trending
        </h2>
        <Link href="/coins/trending" className="text-sm text-bitcoin hover:underline flex items-center">
          View more <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      {initialCoins.length === 0 ? (
        <p className="text-sm text-muted-foreground">No trending data available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {initialCoins.slice(0, 6).map((coin) => (
            <Link
              key={coin.id as string}
              href={`/coins/${coin.id}`}
              className="rounded-xl border bg-card p-4 hover:shadow-md transition-all hover:border-bitcoin/30"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={coin.image as string}
                  alt={coin.name as string}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{coin.name as string}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatCurrency(coin.current_price as number, currency)}</span>
                    <span className={`text-xs ${(coin.price_change_percentage_24h as number) >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {formatPercent(Math.abs(coin.price_change_percentage_24h as number || 0))}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
