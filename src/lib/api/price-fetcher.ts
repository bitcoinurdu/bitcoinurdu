// Multi-API price fetcher with fallback chain
// Uses CoinGecko → CoinCap → Binance → DexScreener → MEXC

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  image?: string;
  circulating_supply?: number;
  max_supply?: number | null;
  price_change_percentage_1h?: number;
  price_change_percentage_7d?: number;
}

type ApiSource = 'coingecko' | 'coincap' | 'binance' | 'dexscreener' | 'mexc';

interface PriceFetchResult {
  coins: CoinPrice[];
  source: ApiSource;
  timestamp: string;
  count: number;
}

export function getPriceOverrides(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('bu_admin_price_overrides');
    if (!raw) return {};
    const overrides: Array<{ coin_id: string; override_price: number; locked: boolean }> = JSON.parse(raw);
    const map: Record<string, number> = {};
    for (const o of overrides) {
      map[o.coin_id] = o.override_price;
    }
    return map;
  } catch {
    return {};
  }
}

export function applyPriceOverrides(coins: CoinPrice[]): CoinPrice[] {
  const overrides = getPriceOverrides();
  if (Object.keys(overrides).length === 0) return coins;
  return coins.map((c) => {
    const override = overrides[c.id];
    if (override !== undefined) {
      return { ...c, current_price: override };
    }
    return c;
  });
}

// CoinGecko - Primary source (detailed data)
async function fetchFromCoinGecko(currency = 'usd', limit = 250): Promise<PriceFetchResult | null> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      coins: data.map((c: Record<string, unknown>) => ({
        id: c.id as string,
        symbol: (c.symbol as string).toLowerCase(),
        name: c.name as string,
        current_price: c.current_price as number,
        price_change_percentage_24h: c.price_change_percentage_24h as number,
        market_cap: c.market_cap as number,
        total_volume: c.total_volume as number,
        market_cap_rank: c.market_cap_rank as number,
        image: c.image as string,
        circulating_supply: c.circulating_supply as number,
        max_supply: c.max_supply as number | null,
        price_change_percentage_1h: c.price_change_percentage_1h_in_currency as number,
        price_change_percentage_7d: c.price_change_percentage_7d_in_currency as number,
      })),
      source: 'coingecko',
      timestamp: new Date().toISOString(),
      count: data.length,
    };
  } catch {
    return null;
  }
}

// CoinCap - Fallback 1 (free, no rate limit)
async function fetchFromCoinCap(limit = 250): Promise<PriceFetchResult | null> {
  try {
    const res = await fetch(
      `https://api.coincap.io/v2/assets?limit=${limit}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      coins: (data.data || []).map((c: Record<string, string>, i: number) => ({
        id: c.id,
        symbol: c.symbol.toLowerCase(),
        name: c.name,
        current_price: parseFloat(c.priceUsd) || 0,
        price_change_percentage_24h: parseFloat(c.changePercent24Hr) || 0,
        market_cap: parseFloat(c.marketCapUsd) || 0,
        total_volume: parseFloat(c.volumeUsd24Hr) || 0,
        market_cap_rank: parseInt(c.rank) || i + 1,
        circulating_supply: parseFloat(c.supply) || 0,
        max_supply: c.maxSupply ? parseFloat(c.maxSupply) : null,
      })),
      source: 'coincap',
      timestamp: new Date().toISOString(),
      count: data.data?.length || 0,
    };
  } catch {
    return null;
  }
}

// Binance - Fallback 2 (top coins only)
async function fetchFromBinance(): Promise<PriceFetchResult | null> {
  try {
    const res = await fetch(
      'https://api.binance.com/api/v3/ticker/24hr',
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const usdtPairs = (data as Record<string, string>[])
      .filter((t) => t.symbol.endsWith('USDT') && !t.symbol.includes('UP') && !t.symbol.includes('DOWN'))
      .slice(0, 250)
      .map((t, i) => {
        const symbol = t.symbol.replace('USDT', '').toLowerCase();
        return {
          id: symbol,
          symbol,
          name: symbol.toUpperCase(),
          current_price: parseFloat(t.lastPrice) || 0,
          price_change_percentage_24h: parseFloat(t.priceChangePercent) || 0,
          market_cap: 0,
          total_volume: parseFloat(t.quoteVolume) || 0,
          market_cap_rank: i + 1,
        };
      });

    return {
      coins: usdtPairs,
      source: 'binance',
      timestamp: new Date().toISOString(),
      count: usdtPairs.length,
    };
  } catch {
    return null;
  }
}

// DexScreener - Fallback 3 (DEX prices)
async function fetchFromDexScreener(): Promise<PriceFetchResult | null> {
  try {
    const res = await fetch(
      'https://api.dexscreener.com/latest/dex/search?q=',
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const coins: CoinPrice[] = [];
    const seen = new Set<string>();

    for (const pair of data.pairs || []) {
      if (!pair.baseToken?.symbol || seen.has(pair.baseToken.symbol.toLowerCase())) continue;
      seen.add(pair.baseToken.symbol.toLowerCase());
      if (coins.length >= 250) break;

      coins.push({
        id: pair.baseToken.symbol.toLowerCase(),
        symbol: pair.baseToken.symbol.toLowerCase(),
        name: pair.baseToken.name || pair.baseToken.symbol,
        current_price: parseFloat(pair.priceUsd) || 0,
        price_change_percentage_24h: pair.priceChange?.h24 ? parseFloat(pair.priceChange.h24) : 0,
        market_cap: 0,
        total_volume: parseFloat(pair.volume?.h24) || 0,
        market_cap_rank: coins.length + 1,
      });
    }

    return {
      coins,
      source: 'dexscreener',
      timestamp: new Date().toISOString(),
      count: coins.length,
    };
  } catch {
    return null;
  }
}

// MEXC - Fallback 4
async function fetchFromMEXC(): Promise<PriceFetchResult | null> {
  try {
    const res = await fetch(
      'https://api.mexc.com/api/v3/ticker/24hr',
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const usdtPairs = (data as Record<string, string>[])
      .filter((t) => t.symbol.endsWith('USDT'))
      .slice(0, 250)
      .map((t, i) => ({
        id: t.symbol.replace('USDT', '').toLowerCase(),
        symbol: t.symbol.replace('USDT', '').toLowerCase(),
        name: t.symbol.replace('USDT', ''),
        current_price: parseFloat(t.lastPrice) || 0,
        price_change_percentage_24h: parseFloat(t.priceChangePercent) || 0,
        market_cap: 0,
        total_volume: parseFloat(t.quoteVolume) || 0,
        market_cap_rank: i + 1,
      }));

    return {
      coins: usdtPairs,
      source: 'mexc',
      timestamp: new Date().toISOString(),
      count: usdtPairs.length,
    };
  } catch {
    return null;
  }
}

// Main fetcher with fallback chain
export async function fetchCoinPrices(currency = 'usd', limit = 250): Promise<PriceFetchResult | null> {
  // Try CoinGecko first
  const coingecko = await fetchFromCoinGecko(currency, limit);
  if (coingecko && coingecko.coins.length > 0) return coingecko;

  // Try CoinCap
  const coincap = await fetchFromCoinCap(limit);
  if (coincap && coincap.coins.length > 0) return coincap;

  // Try Binance
  const binance = await fetchFromBinance();
  if (binance && binance.coins.length > 0) return binance;

  // Try DexScreener
  const dexscreener = await fetchFromDexScreener();
  if (dexscreener && dexscreener.coins.length > 0) return dexscreener;

  // Try MEXC
  const mexc = await fetchFromMEXC();
  if (mexc && mexc.coins.length > 0) return mexc;

  return null;
}

// Fetch single coin price from multiple sources
export async function fetchSingleCoinPrice(coinId: string): Promise<CoinPrice | null> {
  // Try CoinGecko first
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.id,
        symbol: data.symbol.toLowerCase(),
        name: data.name,
        current_price: data.market_data?.current_price?.usd || 0,
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
        market_cap: data.market_data?.market_cap?.usd || 0,
        total_volume: data.market_data?.total_volume?.usd || 0,
        market_cap_rank: data.market_cap_rank || 0,
        image: data.image?.large,
        circulating_supply: data.market_data?.circulating_supply,
        max_supply: data.market_data?.max_supply,
      };
    }
  } catch {}

  // Try CoinCap
  try {
    const res = await fetch(`https://api.coincap.io/v2/assets/${coinId}`, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const data = await res.json();
      const c = data.data;
      return {
        id: c.id,
        symbol: c.symbol.toLowerCase(),
        name: c.name,
        current_price: parseFloat(c.priceUsd) || 0,
        price_change_percentage_24h: parseFloat(c.changePercent24Hr) || 0,
        market_cap: parseFloat(c.marketCapUsd) || 0,
        total_volume: parseFloat(c.volumeUsd24Hr) || 0,
        market_cap_rank: parseInt(c.rank) || 0,
        circulating_supply: parseFloat(c.supply) || 0,
        max_supply: c.maxSupply ? parseFloat(c.maxSupply) : null,
      };
    }
  } catch {}

  // Try Binance
  try {
    const symbol = coinId.toUpperCase() + 'USDT';
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const data = await res.json();
      return {
        id: coinId.toLowerCase(),
        symbol: coinId.toLowerCase(),
        name: coinId.toUpperCase(),
        current_price: parseFloat(data.lastPrice) || 0,
        price_change_percentage_24h: parseFloat(data.priceChangePercent) || 0,
        market_cap: 0,
        total_volume: parseFloat(data.quoteVolume) || 0,
        market_cap_rank: 0,
      };
    }
  } catch {}

  return null;
}
