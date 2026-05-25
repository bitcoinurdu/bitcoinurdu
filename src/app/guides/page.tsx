'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { cn } from '@/lib/utils/helpers';
import { BookOpen, TrendingUp, HardDrive, Wallet, Shield, BarChart3, Clock, ArrowRight, Sparkles, Star, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const categories = [
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen, color: 'text-blue-500' },
  { id: 'trading', label: 'Trading', icon: TrendingUp, color: 'text-green-500' },
  { id: 'mining', label: 'Mining', icon: HardDrive, color: 'text-orange-500' },
  { id: 'wallets', label: 'Wallets', icon: Wallet, color: 'text-cyan-500' },
  { id: 'security', label: 'Security', icon: Shield, color: 'text-red-500' },
  { id: 'defi', label: 'DeFi', icon: BarChart3, color: 'text-purple-500' },
];

const guides = [
  { id: 'how-to-buy-bitcoin', title: 'How to Buy Bitcoin', excerpt: 'Step-by-step guide to buying your first Bitcoin through exchanges, P2P platforms, and Bitcoin ATMs.', difficulty: 'Beginner' as const, readTime: '8 min read', icon: TrendingUp, color: 'text-bitcoin', featured: true, href: '/learn-bitcoin' },
  { id: 'setting-up-wallet', title: 'Setting Up a Crypto Wallet', excerpt: 'Choose and set up your first crypto wallet. Compare hot wallets, cold wallets, and hardware options.', difficulty: 'Beginner' as const, readTime: '10 min read', icon: Wallet, color: 'text-cyan-500', featured: false, href: '/learn-bitcoin' },
  { id: 'what-is-defi', title: 'What is DeFi? A Complete Guide', excerpt: 'Understand decentralized finance, how it works, and how you can earn yields through lending and liquidity.', difficulty: 'Intermediate' as const, readTime: '15 min read', icon: BarChart3, color: 'text-purple-500', featured: false, href: '/learn-bitcoin' },
  { id: 'how-to-stake', title: 'How to Stake Cryptocurrency', excerpt: 'Learn how to stake Proof-of-Stake tokens, choose validators, and earn passive rewards.', difficulty: 'Intermediate' as const, readTime: '12 min read', icon: BarChart3, color: 'text-green-500', featured: true, href: '/learn-bitcoin' },
  { id: 'crypto-tax-guide', title: 'Complete Crypto Tax Guide', excerpt: 'Understand crypto taxation rules, how to calculate gains, and tools to simplify your tax reporting.', difficulty: 'Advanced' as const, readTime: '20 min read', icon: BookOpen, color: 'text-yellow-500', featured: false, href: '/learn-bitcoin' },
  { id: 'security-checklist', title: 'Ultimate Crypto Security Checklist', excerpt: 'Essential security practices to protect your crypto from hackers, phishing, and common scams.', difficulty: 'Beginner' as const, readTime: '7 min read', icon: Shield, color: 'text-red-500', featured: false, href: '/learn-bitcoin' },
];

const difficultyColor = {
  Beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
  Intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
} as const;

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredGuides = guides.filter((g) => g.featured);
  const regularGuides = guides.filter((g) => !g.featured);

  const filteredGuides = (activeCategory ? regularGuides.filter((g) => activeCategory === 'getting-started' ? g.difficulty === 'Beginner' : g.icon === categories.find((c) => c.id === activeCategory)?.icon) : regularGuides).filter((g) =>
    searchQuery ? g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm text-muted-foreground mb-2">
            <BookOpen className="h-4 w-4 text-bitcoin" />
            Step-by-Step Tutorials
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Crypto Guides & Tutorials
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow our detailed guides to master every aspect of cryptocurrency — from buying your first Bitcoin to advanced DeFi strategies.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search guides..."
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        <AdPlaceholder size="banner" className="my-8" />

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-bitcoin" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Browse by Category</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? null : cat.id)}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                    isActive
                      ? 'bg-bitcoin text-white border-bitcoin shadow-sm'
                      : 'bg-card text-muted-foreground border-border hover:border-bitcoin/40 hover:text-bitcoin'
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : cat.color)} />
                  {cat.label}
                </button>
              );
            })}
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="text-sm text-muted-foreground hover:text-bitcoin px-2"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        <section className="space-y-6">
          {featuredGuides.map((guide) => (
            <Link key={guide.id} href={guide.href}>
              <Card className="relative overflow-hidden border-bitcoin/20 bg-gradient-to-br from-bitcoin/5 via-background to-background group cursor-pointer hover:shadow-lg transition-all duration-200">
                <div className="absolute top-0 right-0">
                  <div className="bg-bitcoin text-white px-4 py-1.5 rounded-bl-xl text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" /> Featured Guide
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-bitcoin/10 flex items-center justify-center shrink-0">
                      <guide.icon className="h-7 w-7 text-bitcoin" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-xl group-hover:text-bitcoin transition-colors">{guide.title}</CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed">{guide.excerpt}</p>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn("text-xs", difficultyColor[guide.difficulty])}>{guide.difficulty}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {guide.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {activeCategory ? categories.find((c) => c.id === activeCategory)?.label : 'All Guides'}
              {searchQuery && <span className="text-muted-foreground font-normal text-lg ml-2">matching &quot;{searchQuery}&quot;</span>}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery || activeCategory ? filteredGuides : guides).map((guide) => (
              <Link key={guide.id} href={guide.href}>
                <Card className="card-hover h-full group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col">
                  <CardHeader>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-2", guide.color.replace('text-', 'bg-').replace('bitcoin', 'bitcoin/10').replace('cyan-500', 'cyan-500/10').replace('purple-500', 'purple-500/10').replace('green-500', 'green-500/10').replace('yellow-500', 'yellow-500/10').replace('red-500', 'red-500/10'))}>
                      <guide.icon className={cn("h-6 w-6", guide.color)} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg group-hover:text-bitcoin transition-colors">{guide.title}</CardTitle>
                        <Badge variant="outline" className={cn("shrink-0 text-xs", difficultyColor[guide.difficulty])}>{guide.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{guide.excerpt}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {guide.readTime}
                      </span>
                      <span className="text-sm font-medium text-bitcoin flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Guide <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <Card className="border-bitcoin/20 bg-gradient-to-br from-bitcoin/5 via-background to-background">
            <CardHeader className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm text-muted-foreground mx-auto mb-2">
                <Sparkles className="h-4 w-4 text-bitcoin" />
                New Guides Weekly
              </div>
              <CardTitle className="text-2xl">Can&apos;t Find What You Need?</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground max-w-lg mx-auto">
                We&apos;re constantly adding new guides. Suggest a topic or check back soon for more crypto tutorials.
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/learn-bitcoin">
                  <Button variant="bitcoin" size="lg">
                    Browse All Content <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/learn-bitcoin">
                  <Button variant="outline" size="lg">
                    Suggest a Guide
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <AdPlaceholder size="rectangle" className="my-8" />
      </div>
    </main>
  );
}
