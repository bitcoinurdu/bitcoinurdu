'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchGainersLosers } from '@/lib/api/crypto';
import { formatCurrency, formatPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Coin } from '@/types';

export function TopGainersLosers() {
  const { currency } = useAppStore();
  const [gainers, setGainers] = useState<Coin[]>([]);
  const [losers, setLosers] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGainersLosers().then(({ gainers, losers }) => {
      setGainers(gainers);
      setLosers(losers);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Movers</CardTitle>
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

  const CoinRow = ({ coin, type }: { coin: Coin; type: 'gainer' | 'loser' }) => (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <Image
        src={coin.image}
        alt={coin.name}
        width={28}
        height={28}
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
        <Badge variant={type === 'gainer' ? 'green' : 'red'}>
          {type === 'gainer' ? (
            <ArrowUpRight className="h-3 w-3 inline mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 inline mr-1" />
          )}
          {formatPercent(Math.abs(coin.price_change_percentage_24h || 0))}
        </Badge>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers">
          <TabsList className="w-full">
            <TabsTrigger value="gainers" className="flex-1">
              <ArrowUpRight className="h-4 w-4 mr-1 text-crypto-green" />
              Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex-1">
              <ArrowDownRight className="h-4 w-4 mr-1 text-crypto-red" />
              Losers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gainers" className="space-y-2 mt-4">
            {gainers.slice(0, 8).map((coin) => (
              <CoinRow key={coin.id} coin={coin} type="gainer" />
            ))}
          </TabsContent>
          <TabsContent value="losers" className="space-y-2 mt-4">
            {losers.slice(0, 8).map((coin) => (
              <CoinRow key={coin.id} coin={coin} type="loser" />
            ))}
          </TabsContent>
        </Tabs>
        <div className="mt-4 text-center">
          <Link href="/coins/gainers" className="text-sm text-bitcoin hover:underline">
            View All Movers →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
