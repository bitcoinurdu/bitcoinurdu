'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { BarChart3, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const frequencies = [
  { value: 'daily', label: 'Daily', periodsPerMonth: 30 },
  { value: 'weekly', label: 'Weekly', periodsPerMonth: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerMonth: 1 },
];

export function DcaCalculatorContent() {
  const [initial, setInitial] = useState('1000');
  const [recurring, setRecurring] = useState('100');
  const [frequency, setFrequency] = useState('monthly');
  const [months, setMonths] = useState('12');
  const [annualReturn, setAnnualReturn] = useState('10');

  const freq = frequencies.find((f) => f.value === frequency)!;

  const results = useMemo(() => {
    const init = parseFloat(initial) || 0;
    const rec = parseFloat(recurring) || 0;
    const m = parseInt(months) || 1;
    const annRet = parseFloat(annualReturn) || 0;

    const totalInvested = init + rec * freq.periodsPerMonth * m;
    const monthlyRate = annRet / 100 / 12;
    let estimatedValue = init;

    for (let i = 0; i < m; i++) {
      estimatedValue *= 1 + monthlyRate;
      for (let j = 0; j < freq.periodsPerMonth; j++) {
        estimatedValue += rec;
      }
    }

    const totalProfit = estimatedValue - totalInvested;
    const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return { totalInvested, estimatedValue, totalProfit, roi };
  }, [initial, recurring, frequency, months, annualReturn]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Tools
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">DCA Calculator</h1>
        <p className="text-muted-foreground">
          Calculate the potential returns of a dollar cost averaging strategy.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Set your DCA parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Initial Investment ($)
              </label>
              <Input
                type="number"
                value={initial}
                onChange={(e) => setInitial(e.target.value)}
                placeholder="1000"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Recurring Amount ($)
              </label>
              <Input
                type="number"
                value={recurring}
                onChange={(e) => setRecurring(e.target.value)}
                placeholder="100"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Frequency
              </label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Period (months)
              </label>
              <Input
                type="number"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                placeholder="12"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Expected Annual Return (%)
              </label>
              <Input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                placeholder="10"
                min="0"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground">Optional. Leave at 0 to see raw contributions.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Estimated Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Total Invested</span>
                  <p className="text-xl font-bold">{formatCurrency(results.totalInvested, 'USD')}</p>
                </div>
                <div className="rounded-lg border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Estimated Value</span>
                  <p className="text-xl font-bold text-crypto-green">{formatCurrency(results.estimatedValue, 'USD')}</p>
                </div>
                <div className="rounded-lg border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Total Profit</span>
                  <p className={cn('text-xl font-bold', results.totalProfit >= 0 ? 'text-crypto-green' : 'text-crypto-red')}>
                    {results.totalProfit >= 0 ? '+' : ''}{formatCurrency(results.totalProfit, 'USD')}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">ROI</span>
                  <p className={cn('text-xl font-bold', results.roi >= 0 ? 'text-crypto-green' : 'text-crypto-red')}>
                    {formatPercent(results.roi)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investment Period</span>
                  <span className="font-medium">{months} months ({Math.floor(parseInt(months) / 12)}y {parseInt(months) % 12}m)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frequency</span>
                  <span className="font-medium capitalize">{frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Contributions</span>
                  <span className="font-medium">{Math.floor(parseInt(months) * freq.periodsPerMonth)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Growth Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Principal</span>
                <span className="text-sm font-medium">
                  {results.totalInvested > 0
                    ? ((results.estimatedValue > 0 ? (results.totalInvested / results.estimatedValue) * 100 : 0)).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(
                      results.totalInvested > 0
                        ? (results.totalInvested / results.estimatedValue) * 100
                        : 0,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Growth</span>
                <span className="text-sm font-medium text-crypto-green">
                  {results.estimatedValue > 0
                    ? ((results.totalProfit / results.estimatedValue) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-crypto-green transition-all"
                  style={{
                    width: `${Math.min(
                      results.estimatedValue > 0
                        ? (results.totalProfit / results.estimatedValue) * 100
                        : 0,
                      100
                    )}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdPlaceholder />
    </div>
  );
}
