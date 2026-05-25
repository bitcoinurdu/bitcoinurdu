'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { cn, formatCurrency, timeAgo, truncateAddress } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { Search, Wallet, Coins, ArrowUpRight, ArrowDownRight, Activity, ExternalLink, DollarSign } from 'lucide-react';

const mockOverview = {
  totalValue: 2458000,
  topHoldings: [
    { symbol: 'BTC', amount: 12.5, value: 840625 },
    { symbol: 'ETH', amount: 185, value: 638250 },
    { symbol: 'USDT', amount: 350000, value: 350000 },
  ],
  tokenCount: 24,
};

const mockTxns = [
  { type: 'Receive', token: 'ETH', amount: 3.2, value: 11040, time: new Date(Date.now() - 600000).toISOString() },
  { type: 'Send', token: 'BTC', amount: 0.5, value: 33625, time: new Date(Date.now() - 1800000).toISOString() },
  { type: 'Receive', token: 'USDT', amount: 50000, value: 50000, time: new Date(Date.now() - 3600000).toISOString() },
  { type: 'Send', token: 'SOL', amount: 250, value: 37000, time: new Date(Date.now() - 7200000).toISOString() },
  { type: 'Swap', token: 'ETH → USDC', amount: 10, value: 34500, time: new Date(Date.now() - 14400000).toISOString() },
  { type: 'Receive', token: 'MATIC', amount: 15000, value: 10500, time: new Date(Date.now() - 21600000).toISOString() },
  { type: 'Send', token: 'LINK', amount: 500, value: 6750, time: new Date(Date.now() - 28800000).toISOString() },
];

const wtMeta = generateSEO({ title: 'Wallet Tracker', description: 'Track any crypto wallet address and monitor its portfolio in real-time.' });

export default function WalletTrackerPage() {
  const [address, setAddress] = useState('');
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    document.title = wtMeta.title;
  }, []);

  const handleTrack = () => {
    if (!address.trim()) return;
    setTracked(true);
  };

  const getTypeIcon = (type: string) => {
    if (type === 'Receive' || type === 'Buy') return <ArrowDownRight className="w-3.5 h-3.5 text-crypto-green" />;
    if (type === 'Send' || type === 'Sell') return <ArrowUpRight className="w-3.5 h-3.5 text-crypto-red" />;
    return <Activity className="w-3.5 h-3.5 text-yellow-500" />;
  };

  const getTypeBadge = (type: string) => {
    if (type === 'Receive') return 'green';
    if (type === 'Send') return 'red';
    return 'secondary' as const;
  };

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
        ← Back to Tools
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet Tracker</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Track any cryptocurrency wallet address in real-time — view balances, transaction history, token holdings, and portfolio value across multiple chains.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter wallet address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-9 font-mono text-xs"
              />
            </div>
            <Button onClick={handleTrack} disabled={!address.trim()} className="gap-2">
              <Search className="w-4 h-4" />
              Track Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      {tracked && (
        <>
          <div className="flex items-center gap-2 px-1">
            <Badge variant="green" className="gap-1.5">
              <Activity className="w-3 h-3" />
              Live
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">{truncateAddress(address, 8)}</span>
            <ExternalLink className="w-3 h-3 text-muted-foreground/60" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bitcoin/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-bitcoin" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">{formatCurrency(mockOverview.totalValue)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-crypto-blue/10 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-crypto-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tokens Held</p>
                  <p className="text-xl font-bold">{mockOverview.tokenCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-crypto-purple/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-crypto-purple" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Top Holdings</p>
                  <p className="text-xl font-bold flex gap-2">
                    {mockOverview.topHoldings.map((h) => (
                      <span key={h.symbol} className="text-sm font-mono">{h.symbol}</span>
                    ))}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="w-5 h-5 text-muted-foreground" />
                Top Holdings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockOverview.topHoldings.map((h) => (
                  <div key={h.symbol} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                        {h.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{h.symbol}</p>
                        <p className="text-xs text-muted-foreground">{h.amount} {h.symbol}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(h.value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Token</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Value</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTxns.map((tx, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <Badge variant={getTypeBadge(tx.type) as 'green' | 'red' | 'secondary'} className="gap-1">
                            {getTypeIcon(tx.type)}
                            {tx.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">{tx.token}</td>
                        <td className="py-3 px-4 text-right font-mono">{tx.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono">{formatCurrency(tx.value)}</td>
                        <td className="py-3 px-4 text-right text-xs text-muted-foreground">{timeAgo(tx.time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!tracked && (
        <Card>
          <CardContent className="p-12 text-center">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">Enter a wallet address to start tracking</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Supports Ethereum, BSC, Polygon, Arbitrum, and more.</p>
          </CardContent>
        </Card>
      )}

      <AdPlaceholder />
    </div>
  );
}
