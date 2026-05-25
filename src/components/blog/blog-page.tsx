'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, FileText, Newspaper, Search } from 'lucide-react';
import { useAppStore } from '@/stores';
import { BlogAd, NewsAd, ResearchAd } from '@/components/ads/ad-slots';
import { fetchCmsData } from '@/lib/cms/unified';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  status: string;
}

const BUILTIN_POSTS: BlogPost[] = [
  { id: 'bitcoin-halving-2026', title: 'Bitcoin Halving 2026: What You Need to Know', excerpt: 'The fourth Bitcoin halving occurred in April 2026, reducing block rewards from 6.25 to 3.125 BTC. Learn how this impacts mining, prices, and the broader crypto ecosystem.', category: 'blog', author: 'BitcoinUrdu Team', date: '2026-04-20', readTime: '8 min', tags: ['Bitcoin', 'Halving', 'Mining'], status: 'published' },
  { id: 'bitcoin-etf-approved', title: 'Bitcoin ETF Approval: A New Era for Institutional Investment', excerpt: 'SEC approved multiple spot Bitcoin ETFs in January 2026, opening doors for institutional investors. BlackRock, Fidelity, and others now offer regulated Bitcoin exposure.', category: 'news', author: 'BitcoinUrdu Team', date: '2026-01-10', readTime: '6 min', tags: ['Bitcoin', 'ETF', 'SEC'], status: 'published' },
  { id: 'defi-yield-strategies', title: 'Top DeFi Yield Strategies for 2026: A Comprehensive Guide', excerpt: 'Explore the best DeFi protocols for earning yield in 2026. From liquidity provision to staking and lending, discover strategies that maximize returns while managing risk.', category: 'research', author: 'BitcoinUrdu Research', date: '2026-03-15', readTime: '12 min', tags: ['DeFi', 'Yield', 'Strategy'], status: 'published' },
  { id: 'crypto-global-guide', title: 'Crypto Trading: Complete Global Guide 2026 - Laws, Trading & Taxes', excerpt: 'Everything you need to know about buying, trading, and holding cryptocurrency. Covers legal status, P2P trading, tax implications, and safe storage.', category: 'blog', author: 'BitcoinUrdu Team', date: '2026-02-28', readTime: '10 min', tags: ['Guide', 'Trading'], status: 'published' },
  { id: 'layer2-comparison', title: 'Layer 2 Solutions Compared: Arbitrum, Optimism, zkSync & Base', excerpt: 'A detailed comparison of leading Ethereum Layer 2 solutions. Learn about their technology, fees, security, and which one suits your needs best.', category: 'research', author: 'BitcoinUrdu Research', date: '2026-03-01', readTime: '15 min', tags: ['Layer 2', 'Ethereum', 'Scaling'], status: 'published' },
  { id: 'airdrop-strategy', title: 'How to Farm Airdrops in 2026: Proven Strategies That Work', excerpt: 'Master the art of airdrop farming with our proven strategies. Learn how to identify legitimate projects, maximize eligibility, and secure valuable token rewards.', category: 'blog', author: 'BitcoinUrdu Team', date: '2026-04-05', readTime: '7 min', tags: ['Airdrops', 'Strategy', 'DeFi'], status: 'published' },
  { id: 'bitcoin-price-prediction-2025', title: 'Bitcoin Price Prediction 2025: Expert Analysis & Market Trends', excerpt: 'Comprehensive analysis of Bitcoin price predictions for 2025. Examining historical patterns, institutional adoption, macroeconomic factors, and expert forecasts.', category: 'research', author: 'BitcoinUrdu Research', date: '2026-05-15', readTime: '14 min', tags: ['Bitcoin', 'Prediction', 'Analysis'], status: 'published' },
  { id: 'solana-vs-ethereum-2026', title: 'Solana vs Ethereum 2026: Which Blockchain Wins?', excerpt: 'Head-to-head comparison of Solana and Ethereum in 2026. Performance, ecosystem, developer activity, and investment potential analyzed.', category: 'blog', author: 'BitcoinUrdu Team', date: '2026-05-10', readTime: '11 min', tags: ['Solana', 'Ethereum', 'Comparison'], status: 'published' },
  { id: 'crypto-security-guide', title: 'Crypto Security Guide 2026: Protect Your Digital Assets', excerpt: 'Essential security practices for cryptocurrency holders. Hardware wallets, 2FA, phishing prevention, and best practices to keep your assets safe.', category: 'blog', author: 'BitcoinUrdu Team', date: '2026-04-25', readTime: '9 min', tags: ['Security', 'Wallet', 'Safety'], status: 'published' },
  { id: 'defi-risks-rewards', title: 'DeFi Risks & Rewards: What Every Investor Must Know', excerpt: 'Understanding the risks and rewards of decentralized finance. Smart contract vulnerabilities, impermanent loss, and how to navigate DeFi safely.', category: 'research', author: 'BitcoinUrdu Research', date: '2026-04-18', readTime: '13 min', tags: ['DeFi', 'Risk', 'Education'], status: 'published' },
  { id: 'nft-market-2026', title: 'NFT Market in 2026: Trends, Opportunities & Future Outlook', excerpt: 'The NFT market has evolved significantly. Explore current trends, emerging use cases, and what the future holds for digital collectibles and utility NFTs.', category: 'news', author: 'BitcoinUrdu Team', date: '2026-04-12', readTime: '8 min', tags: ['NFT', 'Market', 'Trends'], status: 'published' },
  { id: 'crypto-tax-guide', title: 'Crypto Tax Guide: Complete Filing Guide 2026', excerpt: 'Step-by-step guide to filing cryptocurrency taxes. Capital gains, income tax, record keeping, and compliance requirements explained.', category: 'blog', author: 'BitcoinUrdu Team', date: '2026-03-20', readTime: '10 min', tags: ['Tax', 'Legal'], status: 'published' },
  { id: 'web3-gaming-future', title: 'Web3 Gaming: The Future of Play-to-Earn & Blockchain Games', excerpt: 'Exploring the intersection of gaming and blockchain technology. Top Web3 games, play-to-earn mechanics, and the future of digital ownership in gaming.', category: 'research', author: 'BitcoinUrdu Research', date: '2026-03-08', readTime: '11 min', tags: ['Web3', 'Gaming', 'P2E'], status: 'published' },
  { id: 'stablecoin-guide', title: 'Stablecoins Explained: USDT, USDC, DAI & More', excerpt: 'Complete guide to stablecoins - how they work, types, risks, and which ones to use. Essential knowledge for every crypto trader and investor.', category: 'blog', author: 'BitcoinUrdu Team', date: '2026-02-15', readTime: '7 min', tags: ['Stablecoin', 'USDT', 'USDC'], status: 'published' },
  { id: 'bitcoin-mining-2026', title: 'Bitcoin Mining in 2026: Profitability, Hardware & Pools', excerpt: 'Current state of Bitcoin mining. ASIC hardware comparison, mining pool selection, electricity costs, and profitability calculations for 2026.', category: 'research', author: 'BitcoinUrdu Research', date: '2026-02-10', readTime: '12 min', tags: ['Mining', 'Bitcoin', 'Hardware'], status: 'published' },
];

const blogTexts: Record<string, Record<string, string>> = {
  roman: { blog: 'Blog', news: 'News', research: 'Tahqeeq', all: 'Sab', blogLabel: 'Blog', desc: 'Latest blog posts and guides', newsDesc: 'Latest crypto news', researchDesc: 'In-depth research', loading: 'Load ho raha hai...' },
  ur: { blog: 'بلاگ', news: 'خبریں', research: 'تحقیق', all: 'سب', blogLabel: 'بلاگ', desc: 'تازہ بلاگ پوسٹس اور گائیڈز', newsDesc: 'تازہ کرپٹو خبریں', researchDesc: 'گہری تحقیق', loading: 'لوڈ ہو رہا ہے...' },
  ps: { blog: 'بلاګ', news: 'خبرونه', research: 'څیړنه', all: 'ټول', blogLabel: 'بلاګ', desc: 'نوي بلاګ پوسټونه او لارښودونه', newsDesc: 'نوي کریپټو خبرونه', researchDesc: 'ژوره څیړنه', loading: 'لوډ کیږي...' },
  sd: { blog: 'بلاگ', news: 'خبرون', research: 'تحقیق', all: 'سڀ', blogLabel: 'بلاگ', desc: 'تازہ بلاگ پوسٽس ۽ گائيڊز', newsDesc: 'تازہ ڪرپٽو خبرون', researchDesc: 'گہري تحقیق', loading: 'لوڊ ٿي رهيو آهي...' },
  en: { blog: 'Blog', news: 'News', research: 'Research', all: 'All', blogLabel: 'Blog', desc: 'Latest blog posts and guides', newsDesc: 'Latest crypto news', researchDesc: 'In-depth research', loading: 'Loading...' },
  hi: { title: 'ब्लॉग', readMore: 'और पढ़ें' },
  fr: { title: 'Blog', readMore: 'Lire la suite' },
  de: { title: 'Blog', readMore: 'Weiterlesen' },
  tr: { title: 'Blog', readMore: 'Devamını Oku' },
  ru: { title: 'Блог', readMore: 'Читать далее' },
  zh: { title: '博客', readMore: '阅读更多' },
  ja: { title: 'ブログ', readMore: '続きを読む' },
};

interface BlogPageProps {
  category?: 'blog' | 'news' | 'research';
}

export function BlogPage({ category }: BlogPageProps) {
  const { language } = useAppStore();
  const [cmsPosts, setCmsPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCmsData().then((data) => {
      setCmsPosts((data.blogPosts as unknown as BlogPost[]) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const lang = language || 'roman';
  const texts = blogTexts[lang] || blogTexts.roman;
  const allPosts = [...BUILTIN_POSTS, ...cmsPosts.filter((p) => !BUILTIN_POSTS.some((bp) => bp.id === p.id))];
  const filtered = category ? allPosts.filter((p) => p.category === category) : allPosts;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'news': return <Newspaper className="h-4 w-4" />;
      case 'research': return <Search className="h-4 w-4" />;
      default: return null;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'blog': return 'bitcoin';
      case 'news': return 'default';
      case 'research': return 'green';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="text-center py-12"><p className="text-muted-foreground">{texts.loading}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold capitalize">{texts[category || 'blog']}</h1>
        <p className="text-muted-foreground mt-1">{category === 'news' ? texts.newsDesc : category === 'research' ? texts.researchDesc : texts.desc}</p>
      </div>

      <BlogAd className="my-4" />
      {category === 'news' && <NewsAd className="my-4" />}
      {category === 'research' && <ResearchAd className="my-4" />}

      <div className="flex gap-2">
        <Link href="/blog"><Button variant={!category ? 'default' : 'outline'} size="sm">{texts.all}</Button></Link>
        <Link href="/blog"><Button variant={category === 'blog' ? 'default' : 'outline'} size="sm">{texts.blogLabel}</Button></Link>
        <Link href="/news"><Button variant={category === 'news' ? 'default' : 'outline'} size="sm">{texts.news}</Button></Link>
        <Link href="/research"><Button variant={category === 'research' ? 'default' : 'outline'} size="sm">{texts.research}</Button></Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <Card className="card-hover h-full">
              <div className="aspect-video bg-muted rounded-t-xl" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getCategoryColor(post.category)}>{getCategoryIcon(post.category)}<span className="ml-1 capitalize">{texts[post.category] || post.category}</span></Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.excerpt}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
