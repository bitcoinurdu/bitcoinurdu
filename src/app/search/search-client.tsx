'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Coins,
  Gift,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  X,
  Briefcase,
  BookOpen,
  BarChart3,
  Wallet,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { useAppStore } from '@/stores';
import { fetchCmsData } from '@/lib/cms/unified';

const JOBS_DATA = [
  { id: 'constable-bps07', title: 'Constable (BPS-07)', category: 'Government', location: 'Global', type: 'Full-time', description: 'Police department constable position. BPS-07 grade.' },
  { id: 'blockchain-dev', title: 'Blockchain Developer', category: 'Development', location: 'Remote', type: 'Full-time', description: 'Build smart contracts and dApps on Ethereum and Solana.' },
  { id: 'crypto-analyst', title: 'Crypto Analyst', category: 'Analysis', location: 'Karachi', type: 'Full-time', description: 'Analyze crypto markets and create reports for clients.' },
  { id: 'community-mgr', title: 'Community Manager', category: 'Marketing', location: 'Remote', type: 'Part-time', description: 'Manage Telegram and Discord communities for crypto projects.' },
  { id: 'content-writer', title: 'Crypto Content Writer', category: 'Content', location: 'Remote', type: 'Freelance', description: 'Write articles and guides about cryptocurrency in Urdu and English.' },
  { id: 'web3-designer', title: 'Web3 UI/UX Designer', category: 'Design', location: 'Remote', type: 'Full-time', description: 'Design interfaces for DeFi and NFT platforms.' },
];

const LEARN_DATA = [
  { id: 'what-is-bitcoin', title: 'What is Bitcoin?', category: 'Beginner', description: 'Bitcoin kya hai aur kaise kaam karta hai.' },
  { id: 'what-is-blockchain', title: 'What is Blockchain?', category: 'Beginner', description: 'Blockchain technology ki basic samajh.' },
  { id: 'crypto-wallets', title: 'Crypto Wallets Explained', category: 'Beginner', description: 'Types of wallets aur security tips.' },
  { id: 'how-to-buy-bitcoin', title: 'How to Buy Bitcoin', category: 'Beginner', description: 'How to buy Bitcoin safely and securely.' },
  { id: 'trading-basics', title: 'Trading Basics', category: 'Intermediate', description: 'Crypto trading ki shuruat.' },
  { id: 'defi-explained', title: 'DeFi Explained', category: 'Intermediate', description: 'Decentralized Finance kya hai.' },
  { id: 'nft-guide', title: 'NFT Guide', category: 'Intermediate', description: 'NFTs kya hain aur kaise kaam karte hain.' },
  { id: 'crypto-security', title: 'Crypto Security', category: 'Intermediate', description: 'Apne crypto ko secure kaise rakhein.' },
];

export default function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useAppStore();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [coins, setCoins] = useState<Record<string, unknown>[]>([]);
  const [airdrops, setAirdrops] = useState<Record<string, unknown>[]>([]);
  const [blogPosts, setBlogPosts] = useState<Record<string, unknown>[]>([]);
  const [jobs, setJobs] = useState<typeof JOBS_DATA>([]);
  const [learn, setLearn] = useState<typeof LEARN_DATA>([]);
  const [coinLoading, setCoinLoading] = useState(false);
  const [cmsLoading, setCmsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchAll = useCallback((q: string) => {
    if (!q.trim()) {
      setCoins([]);
      setAirdrops([]);
      setBlogPosts([]);
      setJobs([]);
      setLearn([]);
      return;
    }

    const lowerQ = q.toLowerCase();

    // Search coins
    setCoinLoading(true);
    fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setCoins((data.coins as Record<string, unknown>[]) || []);
        setCoinLoading(false);
      })
      .catch(() => setCoinLoading(false));

    // Search CMS data
    setCmsLoading(true);
    fetchCmsData().then((data) => {
      const allAirdrops = (data.airdrops as unknown as Record<string, unknown>[]) || [];
      const allBlog = (data.blogPosts as unknown as Record<string, unknown>[]) || [];
      setAirdrops(allAirdrops.filter((a) =>
        String(a.title || '').toLowerCase().includes(lowerQ) ||
        String(a.description || '').toLowerCase().includes(lowerQ) ||
        String(a.network || '').toLowerCase().includes(lowerQ) ||
        String(a.status || '').toLowerCase().includes(lowerQ)
      ));
      setBlogPosts(allBlog.filter((b) =>
        String(b.title || '').toLowerCase().includes(lowerQ) ||
        String(b.excerpt || '').toLowerCase().includes(lowerQ) ||
        String(b.content || '').toLowerCase().includes(lowerQ) ||
        String(b.category || '').toLowerCase().includes(lowerQ) ||
        (b.tags as string[])?.some((t) => t.toLowerCase().includes(lowerQ))
      ));
      setCmsLoading(false);
    }).catch(() => setCmsLoading(false));

    // Search jobs
    setJobs(JOBS_DATA.filter((j) =>
      j.title.toLowerCase().includes(lowerQ) ||
      j.category.toLowerCase().includes(lowerQ) ||
      j.location.toLowerCase().includes(lowerQ) ||
      j.type.toLowerCase().includes(lowerQ) ||
      j.description.toLowerCase().includes(lowerQ)
    ));

    // Search learn
    setLearn(LEARN_DATA.filter((l) =>
      l.title.toLowerCase().includes(lowerQ) ||
      l.category.toLowerCase().includes(lowerQ) ||
      l.description.toLowerCase().includes(lowerQ)
    ));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    searchAll(query);
  }, [query, searchAll]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const sym = currency === 'PKR' ? '₨' : '$';

  const formatPrice = (n: number): string => {
    if (!n || isNaN(n)) return `${sym}0`;
    if (n >= 1e12) return `${sym}${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `${sym}${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${sym}${(n / 1e6).toFixed(2)}M`;
    if (n >= 1) return `${sym}${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    return `${sym}${n.toFixed(6)}`;
  };

  const totalResults = coins.length + airdrops.length + blogPosts.length + jobs.length + learn.length;
  const isLoading = coinLoading || cmsLoading;

  const categories = [
    { key: 'coins', label: 'Coins', count: coins.length, icon: Coins, color: 'text-bitcoin' },
    { key: 'airdrops', label: 'Airdrops', count: airdrops.length, icon: Gift, color: 'text-crypto-purple' },
    { key: 'blog', label: 'Blog', count: blogPosts.length, icon: FileText, color: 'text-crypto-blue' },
    { key: 'jobs', label: 'Jobs', count: jobs.length, icon: Briefcase, color: 'text-crypto-green' },
    { key: 'learn', label: 'Learn', count: learn.length, icon: BookOpen, color: 'text-bitcoin' },
  ].filter((c) => c.count > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground mt-1">Search coins, airdrops, blog posts, jobs, learn and more.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          className="w-full pl-12 pr-12 py-3 rounded-xl border bg-card text-lg focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </form>

      {!query.trim() && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium mb-2">Search anything</p>
          <p className="text-muted-foreground">Find coins, airdrops, blog posts, jobs, learn and more.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Bitcoin', 'Ethereum', 'Solana', 'Airdrop', 'DeFi', 'Jobs', 'Learn'].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 text-sm rounded-lg border bg-card hover:border-bitcoin/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {query.trim() && (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{totalResults} results for &quot;{query}&quot;</span>
            {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div key={cat.key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-card text-sm">
                  <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
                  <span>{cat.label}</span>
                  <span className="text-muted-foreground">({cat.count})</span>
                </div>
              ))}
            </div>
          )}

          {coins.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Coins className="h-5 w-5 text-bitcoin" />
                Coins ({coins.length})
              </h2>
              <div className="space-y-2">
                {coins.slice(0, 10).map((c) => (
                  <Link
                    key={String(c.id)}
                    href={`/coins/${c.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-bitcoin/50 transition-colors"
                  >
                    <Image
                      src={String(c.thumb || c.large || '')}
                      alt={String(c.symbol || '')}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{String(c.name)}</p>
                      <p className="text-xs text-muted-foreground">{String(c.symbol).toUpperCase()}</p>
                    </div>
                    {(c.market_cap_rank as number) > 0 && (
                      <span className="text-sm text-muted-foreground">#{c.market_cap_rank as number}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {airdrops.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Gift className="h-5 w-5 text-crypto-purple" />
                Airdrops ({airdrops.length})
              </h2>
              <div className="space-y-2">
                {airdrops.map((a) => (
                  <Link
                    key={String(a.id)}
                    href={`/airdrops/${a.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-bitcoin/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{String(a.title)}</p>
                      <p className="text-xs text-muted-foreground">{String(a.network)} • {String(a.status)}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${String(a.status) === 'active' ? 'bg-crypto-green/10 text-crypto-green' : 'bg-muted text-muted-foreground'}`}>
                      {String(a.status)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {blogPosts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-crypto-blue" />
                Blog ({blogPosts.length})
              </h2>
              <div className="space-y-2">
                {blogPosts.map((b) => (
                  <Link
                    key={String(b.id)}
                    href={`/blog/${b.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-bitcoin/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{String(b.title)}</p>
                      <p className="text-xs text-muted-foreground">{String(b.excerpt || '').slice(0, 100)}...</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{String(b.category)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {jobs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-crypto-green" />
                Jobs ({jobs.length})
              </h2>
              <div className="space-y-2">
                {jobs.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{j.title}</p>
                      <p className="text-xs text-muted-foreground">{j.category} • {j.location} • {j.type}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{j.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {learn.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-bitcoin" />
                Learn ({learn.length})
              </h2>
              <div className="space-y-2">
                {learn.map((l) => (
                  <Link
                    key={l.id}
                    href={`/learn-bitcoin/${l.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-bitcoin/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{l.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{l.category}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2">No results found</p>
              <p className="text-muted-foreground">Try a different search term.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
