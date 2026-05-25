'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/helpers';
import { useAppStore } from '@/stores';
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  TrendingUp,
  Coins,
  Gem,
  Landmark,
  RefreshCw,
  DollarSign,
  Wheat,
  Building2,
  Activity,
  Globe,
  Clock,
  ArrowLeftRight,
  Calculator,
} from 'lucide-react';
import { MarketsAd } from '@/components/ads/ad-slots';

const PKR_RATE = 278;

interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume?: string;
  marketCap?: string;
  exchange?: string;
  icon?: string;
  high24h?: number;
  low24h?: number;
}

const TABS = [
  { key: 'overview', label: 'Overview', icon: Activity },
  { key: 'stocks', label: 'Stocks', icon: BarChart3 },
  { key: 'forex', label: 'Forex', icon: TrendingUp },
  { key: 'commodities', label: 'Commodities', icon: Gem },
  { key: 'indices', label: 'Indices', icon: Globe },
  { key: 'crypto', label: 'Crypto', icon: Coins },
  { key: 'converter', label: 'Converter', icon: ArrowLeftRight },
];

export function MarketsPage() {
  const { currency } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [cryptoData, setCryptoData] = useState<MarketItem[]>([]);
  const [marketStats, setMarketStats] = useState({
    kse100: { price: 128542, change: 1.24 },
    usdPkr: { price: 278.50, change: 0.12 },
    gold: { price: 2345.60, change: 0.45 },
    silver: { price: 27.85, change: -0.32 },
    oil: { price: 78.45, change: 1.23 },
    bitcoin: { price: 76756, change: 0.12 },
  });

  const [convAmount, setConvAmount] = useState('1');
  const [convFrom, setConvFrom] = useState('USD');
  const [convTo, setConvTo] = useState('PKR');
  const [convRates, setConvRates] = useState<Record<string, number>>({});
  const [convLoading, setConvLoading] = useState(true);
  const [convLastUpdate, setConvLastUpdate] = useState('');

  const FIATS = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate: 278.50, locale: 'ur-PK' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
    { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦' },
    { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
    { code: 'BHD', name: 'Bahraini Dinar', flag: '🇧🇭' },
    { code: 'OMR', name: 'Omani Rial', flag: '🇴🇲' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'BDT', name: 'Bangladeshi Taka', flag: '🇧🇩' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'AFN', name: 'Afghan Afghani', flag: '🇦🇫' },
    { code: 'IRR', name: 'Iranian Rial', flag: '🇮🇷' },
  ];

  const METALS = [
    { code: 'XAU', name: 'Gold (per oz)', flag: '🥇' },
    { code: 'XAG', name: 'Silver (per oz)', flag: '🥈' },
    { code: 'XAU_TOLA', name: 'Gold (per tola)', flag: '🥇' },
    { code: 'XAG_TOLA', name: 'Silver (per tola)', flag: '🥈' },
  ];

  const ALL_CURRENCIES = [...FIATS, ...METALS];

  useEffect(() => {
    setLoading(true);
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCryptoData(data.map((c: Record<string, unknown>) => ({
            id: c.id as string,
            name: c.name as string,
            symbol: (c.symbol as string).toUpperCase(),
            price: c.current_price as number,
            change: c.price_change_percentage_24h as number,
            volume: formatCurrency(c.total_volume as number, 'USD'),
            marketCap: formatCurrency(c.market_cap as number, 'USD'),
          })));
        }
        setLoading(false);
        setLastUpdate(new Date().toLocaleTimeString());
      })
      .catch(() => {
        setLoading(false);
        setLastUpdate(new Date().toLocaleTimeString());
      });

    const interval = setInterval(() => {
      fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h')
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCryptoData(data.map((c: Record<string, unknown>) => ({
              id: c.id as string,
              name: c.name as string,
              symbol: (c.symbol as string).toUpperCase(),
              price: c.current_price as number,
              change: c.price_change_percentage_24h as number,
              volume: formatCurrency(c.total_volume as number, 'USD'),
              marketCap: formatCurrency(c.market_cap as number, 'USD'),
            })));
          }
          setLastUpdate(new Date().toLocaleTimeString());
        })
        .catch(() => {});
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchRates = async () => {
    setConvLoading(true);
    try {
      const fiatRes = await fetch('https://open.er-api.com/v6/latest/USD');
      const fiatData = await fiatRes.json();
      const rates: Record<string, number> = {};

      if (fiatData.rates) {
        Object.keys(fiatData.rates).forEach((key) => {
          rates[key] = fiatData.rates[key];
        });
      }

      let goldPerOz = 2400;
      let silverPerOz = 28;

      try {
        const metalRes = await fetch('https://api.metals.live/v1/spot');
        const metalData = await metalRes.json();
        if (Array.isArray(metalData) && metalData.length > 0) {
          goldPerOz = metalData[0].gold || goldPerOz;
          silverPerOz = metalData[0].silver || silverPerOz;
        }
      } catch {
        try {
          const goldRes = await fetch('https://api.gold-api.com/price/XAU');
          const goldData = await goldRes.json();
          if (goldData.price) goldPerOz = goldData.price;
        } catch {}
      }

      const tolaPerOz = 2.699;
      const goldPerTola = goldPerOz / tolaPerOz;
      const silverPerTola = silverPerOz / tolaPerOz;

      rates.XAU = 1 / goldPerOz;
      rates.XAG = 1 / silverPerOz;
      rates.XAU_TOLA = 1 / goldPerTola;
      rates.XAG_TOLA = 1 / silverPerTola;

      setConvRates(rates);
      setConvLoading(false);
      setConvLastUpdate(new Date().toLocaleTimeString());
    } catch {
      setConvLoading(false);
    }
  };

  const getConvertedAmount = () => {
    const amount = parseFloat(convAmount) || 0;
    if (!convRates[convFrom] || !convRates[convTo]) return 0;
    const usdAmount = amount / convRates[convFrom];
    return usdAmount * convRates[convTo];
  };

  const formatConvResult = (val: number, code: string) => {
    if (code.startsWith('XAU') || code.startsWith('XAG')) {
      return val.toFixed(6);
    }
    if (val >= 1000) return val.toLocaleString('en-PK', { maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(4);
    return val.toFixed(6);
  };

  const swapCurrencies = () => {
    setConvFrom(convTo);
    setConvTo(convFrom);
  };

  const stocks: MarketItem[] = [
    { id: 'aapl', name: 'Apple Inc.', symbol: 'AAPL', price: 189.84, change: 1.23, volume: '52.3M', marketCap: '$2.95T', exchange: 'NASDAQ' },
    { id: 'googl', name: 'Alphabet Inc.', symbol: 'GOOGL', price: 141.80, change: -0.45, volume: '21.1M', marketCap: '$1.78T', exchange: 'NASDAQ' },
    { id: 'msft', name: 'Microsoft Corp.', symbol: 'MSFT', price: 417.88, change: 0.89, volume: '18.7M', marketCap: '$3.10T', exchange: 'NASDAQ' },
    { id: 'tsla', name: 'Tesla Inc.', symbol: 'TSLA', price: 248.42, change: -2.15, volume: '98.2M', marketCap: '$790B', exchange: 'NASDAQ' },
    { id: 'amzn', name: 'Amazon.com Inc.', symbol: 'AMZN', price: 186.49, change: 0.67, volume: '45.1M', marketCap: '$1.93T', exchange: 'NASDAQ' },
    { id: 'nvda', name: 'NVIDIA Corp.', symbol: 'NVDA', price: 875.28, change: 3.45, volume: '42.8M', marketCap: '$2.16T', exchange: 'NASDAQ' },
    { id: 'meta', name: 'Meta Platforms', symbol: 'META', price: 505.75, change: 1.12, volume: '15.3M', marketCap: '$1.29T', exchange: 'NASDAQ' },
    { id: 'brk', name: 'Berkshire Hathaway', symbol: 'BRK.B', price: 408.50, change: 0.34, volume: '3.2M', marketCap: '$890B', exchange: 'NYSE' },
    { id: 'jpm', name: 'JPMorgan Chase', symbol: 'JPM', price: 198.45, change: -0.23, volume: '8.7M', marketCap: '$570B', exchange: 'NYSE' },
    { id: 'v', name: 'Visa Inc.', symbol: 'V', price: 279.32, change: 0.56, volume: '6.1M', marketCap: '$570B', exchange: 'NYSE' },
    { id: 'kse100', name: 'KSE-100 Index', symbol: 'KSE100', price: 128542, change: 1.24, volume: '₨12.5B', marketCap: '-', exchange: 'PSX' },
    { id: 'ogdc', name: 'OGDC Limited', symbol: 'OGDC', price: 185.50, change: 2.15, volume: '₨450M', marketCap: '-', exchange: 'PSX' },
    { id: 'trl', name: 'TRG Global', symbol: 'TRG', price: 142.30, change: -1.85, volume: '$320M', marketCap: '-', exchange: 'Global' },
    { id: 'sys', name: 'Systems Limited', symbol: 'SYS', price: 485.00, change: 0.95, volume: '₨180M', marketCap: '-', exchange: 'PSX' },
    { id: 'mcb', name: 'MCB Bank Limited', symbol: 'MCB', price: 245.75, change: 0.45, volume: '₨210M', marketCap: '-', exchange: 'PSX' },
  ];

  const forex: MarketItem[] = [
    { id: 'usdpkr', name: 'US Dollar / PKR', symbol: 'USD/PKR', price: 278.50, change: 0.12 },
    { id: 'eurusd', name: 'Euro / US Dollar', symbol: 'EUR/USD', price: 1.0856, change: -0.23 },
    { id: 'gbpusd', name: 'British Pound / USD', symbol: 'GBP/USD', price: 1.2634, change: 0.15 },
    { id: 'usdaed', name: 'US Dollar / AED', symbol: 'USD/AED', price: 3.6725, change: 0.01 },
    { id: 'usdsar', name: 'US Dollar / SAR', symbol: 'USD/SAR', price: 3.7500, change: 0.00 },
    { id: 'usdinr', name: 'US Dollar / INR', symbol: 'USD/INR', price: 83.50, change: 0.08 },
    { id: 'usdjpy', name: 'US Dollar / Yen', symbol: 'USD/JPY', price: 154.32, change: -0.45 },
    { id: 'usdcny', name: 'US Dollar / Yuan', symbol: 'USD/CNY', price: 7.2450, change: 0.02 },
    { id: 'audusd', name: 'Australian Dollar / USD', symbol: 'AUD/USD', price: 0.6545, change: 0.32 },
    { id: 'usdchf', name: 'US Dollar / Swiss Franc', symbol: 'USD/CHF', price: 0.8825, change: -0.18 },
    { id: 'usdtry', name: 'US Dollar / Turkish Lira', symbol: 'USD/TRY', price: 32.15, change: 0.05 },
    { id: 'usdmyr', name: 'US Dollar / MYR', symbol: 'USD/MYR', price: 4.72, change: -0.10 },
  ];

  const commodities: MarketItem[] = [
    { id: 'gold', name: 'Gold', symbol: 'XAU/USD', price: 2345.60, change: 0.45, high24h: 2365, low24h: 2320 },
    { id: 'silver', name: 'Silver', symbol: 'XAG/USD', price: 27.85, change: -0.32, high24h: 28.20, low24h: 27.50 },
    { id: 'oil', name: 'Crude Oil (WTI)', symbol: 'WTI', price: 78.45, change: 1.23, high24h: 79.20, low24h: 77.10 },
    { id: 'brent', name: 'Brent Crude', symbol: 'BRENT', price: 82.30, change: 0.95, high24h: 83.10, low24h: 81.20 },
    { id: 'ng', name: 'Natural Gas', symbol: 'NG', price: 2.15, change: -2.45, high24h: 2.25, low24h: 2.10 },
    { id: 'platinum', name: 'Platinum', symbol: 'XPT/USD', price: 945.30, change: 0.78, high24h: 955, low24h: 935 },
    { id: 'copper', name: 'Copper', symbol: 'HG', price: 4.52, change: 1.15, high24h: 4.58, low24h: 4.45 },
    { id: 'wheat', name: 'Wheat', symbol: 'ZW', price: 625.50, change: -0.85, high24h: 635, low24h: 620 },
  ];

  const indices: MarketItem[] = [
    { id: 'spx', name: 'S&P 500', symbol: 'SPX', price: 5234.18, change: 0.67, exchange: 'US' },
    { id: 'dji', name: 'Dow Jones', symbol: 'DJI', price: 39512.84, change: 0.42, exchange: 'US' },
    { id: 'ixic', name: 'NASDAQ Composite', symbol: 'IXIC', price: 16340.87, change: 1.12, exchange: 'US' },
    { id: 'ftse', name: 'FTSE 100', symbol: 'FTSE', price: 8145.30, change: -0.15, exchange: 'UK' },
    { id: 'dax', name: 'DAX', symbol: 'DAX', price: 18432.50, change: 0.85, exchange: 'Germany' },
    { id: 'n225', name: 'Nikkei 225', symbol: 'N225', price: 38450.20, change: -0.32, exchange: 'Japan' },
    { id: 'hsi', name: 'Hang Seng', symbol: 'HSI', price: 17845.60, change: 0.45, exchange: 'Hong Kong' },
    { id: 'sse', name: 'Shanghai Composite', symbol: 'SSE', price: 3085.40, change: -0.18, exchange: 'China' },
    { id: 'bse', name: 'BSE Sensex', symbol: 'BSE', price: 74250.30, change: 0.92, exchange: 'India' },
    { id: 'nifty', name: 'NIFTY 50', symbol: 'NIFTY', price: 22485.75, change: 0.78, exchange: 'India' },
    { id: 'kse100', name: 'KSE-100', symbol: 'KSE100', price: 128542.00, change: 1.24, exchange: 'Global' },
    { id: 'asx', name: 'ASX 200', symbol: 'ASX', price: 7825.40, change: 0.35, exchange: 'Australia' },
  ];

  const MarketRow = ({ item }: { item: MarketItem }) => {
    const change = item.change || 0;
    const isPositive = change >= 0;

    const formatPrice = () => {
      // Global Index - show as Points
      if (item.id === 'kse100' || item.exchange === 'Global') {
        return `${item.price.toLocaleString('en-PK', { maximumFractionDigits: 2 })} pts`;
      }
      // Global Stocks - show as Rs.
      if (item.exchange === 'PSX') {
        return `Rs. ${item.price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      // USD/PKR - show as ₨
      if (item.id === 'usdpkr') {
        return `₨${item.price.toFixed(2)}`;
      }
      // Gold in PKR - show as ₨
      if (item.id === 'goldpkr') {
        return `₨${item.price.toLocaleString('en-PK')}`;
      }
      // Other indices (S&P, Dow, FTSE, etc.) - show as Points
      if (item.exchange && ['US', 'UK', 'Germany', 'Japan', 'Hong Kong', 'China', 'India', 'Australia'].includes(item.exchange)) {
        return `${item.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} pts`;
      }
      // US/Global stocks - show as $
      if (item.price >= 1000) return formatCurrency(item.price, 'USD');
      if (item.price >= 1) return `$${item.price.toFixed(2)}`;
      return `$${item.price.toFixed(4)}`;
    };

    return (
      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
            {item.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="font-medium">{item.symbol}</p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatPrice()}</p>
          <Badge variant={isPositive ? 'green' : 'red'} className="text-xs">
            {isPositive ? <ArrowUpRight className="h-3 w-3 inline mr-0.5" /> : <ArrowDownRight className="h-3 w-3 inline mr-0.5" />}
            {formatPercent(Math.abs(change))}
          </Badge>
        </div>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, label, value, change, color }: { icon: React.ElementType; label: string; value: string; change: number; color: string }) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
      yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20' },
    };
    const c = colorMap[color] || colorMap.blue;

    return (
      <Card className={c.border}>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xl font-bold mt-1">{value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${change >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {formatPercent(Math.abs(change))}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${c.bg}`}>
              <Icon className={`h-6 w-6 ${c.text}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Global Markets</h1>
          <p className="text-sm text-muted-foreground mt-1">Stocks, forex, commodities, indices aur crypto — sab ek jagah</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {lastUpdate ? `Updated: ${lastUpdate}` : 'Loading...'}
          <button
            onClick={() => window.location.reload()}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <MarketsAd className="my-4" />

      {/* HERO STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Landmark} label="KSE-100" value={marketStats.kse100.price.toLocaleString()} change={marketStats.kse100.change} color="green" />
        <StatCard icon={DollarSign} label="USD/PKR" value={`₨${marketStats.usdPkr.price.toFixed(2)}`} change={marketStats.usdPkr.change} color="blue" />
        <StatCard icon={Gem} label="Gold (oz)" value={`$${marketStats.gold.price.toLocaleString()}`} change={marketStats.gold.change} color="yellow" />
        <StatCard icon={Wheat} label="Oil (WTI)" value={`$${marketStats.oil.price.toFixed(2)}`} change={marketStats.oil.change} color="orange" />
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-bitcoin text-white shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Global Markets</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stocks.filter(s => s.exchange === 'PSX').map(s => <MarketRow key={s.id} item={s} />)}
                  <MarketRow item={{ id: 'usdpkr', name: 'US Dollar / PKR', symbol: 'USD/PKR', price: 278.50, change: 0.12 }} />
                  <MarketRow item={{ id: 'goldpkr', name: 'Gold (per tola)', symbol: 'GOLD/PKR', price: 247000, change: 0.45 }} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">🌍 Global Indices</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {indices.slice(0, 6).map(idx => <MarketRow key={idx.id} item={idx} />)}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg">🪙 Top Crypto</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading crypto prices...</p>
              ) : (
                <div className="space-y-2">
                  {cryptoData.slice(0, 10).map(c => (
                    <Link key={c.id} href={`/coins/${c.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors block">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{c.symbol.slice(0, 2)}</div>
                        <div>
                          <p className="font-medium">{c.symbol}</p>
                          <p className="text-xs text-muted-foreground">{c.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${c.price < 1 ? c.price.toFixed(6) : c.price.toLocaleString()}</p>
                        <Badge variant={c.change >= 0 ? 'green' : 'red'} className="text-xs">
                          {c.change >= 0 ? <ArrowUpRight className="h-3 w-3 inline mr-0.5" /> : <ArrowDownRight className="h-3 w-3 inline mr-0.5" />}
                          {formatPercent(Math.abs(c.change))}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* STOCKS */}
      {activeTab === 'stocks' && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>US Stocks</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stocks.filter(s => s.exchange !== 'PSX').map(s => <MarketRow key={s.id} item={s} />)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Global Stock Exchange</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stocks.filter(s => s.exchange === 'PSX').map(s => <MarketRow key={s.id} item={s} />)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FOREX */}
      {activeTab === 'forex' && (
        <Card>
          <CardHeader><CardTitle>Forex Rates</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {forex.map(fx => <MarketRow key={fx.id} item={fx} />)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* COMMODITIES */}
      {activeTab === 'commodities' && (
        <Card>
          <CardHeader><CardTitle>Commodities</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {commodities.map(c => (
                <div key={c.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{c.symbol}</p>
                      <p className="text-xs text-muted-foreground">{c.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${c.price.toLocaleString()}</p>
                      <Badge variant={c.change >= 0 ? 'green' : 'red'} className="text-xs">
                        {c.change >= 0 ? <ArrowUpRight className="h-3 w-3 inline mr-0.5" /> : <ArrowDownRight className="h-3 w-3 inline mr-0.5" />}
                        {formatPercent(Math.abs(c.change))}
                      </Badge>
                    </div>
                  </div>
                  {c.high24h && c.low24h && (
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>H: ${c.high24h.toLocaleString()}</span>
                      <span>L: ${c.low24h.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* INDICES */}
      {activeTab === 'indices' && (
        <Card>
          <CardHeader><CardTitle>Global Market Indices</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {indices.map(idx => <MarketRow key={idx.id} item={idx} />)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CRYPTO */}
      {activeTab === 'crypto' && (
        <Card>
          <CardHeader><CardTitle>Cryptocurrencies (Live)</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-2">
                {cryptoData.map(c => (
                  <Link key={c.id} href={`/coins/${c.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors block">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{c.symbol.slice(0, 2)}</div>
                      <div>
                        <p className="font-medium">{c.symbol}</p>
                        <p className="text-xs text-muted-foreground">{c.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${c.price < 1 ? c.price.toFixed(6) : c.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Vol: {c.volume}</span>
                        <Badge variant={c.change >= 0 ? 'green' : 'red'} className="text-xs">
                          {c.change >= 0 ? <ArrowUpRight className="h-3 w-3 inline mr-0.5" /> : <ArrowDownRight className="h-3 w-3 inline mr-0.5" />}
                          {formatPercent(Math.abs(c.change))}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* CURRENCY CONVERTER */}
      {activeTab === 'converter' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-bitcoin" />
                Currency & Metals Converter
              </CardTitle>
              <p className="text-sm text-muted-foreground">Live rates — 28 fiats + Sona/Chandi (per oz & per tola). Har 60 second mein auto-update hota hai.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Live Gold/Silver Rates in PKR */}
              {!convLoading && convRates.PKR && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(() => {
                    const goldPerOz = 1 / (convRates.XAU || 1 / 2400);
                    const silverPerOz = 1 / (convRates.XAG || 1 / 28);
                    const tolaPerOz = 2.699;
                    const goldPerTola = goldPerOz / tolaPerOz;
                    const silverPerTola = silverPerOz / tolaPerOz;
                    const goldTolaPKR = goldPerTola * convRates.PKR;
                    const silverTolaPKR = silverPerTola * convRates.PKR;
                    const goldOzPKR = goldPerOz * convRates.PKR;
                    const silverOzPKR = silverPerOz * convRates.PKR;
                    return (
                      <>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 text-center">
                          <p className="text-xs text-muted-foreground mb-1">🥇 Sona (1 Tola)</p>
                          <p className="text-lg font-bold text-yellow-500">₨{goldTolaPKR.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</p>
                          <p className="text-xs text-muted-foreground">${goldPerTola.toFixed(0)}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-gray-400/20 to-gray-400/5 border border-gray-400/30 text-center">
                          <p className="text-xs text-muted-foreground mb-1">🥈 Chandi (1 Tola)</p>
                          <p className="text-lg font-bold text-gray-400">₨{silverTolaPKR.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</p>
                          <p className="text-xs text-muted-foreground">${silverPerTola.toFixed(0)}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 text-center">
                          <p className="text-xs text-muted-foreground mb-1">🥇 Sona (1 Oz)</p>
                          <p className="text-lg font-bold text-yellow-500">₨{goldOzPKR.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</p>
                          <p className="text-xs text-muted-foreground">${goldPerOz.toFixed(0)}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-gray-400/20 to-gray-400/5 border border-gray-400/30 text-center">
                          <p className="text-xs text-muted-foreground mb-1">🥈 Chandi (1 Oz)</p>
                          <p className="text-lg font-bold text-gray-400">₨{silverOzPKR.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</p>
                          <p className="text-xs text-muted-foreground">${silverPerOz.toFixed(0)}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">Amount</label>
                <Input
                  type="number"
                  value={convAmount}
                  onChange={(e) => setConvAmount(e.target.value)}
                  className="text-2xl font-bold h-14"
                  placeholder="Enter amount..."
                />
              </div>

              {/* From / To */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
                <div>
                  <label className="text-sm font-medium mb-2 block">From</label>
                  <select
                    value={convFrom}
                    onChange={(e) => setConvFrom(e.target.value)}
                    className="w-full h-12 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
                  >
                    <optgroup label="Currencies">
                      {FIATS.map(f => (
                        <option key={f.code} value={f.code}>{f.flag} {f.code} — {f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Metals">
                      {METALS.map(m => (
                        <option key={m.code} value={m.code}>{m.flag} {m.code} — {m.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <button
                  onClick={swapCurrencies}
                  className="h-12 w-12 rounded-full bg-bitcoin/10 hover:bg-bitcoin/20 flex items-center justify-center transition-colors shrink-0"
                >
                  <ArrowLeftRight className="h-5 w-5 text-bitcoin" />
                </button>

                <div>
                  <label className="text-sm font-medium mb-2 block">To</label>
                  <select
                    value={convTo}
                    onChange={(e) => setConvTo(e.target.value)}
                    className="w-full h-12 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
                  >
                    <optgroup label="Currencies">
                      {FIATS.map(f => (
                        <option key={f.code} value={f.code}>{f.flag} {f.code} — {f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Metals">
                      {METALS.map(m => (
                        <option key={m.code} value={m.code}>{m.flag} {m.code} — {m.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Result */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-bitcoin/10 to-green-500/10 border border-bitcoin/20 text-center">
                {convLoading ? (
                  <p className="text-muted-foreground">Loading rates...</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-1">
                      {convAmount} {convFrom} =
                    </p>
                    <p className="text-3xl font-bold text-bitcoin">
                      {formatConvResult(getConvertedAmount(), convTo)} {convTo}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated: {convLastUpdate}
                    </p>
                  </>
                )}
              </div>

              {/* Quick Convert Table */}
              {!convLoading && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    Quick Convert: {convFrom} to {convTo}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {[1, 5, 10, 25, 50, 100, 500, 1000].map(amt => {
                      const result = (amt / (convRates[convFrom] || 1)) * (convRates[convTo] || 1);
                      return (
                        <button
                          key={amt}
                          onClick={() => setConvAmount(String(amt))}
                          className="p-3 rounded-lg border hover:bg-muted/50 transition-colors text-center"
                        >
                          <p className="text-sm font-medium">{amt} {convFrom}</p>
                          <p className="text-xs text-bitcoin font-semibold mt-0.5">
                            {formatConvResult(result, convTo)} {convTo}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Multi-Currency View */}
              {!convLoading && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {convAmount} {convFrom} in all currencies
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {ALL_CURRENCIES.map(c => {
                      if (!convRates[convFrom] || !convRates[c.code]) return null;
                      const result = (parseFloat(convAmount) / convRates[convFrom]) * convRates[c.code];
                      return (
                        <div key={c.code} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{c.flag}</span>
                            <div>
                              <p className="font-medium text-sm">{c.code}</p>
                              <p className="text-xs text-muted-foreground">{c.name}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-sm text-right">
                            {formatConvResult(result, c.code)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
