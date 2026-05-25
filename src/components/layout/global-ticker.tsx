'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const TICKER_CACHE_KEY = 'bu_ticker_cache';
const TICKER_CACHE_TTL = 120000;

function loadCached(): Record<string, unknown>[] {
  try {
    const raw = localStorage.getItem(TICKER_CACHE_KEY);
    if (!raw) return [];
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > TICKER_CACHE_TTL) return [];
    return data;
  } catch { return []; }
}

function saveCache(coins: Record<string, unknown>[]) {
  try {
    localStorage.setItem(TICKER_CACHE_KEY, JSON.stringify({ data: coins.slice(0, 20), ts: Date.now() }));
  } catch {}
}

export function GlobalTicker() {
  const [coins, setCoins] = useState<Record<string, unknown>[]>(loadCached);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch('/data/coins-market.json');
        if (!res.ok) throw new Error('no cache');
        const data = await res.json();
        const all: Record<string, unknown>[] = [];
        for (const p of data.pages || []) {
          for (const c of p.coins || []) { all.push(c); if (all.length >= 20) break; }
          if (all.length >= 20) break;
        }
        if (!cancelled && all.length > 0) { setCoins(all); saveCache(all); }
      } catch {
        // cached data already loaded via useState
      }
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (coins.length === 0) return null;

  return (
    <div className="bg-muted/50 border-b overflow-hidden py-1.5">
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {coins.map((c: Record<string, unknown>, i: number) => (
          <Link
            key={`${c.id}-${i}`}
            href={`/coins/${c.id}`}
            className="inline-flex items-center gap-1.5 shrink-0 text-xs hover:opacity-80"
          >
            <Image
              src={c.image as string}
              alt={c.symbol as string}
              width={14}
              height={14}
              className="rounded-full"
            />
            <span className="font-medium uppercase">{c.symbol as string}</span>
            <span>${(c.current_price as number)?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            <span className={(c.price_change_percentage_24h as number) >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>
              {(c.price_change_percentage_24h as number) >= 0 ? '↑' : '↓'} {Math.abs(c.price_change_percentage_24h as number || 0).toFixed(2)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
