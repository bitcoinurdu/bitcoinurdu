'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bitcoin/10 via-background to-bitcoin/5 border p-8 md:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-bitcoin/20 via-transparent to-transparent" />
      <div className="relative space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-bitcoin/10 px-4 py-1.5 text-sm text-bitcoin">
          <TrendingUp className="h-4 w-4" />
          <span>Live Crypto Data</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          The World's Elite{' '}
          <span className="text-gradient">Crypto Platform</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Track live prices, discover airdrops, manage your portfolio, and get AI-powered
          insights - all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coins, airdrops, markets..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="bitcoin" asChild>
            <Link href={`/coins?q=${searchQuery}`}>
              Search
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Popular:</span>
          {['Bitcoin', 'Ethereum', 'Solana', 'BNB', 'XRP'].map((coin) => (
            <Link
              key={coin}
              href={`/coins/${coin.toLowerCase()}`}
              className="hover:text-bitcoin transition-colors"
            >
              {coin}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
