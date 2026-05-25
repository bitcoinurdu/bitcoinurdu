'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { cn, formatCurrency, timeAgo } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { RefreshCw, Activity, ArrowUpRight, ArrowDownRight, Filter, Eye } from 'lucide-react';

type WhaleTx = {
  token: string;
  amount: number;
  from: string;
  to: string;
  time: string;
  type: 'Buy' | 'Sell';
};

const tokens = ['ETH', 'BTC', 'SOL', 'DOGE', 'LINK', 'AVAX', 'MATIC', 'SHIB', 'DOT', 'UNI'];
const wallets = [
  '0x1a2...b3c4', '0x5d6...e7f8', '0x9a0...b1c2', '0x3d4...e5f6',
  '0x7g8...h9i0', '0x1j2...k3l4', '0x5m6...n7o8', '0x9p0...q1r2',
  '0x3s4...t5u6', '0x7v8...w9x0', '0x1y2...z3a4', '0x5b6...c7d8',
  '0x9e0...f1g2', '0x3h4...i5j6', '0x7k8...l9m0', '0x1n2...o3p4',
];

function generateMockTx(index: number): WhaleTx {
  const token = tokens[index % tokens.length];
  const amount = Math.floor(Math.random() * 500000000) + 500000;
  return {
    token,
    amount,
    from: wallets[Math.floor(Math.random() * wallets.length)],
    to: wallets[Math.floor(Math.random() * wallets.length)],
    time: new Date(Date.now() - Math.floor(Math.random() * 7200000)).toISOString(),
    type: Math.random() > 0.5 ? 'Buy' : 'Sell',
  };
}

function generateMockTxs(): WhaleTx[] {
  return Array.from({ length: 12 }, (_, i) => generateMockTx(i));
}

const filters = [
  { key: 'all', label: 'All', minAmount: 0 },
  { key: 'large', label: 'Large ($1M+)', minAmount: 1_000_000 },
  { key: 'mega', label: 'Mega ($10M+)', minAmount: 10_000_000 },
  { key: 'insane', label: 'Insane ($100M+)', minAmount: 100_000_000 },
];

const whaleMeta = generateSEO({ title: 'Whale Tracker', description: 'Monitor large crypto transactions and whale movements in real-time.' });

export default function WhaleTrackerPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [txs, setTxs] = useState<WhaleTx[]>(generateMockTxs);
  const [source] = useState<'live' | 'simulated'>('simulated');

  useEffect(() => {
    document.title = whaleMeta.title;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTxs(generateMockTxs());
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setTxs(generateMockTxs());
    setLastUpdated(new Date());
  }, []);

  const minAmount = filters.find((f) => f.key === activeFilter)?.minAmount ?? 0;
  const filteredTxs = txs.filter((tx) => tx.amount >= minAmount);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
        ← Back to Tools
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Whale Tracker</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Monitor large cryptocurrency transactions and whale wallet movements in real-time to spot market trends and significant accumulation or distribution events.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="gap-1.5">
            <Activity className="w-3 h-3" />
            {source === 'live' ? 'Live' : 'Simulated'}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f.key}
            variant={activeFilter === f.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(f.key)}
            className="gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5 text-muted-foreground" />
            Recent Whale Transactions
            <Badge variant="secondary" className="ml-auto">{filteredTxs.length} transactions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Token</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount ($)</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">From</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">To</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map((tx, i) => (
                  <tr key={i} className={cn('border-b last:border-0 transition-colors', tx.type === 'Buy' ? 'hover:bg-crypto-green/5' : 'hover:bg-crypto-red/5')}>
                    <td className="py-3 px-4 font-medium">{tx.token}</td>
                    <td className={cn('py-3 px-4 text-right font-mono font-semibold', tx.type === 'Buy' ? 'text-crypto-green' : 'text-crypto-red')}>
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{truncate(tx.from)}</td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{truncate(tx.to)}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{timeAgo(tx.time)}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={tx.type === 'Buy' ? 'green' : 'red'} className="gap-1">
                        {tx.type === 'Buy' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {tx.type}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filteredTxs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No transactions match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AdPlaceholder />
    </div>
  );
}
