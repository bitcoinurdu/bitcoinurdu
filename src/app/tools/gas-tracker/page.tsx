'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { cn } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { Activity, RefreshCw, ArrowUpDown, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';

const mockChains = [
  {
    name: 'Ethereum',
    icon: 'ETH',
    color: '#627EEA',
    gasPrice: 28,
    level: 'medium',
    costs: { swap: 12.50, bridge: 8.20, nft: 35.00, transfer: 3.80 },
  },
  {
    name: 'BNB Smart Chain',
    icon: 'BNB',
    color: '#F0B90B',
    gasPrice: 5,
    level: 'low',
    costs: { swap: 0.35, bridge: 0.50, nft: 1.20, transfer: 0.08 },
  },
  {
    name: 'Polygon',
    icon: 'MATIC',
    color: '#8247E5',
    gasPrice: 85,
    level: 'low',
    costs: { swap: 0.15, bridge: 0.25, nft: 0.60, transfer: 0.02 },
  },
];

const levelConfig = {
  low: { label: 'Low', color: 'text-crypto-green', bg: 'bg-crypto-green/10', border: 'border-crypto-green/30' },
  medium: { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  high: { label: 'High', color: 'text-crypto-red', bg: 'bg-crypto-red/10', border: 'border-crypto-red/30' },
};

const gasMeta = generateSEO({ title: 'Gas Tracker', description: 'Live gas fees for Ethereum, BSC, Polygon and other major blockchains.' });

type ChainData = {
  name: string;
  icon: string;
  color: string;
  gasPrice: number;
  level: string;
  costs: { swap: number; bridge: number; nft: number; transfer: number };
};

function estimateCosts(gasPrice: number, chain: string) {
  const base = chain === 'Ethereum' ? 21000 : chain === 'BNB Smart Chain' ? 21000 : 50000;
  const gweiToEth = gasPrice * base * 1e-9;
  return {
    swap: +(gweiToEth * 2.5).toFixed(2),
    bridge: +(gweiToEth * 1.8).toFixed(2),
    nft: +(gweiToEth * 7).toFixed(2),
    transfer: +(gweiToEth * 0.8).toFixed(2),
  };
}

function getLevel(gasPrice: number, chain: string): string {
  if (chain === 'Ethereum') {
    if (gasPrice < 20) return 'low';
    if (gasPrice < 50) return 'medium';
    return 'high';
  }
  if (gasPrice < 10) return 'low';
  if (gasPrice < 50) return 'medium';
  return 'high';
}

const apis = [
  { name: 'Ethereum', icon: 'ETH', color: '#627EEA', url: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken' },
  { name: 'BNB Smart Chain', icon: 'BNB', color: '#F0B90B', url: 'https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken' },
  { name: 'Polygon', icon: 'MATIC', color: '#8247E5', url: 'https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken' },
];

export default function GasTrackerPage() {
  const [chains, setChains] = useState<ChainData[]>(mockChains);
  const [source, setSource] = useState<'live' | 'cached'>('cached');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = gasMeta.title;
  }, []);

  const fetchGasPrices = useCallback(async () => {
    const results = await Promise.allSettled(
      apis.map(async (api) => {
        const res = await fetch(api.url);
        const data = await res.json();
        if (data.status !== '1') throw new Error('API error');
        const gp = parseInt(data.result.ProposeGasPrice || data.result.SafeGasPrice, 10);
        return { name: api.name, icon: api.icon, color: api.color, gasPrice: gp };
      })
    );

    const allOk = results.every((r) => r.status === 'fulfilled');
    if (allOk) {
      const updated = results.map((r) => {
        const v = (r as PromiseFulfilledResult<{ name: string; icon: string; color: string; gasPrice: number }>).value;
        return {
          ...v,
          level: getLevel(v.gasPrice, v.name),
          costs: estimateCosts(v.gasPrice, v.name),
        };
      });
      setChains(updated);
      setSource('live');
    } else {
      setChains(mockChains);
      setSource('cached');
    }
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    fetchGasPrices();
    const interval = setInterval(fetchGasPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchGasPrices]);

  const handleRefresh = useCallback(() => {
    setUpdating(true);
    fetchGasPrices().finally(() => {
      setUpdating(false);
    });
  }, [fetchGasPrices]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
        ← Back to Tools
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gas Tracker</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Monitor real-time gas fees across Ethereum, Binance Smart Chain, Polygon, and other leading networks to optimize your transaction costs.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant={source === 'live' ? 'default' : 'secondary'} className="gap-1.5">
            {source === 'live' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {source === 'live' ? 'Live' : 'Cached'}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Activity className="w-3.5 h-3.5" />
            Last updated: {formatTime(lastUpdated)}
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={updating}>
            <RefreshCw className={cn('w-4 h-4 mr-1.5', updating && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {chains.map((chain) => {
          const level = levelConfig[chain.level as keyof typeof levelConfig];
          return (
            <Card key={chain.name} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${chain.color}15`, color: chain.color }}>
                      {chain.icon}
                    </div>
                    <CardTitle className="text-lg">{chain.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className={cn(level.bg, level.border, level.color, 'font-medium')}>
                    {level.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline justify-center gap-1.5 py-4">
                  <span className="text-5xl font-bold tracking-tight">{chain.gasPrice}</span>
                  <span className="text-lg text-muted-foreground font-medium">Gwei</span>
                </div>

                <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Estimated Costs</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {[
                      { label: 'Swap', value: chain.costs.swap },
                      { label: 'Bridge', value: chain.costs.bridge },
                      { label: 'NFT Mint', value: chain.costs.nft },
                      { label: 'Transfer', value: chain.costs.transfer },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium">${value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
            Gas Price History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-8 text-center">
            <ExternalLink className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Gas price chart powered by external data providers.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Connect a real-time API to view historical gas trends.</p>
          </div>
        </CardContent>
      </Card>

      <AdPlaceholder />
    </div>
  );
}
