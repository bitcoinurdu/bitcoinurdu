import { fetchGoldRates, type GoldRates } from './gold';
import { fetchFiatRates, type FiatRates } from './fiat';
import { fetchCryptoPrices, fetchLocalCryptoData, type CryptoPrice, type GlobalCryptoData } from './crypto';

export interface UnifiedRates {
  gold: GoldRates;
  fiat: FiatRates;
  crypto: { coins: CryptoPrice[]; global: GlobalCryptoData };
  lastUpdated: string;
  source: 'live' | 'cached' | 'fallback';
}

const DEFAULT_RATES: UnifiedRates = {
  gold: {
    gold_24k_per_oz: 2650,
    gold_22k_per_oz: 2430,
    gold_21k_per_oz: 2319,
    gold_18k_per_oz: 1988,
    gold_per_gram_24k: 85.20,
    silver_per_oz: 30.50,
    silver_per_gram: 0.98,
    lastUpdated: new Date().toISOString(),
  },
  fiat: {
    usd_pkr: 278,
    usd_eur: 0.92,
    usd_gbp: 0.79,
    usd_aed: 3.6725,
    usd_sar: 3.75,
    lastUpdated: new Date().toISOString(),
  },
  crypto: {
    coins: [
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 77000, market_cap: 1500000000000, total_volume: 35000000000, price_change_percentage_24h: 2.4, lastUpdated: new Date().toISOString() },
      { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 2100, market_cap: 250000000000, total_volume: 15000000000, price_change_percentage_24h: 1.8, lastUpdated: new Date().toISOString() },
    ],
    global: {
      total_market_cap: 2500000000000,
      total_volume: 100000000000,
      btc_dominance: 54,
      eth_dominance: 17,
      active_cryptocurrencies: 15984,
      lastUpdated: new Date().toISOString(),
    },
  },
  lastUpdated: new Date().toISOString(),
  source: 'fallback',
};

const CACHE_KEY = 'bu_rates_cache';
const CACHE_TTL = 5 * 60 * 1000;

function getCachedRates(): UnifiedRates | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { data: UnifiedRates; timestamp: number };
    if (Date.now() - cached.timestamp > CACHE_TTL) return null;
    return cached.data;
  } catch {
    return null;
  }
}

function setCachedRates(data: UnifiedRates): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export async function fetchAllRates(): Promise<UnifiedRates> {
  const cached = getCachedRates();

  try {
    const [gold, fiat, crypto] = await Promise.all([
      fetchGoldRates(),
      fetchFiatRates(),
      fetchCryptoPrices('usd', 100),
    ]);

    const rates: UnifiedRates = {
      gold,
      fiat,
      crypto,
      lastUpdated: new Date().toISOString(),
      source: 'live',
    };

    setCachedRates(rates);
    return rates;
  } catch {
    if (cached) {
      return { ...cached, source: 'cached' };
    }

    try {
      const localCoins = await fetchLocalCryptoData();
      return {
        ...DEFAULT_RATES,
        crypto: {
          coins: localCoins.slice(0, 100),
          global: DEFAULT_RATES.crypto.global,
        },
        source: 'fallback',
      };
    } catch {
      return DEFAULT_RATES;
    }
  }
}

export function getConverterRates(): Record<string, number> {
  const cached = getCachedRates();
  if (cached) {
    return {
      usd: 1,
      pkr: cached.fiat.usd_pkr,
      eur: cached.fiat.usd_eur,
      gbp: cached.fiat.usd_gbp,
      aed: cached.fiat.usd_aed,
      sar: cached.fiat.usd_sar,
      gold: cached.gold.gold_24k_per_oz,
      silver: cached.gold.silver_per_oz,
    };
  }

  return {
    usd: 1,
    pkr: 278,
    eur: 0.92,
    gbp: 0.79,
    aed: 3.6725,
    sar: 3.75,
    gold: 2650,
    silver: 30.50,
  };
}
