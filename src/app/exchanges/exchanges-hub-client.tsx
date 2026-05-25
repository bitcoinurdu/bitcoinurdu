'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { cn, formatNumber } from '@/lib/utils/helpers';

interface Exchange {
  id: string;
  name: string;
  type: 'CEX' | 'DEX';
  volume: number;
  pairs: number;
  fee: string;
  rating: number;
  featured?: boolean;
}

const exchanges: Exchange[] = [
  { id: 'binance', name: 'Binance', type: 'CEX', volume: 76800000000, pairs: 1800, fee: '0.10%', rating: 4.8, featured: true },
  { id: 'coinbase', name: 'Coinbase', type: 'CEX', volume: 3200000000, pairs: 450, fee: '0.50%', rating: 4.5, featured: true },
  { id: 'kraken', name: 'Kraken', type: 'CEX', volume: 1500000000, pairs: 400, fee: '0.16%', rating: 4.6, featured: true },
  { id: 'bybit', name: 'Bybit', type: 'CEX', volume: 25000000000, pairs: 600, fee: '0.10%', rating: 4.4 },
  { id: 'okx', name: 'OKX', type: 'CEX', volume: 18000000000, pairs: 700, fee: '0.08%', rating: 4.5 },
  { id: 'kucoin', name: 'KuCoin', type: 'CEX', volume: 5000000000, pairs: 1400, fee: '0.10%', rating: 4.3 },
  { id: 'uniswap', name: 'Uniswap', type: 'DEX', volume: 12000000000, pairs: 2000, fee: '0.30%', rating: 4.7, featured: true },
  { id: 'pancakeswap', name: 'PancakeSwap', type: 'DEX', volume: 8000000000, pairs: 3500, fee: '0.25%', rating: 4.5, featured: true },
  { id: 'sushiswap', name: 'SushiSwap', type: 'DEX', volume: 2000000000, pairs: 1500, fee: '0.30%', rating: 4.1 },
  { id: 'curve', name: 'Curve', type: 'DEX', volume: 6000000000, pairs: 500, fee: '0.04%', rating: 4.6, featured: true },
];

function ExchangeCard({ exchange }: { exchange: Exchange }) {
  return (
    <Link href={`/exchanges/${exchange.id}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-bitcoin/30 hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center text-white font-bold text-sm">
                {exchange.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm">{exchange.name}</h3>
                  {exchange.featured && (
                    <Badge variant="bitcoin" className="text-[10px] px-1.5 py-0">Trusted</Badge>
                  )}
                </div>
                <Badge variant={exchange.type === 'CEX' ? 'secondary' : 'green'} className="text-[10px] px-1.5 py-0 mt-0.5">
                  {exchange.type}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3 h-3',
                    i < Math.floor(exchange.rating) ? 'fill-yellow-500 text-yellow-500' : 'fill-none text-muted-foreground/30'
                  )}
                />
              ))}
              <span className="text-xs font-medium ml-1">{exchange.rating}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
            <div>
              <p className="text-[11px] text-muted-foreground">Volume (24h)</p>
              <p className="text-sm font-semibold">${formatNumber(exchange.volume)}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Pairs</p>
              <p className="text-sm font-semibold">{exchange.pairs.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Fee</p>
              <p className="text-sm font-semibold">{exchange.fee}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ExchangesHubClient() {
  const [query, setQuery] = useState('');

  const filtered = query
    ? exchanges.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.id.toLowerCase().includes(query.toLowerCase()) ||
          e.type.toLowerCase().includes(query.toLowerCase())
      )
    : exchanges;

  const cexList = filtered.filter((e) => e.type === 'CEX');
  const dexList = filtered.filter((e) => e.type === 'DEX');

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Home
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency Exchanges</h1>
        <p className="text-muted-foreground max-w-2xl">
          Compare the top cryptocurrency exchanges by trading volume, fees, supported assets,
          and user ratings to find the best platform for your needs.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exchanges..."
          className="pl-9"
        />
      </div>

      <AdPlaceholder size="banner" />

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="cex">Centralized (CEX) ({cexList.length})</TabsTrigger>
          <TabsTrigger value="dex">Decentralized (DEX) ({dexList.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-lg">No exchanges found</p>
                <p className="text-muted-foreground text-sm mt-1">Try adjusting your search terms</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((exchange) => (
                <ExchangeCard key={exchange.id} exchange={exchange} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cex" className="mt-6">
          {cexList.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-lg">No CEX exchanges found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cexList.map((exchange) => (
                <ExchangeCard key={exchange.id} exchange={exchange} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="dex" className="mt-6">
          {dexList.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-lg">No DEX exchanges found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dexList.map((exchange) => (
                <ExchangeCard key={exchange.id} exchange={exchange} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AdPlaceholder size="rectangle" className="mt-8" />
    </div>
  );
}