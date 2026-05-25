export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank?: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  lastUpdated: string;
}

export interface GlobalCryptoData {
  total_market_cap: number;
  total_volume: number;
  btc_dominance: number;
  eth_dominance: number;
  active_cryptocurrencies: number;
  lastUpdated: string;
}

const DEFAULT_BTC: CryptoPrice = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  current_price: 77000,
  market_cap: 1500000000000,
  total_volume: 35000000000,
  price_change_percentage_24h: 2.4,
  lastUpdated: new Date().toISOString(),
};

const DEFAULT_ETH: CryptoPrice = {
  id: 'ethereum',
  symbol: 'eth',
  name: 'Ethereum',
  image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  current_price: 2100,
  market_cap: 250000000000,
  total_volume: 15000000000,
  price_change_percentage_24h: 1.8,
  lastUpdated: new Date().toISOString(),
};

export async function fetchCryptoPrices(vsCurrency = 'usd', limit = 250): Promise<{ coins: CryptoPrice[]; global: GlobalCryptoData }> {
  const apiKey = process.env.COINGECKO_API_KEY;
  const baseUrl = apiKey
    ? 'https://pro-api.coingecko.com/api/v3'
    : 'https://api.coingecko.com/api/v3';

  try {
    const params = new URLSearchParams({
      vs_currency: vsCurrency,
      order: 'market_cap_desc',
      per_page: String(limit),
      page: '1',
      sparkline: 'false',
      price_change_percentage: '1h,24h,7d',
    });

    const headers: Record<string, string> = {};
    if (apiKey) headers['x-cg-pro-api-key'] = apiKey;

    const [coinsRes, globalRes] = await Promise.all([
      fetch(`${baseUrl}/coins/markets?${params.toString()}`, {
        headers,
        signal: AbortSignal.timeout(10000),
      }).then((r) => r.ok ? r.json() : null).catch(() => null),
      fetch(`${baseUrl}/global`, {
        signal: AbortSignal.timeout(10000),
      }).then((r) => r.ok ? r.json() : null).catch(() => null),
    ]);

    const coins: CryptoPrice[] = (coinsRes || []).map((c: Record<string, unknown>) => ({
      id: c.id as string,
      symbol: c.symbol as string,
      name: c.name as string,
      image: (c.image as string) || '',
      current_price: (c.current_price as number) || 0,
      market_cap: (c.market_cap as number) || 0,
      market_cap_rank: (c.market_cap_rank as number) || undefined,
      total_volume: (c.total_volume as number) || 0,
      price_change_percentage_24h: (c.price_change_percentage_24h as number) || 0,
      price_change_percentage_1h_in_currency: (c.price_change_percentage_1h_in_currency as number) || undefined,
      price_change_percentage_7d_in_currency: (c.price_change_percentage_7d_in_currency as number) || undefined,
      lastUpdated: new Date().toISOString(),
    }));

    const globalData = globalRes?.data as Record<string, unknown> | undefined;
    const global: GlobalCryptoData = {
      total_market_cap: (globalData?.total_market_cap as Record<string, number>)?.usd || 0,
      total_volume: (globalData?.total_volume as Record<string, number>)?.usd || 0,
      btc_dominance: (globalData?.market_cap_percentage as Record<string, number>)?.btc || 0,
      eth_dominance: (globalData?.market_cap_percentage as Record<string, number>)?.eth || 0,
      active_cryptocurrencies: (globalData?.active_cryptocurrencies as number) || 0,
      lastUpdated: new Date().toISOString(),
    };

    return { coins: coins.length > 0 ? coins : [DEFAULT_BTC, DEFAULT_ETH], global };
  } catch {
    return {
      coins: [DEFAULT_BTC, DEFAULT_ETH],
      global: {
        total_market_cap: 2500000000000,
        total_volume: 100000000000,
        btc_dominance: 54,
        eth_dominance: 17,
        active_cryptocurrencies: 15984,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}

export async function fetchLocalCryptoData(): Promise<CryptoPrice[]> {
  try {
    const res = await fetch('/data/coins-market.json', {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [DEFAULT_BTC, DEFAULT_ETH];

    const data = await res.json();
    const allCoins: CryptoPrice[] = [];
    for (const page of data.pages || []) {
      for (const coin of page.coins || []) {
        allCoins.push({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image || '',
          current_price: coin.current_price || 0,
          market_cap: coin.market_cap || 0,
          total_volume: coin.total_volume || 0,
          price_change_percentage_24h: coin.price_change_percentage_24h || 0,
          lastUpdated: data.last_updated || new Date().toISOString(),
        });
      }
    }
    return allCoins.length > 0 ? allCoins : [DEFAULT_BTC, DEFAULT_ETH];
  } catch {
    return [DEFAULT_BTC, DEFAULT_ETH];
  }
}

export async function fetchCoinHistory(coinId: string, days = 7, vsCurrency = 'usd'): Promise<{ prices: [number, number][] }> {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const baseUrl = apiKey ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3';
    const headers: Record<string, string> = {};
    if (apiKey) headers['x-cg-pro-api-key'] = apiKey;

    const res = await fetch(
      `${baseUrl}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`,
      { headers, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) throw new Error(`CoinGecko history: ${res.status}`);
    const data = await res.json();
    return { prices: data.prices || [] };
  } catch {
    return { prices: [] };
  }
}

export async function fetchGlobalMarketData(): Promise<GlobalCryptoData> {
  const result = await fetchCryptoPrices('usd', 1);
  return result.global;
}

export async function fetchCoins(page = 1, limit = 250, _vsCurrency = 'usd'): Promise<CryptoPrice[]> {
  const result = await fetchCryptoPrices(_vsCurrency, limit);
  return result.coins.map((c) => ({
    ...c,
    image: c.image || '',
  }));
}

export async function fetchGainersLosers(_vsCurrency = 'usd', limit = 250): Promise<{ gainers: CryptoPrice[]; losers: CryptoPrice[] }> {
  const result = await fetchCryptoPrices(_vsCurrency, limit);
  const sorted = [...result.coins].filter((c) => c.price_change_percentage_24h !== 0);
  const gainers = sorted.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 10);
  const losers = sorted.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 10);
  return { gainers, losers };
}

export async function fetchTrendingCoins(): Promise<CryptoPrice[]> {
  const result = await fetchCryptoPrices('usd', 50);
  return result.coins.slice(0, 10).map((c) => ({ ...c, image: c.image || '' }));
}
