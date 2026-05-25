'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, RefreshCw } from 'lucide-react';

const currencies = [
  { value: 'BTC', label: 'Bitcoin', type: 'crypto' },
  { value: 'ETH', label: 'Ethereum', type: 'crypto' },
  { value: 'USDT', label: 'Tether', type: 'crypto' },
  { value: 'USD', label: 'US Dollar', type: 'fiat' },
  { value: 'PKR', label: 'Pakistani Rupee', type: 'fiat' },
  { value: 'EUR', label: 'Euro', type: 'fiat' },
  { value: 'GBP', label: 'British Pound', type: 'fiat' },
  { value: 'AED', label: 'UAE Dirham', type: 'fiat' },
  { value: 'SAR', label: 'Saudi Riyal', type: 'fiat' },
  { value: 'INR', label: 'Indian Rupee', type: 'fiat' },
];

const rates: Record<string, number> = {
  BTC: 65420,
  ETH: 3510,
  USDT: 1,
  USD: 1,
  PKR: 0.0036,
  EUR: 1.08,
  GBP: 1.25,
  AED: 0.27,
  SAR: 0.27,
  INR: 0.012,
};

const quickAmounts = [100, 500, 1000, 5000, 10000];

function convert(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  const usdAmount = amount * (rates[from] || 1);
  const result = usdAmount / (rates[to] || 1);
  return result;
}

export function ConverterContent() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('BTC');
  const [to, setTo] = useState('USD');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const result = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return 0;
    return convert(num, from, to);
  }, [amount, from, to]);

  const rate = useMemo(() => {
    return convert(1, from, to);
  }, [from, to]);

  const handleSwap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Tools
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Crypto Converter</h1>
        <p className="text-muted-foreground">
          Convert between cryptocurrencies and fiat currencies instantly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>Enter an amount and select currencies to convert</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="any"
              className="h-12 text-lg"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full space-y-2">
              <label className="text-sm font-medium">From</label>
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <span className="flex items-center gap-2">
                        <Badge variant={c.type === 'crypto' ? 'bitcoin' : 'secondary'} className="w-12 justify-center shrink-0">
                          {c.value}
                        </Badge>
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="mt-6 shrink-0 rounded-full h-10 w-10"
              title="Swap currencies"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>

            <div className="flex-1 w-full space-y-2">
              <label className="text-sm font-medium">To</label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <span className="flex items-center gap-2">
                        <Badge variant={c.type === 'crypto' ? 'bitcoin' : 'secondary'} className="w-12 justify-center shrink-0">
                          {c.value}
                        </Badge>
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((qa) => (
              <Button
                key={qa}
                variant="outline"
                size="sm"
                onClick={() => setAmount(String(qa))}
                className={amount === String(qa) ? 'border-primary bg-primary/5' : ''}
              >
                {qa.toLocaleString()}
              </Button>
            ))}
          </div>

          <div className="rounded-xl border bg-muted/30 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Result</span>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>
            <div className="text-3xl font-bold tracking-tight">
              {result.toLocaleString('en-US', {
                minimumFractionDigits: from === to ? 2 : 8,
                maximumFractionDigits: from === to ? 2 : 8,
              })}{' '}
              <span className="text-muted-foreground">{to}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              1 {from} = {rate.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} {to}
            </div>
            <div className="text-xs text-muted-foreground/60">
              Last updated: {lastUpdated} · Rates are for display purposes only
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supported Currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currencies.map((c) => (
              <Badge key={c.value} variant={c.type === 'crypto' ? 'bitcoin' : 'secondary'} className="px-3 py-1">
                {c.value} - {c.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <AdPlaceholder />
    </div>
  );
}
