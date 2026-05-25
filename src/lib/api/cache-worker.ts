import { fetchGoldRates, type GoldRates } from './gold';
import { fetchFiatRates, type FiatRates } from './fiat';
import { fetchCryptoPrices, type GlobalCryptoData } from './crypto';

export interface CacheEntry {
  key: string;
  value: unknown;
  updated_at: string;
}

export async function refreshLocalCache(): Promise<{ success: boolean; message: string }> {
  try {
    const [gold, fiat, crypto] = await Promise.all([
      fetchGoldRates(),
      fetchFiatRates(),
      fetchCryptoPrices('usd', 100),
    ]);

    const now = new Date().toISOString();

    const cacheData: Record<string, unknown> = {
      gold,
      fiat,
      crypto: { coins: crypto.coins.slice(0, 100), global: crypto.global },
      updated_at: now,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('bu_rates_cache_v2', JSON.stringify(cacheData));
    }

    return { success: true, message: 'Cache refreshed successfully' };
  } catch (err) {
    return { success: false, message: `Cache refresh failed: ${err}` };
  }
}

export function getCachedRates(): Record<string, unknown> | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('bu_rates_cache_v2');
    if (!raw) return null;
    const cached = JSON.parse(raw) as { updated_at: string };
    const age = Date.now() - new Date(cached.updated_at).getTime();
    if (age > 10 * 60 * 1000) return null;
    return cached;
  } catch {
    return null;
  }
}
