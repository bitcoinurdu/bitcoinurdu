'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  getSupplyPercent,
  truncateAddress,
} from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceChart } from '@/components/charts/price-chart';
import { CoinsAd } from '@/components/ads/ad-slots';
import {
  Star,
  ExternalLink,
  Twitter,
  MessageCircle,
  Globe,
  Github,
  Copy,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Coins,
  TrendingUp,
  Clock,
  Calendar,
  Database,
  Users,
  Code,
  ThumbsUp,
  ThumbsDown,
  Hash,
  Layers,
  Scale,
  Activity,
  Percent,
  Info,
  AlertTriangle,
} from 'lucide-react';
import type { Coin } from '@/types';

interface Props {
  coin: Coin;
}

export function CoinDetailPage({ coin }: Props) {
  const { currency, watchlist, toggleWatchlist } = useAppStore();
  const [chartDays, setChartDays] = useState(30);
  const [extraData, setExtraData] = useState<Record<string, unknown> | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`)
      .then((r) => r.json())
      .then((data) => setExtraData(data))
      .catch(() => {});
  }, [coin.id]);

  const priceChange = coin.price_change_percentage_24h || 0;
  const supplyPercent = getSupplyPercent(coin.circulating_supply || 0, coin.max_supply || 0) || 0;

  const md = extraData?.market_data as Record<string, unknown> | undefined;
  const high24h = (md?.high_24h as Record<string, number>)?.[currency.toLowerCase()] || 0;
  const low24h = (md?.low_24h as Record<string, number>)?.[currency.toLowerCase()] || 0;
  const priceChange24h = (md?.price_change_24h_in_currency as Record<string, number>)?.[currency.toLowerCase()] || 0;
  const mcapChange24h = (md?.market_cap_change_24h_in_currency as Record<string, number>)?.[currency.toLowerCase()] || 0;
  const mcapChangePct24h = (md?.market_cap_change_percentage_24h as number) || 0;
  const fdv = (md?.fully_diluted_valuation as Record<string, number>)?.[currency.toLowerCase()] || 0;
  const athChangePct = (md?.ath_change_percentage as Record<string, number>)?.[currency.toLowerCase()] || 0;
  const atlChangePct = (md?.atl_change_percentage as Record<string, number>)?.[currency.toLowerCase()] || 0;
  const roi = md?.roi as Record<string, number> | undefined;
  const categories = (extraData?.categories as string[]) || [];
  const genesisDate = extraData?.genesis_date as string | undefined;
  const hashingAlgo = extraData?.hashing_algorithm as string | undefined;
  const blockTime = extraData?.block_time_in_minutes as number | undefined;
  const platforms = (extraData?.platforms as Record<string, string>) || {};
  const descHtml = (extraData?.description as Record<string, string>)?.en || coin.description?.en || '';

  const community = extraData?.community_data as Record<string, unknown> | undefined;
  const twitterFollowers = (community?.twitter_followers as number) || 0;
  const redditSubscribers = (community?.reddit_subscribers as number) || 0;
  const redditActive = (community?.reddit_accounts_active_48h as number) || 0;

  const developer = extraData?.developer_data as Record<string, unknown> | undefined;
  const githubStars = (developer?.stars as number) || 0;
  const githubForks = (developer?.forks as number) || 0;
  const githubSubscribers = (developer?.subscribers as number) || 0;
  const commits4w = (developer?.commit_count_4_weeks as number) || 0;
  const totalIssues = (developer?.total_issues as number) || 0;
  const closedIssues = (developer?.closed_issues as number) || 0;
  const prMerged = (developer?.pull_requests_merged as number) || 0;
  const prContributors = (developer?.pull_request_contributors as number) || 0;
  const codeAdditions = ((developer?.code_additions_deletions_4_weeks as Record<string, number>)?.additions as number) || 0;
  const codeDeletions = ((developer?.code_additions_deletions_4_weeks as Record<string, number>)?.deletions as number) || 0;

  const sentimentUp = coin.sentiment_votes_up_percentage || 0;
  const sentimentDown = 100 - sentimentUp;
  const publicInterest = coin.public_interest_score || 0;
  const devScore = coin.developer_score || 0;
  const communityScore = coin.community_score || 0;
  const liquidityScore = coin.liquidity_score || 0;

  const volToMcap = coin.market_cap > 0 ? ((coin.total_volume / coin.market_cap) * 100).toFixed(2) : '0';

  const platformEntries = Object.entries(platforms).filter(([_, addr]) => addr && addr.length > 0);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: coin.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src={coin.image} alt={coin.name} width={56} height={56} className="rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{coin.name}</h1>
              <Badge variant="outline" className="text-xs">{coin.symbol.toUpperCase()}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rank #{coin.market_cap_rank}</span>
              {categories.length > 0 && (
                <>
                  <span>•</span>
                  <span>{categories.slice(0, 2).join(', ')}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => toggleWatchlist(coin.id)}>
            <Star className={`h-4 w-4 ${watchlist.includes(coin.id) ? 'fill-bitcoin text-bitcoin' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PRICE */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-4xl font-bold">{formatCurrency(coin.current_price, currency)}</span>
        <Badge variant={priceChange >= 0 ? 'green' : 'red'} className="text-base px-3 py-1">
          {priceChange >= 0 ? <ArrowUpRight className="h-4 w-4 inline mr-1" /> : <ArrowDownRight className="h-4 w-4 inline mr-1" />}
          {formatPercent(priceChange)}
        </Badge>
        {priceChange24h !== 0 && (
          <span className="text-sm text-muted-foreground">
            {priceChange24h >= 0 ? '+' : ''}{formatCurrency(priceChange24h, currency)} (24h)
          </span>
        )}
      </div>

      {/* PRICE CHANGES */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Price Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: '1h', value: coin.price_change_percentage_1h_in_currency },
              { label: '24h', value: coin.price_change_percentage_24h },
              { label: '7d', value: coin.price_change_percentage_7d_in_currency },
              { label: '30d', value: coin.price_change_percentage_30d },
              { label: '1y', value: coin.price_change_percentage_1y },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className={`text-lg font-bold ${pctClass(item.value)}`}>
                  {pctStr(item.value)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CHART */}
      <Card>
        <CardHeader className="pb-2">
          <Tabs defaultValue="30" onValueChange={(v) => setChartDays(parseInt(v))}>
            <div className="flex items-center justify-between">
              <CardTitle>Price Chart</CardTitle>
              <TabsList>
                <TabsTrigger value="7" onClick={() => setChartDays(7)}>7D</TabsTrigger>
                <TabsTrigger value="30" onClick={() => setChartDays(30)}>30D</TabsTrigger>
                <TabsTrigger value="90" onClick={() => setChartDays(90)}>90D</TabsTrigger>
                <TabsTrigger value="365" onClick={() => setChartDays(365)}>1Y</TabsTrigger>
                <TabsTrigger value="max" onClick={() => setChartDays(0)}>MAX</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <PriceChart coinId={coin.id} days={chartDays} currency={currency.toLowerCase()} />
        </CardContent>
      </Card>

      {/* KEY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <BarChart3 className="h-4 w-4" />
              Market Cap
            </div>
            <p className="text-lg font-semibold">{formatCurrency(coin.market_cap, currency)}</p>
            <p className={`text-xs ${mcapChangePct24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
              {mcapChangePct24h >= 0 ? '+' : ''}{mcapChangePct24h.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Volume (24h)
            </div>
            <p className="text-lg font-semibold">{formatCurrency(coin.total_volume, currency)}</p>
            <p className="text-xs text-muted-foreground">Vol/MCap: {volToMcap}%</p>
          </CardContent>
        </Card>
        {fdv > 0 && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Scale className="h-4 w-4" />
                FDV
              </div>
              <p className="text-lg font-semibold">{formatCurrency(fdv, currency)}</p>
              <p className="text-xs text-muted-foreground">Fully Diluted</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <ArrowUpRight className="h-4 w-4 text-crypto-green" />
              ATH
            </div>
            <p className="text-lg font-semibold">{formatCurrency(coin.ath || 0, currency)}</p>
            <p className="text-xs text-muted-foreground">{formatDate(coin.ath_date || '')}</p>
            <p className="text-xs text-crypto-red">{athChangePct.toFixed(1)}% from ATH</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <ArrowDownRight className="h-4 w-4 text-crypto-red" />
              ATL
            </div>
            <p className="text-lg font-semibold">{formatCurrency(coin.atl || 0, currency)}</p>
            <p className="text-xs text-muted-foreground">{formatDate(coin.atl_date || '')}</p>
            <p className="text-xs text-crypto-green">+{atlChangePct.toFixed(1)}% from ATL</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
              High (24h)
            </div>
            <p className="text-lg font-semibold">{high24h > 0 ? formatCurrency(high24h, currency) : '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
              Low (24h)
            </div>
            <p className="text-lg font-semibold">{low24h > 0 ? formatCurrency(low24h, currency) : '—'}</p>
          </CardContent>
        </Card>
        {roi && roi.times > 0 && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Percent className="h-4 w-4" />
                ROI
              </div>
              <p className="text-lg font-semibold">{roi.times.toFixed(2)}x</p>
              <p className="text-xs text-muted-foreground">since {roi.currency || 'ICO'}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 24H RANGE */}
      {high24h > 0 && low24h > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">24h Price Range</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{formatCurrency(low24h, currency)}</span>
              <div className="flex-1 h-2 bg-muted rounded-full relative">
                <div
                  className="absolute h-full bg-bitcoin rounded-full"
                  style={{
                    left: `${Math.max(0, Math.min(100, ((coin.current_price - low24h) / (high24h - low24h)) * 100))}%`,
                    width: '8px',
                    transform: 'translateX(-50%)',
                  }}
                />
              </div>
              <span className="text-sm font-medium">{formatCurrency(high24h, currency)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SUPPLY */}
      <Card>
        <CardHeader><CardTitle className="text-base">Token Supply</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Circulating Supply</p>
              <p className="text-lg font-bold">{formatNumber(coin.circulating_supply || 0, 0)}</p>
            </div>
            {coin.total_supply && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Supply</p>
                <p className="text-lg font-bold">{formatNumber(coin.total_supply || 0, 0)}</p>
              </div>
            )}
            {coin.max_supply && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Max Supply</p>
                <p className="text-lg font-bold">{formatNumber(coin.max_supply || 0, 0)}</p>
              </div>
            )}
          </div>
          {coin.max_supply && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Mined Progress</span>
                <span className="font-medium">{supplyPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full">
                <div className="h-full bg-gradient-to-r from-bitcoin to-bitcoin-light rounded-full transition-all" style={{ width: `${supplyPercent}%` }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MARKET METRICS */}
      <Card>
        <CardHeader><CardTitle className="text-base">Market Metrics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Market Cap Rank</p>
              <p className="text-lg font-bold">#{coin.market_cap_rank}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Vol / MCap</p>
              <p className="text-lg font-bold">{volToMcap}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Liquidity Score</p>
              <p className="text-lg font-bold">{liquidityScore > 0 ? liquidityScore.toFixed(1) : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Public Interest</p>
              <p className="text-lg font-bold">{publicInterest > 0 ? publicInterest.toFixed(0) : '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SENTIMENT */}
      {sentimentUp > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Community Sentiment</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-crypto-green" />
                <span className="text-sm font-medium text-crypto-green">{sentimentUp.toFixed(0)}%</span>
              </div>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-crypto-green rounded-full" style={{ width: `${sentimentUp}%` }} />
              </div>
              <div className="flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-crypto-red" />
                <span className="text-sm font-medium text-crypto-red">{sentimentDown.toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SCORES */}
      {(devScore > 0 || communityScore > 0 || liquidityScore > 0) && (
        <Card>
          <CardHeader><CardTitle className="text-base">Scores</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {devScore > 0 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Developer</p>
                  <p className="text-xl font-bold">{devScore.toFixed(1)}</p>
                </div>
              )}
              {communityScore > 0 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Community</p>
                  <p className="text-xl font-bold">{communityScore.toFixed(1)}</p>
                </div>
              )}
              {liquidityScore > 0 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
                  <p className="text-xl font-bold">{liquidityScore.toFixed(1)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* DESCRIPTION */}
      {descHtml && (
        <Card>
          <CardHeader><CardTitle className="text-base">About {coin.name}</CardTitle></CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: showFullDesc ? descHtml : descHtml.slice(0, 800) + '...' }}
            />
            {descHtml.length > 800 && (
              <Button variant="link" className="p-0 h-auto mt-2" onClick={() => setShowFullDesc(!showFullDesc)}>
                {showFullDesc ? 'Show Less' : 'Read More'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* GENESIS & TECH */}
      {(genesisDate || hashingAlgo || blockTime) && (
        <Card>
          <CardHeader><CardTitle className="text-base">Technical Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {genesisDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Genesis Date</p>
                    <p className="font-medium">{genesisDate}</p>
                  </div>
                </div>
              )}
              {hashingAlgo && (
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Algorithm</p>
                    <p className="font-medium">{hashingAlgo}</p>
                  </div>
                </div>
              )}
              {blockTime !== undefined && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Block Time</p>
                    <p className="font-medium">{blockTime} minutes</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Categories</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <Badge key={i} variant="outline" className="text-xs">{cat}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PLATFORMS / CONTRACTS */}
      {platformEntries.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Contracts</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {platformEntries.map(([platform, address]) => (
              <div key={platform} className="flex items-center gap-2 p-2 rounded-lg border">
                <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium capitalize shrink-0">{platform}: </span>
                <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{truncateAddress(address as string)}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => navigator.clipboard.writeText(address as string)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* COMMUNITY DATA */}
      {(twitterFollowers > 0 || redditSubscribers > 0) && (
        <Card>
          <CardHeader><CardTitle className="text-base">Community Stats</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {twitterFollowers > 0 && (
                <div className="flex items-center gap-3">
                  <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Twitter Followers</p>
                    <p className="font-medium">{formatNumber(twitterFollowers, 0)}</p>
                  </div>
                </div>
              )}
              {redditSubscribers > 0 && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#FF4500]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reddit Subscribers</p>
                    <p className="font-medium">{formatNumber(redditSubscribers, 0)}</p>
                  </div>
                </div>
              )}
              {redditActive > 0 && (
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-crypto-green" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reddit Active (48h)</p>
                    <p className="font-medium">{formatNumber(redditActive, 0)}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* DEVELOPER DATA */}
      {(githubStars > 0 || commits4w > 0) && (
        <Card>
          <CardHeader><CardTitle className="text-base">Developer Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {githubStars > 0 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">GitHub Stars</p>
                  <p className="text-lg font-bold">{formatNumber(githubStars, 0)}</p>
                </div>
              )}
              {githubForks > 0 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Forks</p>
                  <p className="text-lg font-bold">{formatNumber(githubForks, 0)}</p>
                </div>
              )}
              {githubSubscribers > 0 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Watchers</p>
                  <p className="text-lg font-bold">{formatNumber(githubSubscribers, 0)}</p>
                </div>
              )}
              {commits4w > 0 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Commits (4w)</p>
                  <p className="text-lg font-bold">{commits4w}</p>
                </div>
              )}
            </div>
            {(prMerged > 0 || totalIssues > 0 || codeAdditions > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                {prMerged > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">PRs Merged</p>
                    <p className="text-lg font-bold">{prMerged}</p>
                  </div>
                )}
                {prContributors > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Contributors</p>
                    <p className="text-lg font-bold">{prContributors}</p>
                  </div>
                )}
                {totalIssues > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Issues</p>
                    <p className="text-lg font-bold">{closedIssues}/{totalIssues}</p>
                  </div>
                )}
                {(codeAdditions > 0 || codeDeletions > 0) && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Code (4w)</p>
                    <p className="text-sm">
                      <span className="text-crypto-green">+{formatNumber(codeAdditions, 0)}</span>
                      {' / '}
                      <span className="text-crypto-red">-{formatNumber(codeDeletions, 0)}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* LINKS */}
      {(coin.links?.homepage?.[0] || coin.links?.blockchain_site?.[0]) && (
        <Card>
          <CardHeader><CardTitle className="text-base">Links</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {coin.links?.homepage?.[0] && (
              <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="h-4 w-4" /> Website <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
            {coin.links?.blockchain_site?.filter((s: string) => s).slice(0, 3).map((site: string, i: number) => (
              <a key={i} href={site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Database className="h-4 w-4" /> Explorer {i + 1} <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            ))}
            {coin.links?.twitter_screen_name && (
              <a href={`https://twitter.com/${coin.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-4 w-4" /> Twitter <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
            {coin.links?.telegram_channel_identifier && (
              <a href={`https://t.me/${coin.links.telegram_channel_identifier}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="h-4 w-4" /> Telegram <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
            {coin.links?.repos_url?.github?.[0] && (
              <a href={coin.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-4 w-4" /> GitHub <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
            {coin.links?.subreddit_url && (
              <a href={coin.links.subreddit_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Users className="h-4 w-4" /> Reddit <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
            {coin.links?.facebook_username && (
              <a href={`https://facebook.com/${coin.links.facebook_username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="h-4 w-4" /> Facebook <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            )}
          </CardContent>
        </Card>
      )}

      <CoinsAd className="my-4" />

      {/* SIDEBAR CONTENT - shown below on mobile, right side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CoinsAd className="my-4" />
        </div>
      </div>
    </div>
  );
}

function pctClass(v: number | undefined): string {
  if (!v && v !== 0) return 'text-muted-foreground';
  return v >= 0 ? 'text-crypto-green' : 'text-crypto-red';
}

function pctStr(v: number | undefined): string {
  if (!v && v !== 0) return '—';
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
}
