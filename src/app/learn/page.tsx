import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { generateSEO } from '@/lib/seo';
import { cn } from '@/lib/utils/helpers';
import { BookOpen, Cpu, TrendingUp, BarChart3, Image, Shield, HardDrive, Wallet, Search, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'Learn Cryptocurrency',
  description: 'Complete education hub for cryptocurrency. Learn Bitcoin basics, blockchain, trading, DeFi, NFTs, security, mining, and wallets.',
});

const categories = [
  { id: 'bitcoin-basics', title: 'Bitcoin Basics', description: 'Understand Bitcoin from scratch — what it is, how it works, and why it matters.', icon: BookOpen, href: '/learn-bitcoin', color: 'text-bitcoin' },
  { id: 'blockchain', title: 'Blockchain', description: 'Explore blockchain technology, consensus mechanisms, and distributed ledger fundamentals.', icon: Cpu, href: '/learn-bitcoin', color: 'text-blue-500' },
  { id: 'trading', title: 'Trading', description: 'Master market analysis, order types, risk management, and trading psychology.', icon: TrendingUp, href: '/learn-bitcoin', color: 'text-green-500' },
  { id: 'defi', title: 'DeFi', description: 'Dive into decentralized finance — lending, borrowing, yield farming, and liquidity pools.', icon: BarChart3, href: '/learn-bitcoin', color: 'text-purple-500' },
  { id: 'nfts', title: 'NFTs', description: 'Learn about non-fungible tokens, digital art marketplaces, and NFT use cases.', icon: Image, href: '/learn-bitcoin', color: 'text-pink-500' },
  { id: 'security', title: 'Security', description: 'Protect your crypto assets with best practices for wallets, phishing prevention, and more.', icon: Shield, href: '/learn-bitcoin', color: 'text-red-500' },
  { id: 'mining', title: 'Mining', description: 'Understand proof-of-work, mining hardware, pools, and profitability calculations.', icon: HardDrive, href: '/learn-bitcoin', color: 'text-orange-500' },
  { id: 'wallets', title: 'Wallets', description: 'Compare hot wallets, cold storage, hardware wallets, and seed phrase security.', icon: Wallet, href: '/learn-bitcoin', color: 'text-cyan-500' },
];

const featuredArticles = [
  { title: 'What is Bitcoin? A Complete Beginner\'s Guide', excerpt: 'Bitcoin is the world\'s first decentralized digital currency. Learn how it works, its history, and how to get started.', date: 'May 15, 2026', readTime: '10 min read', href: '/learn-bitcoin' },
  { title: 'Understanding Blockchain Technology', excerpt: 'Blockchain is the underlying technology behind cryptocurrencies. Discover how it enables trustless transactions.', date: 'May 12, 2026', readTime: '12 min read', href: '/learn-bitcoin' },
  { title: 'Crypto Trading Strategies for Beginners', excerpt: 'Start your trading journey with proven strategies. Learn about market orders, limit orders, and risk management.', date: 'May 8, 2026', readTime: '15 min read', href: '/learn-bitcoin' },
  { title: 'DeFi Explained: The Future of Finance', excerpt: 'Decentralized finance is revolutionizing banking. Explore lending, borrowing, and earning yields on your crypto.', date: 'May 3, 2026', readTime: '8 min read', href: '/learn-bitcoin' },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm text-muted-foreground mb-2">
            <Sparkles className="h-4 w-4 text-bitcoin" />
            Your Crypto Learning Journey Starts Here
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Learn Cryptocurrency
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master blockchain, Bitcoin, trading, DeFi, and more with our comprehensive guides. Start from zero and go pro.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search topics..." className="pl-10 h-12 text-base" />
          </div>
        </section>

        <AdPlaceholder size="banner" className="my-8" />

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Categories</h2>
            <Link href="/learn-bitcoin" className="text-sm text-bitcoin hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={cat.href}>
                <Card className="card-hover h-full group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", cat.color.replace('text-', 'bg-').replace('bitcoin', 'bitcoin/10').replace('blue-500', 'blue-500/10').replace('green-500', 'green-500/10').replace('purple-500', 'purple-500/10').replace('pink-500', 'pink-500/10').replace('red-500', 'red-500/10').replace('orange-500', 'orange-500/10').replace('cyan-500', 'cyan-500/10'))}>
                        <cat.icon className={cn("h-6 w-6", cat.color)} />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{cat.title}</CardTitle>
                        <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm font-medium text-bitcoin flex items-center gap-1 group-hover:gap-2 transition-all">
                      Start Learning <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Articles</h2>
            <Link href="/learn-bitcoin" className="text-sm text-bitcoin hover:underline flex items-center gap-1">
              More Articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredArticles.map((article) => (
              <Link key={article.title} href={article.href}>
                <Card className="card-hover h-full group cursor-pointer transition-all duration-200 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-bitcoin transition-colors">{article.title}</CardTitle>
                    <CardContent className="px-0 pt-3 pb-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                      <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                        <span>{article.date}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span>{article.readTime}</span>
                      </div>
                    </CardContent>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <Card className="relative overflow-hidden border-bitcoin/20 bg-gradient-to-br from-bitcoin/5 via-background to-background">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-bitcoin/10 blur-3xl" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <GraduationCap className="h-7 w-7 text-bitcoin" />
                New to Crypto? Start Here
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground max-w-2xl">
                Our beginner&apos;s guide walks you through everything you need to know — from buying your first Bitcoin to understanding blockchain technology.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/learn-bitcoin">
                  <Button variant="bitcoin" size="lg">
                    Start Beginner&apos;s Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/learn-bitcoin">
                  <Button variant="outline" size="lg">
                    Browse All Guides
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <p className="text-2xl font-bold text-bitcoin">50+</p>
                  <p className="text-xs text-muted-foreground">Guides</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <p className="text-2xl font-bold text-bitcoin">3</p>
                  <p className="text-xs text-muted-foreground">Difficulty Levels</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <p className="text-2xl font-bold text-bitcoin">8</p>
                  <p className="text-xs text-muted-foreground">Categories</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <p className="text-2xl font-bold text-bitcoin">Free</p>
                  <p className="text-xs text-muted-foreground">Always</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <AdPlaceholder size="rectangle" className="my-8" />
      </div>
    </main>
  );
}
