'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchTrendingCoins } from '@/lib/api/crypto';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, Star } from 'lucide-react';
import type { Coin } from '@/types';

export function TrendingCoins() {
  const { currency, watchlist, toggleWatchlist } = useAppStore();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingCoins().then((data) => {
      setCoins(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Trending Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Trending Coins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {coins.slice(0, 10).map((coin, index) => (
            <div
              key={coin.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
              <button
                onClick={() => toggleWatchlist(coin.id)}
                className="text-muted-foreground hover:text-bitcoin transition-colors"
              >
                <Star
                  className={`h-4 w-4 ${watchlist.includes(coin.id) ? 'fill-bitcoin text-bitcoin' : ''}`}
                />
              </button>
              <Image
                src={coin.image}
                alt={coin.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/coins/${coin.id}`}
                  className="font-medium hover:text-bitcoin transition-colors truncate block"
                >
                  {coin.name}
                </Link>
                <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(coin.current_price, currency)}</p>
                <Badge
                  variant={
                    (coin.price_change_percentage_24h || 0) >= 0 ? 'green' : 'red'
                  }
                >
                  {formatPercent(coin.price_change_percentage_24h || 0)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/coins/trending"
            className="text-sm text-bitcoin hover:underline"
          >
            View All Trending →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
