'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { cn, formatCurrency, formatPercent, generateId } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { Plus, Trash2, Wallet, TrendingUp, TrendingDown, BarChart3, Coins, PackageOpen } from 'lucide-react';

const coins = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67250 },
  { symbol: 'ETH', name: 'Ethereum', price: 3450 },
  { symbol: 'SOL', name: 'Solana', price: 148 },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.12 },
  { symbol: 'BNB', name: 'BNB', price: 580 },
  { symbol: 'XRP', name: 'XRP', price: 0.52 },
  { symbol: 'ADA', name: 'Cardano', price: 0.45 },
  { symbol: 'AVAX', name: 'Avalanche', price: 35 },
];

interface Transaction {
  id: string;
  coin: string;
  amount: number;
  buyPrice: number;
  date: string;
}

const STORAGE_KEY = 'portfolio-tracker-txns';

const ptMeta = generateSEO({ title: 'Portfolio Tracker', description: 'Track your crypto portfolio across multiple wallets and exchanges.' });

export default function PortfolioTrackerPage() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [coin, setCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    document.title = ptMeta.title;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTxns(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (txns.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [txns]);

  const addTransaction = useCallback(() => {
    if (!coin || !amount || !buyPrice) return;
    const parsed = parseFloat(amount);
    const parsedPrice = parseFloat(buyPrice);
    if (!parsed || !parsedPrice) return;
    setTxns((prev) => [
      { id: generateId(), coin, amount: parsed, buyPrice: parsedPrice, date },
      ...prev,
    ]);
    setAmount('');
    setBuyPrice('');
  }, [coin, amount, buyPrice, date]);

  const removeTransaction = useCallback((id: string) => {
    setTxns((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getCoinInfo = (symbol: string) => coins.find((c) => c.symbol === symbol);
  const totalValue = txns.reduce((sum, t) => {
    const info = getCoinInfo(t.coin);
    return sum + (info ? t.amount * info.price : 0);
  }, 0);
  const totalCost = txns.reduce((sum, t) => sum + t.amount * t.buyPrice, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
        ← Back to Tools
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Tracker</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Manage and track your entire cryptocurrency portfolio in one place. Add transactions manually and monitor your P&L across all your holdings.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bitcoin/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-bitcoin" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-crypto-green/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-crypto-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Cost Basis</p>
              <p className="text-xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', totalPnl >= 0 ? 'bg-crypto-green/10' : 'bg-crypto-red/10')}>
              {totalPnl >= 0 ? <TrendingUp className="w-5 h-5 text-crypto-green" /> : <TrendingDown className="w-5 h-5 text-crypto-red" />}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total P&L</p>
              <p className={cn('text-xl font-bold', totalPnl >= 0 ? 'text-crypto-green' : 'text-crypto-red')}>
                {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)} ({formatPercent(totalPnlPercent)})
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-muted-foreground" />
            Add Transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-5">
            <Select value={coin} onValueChange={setCoin}>
              <SelectTrigger><SelectValue placeholder="Select coin" /></SelectTrigger>
              <SelectContent>
                {coins.map((c) => (
                  <SelectItem key={c.symbol} value={c.symbol}>{c.symbol} - {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" step="any" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input type="number" step="any" placeholder="Buy Price ($)" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button onClick={addTransaction} disabled={!coin || !amount || !buyPrice} className="gap-1.5">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {txns.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Coins className="w-5 h-5 text-muted-foreground" />
              Holdings
              <Badge variant="secondary" className="ml-auto">{txns.length} transactions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Coin</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Holdings</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Buy</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Current</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Value</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">P&L</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((t) => {
                    const info = getCoinInfo(t.coin);
                    const currentPrice = info?.price ?? 0;
                    const value = t.amount * currentPrice;
                    const pnl = value - t.amount * t.buyPrice;
                    const pnlPct = t.buyPrice > 0 ? (pnl / (t.amount * t.buyPrice)) * 100 : 0;
                    return (
                      <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium">{t.coin}</td>
                        <td className="py-3 px-4 text-right font-mono">{t.amount}</td>
                        <td className="py-3 px-4 text-right font-mono">${t.buyPrice.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono">${currentPrice.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono font-medium">{formatCurrency(value)}</td>
                        <td className={cn('py-3 px-4 text-right font-mono font-semibold', pnl >= 0 ? 'text-crypto-green' : 'text-crypto-red')}>
                          {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)} ({formatPercent(pnlPct)})
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-crypto-red" onClick={() => removeTransaction(t.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <PackageOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No transactions yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add your first transaction above to start tracking your portfolio.</p>
          </CardContent>
        </Card>
      )}

      <AdPlaceholder />
    </div>
  );
}
