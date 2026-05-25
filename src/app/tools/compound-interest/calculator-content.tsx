'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Percent, Calendar, TrendingUp, PiggyBank } from 'lucide-react';

const frequencies = [
  { value: 'daily', label: 'Daily', periods: 365 },
  { value: 'monthly', label: 'Monthly', periods: 12 },
  { value: 'quarterly', label: 'Quarterly', periods: 4 },
  { value: 'yearly', label: 'Yearly', periods: 1 },
];

export function CompoundInterestContent() {
  const [principal, setPrincipal] = useState('10000');
  const [contribution, setContribution] = useState('500');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('10');
  const [compoundFreq, setCompoundFreq] = useState('monthly');

  const freq = frequencies.find((f) => f.value === compoundFreq)!;

  const results = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const pmt = parseFloat(contribution) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 1;
    const n = freq.periods;

    const totalPrincipal = p + pmt * 12 * t;

    let finalBalance: number;
    if (r === 0) {
      finalBalance = totalPrincipal;
    } else {
      const ratePerPeriod = r / n;
      const periods = n * t;

      const compoundFactor = Math.pow(1 + ratePerPeriod, periods);

      const principalPart = p * compoundFactor;

      let contributionPart: number;
      if (pmt > 0 && ratePerPeriod > 0) {
        contributionPart =
          pmt * 12 *
          ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod) *
          (1 / n);
      } else {
        contributionPart = 0;
      }

      finalBalance = principalPart + contributionPart;
    }

    const totalInterest = finalBalance - totalPrincipal;

    return { finalBalance, totalPrincipal, totalInterest };
  }, [principal, contribution, rate, years, compoundFreq]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Tools
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Compound Interest Calculator</h1>
        <p className="text-muted-foreground">
          Calculate compound interest on your investments with customizable compounding frequency.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Set your compounding parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Principal Amount ($)
              </label>
              <Input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="10000"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Monthly Contribution ($)
              </label>
              <Input
                type="number"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                placeholder="500"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                Annual Interest Rate (%)
              </label>
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="5"
                min="0"
                step="0.1"
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
                placeholder="10"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
                Compound Frequency
              </label>
              <Select value={compoundFreq} onValueChange={setCompoundFreq}>
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
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-card p-6 space-y-1">
                <span className="text-sm text-muted-foreground">Final Balance</span>
                <p className="text-3xl font-bold text-crypto-green">
                  {formatCurrency(results.finalBalance, 'USD')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Total Principal</span>
                  <p className="text-lg font-bold">{formatCurrency(results.totalPrincipal, 'USD')}</p>
                </div>
                <div className="rounded-lg border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Total Interest</span>
                  <p className="text-lg font-bold text-crypto-green">
                    +{formatCurrency(results.totalInterest, 'USD')}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Compound Frequency</span>
                  <span className="font-medium capitalize">{compoundFreq}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investment Period</span>
                  <span className="font-medium">{years} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Interest / Principal Ratio</span>
                  <span className="font-medium text-crypto-green">
                    {results.totalPrincipal > 0
                      ? ((results.totalInterest / results.totalPrincipal) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Growth Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Principal</span>
                <span className="font-medium">
                  {formatCurrency(results.totalPrincipal, 'USD')}
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                <div
                  className="bg-primary transition-all"
                  style={{
                    width: `${results.finalBalance > 0
                      ? (results.totalPrincipal / results.finalBalance) * 100
                      : 0}%`,
                  }}
                />
                <div
                  className="bg-crypto-green transition-all"
                  style={{
                    width: `${results.finalBalance > 0
                      ? (results.totalInterest / results.finalBalance) * 100
                      : 0}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Interest Earned</span>
                <span className="font-medium text-crypto-green">
                  +{formatCurrency(results.totalInterest, 'USD')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Principal
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-crypto-green" />
                  Interest
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdPlaceholder />
    </div>
  );
}
