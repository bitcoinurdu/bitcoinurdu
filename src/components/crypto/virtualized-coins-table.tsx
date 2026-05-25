'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatNumber, formatPercent, getSupplyPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ArrowUp, ArrowDown, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useCoins, type LocalCoin } from '@/hooks/use-coins';

type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 50;

export function VirtualizedCoinsTable() {
  const { currency, watchlist, toggleWatchlist } = useAppStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { coins, loading, error, meta, lastUpdated, refetch } = useCoins({
    page,
    perPage: PAGE_SIZE,
    sort: sortKey,
    order: sortDir,
    search,
    filter,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: PAGE_SIZE });

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const rowHeight = 56;
    const visibleRows = Math.ceil(containerRef.current.clientHeight / rowHeight);
    const buffer = 5;
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    const end = Math.min(coins.length, start + visibleRows + buffer * 2);
    setVisibleRange({ start, end });
  }, [coins.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3 w-3 inline ml-1 opacity-50" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3 inline ml-1" /> : <ArrowDown className="h-3 w-3 inline ml-1" />;
  };

  const safeLastUpdated = lastUpdated ? new Date(lastUpdated) : null;
  const timeStr = safeLastUpdated ? safeLastUpdated.toLocaleTimeString() : null;

  const totalHeight = meta.total * 56;
  const offsetY = visibleRange.start * 56;
  const visibleCoins = coins.slice(visibleRange.start, visibleRange.end);

  if (loading && coins.length === 0) {
    return (
      <div className="rounded-xl border overflow-hidden bg-card">
        <div className="p-4 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12 ml-auto" />
              <Skeleton className="h-4 w-14 ml-auto" />
              <Skeleton className="h-4 w-20 ml-auto hidden md:block" />
              <Skeleton className="h-4 w-16 ml-auto hidden lg:block" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && coins.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-muted-foreground mb-4">Unable to load coin data</p>
        <button onClick={handleRefresh} className="px-4 py-2 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {meta.total.toLocaleString()} coins
          {timeStr && <span className="ml-2">Updated {timeStr}</span>}
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-muted">{meta.source}</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-xs text-bitcoin hover:underline flex items-center gap-1 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search coins..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
        />
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none"
        >
          <option value="all">All</option>
          <option value="gainers">Gainers (+5%)</option>
          <option value="losers">Losers (-5%)</option>
        </select>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="p-3 w-10"></th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">#</th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase cursor-pointer hover:text-foreground" onClick={() => handleSort('current_price')}>
                  Price <SortIcon column="current_price" />
                </th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase cursor-pointer hover:text-foreground" onClick={() => handleSort('price_change_percentage_24h')}>
                  24h % <SortIcon column="price_change_percentage_24h" />
                </th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase cursor-pointer hover:text-foreground hidden md:table-cell" onClick={() => handleSort('market_cap')}>
                  Market Cap <SortIcon column="market_cap" />
                </th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase cursor-pointer hover:text-foreground hidden lg:table-cell" onClick={() => handleSort('total_volume')}>
                  Volume <SortIcon column="total_volume" />
                </th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase hidden xl:table-cell">Supply</th>
              </tr>
            </thead>
          </table>
        </div>

        <div ref={containerRef} className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr style={{ height: `${offsetY}px` }}>
                  <td colSpan={8}></td>
                </tr>
                {visibleCoins.map((coin, idx) => {
                  const actualIndex = visibleRange.start + idx;
                  return (
                    <tr key={coin.id} className="border-t hover:bg-muted/30 transition-colors" style={{ height: '56px' }}>
                      <td className="p-3">
                        <button onClick={() => toggleWatchlist(coin.id)} className="text-muted-foreground hover:text-bitcoin transition-colors">
                          <Star className={`h-4 w-4 ${watchlist.includes(coin.id) ? 'fill-bitcoin text-bitcoin' : ''}`} />
                        </button>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{coin.market_cap_rank || actualIndex + 1}</td>
                      <td className="p-3">
                        <Link href={`/coins/${coin.id}`} className="flex items-center gap-2 hover:text-bitcoin transition-colors">
                          <Image src={coin.image || '/placeholder-coin.png'} alt={coin.name} width={28} height={28} className="rounded-full" />
                          <div>
                            <span className="font-medium">{coin.name}</span>
                            <span className="text-xs text-muted-foreground ml-1 uppercase">{coin.symbol}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="p-3 text-right font-medium">{formatCurrency(coin.current_price, currency)}</td>
                      <td className="p-3 text-right">
                        <Badge variant={(coin.price_change_percentage_24h || 0) >= 0 ? 'green' : 'red'}>
                          {formatPercent(coin.price_change_percentage_24h || 0)}
                        </Badge>
                      </td>
                      <td className="p-3 text-right hidden md:table-cell">{formatCurrency(coin.market_cap, currency)}</td>
                      <td className="p-3 text-right hidden lg:table-cell">{formatCurrency(coin.total_volume, currency)}</td>
                      <td className="p-3 text-right hidden xl:table-cell">
                        <div className="text-sm">{formatNumber(coin.circulating_supply || 0, 0)}
                          {coin.max_supply && (
                            <div className="text-xs text-muted-foreground">/ {formatNumber(coin.max_supply, 0)}</div>
                          )}
                        </div>
                        {coin.max_supply && (
                          <div className="w-16 h-1 bg-muted rounded-full ml-auto mt-1">
                            <div className="h-full bg-bitcoin rounded-full" style={{ width: `${getSupplyPercent(coin.circulating_supply || 0, coin.max_supply)}%` }} />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ height: `${Math.max(0, totalHeight - (visibleRange.end * 56))}px` }}>
                  <td colSpan={8}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {meta.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(meta.page - 1) * meta.per_page + 1}-{Math.min(meta.page * meta.per_page, meta.total)} of {meta.total.toLocaleString()}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.page === 1} className="px-3 py-1.5 text-sm rounded-lg border disabled:opacity-50 hover:bg-muted transition-colors">
              Prev
            </button>
            {Array.from({ length: Math.min(5, meta.total_pages) }, (_, i) => {
              let p: number;
              if (meta.total_pages <= 5) p = i + 1;
              else if (meta.page <= 3) p = i + 1;
              else if (meta.page >= meta.total_pages - 2) p = meta.total_pages - 4 + i;
              else p = meta.page - 2 + i;
              return (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${meta.page === p ? 'bg-bitcoin text-white border-bitcoin' : 'hover:bg-muted'}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={meta.page === meta.total_pages} className="px-3 py-1.5 text-sm rounded-lg border disabled:opacity-50 hover:bg-muted transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
