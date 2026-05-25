import { Metadata } from 'next';
import Link from 'next/link';
import { Star, Globe, Shield, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { generateSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatNumber } from '@/lib/utils/helpers';

interface ExchangeDetail {
  name: string;
  type: 'CEX' | 'DEX';
  rating: number;
  volume: number;
  coins: number;
  pairs: number;
  spotFee: string;
  futuresFee: string;
  established: number;
  description: string;
  features: string[];
  topCoins: { name: string; symbol: string; pair: string; volume: number; price: number; change: number }[];
}

const exchangeData: Record<string, ExchangeDetail> = {
  binance: {
    name: 'Binance',
    type: 'CEX',
    rating: 4.8,
    volume: 76800000000,
    coins: 420,
    pairs: 1800,
    spotFee: '0.10%',
    futuresFee: '0.02% / 0.04%',
    established: 2017,
    description: 'Binance is the world\'s largest cryptocurrency exchange by trading volume, serving over 150 million users globally. Founded by Changpeng Zhao, it offers a comprehensive platform for spot trading, futures, margin trading, staking, and more. Binance is known for its low fees, wide range of supported assets, and advanced trading features.',
    features: ['Low trading fees', 'Wide asset selection', 'Advanced trading tools', 'Binance Earn', 'NFT marketplace', 'Launchpad'],
    topCoins: [
      { name: 'Bitcoin', symbol: 'BTC', pair: 'BTC/USDT', volume: 12500000000, price: 67500, change: 2.34 },
      { name: 'Ethereum', symbol: 'ETH', pair: 'ETH/USDT', volume: 8900000000, price: 3450, change: 1.56 },
      { name: 'BNB', symbol: 'BNB', pair: 'BNB/USDT', volume: 3200000000, price: 580, change: -0.45 },
      { name: 'Solana', symbol: 'SOL', pair: 'SOL/USDT', volume: 2100000000, price: 145, change: 5.67 },
      { name: 'XRP', symbol: 'XRP', pair: 'XRP/USDT', volume: 1800000000, price: 0.62, change: -1.23 },
    ],
  },
  coinbase: {
    name: 'Coinbase',
    type: 'CEX',
    rating: 4.5,
    volume: 3200000000,
    coins: 250,
    pairs: 450,
    spotFee: '0.50%',
    futuresFee: 'N/A',
    established: 2012,
    description: 'Coinbase is a US-based publicly traded cryptocurrency exchange (NASDAQ: COIN) known for its regulatory compliance and user-friendly interface. It is one of the most trusted platforms for beginners and institutional investors, offering secure custody, staking, and a wide range of educational resources.',
    features: ['Regulated US exchange', 'User-friendly interface', 'Institutional grade', 'Coinbase Earn', 'Secure custody', 'FDIC insured'],
    topCoins: [
      { name: 'Bitcoin', symbol: 'BTC', pair: 'BTC/USD', volume: 980000000, price: 67500, change: 2.34 },
      { name: 'Ethereum', symbol: 'ETH', pair: 'ETH/USD', volume: 650000000, price: 3450, change: 1.56 },
      { name: 'Solana', symbol: 'SOL', pair: 'SOL/USD', volume: 280000000, price: 145, change: 5.67 },
      { name: 'Cardano', symbol: 'ADA', pair: 'ADA/USD', volume: 120000000, price: 0.45, change: -0.89 },
      { name: 'Dogecoin', symbol: 'DOGE', pair: 'DOGE/USD', volume: 95000000, price: 0.12, change: 3.21 },
    ],
  },
  kraken: {
    name: 'Kraken',
    type: 'CEX',
    rating: 4.6,
    volume: 1500000000,
    coins: 230,
    pairs: 400,
    spotFee: '0.16%',
    futuresFee: '0.02% / 0.05%',
    established: 2011,
    description: 'Kraken is one of the oldest and most reputable cryptocurrency exchanges, founded in 2011. It is known for its strong security measures, transparent operations, and comprehensive trading options including spot, futures, margin, and staking services. Kraken serves both retail and institutional clients across the globe.',
    features: ['Strong security track record', 'Transparent operations', 'Futures & margin trading', 'Staking services', 'Bank-grade security', 'Global coverage'],
    topCoins: [
      { name: 'Bitcoin', symbol: 'BTC', pair: 'BTC/USD', volume: 450000000, price: 67500, change: 2.34 },
      { name: 'Ethereum', symbol: 'ETH', pair: 'ETH/USD', volume: 320000000, price: 3450, change: 1.56 },
      { name: 'XRP', symbol: 'XRP', pair: 'XRP/USD', volume: 98000000, price: 0.62, change: -1.23 },
      { name: 'Cardano', symbol: 'ADA', pair: 'ADA/USD', volume: 65000000, price: 0.45, change: -0.89 },
      { name: 'Polkadot', symbol: 'DOT', pair: 'DOT/USD', volume: 42000000, price: 7.20, change: 1.45 },
    ],
  },
  bybit: {
    name: 'Bybit',
    type: 'CEX',
    rating: 4.4,
    volume: 25000000000,
    coins: 300,
    pairs: 600,
    spotFee: '0.10%',
    futuresFee: '0.01% / 0.06%',
    established: 2018,
    description: 'Bybit is a leading cryptocurrency derivatives exchange that offers a professional platform for crypto traders. Known for its high-performance matching engine and deep liquidity, Bybit provides spot, futures, options, and perpetual contracts trading with competitive fees and advanced risk management tools.',
    features: ['High-performance engine', 'Deep liquidity', 'Derivatives focused', 'Copy trading', 'VIP tiers', '24/7 support'],
    topCoins: [
      { name: 'Bitcoin', symbol: 'BTC', pair: 'BTC/USDT', volume: 5200000000, price: 67500, change: 2.34 },
      { name: 'Ethereum', symbol: 'ETH', pair: 'ETH/USDT', volume: 3800000000, price: 3450, change: 1.56 },
      { name: 'Solana', symbol: 'SOL', pair: 'SOL/USDT', volume: 1500000000, price: 145, change: 5.67 },
      { name: 'XRP', symbol: 'XRP', pair: 'XRP/USDT', volume: 890000000, price: 0.62, change: -1.23 },
      { name: 'Dogecoin', symbol: 'DOGE', pair: 'DOGE/USDT', volume: 620000000, price: 0.12, change: 3.21 },
    ],
  },
  okx: {
    name: 'OKX',
    type: 'CEX',
    rating: 4.5,
    volume: 18000000000,
    coins: 350,
    pairs: 700,
    spotFee: '0.08%',
    futuresFee: '0.02% / 0.05%',
    established: 2017,
    description: 'OKX is a global cryptocurrency exchange offering a comprehensive suite of products including spot and derivatives trading, DeFi, NFTs, and Web3 wallet services. With one of the lowest fee structures in the industry, OKX serves millions of users worldwide with advanced trading tools and robust security.',
    features: ['Low fee structure', 'Web3 wallet', 'DeFi integration', 'NFT marketplace', 'Earn products', 'Trading bots'],
    topCoins: [
      { name: 'Bitcoin', symbol: 'BTC', pair: 'BTC/USDT', volume: 4100000000, price: 67500, change: 2.34 },
      { name: 'Ethereum', symbol: 'ETH', pair: 'ETH/USDT', volume: 2900000000, price: 3450, change: 1.56 },
      { name: 'OKB', symbol: 'OKB', pair: 'OKB/USDT', volume: 780000000, price: 45, change: -0.67 },
      { name: 'Solana', symbol: 'SOL', pair: 'SOL/USDT', volume: 1200000000, price: 145, change: 5.67 },
      { name: 'Avalanche', symbol: 'AVAX', pair: 'AVAX/USDT', volume: 450000000, price: 35, change: 4.12 },
    ],
  },
  kucoin: {
    name: 'KuCoin',
    type: 'CEX',
    rating: 4.3,
    volume: 5000000000,
    coins: 700,
    pairs: 1400,
    spotFee: '0.10%',
    futuresFee: '0.03% / 0.06%',
    established: 2017,
    description: 'KuCoin is a global cryptocurrency exchange known for its extensive selection of altcoins and trading pairs. Dubbed "The People\'s Exchange," KuCoin offers spot, margin, futures trading, as well as staking, lending, and an automated trading bot platform. It supports over 700 coins making it one of the most diverse exchanges.',
    features: ['Massive coin selection', 'Trading bots', 'Staking & lending', 'KuCoin Earn', 'Pool-X mining', 'Community driven'],
    topCoins: [
      { name: 'Bitcoin', symbol: 'BTC', pair: 'BTC/USDT', volume: 980000000, price: 67500, change: 2.34 },
      { name: 'Ethereum', symbol: 'ETH', pair: 'ETH/USDT', volume: 720000000, price: 3450, change: 1.56 },
      { name: 'KuCoin Token', symbol: 'KCS', pair: 'KCS/USDT', volume: 180000000, price: 12, change: 0.34 },
      { name: 'Solana', symbol: 'SOL', pair: 'SOL/USDT', volume: 350000000, price: 145, change: 5.67 },
      { name: 'XRP', symbol: 'XRP', pair: 'XRP/USDT', volume: 210000000, price: 0.62, change: -1.23 },
    ],
  },
  uniswap: {
    name: 'Uniswap',
    type: 'DEX',
    rating: 4.7,
    volume: 12000000000,
    coins: 400,
    pairs: 2000,
    spotFee: '0.30%',
    futuresFee: 'N/A',
    established: 2018,
    description: 'Uniswap is the leading decentralized exchange (DEX) on Ethereum, pioneering the Automated Market Maker (AMM) model. It allows users to swap ERC-20 tokens directly from their wallets without intermediaries. Uniswap V3 introduced concentrated liquidity, significantly improving capital efficiency for liquidity providers.',
    features: ['Non-custodial trading', 'AMM protocol', 'Concentrated liquidity', 'UNI governance', 'Open source', 'Multi-chain'],
    topCoins: [
      { name: 'Ethereum', symbol: 'ETH', pair: 'ETH/USDC', volume: 2800000000, price: 3450, change: 1.56 },
      { name: 'USDC', symbol: 'USDC', pair: 'USDC/USDT', volume: 2100000000, price: 1.00, change: 0.01 },
      { name: 'UNI', symbol: 'UNI', pair: 'UNI/ETH', volume: 580000000, price: 8.50, change: -0.34 },
      { name: 'Wrapped BTC', symbol: 'WBTC', pair: 'WBTC/ETH', volume: 420000000, price: 67400, change: 2.30 },
      { name: 'Chainlink', symbol: 'LINK', pair: 'LINK/ETH', volume: 280000000, price: 15.20, change: 1.78 },
    ],
  },
  pancakeswap: {
    name: 'PancakeSwap',
    type: 'DEX',
    rating: 4.5,
    volume: 8000000000,
    coins: 1000,
    pairs: 3500,
    spotFee: '0.25%',
    futuresFee: 'N/A',
    established: 2020,
    description: 'PancakeSwap is the largest decentralized exchange on the Binance Smart Chain (BSC). It offers low-fee token swaps, yield farming, staking, lottery, and NFT collections. Built on the AMM model similar to Uniswap, PancakeSwap has become the go-to DEX for BSC users due to its low transaction costs and gamified DeFi experience.',
    features: ['Low BSC fees', 'Yield farming', 'Syrup pools', 'Lottery & predictions', 'NFT marketplace', 'CAKE governance'],
    topCoins: [
      { name: 'CAKE', symbol: 'CAKE', pair: 'CAKE/BNB', volume: 850000000, price: 2.80, change: -1.45 },
      { name: 'BNB', symbol: 'BNB', pair: 'BNB/BUSD', volume: 650000000, price: 580, change: -0.45 },
      { name: 'Ethereum', symbol: 'ETH', pair: 'ETH/BNB', volume: 420000000, price: 3450, change: 1.56 },
      { name: 'USDT', symbol: 'USDT', pair: 'USDT/BNB', volume: 380000000, price: 1.00, change: 0.01 },
      { name: 'XRP', symbol: 'XRP', pair: 'XRP/BNB', volume: 190000000, price: 0.62, change: -1.23 },
    ],
  },
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'w-4 h-4',
            i < Math.floor(rating) ? 'fill-yellow-500 text-yellow-500' : 'fill-none text-muted-foreground/30'
          )}
        />
      ))}
      <span className="text-sm font-medium ml-1.5">{rating}</span>
    </div>
  );
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const data = exchangeData[params.id];
  const name = data?.name || params.id.charAt(0).toUpperCase() + params.id.slice(1);
  return generateSEO({
    title: `${name} Exchange Details - BitcoinUrdu`,
    description: data
      ? `View ${name} exchange details, trading pairs, fees, ratings, and reviews. ${data.type} with $${formatNumber(data.volume)} in 24h volume.`
      : `View details, trading pairs, fees, and reviews for ${name} cryptocurrency exchange.`,
  });
}

export function generateStaticParams() {
  return [
    { id: 'binance' },
    { id: 'coinbase' },
    { id: 'kraken' },
    { id: 'bybit' },
    { id: 'okx' },
    { id: 'kucoin' },
    { id: 'uniswap' },
    { id: 'pancakeswap' },
  ];
}

export const dynamicParams = false;

export default async function ExchangeDetailPage({ params }: { params: { id: string } }) {
  const data = exchangeData[params.id];

  if (!data) {
    return (
      <div className="space-y-8">
        <div>
          <Link href="/exchanges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            &larr; Back to Exchanges
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h1 className="text-2xl font-bold text-muted-foreground">Exchange not found</h1>
            <p className="text-muted-foreground mt-2">The exchange you are looking for does not exist.</p>
            <Link
              href="/exchanges"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
            >
              Browse all exchanges
            </Link>
          </CardContent>
        </Card>
        <AdPlaceholder size="banner" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/exchanges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Exchanges
        </Link>
      </div>

      <div className="rounded-xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center text-white font-bold text-2xl shrink-0">
            {data.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
              <Badge variant={data.type === 'CEX' ? 'secondary' : 'green'}>{data.type}</Badge>
              {data.name === 'Binance' && (
                <Badge variant="bitcoin" className="text-xs">#1 Largest</Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <RatingStars rating={data.rating} />
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                Established {data.established}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Volume (24h)', value: `$${formatNumber(data.volume)}`, icon: TrendingUp },
          { label: 'Coins Available', value: data.coins.toLocaleString(), icon: BarChart3 },
          { label: 'Trading Pairs', value: data.pairs.toLocaleString(), icon: Globe },
          { label: 'Spot Fee', value: data.spotFee, icon: Clock },
          { label: 'Futures Fee', value: data.futuresFee, icon: TrendingUp },
          { label: 'Year Established', value: data.established.toString(), icon: Shield },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <stat.icon className="w-4 h-4 text-muted-foreground mb-2" />
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-sm font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdPlaceholder size="banner" />

      <Card>
        <CardHeader>
          <CardTitle>About {data.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{data.description}</p>
          <div>
            <h4 className="text-sm font-semibold mb-2">Key Features</h4>
            <div className="flex flex-wrap gap-2">
              {data.features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Coins Traded on {data.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead className="text-right">Volume (24h)</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topCoins.map((coin) => (
                <TableRow key={coin.symbol}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {coin.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{coin.name}</p>
                        <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{coin.pair}</TableCell>
                  <TableCell className="text-right font-medium">${formatNumber(coin.volume)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                  </TableCell>
                  <TableCell className={cn(
                    'text-right font-medium',
                    coin.change >= 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AdPlaceholder size="rectangle" />
    </div>
  );
}
