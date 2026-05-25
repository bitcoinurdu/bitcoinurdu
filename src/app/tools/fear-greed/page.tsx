'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { cn } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { TrendingUp, TrendingDown, Info, BarChart3, CalendarDays, RefreshCw, Activity } from 'lucide-react';

const mockValue = 42;
const mockHistory = [
  { date: 'May 16', value: 38, label: 'Fear' },
  { date: 'May 17', value: 41, label: 'Fear' },
  { date: 'May 18', value: 35, label: 'Fear' },
  { date: 'May 19', value: 39, label: 'Fear' },
  { date: 'May 20', value: 44, label: 'Fear' },
  { date: 'May 21', value: 47, label: 'Neutral' },
  { date: 'May 22', value: 42, label: 'Fear' },
];

function getIndexConfig(value: number) {
  if (value <= 25) return { label: 'Extreme Fear', color: 'text-crypto-red', bg: 'bg-crypto-red/10', border: 'border-crypto-red/30', ring: 'ring-crypto-red/40', bar: 'bg-crypto-red' };
  if (value <= 45) return { label: 'Fear', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', ring: 'ring-orange-500/40', bar: 'bg-orange-500' };
  if (value <= 55) return { label: 'Neutral', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', ring: 'ring-yellow-500/40', bar: 'bg-yellow-500' };
  if (value <= 75) return { label: 'Greed', color: 'text-lime-500', bg: 'bg-lime-500/10', border: 'border-lime-500/30', ring: 'ring-lime-500/40', bar: 'bg-lime-500' };
  return { label: 'Extreme Greed', color: 'text-crypto-green', bg: 'bg-crypto-green/10', border: 'border-crypto-green/30', ring: 'ring-crypto-green/40', bar: 'bg-crypto-green' };
}

const fgMeta = generateSEO({ title: 'Fear & Greed Index', description: 'Crypto fear and greed index showing market sentiment from 0 (Extreme Fear) to 100 (Extreme Greed).' });

type HistoryEntry = { date: string; value: number; label: string };

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function FearGreedPage() {
  const [currentValue, setCurrentValue] = useState(mockValue);
  const [history, setHistory] = useState<HistoryEntry[]>(mockHistory);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [updating, setUpdating] = useState(false);
  const [source, setSource] = useState<'live' | 'cached'>('cached');

  useEffect(() => {
    document.title = fgMeta.title;
  }, []);

  const fetchFearGreed = useCallback(async () => {
    try {
      const res = await fetch('https://api.alternative.me/fng/?limit=7');
      const json = await res.json();
      if (!json.data || !Array.isArray(json.data)) throw new Error('Invalid response');
      const entries: HistoryEntry[] = json.data.map((d: { value: string; value_classification: string; timestamp: string }) => ({
        date: formatTimestamp(parseInt(d.timestamp, 10)),
        value: parseInt(d.value, 10),
        label: d.value_classification,
      }));
      setCurrentValue(entries[0].value);
      setHistory(entries);
      setSource('live');
    } catch {
      setCurrentValue(mockValue);
      setHistory(mockHistory);
      setSource('cached');
    }
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    fetchFearGreed();
    const interval = setInterval(fetchFearGreed, 60000);
    return () => clearInterval(interval);
  }, [fetchFearGreed]);

  const handleRefresh = useCallback(() => {
    setUpdating(true);
    fetchFearGreed().finally(() => setUpdating(false));
  }, [fetchFearGreed]);

  const config = getIndexConfig(currentValue);

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
        ← Back to Tools
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fear & Greed Index</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Track the Crypto Fear & Greed Index to gauge market sentiment. Values range from 0 (Extreme Fear) to 100 (Extreme Greed) based on volatility, volume, social media, and surveys.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant={source === 'live' ? 'default' : 'secondary'} className="gap-1.5">
            {source === 'live' ? 'Live' : 'Cached'}
          </Badge>
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Activity className="w-3.5 h-3.5" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={updating}>
            <RefreshCw className={cn('w-4 h-4 mr-1.5', updating && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      <Card className={cn('overflow-hidden border-2', config.border)}>
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Crypto Fear & Greed Index</p>
            <div className={cn('relative inline-flex items-center justify-center w-40 h-40 rounded-full ring-4', config.ring, config.bg)}>
              <span className={cn('text-6xl font-black', config.color)}>{currentValue}</span>
            </div>
            <Badge variant="outline" className={cn('text-base px-5 py-1.5 font-semibold', config.bg, config.border, config.color)}>
              {config.label}
            </Badge>
            <div className="w-full max-w-md">
              <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                <div className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-1000', config.bar)} style={{ width: `${currentValue}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-crypto-red" /> Extreme Fear</span>
                <span className="flex items-center gap-1">Extreme Greed <TrendingUp className="w-3 h-3 text-crypto-green" /></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-muted-foreground" />
            7-Day History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Date</th>
                  <th className="text-center py-3 px-2 font-medium">Value</th>
                  <th className="text-right py-3 px-2 font-medium">Classification</th>
                </tr>
              </thead>
              <tbody>
                {history.map((day) => {
                  const dayConfig = getIndexConfig(day.value);
                  return (
                    <tr key={day.date} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 text-muted-foreground">{day.date}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={cn('font-bold', dayConfig.color)}>{day.value}</span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Badge variant="outline" className={cn('text-xs', dayConfig.bg, dayConfig.border, dayConfig.color)}>
                          {day.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-muted-foreground" />
            What is the Fear & Greed Index?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            The Crypto Fear & Greed Index measures the current sentiment in the cryptocurrency market. It is calculated using several factors including market volatility, trading volume, social media mentions, surveys, and Bitcoin dominance trends.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: TrendingDown, label: 'Extreme Fear (0-25)', desc: 'Investors are overly worried, which often signals a buying opportunity.', color: 'text-crypto-red' },
              { icon: TrendingDown, label: 'Fear (25-45)', desc: 'Caution dominates the market with moderate selling pressure.', color: 'text-orange-500' },
              { icon: BarChart3, label: 'Neutral (45-55)', desc: 'Market sentiment is balanced with no strong directional bias.', color: 'text-yellow-500' },
              { icon: TrendingUp, label: 'Greed (55-75)', desc: 'Optimism is high and investors are actively buying.', color: 'text-lime-500' },
              { icon: TrendingUp, label: 'Extreme Greed (75-100)', desc: 'Market euphoria — may indicate an overheated market and potential correction.', color: 'text-crypto-green' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="flex gap-3 p-3 rounded-lg border bg-card">
                <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', color)} />
                <div>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AdPlaceholder />
    </div>
  );
}
