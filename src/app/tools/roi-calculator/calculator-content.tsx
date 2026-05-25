'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { Badge } from '@/components/ui/badge';
import { Percent, DollarSign, Calendar, TrendingUp } from 'lucide-react';

export function RoiCalculatorContent() {
  const [initial, setInitial] = useState('1000');
  const [finalValue, setFinalValue] = useState('1500');
  const [years, setYears] = useState('1');

  const results = useMemo(() => {
    const init = parseFloat(initial) || 0;
    const final = parseFloat(finalValue) || 0;
    const y = parseFloat(years) || 1;

    const totalProfit = final - init;
    const roi = init > 0 ? (totalProfit / init) * 100 : 0;
    const annualizedRoi = y > 0 ? (Math.pow(1 + roi / 100, 1 / y) - 1) * 100 : 0;

    return { totalProfit, roi, annualizedRoi };
  }, [initial, finalValue, years]);

  const roiDisplay = results.roi;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Tools
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">ROI Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your return on investment for any trade or investment.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Enter your investment parameters</CardDescription>
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
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Final Value ($)
              </label>
              <Input
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                placeholder="1500"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Time Period (years)
              </label>
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="1"
                min="0.1"
                step="0.1"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div className="rounded-lg border bg-card p-4 space-y-1 col-span-2">
                  <span className="text-xs text-muted-foreground">Annualized ROI</span>
                  <p className={cn('text-xl font-bold', results.annualizedRoi >= 0 ? 'text-crypto-green' : 'text-crypto-red')}>
                    {formatPercent(results.annualizedRoi)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Initial Investment</span>
                  <span className="font-medium">{formatCurrency(parseFloat(initial) || 0, 'USD')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Final Value</span>
                  <span className="font-medium">{formatCurrency(parseFloat(finalValue) || 0, 'USD')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Period</span>
                  <span className="font-medium">{years} year{parseFloat(years) !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ROI Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Return</span>
                <Badge variant={roiDisplay >= 0 ? 'green' : 'red'}>
                  {formatPercent(roiDisplay)}
                </Badge>
              </div>
              <div className="h-4 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    roiDisplay >= 0 ? 'bg-crypto-green' : 'bg-crypto-red'
                  )}
                  style={{
                    width: `${Math.min(Math.abs(roiDisplay), 200)}%`,
                    marginLeft: roiDisplay < 0 ? 'auto' : '0',
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdPlaceholder />
    </div>
  );
}
