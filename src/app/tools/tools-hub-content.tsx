'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import {
  Search,
  Gauge,
  Activity,
  TrendingUp,
  Shield,
  Wallet,
  Scan,
  Layers,
  GitBranch,
  BarChart3,
  Percent,
  LineChart,
  DollarSign,
} from 'lucide-react';

interface Tool {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  category: string;
}

const tools: Tool[] = [
  {
    title: 'Gas Tracker',
    description: 'Live gas fees for Ethereum, BSC, Polygon and other major blockchains. Optimize your transaction costs.',
    href: '/tools/gas-tracker',
    icon: Gauge,
    category: 'blockchain',
  },
  {
    title: 'Fear & Greed Index',
    description: 'Track the Crypto Fear & Greed Index to gauge market sentiment from extreme fear to extreme greed.',
    href: '/tools/fear-greed',
    icon: Activity,
    category: 'market',
  },
  {
    title: 'Whale Tracker',
    description: 'Monitor large crypto transactions and whale wallet movements in real-time to spot market trends.',
    href: '/tools/whale-tracker',
    icon: TrendingUp,
    category: 'market',
  },
  {
    title: 'Rug Checker',
    description: 'Analyze token contracts for potential rug pull risks with honeypot detection and liquidity lock checks.',
    href: '/tools/rug-checker',
    icon: Shield,
    category: 'security',
  },
  {
    title: 'Portfolio Tracker',
    description: 'Track your crypto portfolio across multiple wallets and exchanges. View combined holdings and P&L.',
    href: '/tools/portfolio-tracker',
    icon: Wallet,
    category: 'portfolio',
  },
  {
    title: 'Wallet Tracker',
    description: 'Track any crypto wallet address in real-time. View balances, transactions, and token holdings.',
    href: '/tools/wallet-tracker',
    icon: Scan,
    category: 'portfolio',
  },
  {
    title: 'Token Approvals',
    description: 'View and revoke token approvals granted to dApps across multiple chains to protect your wallet.',
    href: '/tools/token-approvals',
    icon: Layers,
    category: 'security',
  },
  {
    title: 'Bridge Finder',
    description: 'Compare cross-chain bridges to find the best route for transferring tokens with lowest fees.',
    href: '/tools/bridge-finder',
    icon: GitBranch,
    category: 'defi',
  },
  {
    title: 'DCA Calculator',
    description: 'Plan your dollar cost averaging strategy. See how recurring investments grow over time.',
    href: '/tools/dca-calculator',
    icon: BarChart3,
    category: 'calculator',
  },
  {
    title: 'ROI Calculator',
    description: 'Calculate return on investment for any trade. See profit, loss, and ROI percentage.',
    href: '/tools/roi-calculator',
    icon: Percent,
    category: 'calculator',
  },
  {
    title: 'Compound Interest',
    description: 'Calculate compound interest on your crypto investments with customizable compounding frequency.',
    href: '/tools/compound-interest',
    icon: LineChart,
    category: 'calculator',
  },
  {
    title: 'Crypto Converter',
    description: 'Convert between cryptocurrencies and fiat currencies instantly using live market rates.',
    href: '/tools/crypto-converter',
    icon: DollarSign,
    category: 'calculator',
  },
];

const categories = [
  { value: 'all', label: 'All Tools' },
  { value: 'calculator', label: 'Calculators' },
  { value: 'market', label: 'Market' },
  { value: 'security', label: 'Security' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'defi', label: 'DeFi' },
];

export function ToolsHubContent() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === 'all' || t.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Home
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Crypto Tools</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore our collection of free cryptocurrency tools and calculators designed to help you make informed decisions.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeCategory === cat.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <AdPlaceholder />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 transition-colors group-hover:bg-primary/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {tool.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      Open →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No tools found</h3>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Try adjusting your search or category filter.
          </p>
        </div>
      )}

      <AdPlaceholder />
    </div>
  );
}
