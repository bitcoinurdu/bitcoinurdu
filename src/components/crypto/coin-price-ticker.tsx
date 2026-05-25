'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCoins } from '@/lib/api/crypto';
import { formatCurrency, formatPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Coin } from '@/types';

export function CoinPriceTicker() {
  const { currency } = useAppStore();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoins(1, 20).then((data) => {
      setCoins(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden border-b bg-muted/30 py-2">
        <div className="flex gap-8 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-b bg-muted/30 py-2">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {[...coins, ...coins].map((coin, index) => (
          <Link
            key={`${coin.id}-${index}`}
            href={`/coins/${coin.id}`}
            className="inline-flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src={coin.image}
              alt={coin.name}
              width={16}
              height={16}
              className="rounded-full"
            />
            <span className="text-xs font-medium">{coin.symbol.toUpperCase()}</span>
            <span className="text-xs">{formatCurrency(coin.current_price, currency)}</span>
            <span
              className={`inline-flex items-center gap-0.5 text-xs ${
                (coin.price_change_percentage_24h || 0) >= 0
                  ? 'text-crypto-green'
                  : 'text-crypto-red'
              }`}
            >
              {(coin.price_change_percentage_24h || 0) >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {formatPercent(Math.abs(coin.price_change_percentage_24h || 0))}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
