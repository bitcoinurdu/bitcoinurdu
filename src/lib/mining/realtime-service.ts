'use client';

import type { MiningHardware } from '@/lib/mining/data';

const BTC_DIFFICULTY_URL = 'https://mempool.space/api/v1/difficulty-adjustment';
const FALLBACK_BTC_DIFFICULTY = 92300000000000;

interface PriceCache { usd: number; usd_24h_change?: number; ts: number; }
interface DifficultyCache { difficulty: number; blockReward: number; ts: number; source: 'live' | 'fallback'; }

const priceCache: Record<string, PriceCache> = {};
const diffCache: Record<string, DifficultyCache> = {};
const PRICE_TTL = 120000;
const DIFF_TTL = 300000;

export const REFERENCE_PRICES: Record<string, number> = {
  BTC: 65000, BCH: 350, LTC: 80, DOGE: 0.08, KAS: 0.15,
  ZEC: 30, DASH: 30, XMR: 150, ETC: 20, ZEN: 10,
  INI: 50, ALEO: 3, ALPH: 2, XTM: 0.5,
};

export async function fetchBTCData(): Promise<DifficultyCache> {
  if (diffCache.bitcoin && Date.now() - diffCache.bitcoin.ts < DIFF_TTL) return diffCache.bitcoin;
  try {
    const res = await fetch(BTC_DIFFICULTY_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('mempool fail');
    const d = await res.json();
    const result: DifficultyCache = { difficulty: d.difficulty || FALLBACK_BTC_DIFFICULTY, blockReward: 3.125, ts: Date.now(), source: 'live' };
    diffCache.bitcoin = result;
    return result;
  } catch {
    const f = diffCache.bitcoin?.source === 'live' ? diffCache.bitcoin : { difficulty: FALLBACK_BTC_DIFFICULTY, blockReward: 3.125, ts: Date.now(), source: 'fallback' as const };
    diffCache.bitcoin = f;
    return f;
  }
}

export async function fetchCoinPriceWithCache(coinId: string): Promise<PriceCache | null> {
  const cached = priceCache[coinId];
  if (cached && Date.now() - cached.ts < PRICE_TTL) return cached;
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('coingecko fail');
    const data = await res.json();
    if (data[coinId]) {
      const result: PriceCache = { usd: data[coinId].usd, usd_24h_change: data[coinId].usd_24h_change, ts: Date.now() };
      priceCache[coinId] = result;
      return result;
    }
    return null;
  } catch {
    return cached || null;
  }
}

const GLOBAL_ELECTRICITY_RATE = 0.08;

function normalizeToTH(hashrate: number, unit: string): number {
  switch (unit) {
    case 'PH/s': return hashrate * 1000;
    case 'TH/s': return hashrate;
    case 'GH/s': return hashrate / 1000;
    case 'MH/s': return hashrate / 1e6;
    case 'KH/s': return hashrate / 1e9;
    default: return hashrate;
  }
}

function normalizeToHs(hashrate: number, unit: string): number {
  switch (unit) {
    case 'PH/s': return hashrate * 1e15;
    case 'TH/s': return hashrate * 1e12;
    case 'GH/s': return hashrate * 1e9;
    case 'MH/s': return hashrate * 1e6;
    case 'KH/s': return hashrate * 1e3;
    default: return hashrate;
  }
}

const COIN_NETWORK_DATA: Record<string, { networkHPS: number; blockTimeSec: number; blockReward: number }> = {
  BTC: { networkHPS: 750e18, blockTimeSec: 600, blockReward: 3.125 },
  KAS: { networkHPS: 850e18, blockTimeSec: 1, blockReward: 56.94 },
  ZEC: { networkHPS: 16.4e15, blockTimeSec: 75, blockReward: 1.25 },
  ALPH: { networkHPS: 3.5e15, blockTimeSec: 120, blockReward: 0.625 },
  ETC: { networkHPS: 3e15, blockTimeSec: 13, blockReward: 2.56 },
  LTC: { networkHPS: 800e12, blockTimeSec: 150, blockReward: 6.25 },
  DOGE: { networkHPS: 900e12, blockTimeSec: 60, blockReward: 10000 },
  KDA: { networkHPS: 500e15, blockTimeSec: 1, blockReward: 0.53 },
  ZEN: { networkHPS: 5e9, blockTimeSec: 150, blockReward: 2.5 },
  RXD: { networkHPS: 10e12, blockTimeSec: 60, blockReward: 375 },
  NEXA: { networkHPS: 50e12, blockTimeSec: 10, blockReward: 10000 },
  SC: { networkHPS: 800e15, blockTimeSec: 10, blockReward: 31250 },
  CKB: { networkHPS: 300e12, blockTimeSec: 17, blockReward: 431 },
  ALEO: { networkHPS: 200e12, blockTimeSec: 10, blockReward: 23.5 },
};

export function calcGrossDaily(hardware: MiningHardware, coinPriceUsd: number, btcDifficulty: number, btcBlockReward: number, electricityRate?: number): {
  grossUsd: number; powerCostUsd: number; netDailyUsd: number; paybackDays: number; earningsBtc: number;
} {
  const primaryTicker = hardware.coins[0]?.ticker || 'BTC';
  const rate = electricityRate !== undefined && Number.isFinite(electricityRate) && electricityRate > 0 ? electricityRate : GLOBAL_ELECTRICITY_RATE;
  const powerWatts = Number.isFinite(hardware.power) && hardware.power > 0 ? hardware.power : 0;
  const dailyElectricity = (powerWatts / 1000) * 24 * rate;
  const minerPrice = Number.isFinite(hardware.cost) && hardware.cost > 0 ? hardware.cost : 0;

  const networkData = COIN_NETWORK_DATA[primaryTicker];
  if (networkData) {
    const minerHs = normalizeToHs(hardware.hashrate, hardware.hashrateUnit);
    if (minerHs > 0 && networkData.networkHPS > 0 && networkData.blockTimeSec > 0) {
      const minerShare = minerHs / networkData.networkHPS;
      const blocksPerDay = 86400 / networkData.blockTimeSec;
      const dailyGross = minerShare * blocksPerDay * networkData.blockReward * coinPriceUsd;
      const dailyNetProfit = dailyGross - dailyElectricity;
      const paybackDays = dailyNetProfit > 0.01 && minerPrice > 0 ? Math.ceil(minerPrice / dailyNetProfit) : 9999;
      return { grossUsd: dailyGross, powerCostUsd: dailyElectricity, netDailyUsd: dailyNetProfit, paybackDays, earningsBtc: dailyGross > 0 && coinPriceUsd > 0 ? dailyGross / coinPriceUsd : 0 };
    }
  }

  if (primaryTicker === 'BTC') {
    const hashrateTH = normalizeToTH(hardware.hashrate, hardware.hashrateUnit);
    const hashrateInHps = Number.isFinite(hashrateTH) && hashrateTH > 0 ? hashrateTH * 1e12 : 0;
    const sanitizedDifficulty = Number.isFinite(btcDifficulty) && btcDifficulty > 0 ? btcDifficulty : 92300000000000;
    const sanitizedReward = Number.isFinite(btcBlockReward) && btcBlockReward > 0 ? btcBlockReward : 3.125;
    const sanitizedPrice = Number.isFinite(coinPriceUsd) && coinPriceUsd > 0 ? coinPriceUsd : 65000;
    const dailyGross = hashrateInHps > 0
      ? (hashrateInHps * 86400 * sanitizedReward) / (sanitizedDifficulty * Math.pow(2, 32)) * sanitizedPrice
      : 0;
    const dailyNetProfit = dailyGross - dailyElectricity;
    const paybackDays = dailyNetProfit > 0.01 && minerPrice > 0 ? Math.ceil(minerPrice / dailyNetProfit) : 9999;
    return { grossUsd: dailyGross, powerCostUsd: dailyElectricity, netDailyUsd: dailyNetProfit, paybackDays, earningsBtc: dailyGross > 0 && sanitizedPrice > 0 ? dailyGross / sanitizedPrice : 0 };
  }

  const grossUsd = hardware.dailyProfit > 0 ? hardware.dailyProfit : 0;
  const dailyNetProfit = grossUsd - dailyElectricity;
  const paybackDays = dailyNetProfit > 0.01 && minerPrice > 0 ? Math.ceil(minerPrice / dailyNetProfit) : 9999;
  return { grossUsd, powerCostUsd: dailyElectricity, netDailyUsd: dailyNetProfit, paybackDays, earningsBtc: 0 };
}

export const MANUFACTURER_STYLES: Record<string, string> = {
  BITMAIN: 'bg-orange-600 text-white',
  MICROBT: 'bg-blue-600 text-white',
  WHATSMINER: 'bg-blue-500 text-white',
  CANAAN: 'bg-green-600 text-white',
  AVALON: 'bg-green-500 text-white',
  JASMINER: 'bg-purple-600 text-white',
  GOLDSHELL: 'bg-yellow-500 text-black',
  ICERIVER: 'bg-cyan-600 text-white',
  ELPHAPEX: 'bg-red-600 text-white',
  VOLCMINER: 'bg-indigo-600 text-white',
  FLUMINER: 'bg-pink-600 text-white',
  SEALMINER: 'bg-emerald-600 text-white',
  BITAXE: 'bg-lime-600 text-white',
  NERDMINER: 'bg-violet-600 text-white',
  PINECONE: 'bg-amber-600 text-white',
  BITDEER: 'bg-teal-600 text-white',
  INNOSILICON: 'bg-rose-600 text-white',
  BRAIINS: 'bg-sky-600 text-white',
  PLEBSOURCE: 'bg-stone-600 text-white',
  LUCKY: 'bg-red-500 text-white',
  JINGLE: 'bg-green-700 text-white',
  AURADINE: 'bg-blue-700 text-white',
  BOMBAX: 'bg-gray-700 text-white',
  DIGITAL: 'bg-amber-800 text-white',
};

export function getMfrStyle(mfr: string): string {
  const key = mfr.toUpperCase().replace(/[^A-Z0-9]/g, '');
  for (const [k, v] of Object.entries(MANUFACTURER_STYLES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return 'bg-muted text-muted-foreground';
}

export function getMfrInitials(mfr: string): string {
  return mfr.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
}
