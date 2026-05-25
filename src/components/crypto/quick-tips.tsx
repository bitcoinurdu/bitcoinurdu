'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, BookOpen, Shield, Wallet, ChevronRight } from 'lucide-react';

const tips = [
  {
    icon: Shield,
    title: 'Secure Your Crypto',
    description: 'Always use hardware wallets for long-term storage. Never share your seed phrase with anyone.',
    href: '/learn-bitcoin',
    tag: 'Security',
  },
  {
    icon: Wallet,
    title: 'Diversify Your Portfolio',
    description: 'Dont put all your eggs in one basket. Spread investments across different cryptocurrencies.',
    href: '/portfolio',
    tag: 'Strategy',
  },
  {
    icon: BookOpen,
    title: 'DYOR - Do Your Own Research',
    description: 'Always research before investing. Check whitepapers, team backgrounds, and community activity.',
    href: '/research',
    tag: 'Research',
  },
  {
    icon: Lightbulb,
    title: 'Start Small',
    description: 'Begin with small amounts you can afford to lose. Learn the market before making bigger investments.',
    href: '/learn-bitcoin',
    tag: 'Beginner',
  },
];

export function QuickTips() {
  const [visibleCount, setVisibleCount] = useState(2);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Quick Crypto Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.slice(0, visibleCount).map((tip, index) => (
            <Link
              key={index}
              href={tip.href}
              className="card card-hover p-4 group"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-bitcoin/10 p-2 shrink-0">
                  <tip.icon className="h-5 w-5 text-bitcoin" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{tip.tag}</Badge>
                  </div>
                  <h3 className="font-semibold group-hover:text-bitcoin transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {visibleCount < tips.length && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVisibleCount(tips.length)}
            >
              Show More Tips
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Want to learn more? Check out our complete guides.
          </p>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn-bitcoin">
              Learn More
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
