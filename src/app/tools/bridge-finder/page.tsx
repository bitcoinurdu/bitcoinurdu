'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { cn, formatCurrency } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { ArrowRightLeft, Gauge, Clock, Banknote, Star, ArrowUpDown, RefreshCw } from 'lucide-react';

const chains = [
  'Ethereum', 'BNB Smart Chain', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'Solana',
];

const mockBridges = [
  { name: 'Stargate', fee: 12.50, time: '2-5 min', liquidity: 95, rating: 4.7 },
  { name: 'Hop Protocol', fee: 8.00, time: '5-10 min', liquidity: 88, rating: 4.5 },
  { name: 'Across', fee: 5.50, time: '1-3 min', liquidity: 78, rating: 4.3 },
  { name: 'Synapse', fee: 15.00, time: '3-7 min', liquidity: 92, rating: 4.6 },
  { name: 'Multichain', fee: 10.00, time: '10-20 min', liquidity: 85, rating: 4.1 },
  { name: 'Celer cBridge', fee: 6.75, time: '2-4 min', liquidity: 72, rating: 4.0 },
  { name: 'Wormhole', fee: 18.00, time: '10-15 min', liquidity: 90, rating: 4.4 },
  { name: 'deBridge', fee: 9.25, time: '3-8 min', liquidity: 76, rating: 4.2 },
  { name: 'Li.Fi', fee: 11.00, time: '5-10 min', liquidity: 82, rating: 4.3 },
  { name: 'Chainlink CCIP', fee: 22.00, time: '15-30 min', liquidity: 96, rating: 4.8 },
];

type SortField = 'fee' | 'time' | 'liquidity' | 'rating';
type SortDir = 'asc' | 'desc';

const bfMeta = generateSEO({ title: 'Bridge Finder', description: 'Find the best cross-chain bridge for your tokens with lowest fees and fastest speeds.' });

export default function BridgeFinderPage() {
  const [fromChain, setFromChain] = useState('Ethereum');
  const [toChain, setToChain] = useState('Polygon');
  const [sortField, setSortField] = useState<SortField>('fee');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => {
    document.title = bfMeta.title;
  }, []);

  const filtered = useMemo(() => {
    return [...mockBridges].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const mul = sortDir === 'asc' ? 1 : -1;
      return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * mul;
    });
  }, [sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown className={cn('w-3 h-3', sortField === field && 'text-foreground')} />
    </button>
  );

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
        ← Back to Tools
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bridge Finder</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Compare cross-chain bridges to find the best route for transferring your tokens across blockchains with the lowest fees and fastest confirmation times.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">From</label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {chains.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center pb-1">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">To</label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {chains.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
            Bridge Routes: {fromChain} → {toChain}
            <Badge variant="secondary" className="ml-auto">{filtered.length} bridges</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Bridge</th>
                  <th className="text-right py-3 px-4"><SortHeader field="fee" label="Fee" /></th>
                  <th className="text-right py-3 px-4"><SortHeader field="time" label="Time" /></th>
                  <th className="text-right py-3 px-4"><SortHeader field="liquidity" label="Liquidity" /></th>
                  <th className="text-right py-3 px-4"><SortHeader field="rating" label="Rating" /></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bridge, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{bridge.name}</td>
                    <td className="py-3 px-4 text-right font-mono text-crypto-red">{formatCurrency(bridge.fee)}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs">{bridge.time}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn('h-full rounded-full', bridge.liquidity >= 90 ? 'bg-crypto-green' : bridge.liquidity >= 80 ? 'bg-yellow-500' : 'bg-crypto-red')}
                            style={{ width: `${bridge.liquidity}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono">{bridge.liquidity}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="font-mono text-xs">{bridge.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AdPlaceholder />
    </div>
  );
}
