'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

interface HeatmapCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

export function MarketHeatmapPage() {
  const { currency } = useAppStore();
  const [coins, setCoins] = useState<HeatmapCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCoin, setHoveredCoin] = useState<HeatmapCoin | null>(null);
  const [maxCoins, setMaxCoins] = useState(50);

  useEffect(() => {
    fetch('/data/coins-market.json')
      .then((r) => r.json())
      .then((data) => {
        const all: HeatmapCoin[] = [];
        for (const p of data.pages || []) {
          for (const c of p.coins || []) {
            all.push(c as HeatmapCoin);
          }
        }
        setCoins(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const topCoins = useMemo(() => {
    return [...coins]
      .filter((c) => c.market_cap > 0 && c.market_cap_rank)
      .sort((a, b) => (a.market_cap_rank || 999) - (b.market_cap_rank || 999))
      .slice(0, maxCoins);
  }, [coins, maxCoins]);

  const maxMarketCap = useMemo(() => Math.max(...topCoins.map((c) => c.market_cap || 0)), [topCoins]);

  const getBoxSize = (marketCap: number) => {
    const ratio = marketCap / maxMarketCap;
    if (ratio > 0.5) return { cols: 3, rows: 2 };
    if (ratio > 0.2) return { cols: 2, rows: 2 };
    if (ratio > 0.05) return { cols: 2, rows: 1 };
    return { cols: 1, rows: 1 };
  };

  const getColor = (change: number) => {
    if (change > 10) return 'from-green-600 to-green-700';
    if (change > 5) return 'from-green-500 to-green-600';
    if (change > 2) return 'from-green-400 to-green-500';
    if (change > 0) return 'from-green-300 to-green-400';
    if (change === 0) return 'from-gray-400 to-gray-500';
    if (change > -2) return 'from-red-300 to-red-400';
    if (change > -5) return 'from-red-400 to-red-500';
    if (change > -10) return 'from-red-500 to-red-600';
    return 'from-red-600 to-red-700';
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading heatmap...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/markets" className="p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Market Heatmap</h1>
            <p className="text-sm text-muted-foreground">Visual overview of crypto market movements</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={maxCoins}
            onChange={(e) => setMaxCoins(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border bg-background text-sm"
          >
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500" /> Gain</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500" /> Loss</span>
        <span className="ml-auto">{topCoins.length} coins</span>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1 auto-rows-[50px] sm:auto-rows-[60px]">
        {topCoins.map((coin) => {
          const size = getBoxSize(coin.market_cap);
          const change = coin.price_change_percentage_24h || 0;
          return (
            <Link
              key={coin.id}
              href={`/coins/${coin.id}`}
              className={`bg-gradient-to-br ${getColor(change)} text-white rounded-lg p-1.5 sm:p-2 flex flex-col justify-between hover:opacity-90 transition-opacity relative overflow-hidden`}
              style={{ gridColumn: `span ${size.cols}`, gridRow: `span ${size.rows}` }}
              onMouseEnter={() => setHoveredCoin(coin)}
              onMouseLeave={() => setHoveredCoin(null)}
            >
              <div className="flex items-center gap-1">
                <Image src={coin.image} alt={coin.symbol} width={16} height={16} className="rounded-full" />
                <span className="font-semibold text-xs sm:text-sm truncate">{coin.symbol.toUpperCase()}</span>
              </div>
              <div>
                <div className="font-bold text-xs sm:text-base truncate">{formatCurrency(coin.current_price, currency)}</div>
                <div className="text-[10px] sm:text-xs font-medium flex items-center gap-0.5">
                  {change >= 0 ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hoveredCoin && (
        <div className="fixed z-50 pointer-events-none bg-card border rounded-lg shadow-xl p-3 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Image src={hoveredCoin.image} alt={hoveredCoin.name} width={20} height={20} className="rounded-full" />
            <span className="font-semibold text-sm">{hoveredCoin.name}</span>
          </div>
          <div className="text-xs space-y-1">
            <div>Price: <span className="font-medium">{formatCurrency(hoveredCoin.current_price, currency)}</span></div>
            <div>MCap: <span className="font-medium">{formatCurrency(hoveredCoin.market_cap, currency)}</span></div>
            <div className={hoveredCoin.price_change_percentage_24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>
              24h: <span className="font-medium">{hoveredCoin.price_change_percentage_24h >= 0 ? '+' : ''}{hoveredCoin.price_change_percentage_24h?.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
