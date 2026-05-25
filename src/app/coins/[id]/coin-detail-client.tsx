'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getSupplyPercent,
} from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import {
  Star,
  ExternalLink,
  Twitter,
  MessageCircle,
  Globe,
  Github,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  TrendingUp,
  ChevronLeft,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';

interface LocalCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  circulating_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_date: string | null;
  fully_diluted_valuation: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  last_updated: string;
}

let coinCache: Record<string, LocalCoin> = {};
let allCoinsLoaded = false;

async function loadAllCoins(): Promise<Record<string, LocalCoin>> {
  if (allCoinsLoaded) return coinCache;
  try {
    const res = await fetch('/data/coins-market.json');
    if (!res.ok) return {};
    const data = await res.json();
    const map: Record<string, LocalCoin> = {};
    for (const page of data.pages || []) {
      for (const coin of page.coins || []) {
        map[coin.id.toLowerCase()] = coin;
      }
    }
    coinCache = map;
    allCoinsLoaded = true;
    return map;
  } catch {
    return {};
  }
}

function getTradingViewSymbol(coin: LocalCoin): string {
  const symbolMap: Record<string, string> = {
    bitcoin: 'BINANCE:BTCUSDT',
    ethereum: 'BINANCE:ETHUSDT',
    binancecoin: 'BINANCE:BNBUSDT',
    ripple: 'BINANCE:XRPUSDT',
    cardano: 'BINANCE:ADAUSDT',
    solana: 'BINANCE:SOLUSDT',
    dogecoin: 'BINANCE:DOGEUSDT',
    polkadot: 'BINANCE:DOTUSDT',
    'avalanche-2': 'BINANCE:AVAXUSDT',
    chainlink: 'BINANCE:LINKUSDT',
    litecoin: 'BINANCE:LTCUSDT',
    tron: 'BINANCE:TRXUSDT',
    near: 'BINANCE:NEARUSDT',
    aptos: 'BINANCE:APTUSDT',
    sui: 'BINANCE:SUIUSDT',
    toncoin: 'BINANCE:TONUSDT',
    kaspa: 'BINANCE:KASUSDT',
    injective: 'BINANCE:INJUSDT',
    'sei-network': 'BINANCE:SEIUSDT',
    arbitrum: 'BINANCE:ARBUSDT',
    optimism: 'BINANCE:OPUSDT',
    'render-token': 'BINANCE:RENDERUSDT',
    'fetch-ai': 'BINANCE:FETUSDT',
    bittensor: 'BINANCE:TAOUSDT',
    'immutable-x': 'BINANCE:IMXUSDT',
    aave: 'BINANCE:AAVEUSDT',
    uniswap: 'BINANCE:UNIUSDT',
    maker: 'BINANCE:MKRUSDT',
    cosmos: 'BINANCE:ATOMUSDT',
    filecoin: 'BINANCE:FILUSDT',
    'internet-computer': 'BINANCE:ICPUSDT',
    'hedera-hashgraph': 'BINANCE:HBARUSDT',
    fantom: 'BINANCE:FTMUSDT',
    algorand: 'BINANCE:ALGOUSDT',
    'the-sandbox': 'BINANCE:SANDUSDT',
    decentraland: 'BINANCE:MANAUSDT',
    monero: 'KRAKEN:XMRUSD',
    zcash: 'BINANCE:ZECUSDT',
    stellar: 'BINANCE:XLMUSDT',
    'theta-token': 'BINANCE:THETAUSDT',
    vechain: 'BINANCE:VETUSDT',
    stacks: 'BINANCE:STXUSDT',
    thorchain: 'BINANCE:RUNEUSDT',
    bonk: 'BINANCE:BONKUSDT',
    dogwifcoin: 'BINANCE:WIFUSDT',
    floki: 'BINANCE:FLOKIUSDT',
    pendle: 'BINANCE:PENDLEUSDT',
    worldcoin: 'BINANCE:WLDUSDT',
    'shiba-inu': 'BINANCE:SHIBUSDT',
    pepe: 'BINANCE:PEPEUSDT',
    tether: 'BINANCE:USDTUSD',
    'usd-coin': 'BINANCE:USDCUSD',
    'artificial-superintelligence-alliance': 'BINANCE:FETUSDT',
  };

  if (symbolMap[coin.id]) return symbolMap[coin.id];

  const binanceSymbol = `BINANCE:${coin.symbol.toUpperCase()}USDT`;
  return binanceSymbol;
}

export function CoinDetailClient({ coinId }: { coinId: string }) {
  const { currency, watchlist, toggleWatchlist } = useAppStore();
  const [coin, setCoin] = useState<LocalCoin | null>(null);
  const [loading, setLoading] = useState(true);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [liveChange, setLiveChange] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const tvContainerRef = useRef<HTMLDivElement>(null);
  const tvWidgetRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadAllCoins().then((map) => {
      if (cancelled) return;
      const found = map[coinId.toLowerCase()];
      if (found) {
        setCoin(found);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [coinId]);

  useEffect(() => {
    if (!coin) return;
    let cancelled = false;
    const fetchLive = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd&include_24hr_change=true`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (res.ok) {
          const data = await res.json();
          if (data[coin.id] && !cancelled) {
            setLivePrice(data[coin.id].usd || null);
            setLiveChange(data[coin.id].usd_24h_change || null);
          }
        }
      } catch {
        try {
          const res = await fetch(`https://api.coincap.io/v2/assets/${coin.id}`, { signal: AbortSignal.timeout(5000) });
          if (res.ok) {
            const data = await res.json();
            if (data.data && !cancelled) {
              setLivePrice(parseFloat(data.data.priceUsd) || null);
              setLiveChange(parseFloat(data.data.changePercent24Hr) || null);
            }
          }
        } catch {}
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [coin]);

  useEffect(() => {
    if (!coin || !tvContainerRef.current) return;
    const container = tvContainerRef.current;
    container.innerHTML = '';

    const tvSymbol = getTradingViewSymbol(coin);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (!container || !(window as unknown as Record<string, unknown>).TradingView) return;
      const TradingView = (window as unknown as Record<string, unknown>).TradingView as Record<string, unknown>;
      try {
        const widget = new (TradingView.widget as new (opts: Record<string, unknown>) => unknown)({
          autosize: true,
          symbol: tvSymbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#0a0a0f',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          withdateranges: true,
          hide_top_toolbar: false,
          save_image: false,
          studies: ['RSI@tv-basicstudies', 'MASimple@tv-basicstudies'],
          container_id: container.id,
          backgroundColor: '#0a0a0f',
          gridColor: '#1a1a2e',
          overrides: {
            'paneProperties.background': '#0a0a0f',
            'paneProperties.vertGridProperties.color': '#1a1a2e',
            'paneProperties.horzGridProperties.color': '#1a1a2e',
          },
        });
        tvWidgetRef.current = widget;
      } catch {
        container.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center p-8"><p class="text-muted-foreground mb-2">Chart unavailable for this asset</p><p class="text-xs text-muted-foreground/60">Showing benchmark: BTC/USDT</p></div>`;
        try {
          const fallbackWidget = new (TradingView.widget as new (opts: Record<string, unknown>) => unknown)({
            autosize: true,
            symbol: 'BINANCE:BTCUSDT',
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#0a0a0f',
            enable_publishing: false,
            hide_side_toolbar: true,
            allow_symbol_change: false,
            container_id: container.id,
            backgroundColor: '#0a0a0f',
          });
          tvWidgetRef.current = fallbackWidget;
        } catch {}
      }
    };
    document.head.appendChild(script);

    return () => {
      container.innerHTML = '';
      tvWidgetRef.current = null;
    };
  }, [coin]);

  const handleRefresh = async () => {
    if (!coin) return;
    setRefreshing(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd&include_24hr_change=true`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (res.ok) {
        const data = await res.json();
        if (data[coin.id]) {
          setLivePrice(data[coin.id].usd || null);
          setLiveChange(data[coin.id].usd_24h_change || null);
        }
      }
    } catch {}
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardContent className="pt-6"><Skeleton className="h-96 w-full" /></CardContent></Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}><CardContent className="pt-4"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-6 w-28" /></CardContent></Card>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card key={i}><CardContent className="pt-6"><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="space-y-6">
        <Link href="/coins" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to Coins
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Coin &quot;{coinId}&quot; not found in database.</p>
            <Link href="/coins" className="text-bitcoin hover:underline">Browse all 15,984 coins</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayPrice = livePrice ?? coin.current_price;
  const displayChange = liveChange ?? coin.price_change_percentage_24h ?? 0;
  const supplyPercent = getSupplyPercent(coin.circulating_supply || 0, coin.max_supply || 0);
  const priceChange = displayChange;

  return (
    <div className="space-y-6">
      <Link href="/coins" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to Coins
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Image src={coin.image} alt={coin.name} width={48} height={48} className="rounded-full" />
          <div>
            <h1 className="text-2xl font-bold">{coin.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground uppercase">{coin.symbol}</span>
              {coin.market_cap_rank && <span className="text-sm text-muted-foreground">Rank #{coin.market_cap_rank}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => toggleWatchlist(coin.id)}>
            <Star className={`h-4 w-4 ${watchlist.includes(coin.id) ? 'fill-bitcoin text-bitcoin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-bold">{formatCurrency(displayPrice, currency)}</span>
        <Badge variant={priceChange >= 0 ? 'green' : 'red'} className="text-base px-3 py-1">
          {priceChange >= 0 ? <ArrowUpRight className="h-4 w-4 inline mr-1" /> : <ArrowDownRight className="h-4 w-4 inline mr-1" />}
          {formatPercent(Math.abs(priceChange))}
        </Badge>
        {livePrice && <span className="text-xs text-muted-foreground">Live</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Advanced Chart</CardTitle>
              <p className="text-xs text-muted-foreground">TradingView • {getTradingViewSymbol(coin)}</p>
            </CardHeader>
            <CardContent>
              <div id={`tv-chart-${coin.id}`} ref={tvContainerRef} className="h-[500px] w-full rounded-lg overflow-hidden" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><BarChart3 className="h-4 w-4" /> Market Cap</div>
                <p className="text-lg font-semibold">{formatCurrency(coin.market_cap, currency)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><TrendingUp className="h-4 w-4" /> Volume (24h)</div>
                <p className="text-lg font-semibold">{formatCurrency(coin.total_volume, currency)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><ArrowUpRight className="h-4 w-4 text-crypto-green" /> ATH</div>
                <p className="text-lg font-semibold">{formatCurrency(coin.ath || 0, currency)}</p>
                <p className="text-xs text-muted-foreground">{coin.ath_date ? new Date(coin.ath_date).toLocaleDateString() : '—'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><ArrowDownRight className="h-4 w-4 text-crypto-red" /> ATL</div>
                <p className="text-lg font-semibold">{formatCurrency(coin.atl || 0, currency)}</p>
                <p className="text-xs text-muted-foreground">{coin.atl_date ? new Date(coin.atl_date).toLocaleDateString() : '—'}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Supply</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Circulating</span>
                  <span>{formatNumber(coin.circulating_supply || 0, 0)}</span>
                </div>
                {coin.max_supply && (
                  <>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div className="h-full bg-bitcoin rounded-full transition-all" style={{ width: `${supplyPercent}%` }} />
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Max Supply</span>
                      <span>{formatNumber(coin.max_supply, 0)}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">High 24h</span><span>{formatCurrency(coin.high_24h || 0, currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Low 24h</span><span>{formatCurrency(coin.low_24h || 0, currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">FDV</span><span>{formatCurrency(coin.fully_diluted_valuation || 0, currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">24h Change</span><span className={(coin.market_cap_change_percentage_24h ?? 0) >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>{(coin.market_cap_change_percentage_24h ?? 0).toFixed(2)}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last Updated</span><span className="text-xs">{coin.last_updated ? new Date(coin.last_updated).toLocaleString() : '—'}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Links</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <a href={`https://www.coingecko.com/en/coins/${coin.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="h-4 w-4" /> CoinGecko <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
              <a href={`https://www.binance.com/en/trade/${coin.symbol.toUpperCase()}_USDT`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <TrendingUp className="h-4 w-4" /> Trade on Binance <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
