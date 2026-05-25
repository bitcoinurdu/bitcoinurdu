'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatNumber, formatPercent, getSupplyPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Search, ArrowUpDown, ArrowUp, ArrowDown, Calendar, Clock, Unlock, TrendingUp } from 'lucide-react';
import { CoinsAd } from '@/components/ads/ad-slots';
import { fetchCoinPrices } from '@/lib/api/price-fetcher';
import type { Coin } from '@/types';

const TABS = [
  { key: 'all', label: 'All Coins', icon: '🌐' },
  { key: 'trending', label: 'Trending', icon: '🔥' },
  { key: 'gainers', label: 'Top Gainers', icon: '🚀' },
  { key: 'losers', label: 'Top Losers', icon: '📉' },
  { key: 'new', label: 'New Listings', icon: '✨' },
  { key: 'layer-1', label: 'Layer 1', icon: '⛓️' },
  { key: 'layer-2', label: 'Layer 2', icon: '🔗' },
  { key: 'defi', label: 'DeFi', icon: '💰' },
  { key: 'meme', label: 'Meme', icon: '🐸' },
  { key: 'gaming', label: 'Gaming', icon: '🎮' },
  { key: 'ai', label: 'AI', icon: '🤖' },
  { key: 'unlocks', label: 'Token Unlocks', icon: '🔓' },
];

const CATEGORY_COINS: Record<string, string[]> = {
  'layer-1': ['bitcoin', 'ethereum', 'solana', 'cardano', 'avalanche-2', 'polkadot', 'near', 'aptos', 'sui', 'sei-network', 'celestia', 'cosmos', 'toncoin', 'kaspa', 'algorand', 'injective', 'hedera-hashgraph', 'fantom', 'cronos', 'theta-token', 'elrond-erd-2', 'flow', 'tezos', 'neo', 'iota', 'kava', 'zilliqa', 'harmony', 'ontology', 'qtum', 'waves', 'icon', 'lisk', 'ark', 'stratis', 'decred', 'zcash', 'monero', 'dash', 'ethereum-classic', 'bitcoin-cash'],
  'layer-2': ['arbitrum', 'optimism', 'polygon-ecosystem-token', 'immutable-x', 'loopring', 'metis-token', 'zksync', 'starknet', 'mantle', 'base', 'scroll', 'linea'],
  'defi': ['uniswap', 'aave', 'maker', 'compound-governance-token', 'curve-dao-token', 'lido-dao', 'pancakeswap-token', 'sushiswap', 'yearn-finance', '1inch', 'thorchain', 'just', 'raydium', 'jupiter-exchange-solana', 'gmx', 'pendle', 'rocket-pool', 'frax-share', 'balancer', 'convex-finance'],
  'meme': ['dogecoin', 'shiba-inu', 'pepe', 'dogwifcoin', 'bonk', 'floki', 'book-of-meme', 'brett', 'popcat', 'gigachad', 'meme', 'cat-in-a-dogs-world', 'myro', 'wen', 'neiro', 'goatseus-maximus', 'moodeng', 'spx6900'],
  'gaming': ['immutable-x', 'gala', 'axie-infinity', 'the-sandbox', 'decentraland', 'enjincoin', 'gods-unchained', 'illuvium', 'ultra', 'ronin', 'beam', 'render-token', 'pixels', 'star-atlas', 'my-neighbor-alice', 'mavia', 'heroes-of-mavia', 'prime', 'treasure'],
  'ai': ['fetch-ai', 'render-token', 'bittensor', 'artificial-superintelligence-alliance', 'near', 'arkham', 'akashi-network', 'ritestream', 'origintrail', 'singularitynet', 'ocean-protocol', 'numeraire', 'cudos', 'paal-ai', 'alethea-artificial-liquid-intelligence-token', 'graphlinq-protocol', 'aleph-ai', 'brainlet', 'aixbt-by-virtuals'],
};

interface TokenUnlock {
  id: string;
  name: string;
  symbol: string;
  image: string;
  unlockDate: string;
  tokenAmount: string;
  usdValue: string;
  percentOfSupply: string;
  type: 'cliff' | 'linear' | 'event';
  coinGeckoId: string;
  description: string;
}

const TOKEN_UNLOCKS: TokenUnlock[] = [
  { id: 'arb-1', name: 'Arbitrum', symbol: 'ARB', image: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-01-17_08-06-11.jpg?1673947795', unlockDate: '2026-05-24', tokenAmount: '11.28M', usdValue: '$7.9M', percentOfSupply: '0.28%', type: 'linear', coinGeckoId: 'arbitrum', description: 'Monthly team & investor unlock' },
  { id: 'op-1', name: 'Optimism', symbol: 'OP', image: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png?1698233689', unlockDate: '2026-05-25', tokenAmount: '4.2M', usdValue: '$7.6M', percentOfSupply: '0.21%', type: 'linear', coinGeckoId: 'optimism', description: 'Core contributor unlock' },
  { id: 'apt-1', name: 'Aptos', symbol: 'APT', image: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png?1698233563', unlockDate: '2026-05-28', tokenAmount: '11.2M', usdValue: '$100.8M', percentOfSupply: '1.12%', type: 'cliff', coinGeckoId: 'aptos', description: 'Major cliff unlock for early investors' },
  { id: 'sui-1', name: 'Sui', symbol: 'SUI', image: 'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg?1698233547', unlockDate: '2026-05-30', tokenAmount: '28.7M', usdValue: '$57.4M', percentOfSupply: '1.43%', type: 'linear', coinGeckoId: 'sui', description: 'Community & ecosystem fund' },
  { id: 'sei-1', name: 'Sei', symbol: 'SEI', image: 'https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Circular.png?1698234200', unlockDate: '2026-06-01', tokenAmount: '52.1M', usdValue: '$26M', percentOfSupply: '2.08%', type: 'cliff', coinGeckoId: 'sei-network', description: 'Seed investor cliff unlock' },
  { id: 'tia-1', name: 'Celestia', symbol: 'TIA', image: 'https://assets.coingecko.com/coins/images/31967/small/tia.jpg?1698235600', unlockDate: '2026-06-15', tokenAmount: '18.5M', usdValue: '$92.5M', percentOfSupply: '3.70%', type: 'cliff', coinGeckoId: 'celestia', description: 'Team & early backer unlock' },
  { id: 'strk-1', name: 'Starknet', symbol: 'STRK', image: 'https://assets.coingecko.com/coins/images/26433/small/starknet.jpg?1698233550', unlockDate: '2026-06-20', tokenAmount: '35.8M', usdValue: '$28.6M', percentOfSupply: '1.79%', type: 'linear', coinGeckoId: 'starknet', description: 'Monthly investor unlock' },
  { id: 'pendle-1', name: 'Pendle', symbol: 'PENDLE', image: 'https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png?1698231900', unlockDate: '2026-07-01', tokenAmount: '4.2M', usdValue: '$16.8M', percentOfSupply: '1.40%', type: 'linear', coinGeckoId: 'pendle', description: 'Team & advisor tokens' },
  { id: 'imx-1', name: 'Immutable X', symbol: 'IMX', image: 'https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png?1698232700', unlockDate: '2026-07-15', tokenAmount: '15.6M', usdValue: '$23.4M', percentOfSupply: '1.04%', type: 'linear', coinGeckoId: 'immutable-x', description: 'Ecosystem fund unlock' },
  { id: 'fet-1', name: 'Fetch.ai', symbol: 'FET', image: 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg?1698229800', unlockDate: '2026-08-01', tokenAmount: '8.9M', usdValue: '$17.8M', percentOfSupply: '0.89%', type: 'linear', coinGeckoId: 'fetch-ai', description: 'ASI alliance unlock' },
  { id: 'rndr-1', name: 'Render', symbol: 'RENDER', image: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png?1698231200', unlockDate: '2026-08-15', tokenAmount: '3.1M', usdValue: '$18.6M', percentOfSupply: '0.62%', type: 'linear', coinGeckoId: 'render-token', description: 'Monthly investor unlock' },
  { id: 'arb-2', name: 'Arbitrum', symbol: 'ARB', image: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-01-17_08-06-11.jpg?1673947795', unlockDate: '2026-08-24', tokenAmount: '11.28M', usdValue: '$7.9M', percentOfSupply: '0.28%', type: 'linear', coinGeckoId: 'arbitrum', description: 'Monthly team unlock' },
  { id: 'op-2', name: 'Optimism', symbol: 'OP', image: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png?1698233689', unlockDate: '2026-09-01', tokenAmount: '4.2M', usdValue: '$7.6M', percentOfSupply: '0.21%', type: 'linear', coinGeckoId: 'optimism', description: 'Core contributor unlock' },
  { id: 'apt-2', name: 'Aptos', symbol: 'APT', image: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png?1698233563', unlockDate: '2026-09-12', tokenAmount: '11.2M', usdValue: '$100.8M', percentOfSupply: '1.12%', type: 'cliff', coinGeckoId: 'aptos', description: 'Early investor cliff' },
  { id: 'sui-2', name: 'Sui', symbol: 'SUI', image: 'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg?1698233547', unlockDate: '2026-10-01', tokenAmount: '28.7M', usdValue: '$57.4M', percentOfSupply: '1.43%', type: 'linear', coinGeckoId: 'sui', description: 'Community fund unlock' },
  { id: 'sei-2', name: 'Sei', symbol: 'SEI', image: 'https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Circular.png?1698234200', unlockDate: '2026-10-15', tokenAmount: '52.1M', usdValue: '$26M', percentOfSupply: '2.08%', type: 'cliff', coinGeckoId: 'sei-network', description: 'Seed investor cliff' },
  { id: 'tia-2', name: 'Celestia', symbol: 'TIA', image: 'https://assets.coingecko.com/coins/images/31967/small/tia.jpg?1698235600', unlockDate: '2026-11-01', tokenAmount: '18.5M', usdValue: '$92.5M', percentOfSupply: '3.70%', type: 'cliff', coinGeckoId: 'celestia', description: 'Team & backer unlock' },
  { id: 'strk-2', name: 'Starknet', symbol: 'STRK', image: 'https://assets.coingecko.com/coins/images/26433/small/starknet.jpg?1698233550', unlockDate: '2026-11-15', tokenAmount: '35.8M', usdValue: '$28.6M', percentOfSupply: '1.79%', type: 'linear', coinGeckoId: 'starknet', description: 'Monthly investor unlock' },
  { id: 'pendle-2', name: 'Pendle', symbol: 'PENDLE', image: 'https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png?1698231900', unlockDate: '2026-12-01', tokenAmount: '4.2M', usdValue: '$16.8M', percentOfSupply: '1.40%', type: 'linear', coinGeckoId: 'pendle', description: 'Team & advisor unlock' },
  { id: 'imx-2', name: 'Immutable X', symbol: 'IMX', image: 'https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png?1698232700', unlockDate: '2026-12-15', tokenAmount: '15.6M', usdValue: '$23.4M', percentOfSupply: '1.04%', type: 'linear', coinGeckoId: 'immutable-x', description: 'Ecosystem fund unlock' },
];

type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume';
type SortDir = 'asc' | 'desc';

export function CoinsPage() {
  const { currency, watchlist, toggleWatchlist } = useAppStore();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [activeTab, setActiveTab] = useState('all');
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const cur = currency.toLowerCase() === 'pkr' ? 'usd' : currency.toLowerCase();
    const fetchCoins = async () => {
      const result = await fetchCoinPrices(cur, 250);
      if (result && result.coins.length > 0) {
        setCoins(result.coins as Coin[]);
      }
      setLoading(false);
    };
    fetchCoins();
  }, [currency]);

  const filtered = coins.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'trending') return (c.market_cap_rank || 999) <= 20;
    if (activeTab === 'gainers') return (c.price_change_percentage_24h || 0) > 5;
    if (activeTab === 'losers') return (c.price_change_percentage_24h || 0) < -5;
    if (activeTab === 'new') return (c.market_cap_rank || 999) > 200;
    if (activeTab === 'unlocks') return false;
    return (CATEGORY_COINS[activeTab] || []).includes(c.id);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (activeTab === 'gainers') return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
    if (activeTab === 'losers') return (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0);
    const aVal = a[sortKey] || 0;
    const bVal = b[sortKey] || 0;
    return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const pagedCoins = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3 w-3 inline ml-1" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3 inline ml-1" /> : <ArrowDown className="h-3 w-3 inline ml-1" />;
  };

  if (activeTab === 'unlocks') {
    const sortedUnlocks = [...TOKEN_UNLOCKS].sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime());
    const now = new Date();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Unlock className="h-6 w-6 text-bitcoin" />
              Token Unlocks
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Upcoming token unlocks and vesting schedules</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-bitcoin">$577M</span> across {TOKEN_UNLOCKS.length} unlocks
          </div>
        </div>

        <div className="space-y-3">
          {sortedUnlocks.map((token) => {
            const unlockDate = new Date(token.unlockDate);
            const daysUntil = Math.ceil((unlockDate.getTime() - now.getTime()) / 86400000);
            const isUrgent = daysUntil <= 30;
            const isSoon = daysUntil <= 90;

            return (
              <div
                key={token.id}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                  isUrgent ? 'border-red-500/30 bg-red-500/5' : isSoon ? 'border-yellow-500/30 bg-yellow-500/5' : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Image src={token.image} alt={token.symbol} width={36} height={36} className="rounded-full" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{token.name}</span>
                      <Badge variant="secondary" className="text-xs">{token.symbol}</Badge>
                      <Badge variant={token.type === 'cliff' ? 'red' : 'default'} className="text-xs">{token.type === 'cliff' ? 'Cliff' : 'Linear'}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{token.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs"><Calendar className="h-3 w-3" /> Date</div>
                    <p className="font-semibold">{unlockDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs"><Clock className="h-3 w-3" /> Left</div>
                    <p className={`font-semibold ${isUrgent ? 'text-red-500' : isSoon ? 'text-yellow-500' : 'text-crypto-green'}`}>
                      {daysUntil > 0 ? `${daysUntil}d` : 'Today'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Amount</div>
                    <p className="font-semibold">{token.tokenAmount}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Value</div>
                    <p className="font-semibold text-bitcoin">{token.usdValue}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">% Supply</div>
                    <p className="font-semibold">{token.percentOfSupply}</p>
                  </div>
                  <Link href={`/coins/${token.coinGeckoId}`} className="text-bitcoin hover:underline text-xs shrink-0">
                    View →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Crypto Prices</h1>
        <p className="text-sm text-muted-foreground mt-1">Live prices, market cap, and 24h volume for all cryptocurrencies</p>
      </div>

      <CoinsAd className="my-4" />

      {/* SEARCH + PER PAGE */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search coins..." className="pl-10" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select
          value={perPage}
          onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
          className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none"
        >
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-bitcoin text-white shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{sorted.length} coins found</p>
        {totalPages > 1 && <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>}
      </div>

      {/* TABLE */}
      <div className="rounded-xl border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 w-10"></th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">#</th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase cursor-pointer hover:text-foreground" onClick={() => handleSort('current_price')}>Price <SortIcon column="current_price" /></th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase cursor-pointer hover:text-foreground" onClick={() => handleSort('price_change_percentage_24h')}>24h % <SortIcon column="price_change_percentage_24h" /></th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase cursor-pointer hover:text-foreground hidden md:table-cell" onClick={() => handleSort('market_cap')}>Market Cap <SortIcon column="market_cap" /></th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase cursor-pointer hover:text-foreground hidden lg:table-cell" onClick={() => handleSort('total_volume')}>Volume (24h) <SortIcon column="total_volume" /></th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase hidden xl:table-cell">Supply</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3"><Skeleton className="h-4 w-4" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-6" /></td>
                      <td className="p-3"><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 w-24" /></div></td>
                      <td className="p-3"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-14 ml-auto" /></td>
                      <td className="p-3 hidden md:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></td>
                      <td className="p-3 hidden lg:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      <td className="p-3 hidden xl:table-cell"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    </tr>
                  ))
                : pagedCoins.map((coin) => (
                    <tr key={coin.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-3"><button onClick={() => toggleWatchlist(coin.id)} className="text-muted-foreground hover:text-bitcoin transition-colors"><Star className={`h-4 w-4 ${watchlist.includes(coin.id) ? 'fill-bitcoin text-bitcoin' : ''}`} /></button></td>
                      <td className="p-3 text-sm text-muted-foreground">{coin.market_cap_rank}</td>
                      <td className="p-3"><Link href={`/coins/${coin.id}`} className="flex items-center gap-2 hover:text-bitcoin transition-colors"><Image src={coin.image} alt={coin.name} width={28} height={28} className="rounded-full" /><div><span className="font-medium">{coin.name}</span><span className="text-xs text-muted-foreground ml-1 uppercase">{coin.symbol}</span></div></Link></td>
                      <td className="p-3 text-right font-medium">{formatCurrency(coin.current_price, currency)}</td>
                      <td className="p-3 text-right"><Badge variant={(coin.price_change_percentage_24h || 0) >= 0 ? 'green' : 'red'}>{formatPercent(coin.price_change_percentage_24h || 0)}</Badge></td>
                      <td className="p-3 text-right hidden md:table-cell">{formatCurrency(coin.market_cap, currency)}</td>
                      <td className="p-3 text-right hidden lg:table-cell">{formatCurrency(coin.total_volume, currency)}</td>
                      <td className="p-3 text-right hidden xl:table-cell"><div className="text-sm">{formatNumber(coin.circulating_supply || 0, 0)}{coin.max_supply && <div className="text-xs text-muted-foreground">/ {formatNumber(coin.max_supply || 0, 0)}</div>}</div>{coin.max_supply && <div className="w-16 h-1 bg-muted rounded-full ml-auto mt-1"><div className="h-full bg-bitcoin rounded-full" style={{ width: `${getSupplyPercent(coin.circulating_supply || 0, coin.max_supply || 0)}%` }} /></div>}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, sorted.length)} of {sorted.length}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm rounded-lg border disabled:opacity-50 hover:bg-muted transition-colors">← Prev</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${page === p ? 'bg-bitcoin text-white border-bitcoin' : 'hover:bg-muted'}`}>{p}</button>
              );
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded-lg border disabled:opacity-50 hover:bg-muted transition-colors">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
