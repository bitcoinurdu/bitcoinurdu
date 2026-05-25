'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { cn } from '@/lib/utils/helpers';
import { BarChart3, TrendingUp, PieChart, Activity, Calendar, Clock, User, ArrowRight, LineChart } from 'lucide-react';
import Link from 'next/link';

const analysisArticles = {
  latest: {
    featured: {
      title: 'Bitcoin Price Analysis: BTC Approaches Key Resistance at $120K',
      author: 'BitcoinUrdu Research',
      date: 'May 20, 2026',
      excerpt: 'Bitcoin is approaching a critical resistance level at $120,000 as institutional inflows surge. Our technical analysis examines key support levels, moving averages, and on-chain metrics to determine the next likely direction for BTC.',
      readTime: '12 min read',
      category: 'Technical',
      href: '/learn-bitcoin',
    },
    articles: [
      { title: 'Ethereum Shanghai Upgrade: Impact on Staking and L2 Scaling', author: 'Sarah Khan', date: 'May 18, 2026', excerpt: 'The Ethereum Shanghai upgrade has introduced new staking capabilities and improved L2 scalability. Here\'s what it means for ETH holders.', readTime: '8 min read', category: 'Fundamental', href: '/learn-bitcoin' },
      { title: 'DeFi TVL Reaches New ATH: Which Protocols Are Leading?', author: 'Ali Raza', date: 'May 16, 2026', excerpt: 'Total value locked in DeFi has hit a new all-time high. We break down the top protocols driving this growth.', readTime: '6 min read', category: 'DeFi', href: '/learn-bitcoin' },
      { title: 'On-Chain Analysis: Whale Accumulation Patterns Signal Bullish Trend', author: 'BitcoinUrdu Research', date: 'May 14, 2026', excerpt: 'On-chain data reveals significant whale accumulation over the past 30 days. Analysis of exchange flows and holder behavior.', readTime: '10 min read', category: 'On-Chain', href: '/learn-bitcoin' },
      { title: 'Solana Price Prediction: Can SOL Break $400?', author: 'Fatima Ahmed', date: 'May 12, 2026', excerpt: 'Solana has been outperforming the broader market. Technical analysis and ecosystem growth point to a potential breakout.', readTime: '7 min read', category: 'Technical', href: '/learn-bitcoin' },
    ],
  },
  technical: {
    featured: {
      title: 'Technical Analysis Masterclass: Reading Crypto Charts Like a Pro',
      author: 'Usman Malik',
      date: 'May 15, 2026',
      excerpt: 'Learn how to read candlestick charts, identify support and resistance levels, and use technical indicators to make informed trading decisions.',
      readTime: '15 min read',
      category: 'Technical',
      href: '/learn-bitcoin',
    },
    articles: [
      { title: 'RSI and MACD: The Ultimate Combo for Crypto Trading', author: 'Sarah Khan', date: 'May 10, 2026', excerpt: 'Combine RSI and MACD indicators for more reliable trade signals. Backtested strategies with real market examples.', readTime: '9 min read', category: 'Technical', href: '/learn-bitcoin' },
      { title: 'Elliott Wave Analysis: Bitcoin\'s Next Impulsive Move', author: 'Ali Raza', date: 'May 7, 2026', excerpt: 'Elliott Wave analysis suggests Bitcoin is in the third wave of a bull cycle. Target levels and invalidation points.', readTime: '11 min read', category: 'Technical', href: '/learn-bitcoin' },
      { title: 'Volume Profile Analysis: Identifying Key Support Levels', author: 'Fatima Ahmed', date: 'May 4, 2026', excerpt: 'Volume profile reveals where the smart money is positioned. Learn to identify high-volume nodes and value areas.', readTime: '8 min read', category: 'Technical', href: '/learn-bitcoin' },
    ],
  },
  fundamental: {
    featured: {
      title: 'Bitcoin Fundamentals: Institutional Adoption Reaches New Heights',
      author: 'BitcoinUrdu Research',
      date: 'May 13, 2026',
      excerpt: 'Institutional investment in Bitcoin has reached record levels. We analyze the latest ETF flows, corporate treasuries, and regulatory developments.',
      readTime: '14 min read',
      category: 'Fundamental',
      href: '/learn-bitcoin',
    },
    articles: [
      { title: 'The State of Stablecoins: Market Cap Analysis and Regulatory Outlook', author: 'Usman Malik', date: 'May 9, 2026', excerpt: 'Stablecoin market cap is growing as regulatory clarity emerges. Analysis of USDT, USDC, DAI, and emerging competitors.', readTime: '7 min read', category: 'Fundamental', href: '/learn-bitcoin' },
      { title: 'Layer 2 Ecosystem Growth: Arbitrum vs Optimism vs zkSync', author: 'Sarah Khan', date: 'May 6, 2026', excerpt: 'A comparative analysis of leading L2 solutions — TVL, user adoption, fees, and ecosystem development.', readTime: '10 min read', category: 'Fundamental', href: '/learn-bitcoin' },
    ],
  },
  onchain: {
    featured: {
      title: 'On-Chain Metrics Dashboard: What the Data Tells Us About Q3 2026',
      author: 'Ali Raza',
      date: 'May 11, 2026',
      excerpt: 'Active addresses, transaction counts, MVRV ratio, and SOPR indicators point to a healthy market structure with room for further growth.',
      readTime: '13 min read',
      category: 'On-Chain',
      href: '/learn-bitcoin',
    },
    articles: [
      { title: 'Exchange Flows: Net Outflows Signal Strong Holder Conviction', author: 'Fatima Ahmed', date: 'May 8, 2026', excerpt: 'Bitcoin exchange reserves continue to decline, indicating that long-term holders are accumulating rather than selling.', readTime: '6 min read', category: 'On-Chain', href: '/learn-bitcoin' },
      { title: 'Miner Revenue and Hash Rate: Network Security at All-Time High', author: 'BitcoinUrdu Research', date: 'May 5, 2026', excerpt: 'Bitcoin hash rate has reached new highs, reflecting miner confidence and network security strength.', readTime: '8 min read', category: 'On-Chain', href: '/learn-bitcoin' },
      { title: 'Stablecoin Supply Ratio: What It Tells About Market Sentiment', author: 'Usman Malik', date: 'May 2, 2026', excerpt: 'The stablecoin supply ratio is a powerful indicator of market buying power and sentiment shifts.', readTime: '7 min read', category: 'On-Chain', href: '/learn-bitcoin' },
    ],
  },
};

type TabKey = 'latest' | 'technical' | 'fundamental' | 'onchain';

const tabIcons: Record<TabKey, React.ComponentType<{ className?: string }>> = {
  latest: Activity,
  technical: LineChart,
  fundamental: PieChart,
  onchain: BarChart3,
};

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('latest');

  const currentAnalysis = analysisArticles[activeTab];
  const TabIcon = tabIcons[activeTab];

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm text-muted-foreground mb-2">
            <BarChart3 className="h-4 w-4 text-bitcoin" />
            Expert Market Insights
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Crypto Market Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In-depth technical, fundamental, and on-chain analysis from our research team. Make informed decisions with data-driven insights.
          </p>
        </section>

        <AdPlaceholder size="banner" className="my-8" />

        <Tabs defaultValue="latest" onValueChange={(v) => setActiveTab(v as TabKey)} className="space-y-6">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-4">
            {(['latest', 'technical', 'fundamental', 'onchain'] as const).map((tab) => {
              const Icon = tabIcons[tab];
              return (
                <TabsTrigger key={tab} value={tab} className="flex items-center gap-2 capitalize">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab === 'latest' ? 'Latest' : tab}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(Object.keys(analysisArticles) as TabKey[]).map((tabKey) => {
            const data = analysisArticles[tabKey];
            const Icon = tabIcons[tabKey];
            return (
              <TabsContent key={tabKey} value={tabKey} className="space-y-6 mt-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground mb-2">
                  <Icon className="h-5 w-5 text-bitcoin" />
                  <span className="capitalize">{tabKey === 'latest' ? 'Latest Analysis' : `${tabKey} Analysis`}</span>
                </div>

                <Link href={data.featured.href}>
                  <Card className="relative overflow-hidden border-bitcoin/20 bg-gradient-to-br from-bitcoin/5 via-background to-background group cursor-pointer hover:shadow-lg transition-all duration-200">
                    <div className="absolute top-0 right-0">
                      <Badge variant="bitcoin" className="rounded-none rounded-bl-xl rounded-tr-xl px-3 py-1">{data.featured.category}</Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-bitcoin/10 flex items-center justify-center shrink-0">
                          <TrendingUp className="h-7 w-7 text-bitcoin" />
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-xl group-hover:text-bitcoin transition-colors">{data.featured.title}</CardTitle>
                          <p className="text-sm text-muted-foreground leading-relaxed">{data.featured.excerpt}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {data.featured.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {data.featured.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {data.featured.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.articles.map((article) => (
                    <Link key={article.title} href={article.href}>
                      <Card className="card-hover h-full group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge variant="outline" className="text-xs border-bitcoin/30 text-bitcoin">{article.category}</Badge>
                          </div>
                          <CardTitle className="text-base group-hover:text-bitcoin transition-colors">{article.title}</CardTitle>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">{article.excerpt}</p>
                        </CardHeader>
                        <CardContent className="mt-auto">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1"><User className="h-3 w-3" /> {article.author}</span>
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
                            </div>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <AdPlaceholder size="rectangle" className="my-8" />
      </div>
    </main>
  );
}
