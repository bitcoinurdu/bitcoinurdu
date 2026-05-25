'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Unlock, Calendar, Clock, TrendingUp, Search, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

interface TokenUnlock {
  id: string;
  name: string;
  symbol: string;
  image: string;
  unlockDate: string;
  unlockTime: string;
  tokenAmount: string;
  usdValue: string;
  percentOfSupply: string;
  type: 'cliff' | 'linear' | 'event';
  category: 'layer-1' | 'layer-2' | 'defi' | 'gaming' | 'ai' | 'meme';
  coinGeckoId: string;
  description: string;
}

const tokenUnlocks: TokenUnlock[] = [
  {
    id: 'arbitrum-may',
    name: 'Arbitrum',
    symbol: 'ARB',
    image: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-01-17_08-06-11.jpg?1673947795',
    unlockDate: '2026-05-24',
    unlockTime: '00:00 UTC',
    tokenAmount: '11.28M ARB',
    usdValue: '$7.9M',
    percentOfSupply: '0.28%',
    type: 'linear',
    category: 'layer-2',
    coinGeckoId: 'arbitrum',
    description: 'Monthly team & investor unlock from vesting schedule.',
  },
  {
    id: 'optimism-may',
    name: 'Optimism',
    symbol: 'OP',
    image: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png?1698233689',
    unlockDate: '2026-05-25',
    unlockTime: '00:00 UTC',
    tokenAmount: '4.2M OP',
    usdValue: '$7.6M',
    percentOfSupply: '0.21%',
    type: 'linear',
    category: 'layer-2',
    coinGeckoId: 'optimism',
    description: 'Core contributor and investor tokens unlock.',
  },
  {
    id: 'apt-may',
    name: 'Aptos',
    symbol: 'APT',
    image: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png?1698233563',
    unlockDate: '2026-05-28',
    unlockTime: '14:00 UTC',
    tokenAmount: '11.2M APT',
    usdValue: '$100.8M',
    percentOfSupply: '1.12%',
    type: 'cliff',
    category: 'layer-1',
    coinGeckoId: 'aptos',
    description: 'Major cliff unlock for early investors and team.',
  },
  {
    id: 'sui-may',
    name: 'Sui',
    symbol: 'SUI',
    image: 'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg?1698233547',
    unlockDate: '2026-05-30',
    unlockTime: '00:00 UTC',
    tokenAmount: '28.7M SUI',
    usdValue: '$57.4M',
    percentOfSupply: '1.43%',
    type: 'linear',
    category: 'layer-1',
    coinGeckoId: 'sui',
    description: 'Monthly unlock for community and ecosystem development fund.',
  },
  {
    id: 'sei-jun',
    name: 'Sei',
    symbol: 'SEI',
    image: 'https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Circular.png?1698234200',
    unlockDate: '2026-06-01',
    unlockTime: '12:00 UTC',
    tokenAmount: '52.1M SEI',
    usdValue: '$26.05M',
    percentOfSupply: '2.08%',
    type: 'cliff',
    category: 'layer-1',
    coinGeckoId: 'sei-network',
    description: 'Seed investor cliff unlock.',
  },
  {
    id: 'tia-jun',
    name: 'Celestia',
    symbol: 'TIA',
    image: 'https://assets.coingecko.com/coins/images/31967/small/tia.jpg?1698235600',
    unlockDate: '2026-06-15',
    unlockTime: '00:00 UTC',
    tokenAmount: '18.5M TIA',
    usdValue: '$92.5M',
    percentOfSupply: '3.70%',
    type: 'cliff',
    category: 'layer-1',
    coinGeckoId: 'celestia',
    description: 'Major TIA unlock for team and early backers.',
  },
  {
    id: 'strk-jun',
    name: 'Starknet',
    symbol: 'STRK',
    image: 'https://assets.coingecko.com/coins/images/26433/small/starknet.jpg?1698233550',
    unlockDate: '2026-06-20',
    unlockTime: '14:00 UTC',
    tokenAmount: '35.8M STRK',
    usdValue: '$28.64M',
    percentOfSupply: '1.79%',
    type: 'linear',
    category: 'layer-2',
    coinGeckoId: 'starknet',
    description: 'Monthly investor and team unlock.',
  },
  {
    id: 'pendle-jul',
    name: 'Pendle',
    symbol: 'PENDLE',
    image: 'https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png?1698231900',
    unlockDate: '2026-07-01',
    unlockTime: '12:00 UTC',
    tokenAmount: '4.2M PENDLE',
    usdValue: '$16.8M',
    percentOfSupply: '1.40%',
    type: 'linear',
    category: 'defi',
    coinGeckoId: 'pendle',
    description: 'Team and advisor tokens unlock.',
  },
  {
    id: 'imx-jul',
    name: 'Immutable X',
    symbol: 'IMX',
    image: 'https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png?1698232700',
    unlockDate: '2026-07-15',
    unlockTime: '00:00 UTC',
    tokenAmount: '15.6M IMX',
    usdValue: '$23.4M',
    percentOfSupply: '1.04%',
    type: 'linear',
    category: 'gaming',
    coinGeckoId: 'immutable-x',
    description: 'Ecosystem and development fund monthly unlock.',
  },
  {
    id: 'fet-aug',
    name: 'Fetch.ai (ASI)',
    symbol: 'FET',
    image: 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg?1698229800',
    unlockDate: '2026-08-01',
    unlockTime: '12:00 UTC',
    tokenAmount: '8.9M FET',
    usdValue: '$17.8M',
    percentOfSupply: '0.89%',
    type: 'linear',
    category: 'ai',
    coinGeckoId: 'fetch-ai',
    description: 'Monthly team and ecosystem unlock for ASI alliance.',
  },
  {
    id: 'rndr-aug',
    name: 'Render',
    symbol: 'RENDER',
    image: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png?1698231200',
    unlockDate: '2026-08-15',
    unlockTime: '00:00 UTC',
    tokenAmount: '3.1M RENDER',
    usdValue: '$18.6M',
    percentOfSupply: '0.62%',
    type: 'linear',
    category: 'ai',
    coinGeckoId: 'render-token',
    description: 'Monthly investor unlock from vesting schedule.',
  },
  {
    id: 'arb-aug',
    name: 'Arbitrum',
    symbol: 'ARB',
    image: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-01-17_08-06-11.jpg?1673947795',
    unlockDate: '2026-08-24',
    unlockTime: '00:00 UTC',
    tokenAmount: '11.28M ARB',
    usdValue: '$7.9M',
    percentOfSupply: '0.28%',
    type: 'linear',
    category: 'layer-2',
    coinGeckoId: 'arbitrum',
    description: 'Monthly team & investor unlock.',
  },
];

const categoryLabels: Record<string, string> = {
  'layer-1': 'Layer 1',
  'layer-2': 'Layer 2',
  'defi': 'DeFi',
  'gaming': 'Gaming',
  'ai': 'AI',
  'meme': 'Meme',
};

const typeLabels: Record<string, string> = {
  cliff: 'Cliff Unlock',
  linear: 'Linear Vesting',
  event: 'Event Based',
};

export default function TokenUnlocksClient() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filtered = tokenUnlocks.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.symbol.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchType = filterType === 'all' || t.type === filterType;
    return matchSearch && matchCategory && matchType;
  });

  const sorted = [...filtered].sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime());

  const totalUsdValue = sorted.reduce((sum, t) => {
    const num = parseFloat(t.usdValue.replace(/[$M]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Unlock className="h-8 w-8 text-bitcoin" />
          Token Unlocks Schedule
        </h1>
        <p className="text-muted-foreground mt-1">
          Upcoming crypto token unlocks, vesting schedules, and release dates.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Total upcoming unlocks: <span className="font-semibold text-bitcoin">${totalUsdValue.toFixed(1)}M</span> across {sorted.length} tokens
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none"
          >
            <option value="all">All Types</option>
            {Object.entries(typeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* UPCOMING UNLOCKS */}
      <div className="space-y-4">
        {sorted.map((token) => {
          const unlockDate = new Date(token.unlockDate);
          const now = new Date();
          const daysUntil = Math.ceil((unlockDate.getTime() - now.getTime()) / 86400000);
          const isUrgent = daysUntil <= 30;
          const isSoon = daysUntil <= 90;

          return (
            <Card key={token.id} className={`hover:shadow-md transition-all ${isUrgent ? 'border-red-500/30' : isSoon ? 'border-yellow-500/30' : ''}`}>
              <CardContent className="pt-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Image src={token.image} alt={token.symbol} width={40} height={40} className="rounded-full" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{token.name}</h3>
                        <Badge variant="secondary" className="text-xs">{token.symbol}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{token.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Date
                      </div>
                      <p className="font-semibold text-sm">{unlockDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Time Left
                      </div>
                      <p className={`font-semibold text-sm ${isUrgent ? 'text-red-500' : isSoon ? 'text-yellow-500' : 'text-crypto-green'}`}>
                        {daysUntil > 0 ? `${daysUntil} days` : 'Today!'}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Tokens</div>
                      <p className="font-semibold text-sm">{token.tokenAmount}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">USD Value</div>
                      <p className="font-semibold text-sm text-bitcoin">{token.usdValue}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">% of Supply</div>
                      <p className="font-semibold text-sm">{token.percentOfSupply}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={token.type === 'cliff' ? 'red' : token.type === 'linear' ? 'default' : 'secondary'} className="text-xs">
                        {typeLabels[token.type]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{categoryLabels[token.category]}</Badge>
                    </div>
                    <Link href={`/coins/${token.coinGeckoId}`} className="flex items-center gap-1 text-sm text-bitcoin hover:underline shrink-0">
                      View Coin <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Unlock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No unlocks found</h3>
            <p className="text-muted-foreground">Try changing your search or filters.</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="pt-5">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Token Unlocks Kya Hote Hain?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">Cliff Unlock</p>
              <p>Ek specific date par bari miqdar mein tokens release hote hain. Isse price par asar par sakta hai.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Linear Vesting</p>
              <p>Tokens dheere dheere monthly ya weekly release hote hain. Yeh zyada predictable hota hai.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Event Based</p>
              <p>Kisi specific event ya milestone par tokens unlock hote hain. Timing uncertain ho sakti hai.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
