import fs from 'fs';
import path from 'path';

export interface LocalCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null;
  last_updated: string;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
}

export interface LocalCoinsData {
  allCoins: LocalCoin[];
  totalCoins: number;
  totalPages: number;
  totalMarketCap: number;
  totalVolume: number;
  lastUpdated: string;
}

let cachedData: LocalCoinsData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000;

function loadCoinsFromJson(): LocalCoinsData | null {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const coinsFile = path.join(dataDir, 'coins-market.json');

    if (!fs.existsSync(coinsFile)) {
      console.warn('[LocalData] coins-market.json not found');
      return null;
    }

    const raw = fs.readFileSync(coinsFile, 'utf-8');
    const parsed = JSON.parse(raw);

    const allCoins: LocalCoin[] = [];
    for (const page of parsed.pages || []) {
      for (const coin of page.coins || []) {
        allCoins.push(coin as LocalCoin);
      }
    }

    const totalMarketCap = allCoins.reduce((sum, c) => sum + (c.market_cap || 0), 0);
    const totalVolume = allCoins.reduce((sum, c) => sum + (c.total_volume || 0), 0);

    return {
      allCoins,
      totalCoins: allCoins.length,
      totalPages: parsed.totalPages || 0,
      totalMarketCap,
      totalVolume,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch (err) {
    console.error('[LocalData] Failed to load coins-market.json:', err);
    return null;
  }
}

export function getLocalCoinsData(forceRefresh = false): LocalCoinsData | null {
  const now = Date.now();

  if (cachedData && !forceRefresh && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedData;
  }

  const data = loadCoinsFromJson();
  if (data) {
    cachedData = data;
    cacheTimestamp = now;
  }

  return cachedData;
}

export function getLocalCoinById(coinId: string): LocalCoin | null {
  const data = getLocalCoinsData();
  if (!data) return null;
  return data.allCoins.find((c) => c.id === coinId) || null;
}

export function getLocalCoinsPage(
  page: number,
  perPage: number,
  sort: string,
  order: string,
  search: string,
  filter: string
): { coins: LocalCoin[]; total: number; totalPages: number } {
  const data = getLocalCoinsData();
  if (!data) return { coins: [], total: 0, totalPages: 0 };

  let coins = [...data.allCoins];

  if (search) {
    const q = search.toLowerCase();
    coins = coins.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    );
  }

  if (filter === 'gainers') {
    coins = coins.filter((c) => (c.price_change_percentage_24h || 0) > 5);
  } else if (filter === 'losers') {
    coins = coins.filter((c) => (c.price_change_percentage_24h || 0) < -5);
  }

  const validSorts = ['market_cap_rank', 'current_price', 'price_change_percentage_24h', 'market_cap', 'total_volume', 'price_change_percentage_1h_in_currency', 'price_change_percentage_7d_in_currency'];
  const sortKey = validSorts.includes(sort) ? sort : 'market_cap_rank';

  coins.sort((a, b) => {
    const aVal = (a as unknown as Record<string, unknown>)[sortKey] as number | null | undefined;
    const bVal = (b as unknown as Record<string, unknown>)[sortKey] as number | null | undefined;
    const aNum = aVal ?? 999999999;
    const bNum = bVal ?? 999999999;
    return order === 'desc' ? bNum - aNum : aNum - bNum;
  });

  const total = coins.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const pagedCoins = coins.slice(start, start + perPage);

  return { coins: pagedCoins, total, totalPages };
}
