'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';

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

interface HeatmapProps {
  coins: HeatmapCoin[];
  maxCoins?: number;
}

export function MarketHeatmap({ coins, maxCoins = 50 }: HeatmapProps) {
  const { currency } = useAppStore();
  const [hoveredCoin, setHoveredCoin] = useState<HeatmapCoin | null>(null);

  const topCoins = useMemo(() => {
    return [...coins]
      .filter((c) => c.market_cap > 0 && c.market_cap_rank)
      .sort((a, b) => (a.market_cap_rank || 999) - (b.market_cap_rank || 999))
      .slice(0, maxCoins);
  }, [coins, maxCoins]);

  const maxMarketCap = useMemo(() => {
    return Math.max(...topCoins.map((c) => c.market_cap || 0));
  }, [topCoins]);

  const getBoxSize = (marketCap: number) => {
    const ratio = marketCap / maxMarketCap;
    if (ratio > 0.5) return { cols: 3, rows: 2, label: 'xl' };
    if (ratio > 0.2) return { cols: 2, rows: 2, label: 'lg' };
    if (ratio > 0.05) return { cols: 2, rows: 1, label: 'md' };
    if (ratio > 0.01) return { cols: 1, rows: 1, label: 'sm' };
    return { cols: 1, rows: 1, label: 'xs' };
  };

  const getColor = (change: number) => {
    if (change > 10) return 'bg-green-600';
    if (change > 5) return 'bg-green-500';
    if (change > 2) return 'bg-green-400';
    if (change > 0) return 'bg-green-300';
    if (change === 0) return 'bg-gray-400';
    if (change > -2) return 'bg-red-300';
    if (change > -5) return 'bg-red-400';
    if (change > -10) return 'bg-red-500';
    return 'bg-red-600';
  };

  const getTextColor = (change: number) => {
    if (change > 0) return 'text-white';
    if (change < 0) return 'text-white';
    return 'text-gray-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Market Heatmap</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-500" /> Gain
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-red-500" /> Loss
          </span>
        </div>
      </div>

      {hoveredCoin && (
        <div className="fixed z-50 pointer-events-none bg-card border rounded-lg shadow-xl p-3 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Image src={hoveredCoin.image} alt={hoveredCoin.name} width={20} height={20} className="rounded-full" />
            <span className="font-semibold text-sm">{hoveredCoin.name}</span>
          </div>
          <div className="text-xs space-y-1">
            <div>Price: <span className="font-medium">{formatCurrency(hoveredCoin.current_price, currency)}</span></div>
            <div>Market Cap: <span className="font-medium">{formatCurrency(hoveredCoin.market_cap, currency)}</span></div>
            <div className={hoveredCoin.price_change_percentage_24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>
              24h: <span className="font-medium">{hoveredCoin.price_change_percentage_24h >= 0 ? '+' : ''}{hoveredCoin.price_change_percentage_24h?.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-1 auto-rows-[60px]">
        {topCoins.map((coin) => {
          const size = getBoxSize(coin.market_cap);
          const change = coin.price_change_percentage_24h || 0;

          return (
            <Link
              key={coin.id}
              href={`/coins/${coin.id}`}
              className={`${getColor(change)} ${getTextColor(change)} rounded-lg p-2 flex flex-col justify-between hover:opacity-90 transition-opacity cursor-pointer relative overflow-hidden`}
              style={{
                gridColumn: `span ${size.cols}`,
                gridRow: `span ${size.rows}`,
              }}
              onMouseEnter={() => setHoveredCoin(coin)}
              onMouseLeave={() => setHoveredCoin(null)}
            >
              <div className="flex items-center gap-1.5">
                <Image src={coin.image} alt={coin.symbol} width={size.label === 'xl' ? 24 : 16} height={size.label === 'xl' ? 24 : 16} className="rounded-full" />
                <span className="font-semibold text-sm truncate">{coin.symbol.toUpperCase()}</span>
              </div>
              <div className="space-y-0.5">
                <div className={`font-bold ${size.label === 'xl' || size.label === 'lg' ? 'text-lg' : 'text-sm'}`}>
                  {formatCurrency(coin.current_price, currency)}
                </div>
                <div className="text-xs font-medium">
                  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
