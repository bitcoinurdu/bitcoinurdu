'use client';

import { useEffect, useState } from 'react';
import { fetchCoinHistory } from '@/lib/api/crypto';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceChartProps {
  coinId: string;
  days: number;
  currency: string;
}

export function PriceChart({ coinId, days, currency }: PriceChartProps) {
  const [data, setData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCoinHistory(coinId, days, currency).then((result) => {
      const prices = (result as Record<string, number[][]>)?.prices || [];
      const formatted = prices.map((p: number[]) => ({
        date: new Date(p[0]).toLocaleDateString(),
        price: p[1],
      }));
      setData(formatted);
      setLoading(false);
    });
  }, [coinId, days, currency]);

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No chart data available
      </div>
    );
  }

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const isUp = data[data.length - 1]?.price >= data[0]?.price;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isUp ? '#0ECB81' : '#F6465D'} stopOpacity={0.3} />
            <stop offset="95%" stopColor={isUp ? '#0ECB81' : '#F6465D'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
        />
        <YAxis
          domain={[minPrice * 0.99, maxPrice * 1.01]}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(2)}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={isUp ? '#0ECB81' : '#F6465D'}
          fill="url(#colorPrice)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
