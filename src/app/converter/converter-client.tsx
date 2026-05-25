'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpDown, RefreshCw, Calculator, Coins } from 'lucide-react';
import { getConverterRates, fetchAllRates } from '@/lib/api/rates';
import type { GoldRates } from '@/lib/api/gold';

const CURRENCIES = [
  { code: 'usd', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'pkr', symbol: '₨', name: 'Pakistani Rupee', flag: '' },
  { code: 'eur', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'gbp', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'aed', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'sar', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'gold', symbol: '🥇', name: 'Gold (oz)', flag: '🥇' },
  { code: 'silver', symbol: '🥈', name: 'Silver (oz)', flag: '🥈' },
];

export default function ConverterClient() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('usd');
  const [to, setTo] = useState('pkr');
  const [rates, setRates] = useState<Record<string, number>>(getConverterRates());
  const [goldData, setGoldData] = useState<GoldRates | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [source, setSource] = useState<'live' | 'cached' | 'fallback'>('fallback');

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const allRates = await fetchAllRates();
      const converterRates: Record<string, number> = {
        usd: 1,
        pkr: allRates.fiat.usd_pkr,
        eur: allRates.fiat.usd_eur,
        gbp: allRates.fiat.usd_gbp,
        aed: allRates.fiat.usd_aed,
        sar: allRates.fiat.usd_sar,
        gold: allRates.gold.gold_24k_per_oz,
        silver: allRates.gold.silver_per_oz,
      };
      setRates(converterRates);
      setGoldData(allRates.gold);
      setLastUpdate(new Date(allRates.lastUpdated));
      setSource(allRates.source);
    } catch {
      const fallback = getConverterRates();
      setRates(fallback);
      setSource('fallback');
    } finally {
      setLoading(false);
    }
  };

  const convert = () => {
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    const amountInUsd = amount / fromRate;
    return amountInUsd * toRate;
  };

  const result = convert();
  const fromCur = CURRENCIES.find((c) => c.code === from);
  const toCur = CURRENCIES.find((c) => c.code === to);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  const sourceBadge = {
    live: { label: 'Live', color: 'bg-green-500/10 text-green-500' },
    cached: { label: 'Cached', color: 'bg-yellow-500/10 text-yellow-500' },
    fallback: { label: 'Fallback', color: 'bg-red-500/10 text-red-500' },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6 text-bitcoin" />
            Currency & Gold Converter
          </h1>
          <p className="text-sm text-muted-foreground">Real-time conversion for fiat & precious metals</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4 sm:p-6 space-y-4">
        {/* Source Badge */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${sourceBadge[source].color}`}>
            {sourceBadge[source].label}
          </span>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* From */}
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="flex-1 px-4 py-3 rounded-xl border bg-background text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
              placeholder="0.00"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 rounded-xl border bg-background text-sm font-medium min-w-[120px]"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-2 rounded-full bg-bitcoin/10 hover:bg-bitcoin/20 transition-colors"
          >
            <ArrowUpDown className="h-5 w-5 text-bitcoin" />
          </button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 rounded-xl border bg-muted/50 text-lg font-semibold">
              {loading ? '...' : `${toCur?.symbol}${result.toLocaleString(undefined, { maximumFractionDigits: result < 1 ? 8 : 2 })}`}
            </div>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-2 rounded-xl border bg-background text-sm font-medium min-w-[120px]"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Amounts */}
        <div className="flex flex-wrap gap-2">
          {[1, 10, 100, 1000, 10000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className="px-3 py-1.5 rounded-lg border bg-background text-xs hover:bg-accent transition-colors"
            >
              {fromCur?.symbol}{v.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <div className="flex items-center justify-between pt-2 border-t">
          <button
            onClick={fetchRates}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Update Rates'}
          </button>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-6 rounded-2xl border bg-card p-4 sm:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Coins className="h-4 w-4 text-bitcoin" />
          Quick Reference (1 USD)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CURRENCIES.filter((c) => c.code !== 'usd').map((c) => (
            <div key={c.code} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-sm">{c.flag} {c.code.toUpperCase()}</span>
              <span className="font-semibold text-sm">
                {c.code === 'gold' ? (rates.usd ? (1 / (rates.gold || 2650)).toFixed(6) : '—') :
                 c.code === 'silver' ? (rates.usd ? (1 / (rates.silver || 30)).toFixed(4) : '—') :
                 `${c.symbol}${rates[c.code]?.toFixed(2) || '—'}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gold Purity Table */}
      {goldData && (
        <div className="mt-6 rounded-2xl border bg-card p-4 sm:p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-lg">🥇</span>
            Gold Rates (per ounce)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { purity: '24K', price: goldData.gold_24k_per_oz, color: 'text-yellow-500' },
              { purity: '22K', price: goldData.gold_22k_per_oz, color: 'text-yellow-600' },
              { purity: '21K', price: goldData.gold_21k_per_oz, color: 'text-yellow-700' },
              { purity: '18K', price: goldData.gold_18k_per_oz, color: 'text-amber-600' },
            ].map((g) => (
              <div key={g.purity} className="p-3 rounded-xl border bg-muted/30 text-center">
                <p className={`font-bold ${g.color}`}>{g.purity}</p>
                <p className="text-sm font-semibold">${g.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Silver/oz</span>
              <span className="font-semibold">${goldData.silver_per_oz.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gold/gram 24K</span>
              <span className="font-semibold">${goldData.gold_per_gram_24k.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
