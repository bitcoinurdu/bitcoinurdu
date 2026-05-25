'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, ExternalLink, ChevronRight } from 'lucide-react';

const newsItems = [
  {
    title: "Bitcoin Surges Past $76K as Institutional Demand Grows",
    source: "CoinDesk",
    time: "15 minutes ago",
    category: "Breaking",
    href: "/news",
  },
  {
    title: "Ethereum ETF Inflows Hit Record $500M in Single Day",
    source: "Decrypt",
    time: "32 minutes ago",
    category: "ETF",
    href: "/news",
  },
  {
    title: "Solana DeFi TVL Crosses $10B Milestone for First Time",
    source: "The Block",
    time: "1 hour ago",
    category: "DeFi",
    href: "/news",
  },
  {
    title: "Global Crypto Regulation Framework Expands in 2026",
    source: "BitcoinUrdu",
    time: "2 hours ago",
    category: "Regulation",
    href: "/news",
  },
  {
    title: "Hyperliquid Token Jumps 15% After Major Protocol Upgrade",
    source: "CoinTelegraph",
    time: "3 hours ago",
    category: "Altcoins",
    href: "/news",
  },
];

export function CryptoNews() {
  const [visibleCount, setVisibleCount] = useState(3);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-bitcoin" />
          Latest Crypto News
        </h2>
        <Link href="/news" className="text-sm text-bitcoin hover:underline flex items-center">
          View all <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      <div className="space-y-3">
        {newsItems.slice(0, visibleCount).map((news, index) => (
          <Link
            key={index}
            href={news.href}
            className="block rounded-xl border bg-card p-4 hover:shadow-md transition-all hover:border-bitcoin/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{news.category}</Badge>
                  <span className="text-xs text-muted-foreground">{news.source}</span>
                  <span className="text-xs text-muted-foreground">• {news.time}</span>
                </div>
                <h3 className="font-medium hover:text-bitcoin transition-colors">
                  {news.title}
                </h3>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </Link>
        ))}
      </div>
      {visibleCount < newsItems.length && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVisibleCount(newsItems.length)}
          >
            Show More News
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
