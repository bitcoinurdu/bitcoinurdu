import { useState, useEffect, useCallback, useRef } from 'react';

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

interface CoinsResponse {
  coins: LocalCoin[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  source: string;
  timestamp: string;
}

interface PriceResponse {
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  source: string;
}

interface PricesResponse {
  prices: Record<string, PriceResponse>;
  currency: string;
  count: number;
  timestamp: string;
}

let coinCache: LocalCoin[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 120000;

async function loadAllCoins(): Promise<LocalCoin[]> {
  if (coinCache && (Date.now() - cacheTimestamp) < CACHE_TTL) {
    return coinCache;
  }

  const res = await fetch('/data/coins-market.json', { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to load coins data: ${res.status}`);
  const data = await res.json();

  const allCoins: LocalCoin[] = [];
  for (const page of data.pages || []) {
    for (const coin of page.coins || []) {
      allCoins.push(coin);
    }
  }

  coinCache = allCoins;
  cacheTimestamp = Date.now();
  return allCoins;
}

function processCoins(
  allCoins: LocalCoin[],
  page: number,
  perPage: number,
  sort: string,
  order: string,
  search: string,
  filter: string
): { coins: LocalCoin[]; total: number; totalPages: number } {
  let coins = [...allCoins];

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

export function useCoins({ page = 1, perPage = 50, sort = 'market_cap_rank', order = 'asc', search = '', filter = 'all' } = {}) {
  const [coins, setCoins] = useState<LocalCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 50, total_pages: 1, source: 'local' });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchCoins = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const allCoins = await loadAllCoins();
      if (controller.signal.aborted) return;

      const result = processCoins(allCoins, page, perPage, sort, order, search, filter);
      setCoins(result.coins);
      setMeta({
        total: result.total,
        page,
        per_page: perPage,
        total_pages: result.totalPages,
        source: 'local',
      });
      setLastUpdated(new Date());
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [page, perPage, sort, order, search, filter]);

  useEffect(() => {
    fetchCoins();
    return () => { abortRef.current?.abort(); };
  }, [fetchCoins]);

  return { coins, loading, error, meta, lastUpdated, refetch: fetchCoins };
}

export function useCoinPrice(coinId: string | undefined, { autoRefresh = true, interval = 30000 } = {}) {
  const [price, setPrice] = useState<LocalCoin & { live_source?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrice = useCallback(async () => {
    if (!coinId) return;
    setLoading(true);
    setError(null);

    try {
      const allCoins = await loadAllCoins();
      const localCoin = allCoins.find((c) => c.id === coinId);

      if (!localCoin) {
        setError('Coin not found');
        setLoading(false);
        return;
      }

      let livePrice: PriceResponse | null = null;

      try {
        const cgRes = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (cgRes.ok) {
          const cgData = await cgRes.json();
          if (cgData[coinId]) {
            livePrice = {
              current_price: cgData[coinId].usd || 0,
              price_change_percentage_24h: cgData[coinId].usd_24h_change || 0,
              total_volume: cgData[coinId].usd_24h_vol || 0,
              market_cap: cgData[coinId].usd_market_cap || 0,
              source: 'coingecko',
            };
          }
        }
      } catch {}

      if (!livePrice) {
        try {
          const ccRes = await fetch(`https://api.coincap.io/v2/assets/${coinId}`, { signal: AbortSignal.timeout(5000) });
          if (ccRes.ok) {
            const ccData = await ccRes.json();
            if (ccData.data) {
              livePrice = {
                current_price: parseFloat(ccData.data.priceUsd) || 0,
                price_change_percentage_24h: parseFloat(ccData.data.changePercent24Hr) || 0,
                total_volume: parseFloat(ccData.data.volumeUsd24Hr) || 0,
                market_cap: parseFloat(ccData.data.marketCapUsd) || 0,
                source: 'coincap',
              };
            }
          }
        } catch {}
      }

      setPrice({
        ...localCoin,
        current_price: livePrice?.current_price || localCoin.current_price,
        price_change_percentage_24h: livePrice?.price_change_percentage_24h ?? localCoin.price_change_percentage_24h,
        total_volume: livePrice?.total_volume || localCoin.total_volume,
        market_cap: livePrice?.market_cap || localCoin.market_cap,
        live_source: livePrice?.source || 'cached',
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [coinId]);

  useEffect(() => {
    fetchPrice();
    if (autoRefresh && coinId) {
      const id = setInterval(fetchPrice, interval);
      return () => clearInterval(id);
    }
  }, [fetchPrice, autoRefresh, interval]);

  return { price, loading, error, lastUpdated, refetch: fetchPrice };
}

export function useLivePrices(coinIds: string[] | undefined, { autoRefresh = true, interval = 30000 } = {}) {
  const [prices, setPrices] = useState<Record<string, PriceResponse>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    if (!coinIds || coinIds.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const results: Record<string, PriceResponse> = {};

      const fetches = coinIds.map(async (id) => {
        try {
          const cgRes = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (cgRes.ok) {
            const cgData = await cgRes.json();
            if (cgData[id]) {
              results[id] = {
                current_price: cgData[id].usd || 0,
                price_change_percentage_24h: cgData[id].usd_24h_change || 0,
                total_volume: 0,
                market_cap: 0,
                source: 'coingecko',
              };
              return;
            }
          }
        } catch {}

        try {
          const ccRes = await fetch(`https://api.coincap.io/v2/assets/${id}`, { signal: AbortSignal.timeout(5000) });
          if (ccRes.ok) {
            const ccData = await ccRes.json();
            if (ccData.data) {
              results[id] = {
                current_price: parseFloat(ccData.data.priceUsd) || 0,
                price_change_percentage_24h: parseFloat(ccData.data.changePercent24Hr) || 0,
                total_volume: 0,
                market_cap: 0,
                source: 'coincap',
              };
            }
          }
        } catch {}
      });

      await Promise.allSettled(fetches);
      setPrices(results);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [coinIds?.join(',')]);

  useEffect(() => {
    fetchPrices();
    if (autoRefresh && coinIds && coinIds.length > 0) {
      const id = setInterval(fetchPrices, interval);
      return () => clearInterval(id);
    }
  }, [fetchPrices, autoRefresh, interval]);

  return { prices, loading, error, lastUpdated, refetch: fetchPrices };
}
