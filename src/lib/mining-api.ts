export interface MiningApiRate {
  usd: number;
  btc: number;
  usd_24h_change?: number;
}

const rateCache: Record<string, { data: MiningApiRate; ts: number }> = {};
const CACHE_TTL = 120000;

export async function fetchCoinPrice(coinId: string): Promise<MiningApiRate | null> {
  const cached = rateCache[coinId];
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd,btc&include_24hr_change=true`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error('CoinGecko fetch failed');
    const data = await res.json();
    if (data[coinId]) {
      const result: MiningApiRate = {
        usd: data[coinId].usd,
        btc: data[coinId].btc,
        usd_24h_change: data[coinId].usd_24h_change,
      };
      rateCache[coinId] = { data: result, ts: Date.now() };
      return result;
    }
    return null;
  } catch {
    return cached?.data || null;
  }
}

export interface MiningProfitCalc {
  coinPrice: number;
  earningsBtc: number;
  earningsUsd: number;
  powerCostUsd: number;
  netDailyUsd: number;
  netMonthlyUsd: number;
  paybackDays: number;
}

export function calcMiningProfit(
  hashrate: number,
  hashrateUnit: string,
  powerWatts: number,
  coinPriceUsd: number,
  networkDifficulty: number,
  blockReward: number,
  elecRate: number
): MiningProfitCalc {
  const hashrateTh = normalizeToTH(s(hashrate, hashrateUnit));
  const earningsBtc = (hashrateTh * 86400 * blockReward) / (networkDifficulty * 2 ** 32);
  const earningsUsd = earningsBtc * coinPriceUsd;
  const powerCostUsd = (powerWatts / 1000) * 24 * elecRate;
  const netDailyUsd = earningsUsd - powerCostUsd;
  const netMonthlyUsd = netDailyUsd * 30;
  const paybackDays = netDailyUsd > 0 ? Math.ceil(coinPriceUsd / netDailyUsd) : 9999;

  return { coinPrice: coinPriceUsd, earningsBtc, earningsUsd, powerCostUsd, netDailyUsd, netMonthlyUsd, paybackDays };
}

function s(val: number, unit: string): { val: number; unit: string } {
  return { val, unit };
}

function normalizeToTH(input: { val: number; unit: string }): number {
  switch (input.unit) {
    case 'PH/s': return input.val * 1000;
    case 'TH/s': return input.val;
    case 'GH/s': return input.val / 1000;
    case 'MH/s': return input.val / 1000000;
    case 'KH/s': return input.val / 1000000000;
    default: return input.val;
  }
}

export const DIFFICULTY_FALLBACKS: Record<string, { difficulty: number; blockReward: number }> = {
  bitcoin: { difficulty: 92300000000000, blockReward: 3.125 },
  litecoin: { difficulty: 12000000, blockReward: 6.25 },
  kaspa: { difficulty: 200000000000, blockReward: 130 },
  ethereum: { difficulty: 0, blockReward: 0 },
};

export const COIN_MAP: Record<string, { coingeckoId: string; tag: string }> = {
  BTC: { coingeckoId: 'bitcoin', tag: 'BTC' },
  BCH: { coingeckoId: 'bitcoin-cash', tag: 'BCH' },
  LTC: { coingeckoId: 'litecoin', tag: 'LTC' },
  DOGE: { coingeckoId: 'dogecoin', tag: 'DOGE' },
  KAS: { coingeckoId: 'kaspa', tag: 'KAS' },
  ETH: { coingeckoId: 'ethereum', tag: 'ETH' },
  ZEC: { coingeckoId: 'zcash', tag: 'ZEC' },
  DASH: { coingeckoId: 'dash', tag: 'DASH' },
  XMR: { coingeckoId: 'monero', tag: 'XMR' },
  ETC: { coingeckoId: 'ethereum-classic', tag: 'ETC' },
  ZEN: { coingeckoId: 'horizen', tag: 'ZEN' },
  INI: { coingeckoId: 'initverse', tag: 'INI' },
};

export interface MinerEntry {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  coin: string;
  algorithm: string;
  hashrate: number;
  hashrateUnit: string;
  power: number;
  powerUnit: string;
  price: number;
  earnings24h: number;
  electricityCost24h: number;
  netProfit24h: number;
  releaseDate: string;
  category: string;
  noise: string;
  weight: string;
  dimensions: string;
  cooling: string;
  specs: string[];
  coins: { ticker: string; name: string }[];
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function calcElec(power: number, rate: number): number {
  return (power / 1000) * 24 * rate;
}

export const ELEC_RATE = 0.08;

export const HARDWARE_MATRIX: MinerEntry[] = [
  {
    id: 'antminer-z15-pro-840kh', slug: 'antminer-z15-pro-840kh',
    name: 'Antminer Z15 Pro (840kh)', manufacturer: 'Bitmain', coin: 'ZEC+ZEN', algorithm: 'Equihash',
    hashrate: 840, hashrateUnit: 'KH/s', power: 2780, powerUnit: 'W', price: 3999,
    earnings24h: 51.89, electricityCost24h: calcElec(2780, ELEC_RATE), netProfit24h: 51.89 - calcElec(2780, ELEC_RATE),
    releaseDate: 'Jun 2023', category: 'PROFESSIONAL', noise: '75dB', weight: '14200g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['Equihash Algorithm', 'ZEC/ZEN Mining', 'Air Cooled'], coins: [{ ticker: 'ZEC', name: 'Zcash' }, { ticker: 'ZEN', name: 'Horizen' }],
  },
  {
    id: 'antminer-x9-1mh', slug: 'antminer-x9-1mh',
    name: 'Antminer X9 (1Mh)', manufacturer: 'Bitmain', coin: 'XMR', algorithm: 'RandomX',
    hashrate: 1, hashrateUnit: 'MH/s', power: 2472, powerUnit: 'W', price: 5360,
    earnings24h: 30.15, electricityCost24h: calcElec(2472, ELEC_RATE), netProfit24h: 30.15 - calcElec(2472, ELEC_RATE),
    releaseDate: 'Jul 2026', category: 'PROFESSIONAL', noise: '75dB', weight: '14500g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['RandomX Algorithm', 'Monero Mining', 'Air Cooled'], coins: [{ ticker: 'XMR', name: 'Monero' }],
  },
  {
    id: 'antminer-z15-420kh', slug: 'antminer-z15-420kh',
    name: 'Antminer Z15 (420kh)', manufacturer: 'Bitmain', coin: 'ZEC+ZEN', algorithm: 'Equihash',
    hashrate: 420, hashrateUnit: 'KH/s', power: 1510, powerUnit: 'W', price: 770,
    earnings24h: 25.66, electricityCost24h: calcElec(1510, ELEC_RATE), netProfit24h: 25.66 - calcElec(1510, ELEC_RATE),
    releaseDate: 'Jun 2020', category: 'PROFESSIONAL', noise: '72dB', weight: '14000g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['Equihash Algorithm', 'ZEC/ZEN Mining'], coins: [{ ticker: 'ZEC', name: 'Zcash' }, { ticker: 'ZEN', name: 'Horizen' }],
  },
  {
    id: 'inibox-pro-2-4gh', slug: 'inibox-pro-2-4gh',
    name: 'Matches INIBOX Pro (2.4Gh)', manufacturer: 'Pinecone', coin: 'INI', algorithm: 'VersaHash',
    hashrate: 2.4, hashrateUnit: 'GH/s', power: 1280, powerUnit: 'W', price: 7799,
    earnings24h: 15.76, electricityCost24h: calcElec(1280, ELEC_RATE), netProfit24h: 15.76 - calcElec(1280, ELEC_RATE),
    releaseDate: 'Mar 2026', category: 'HOME_MINER', noise: '55dB', weight: '11500g', dimensions: '380×160×260mm', cooling: 'Air',
    specs: ['VersaHash Algorithm', 'INI Mining', 'Home Miner'], coins: [{ ticker: 'INI', name: 'InitVerse' }],
  },
  {
    id: 'iceriver-aleo-ae3-2gh', slug: 'iceriver-aleo-ae3-2gh',
    name: 'IceRiver ALEO AE3 (2Gh)', manufacturer: 'IceRiver', coin: 'ALEO', algorithm: 'zkSNARK',
    hashrate: 2, hashrateUnit: 'GH/s', power: 3400, powerUnit: 'W', price: 5880,
    earnings24h: 15.53, electricityCost24h: calcElec(3400, ELEC_RATE), netProfit24h: 15.53 - calcElec(3400, ELEC_RATE),
    releaseDate: 'Nov 2025', category: 'PROFESSIONAL', noise: '70dB', weight: '14800g', dimensions: '400×180×280mm', cooling: 'Air',
    specs: ['zkSNARK Algorithm', 'Aleo Mining', 'Air Cooled'], coins: [{ ticker: 'ALEO', name: 'Aleo' }],
  },
  {
    id: 'antminer-s23-hyd-3u-1-16ph', slug: 'antminer-s23-hyd-3u-1-16ph',
    name: 'Antminer S23 Hyd 3U (1.16Ph)', manufacturer: 'Bitmain', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 1.16, hashrateUnit: 'PH/s', power: 11020, powerUnit: 'W', price: 7757,
    earnings24h: 15.23, electricityCost24h: calcElec(11020, ELEC_RATE), netProfit24h: 15.23 - calcElec(11020, ELEC_RATE),
    releaseDate: 'Jan 2026', category: 'INDUSTRIAL', noise: '80dB', weight: '25000g', dimensions: '535×460×180mm', cooling: 'Hydro',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Hydro Cooling', '3U Form Factor'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'sealminer-a4-ultra-hydro-886th', slug: 'sealminer-a4-ultra-hydro-886th',
    name: 'SealMiner A4 Ultra Hydro (886Th)', manufacturer: 'Bitdeer', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 886, hashrateUnit: 'TH/s', power: 8372, powerUnit: 'W', price: 9980,
    earnings24h: 11.74, electricityCost24h: calcElec(8372, ELEC_RATE), netProfit24h: 11.74 - calcElec(8372, ELEC_RATE),
    releaseDate: 'May 2026', category: 'PROFESSIONAL', noise: '75dB', weight: '18500g', dimensions: '450×220×300mm', cooling: 'Hydro',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Hydro Cooling'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'antminer-s23e-hyd-2u-865th', slug: 'antminer-s23e-hyd-2u-865th',
    name: 'Antminer S23e Hyd 2U (865Th)', manufacturer: 'Bitmain', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 865, hashrateUnit: 'TH/s', power: 8650, powerUnit: 'W', price: 11699,
    earnings24h: 10.32, electricityCost24h: calcElec(8650, ELEC_RATE), netProfit24h: 10.32 - calcElec(8650, ELEC_RATE),
    releaseDate: 'Apr 2026', category: 'INDUSTRIAL', noise: '80dB', weight: '24000g', dimensions: '535×460×180mm', cooling: 'Hydro',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Hydro Cooling', '2U Form Factor'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'antminer-s23-hyd-580th', slug: 'antminer-s23-hyd-580th',
    name: 'Antminer S23 Hyd (580Th)', manufacturer: 'Bitmain', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 580, hashrateUnit: 'TH/s', power: 5510, powerUnit: 'W', price: 12949,
    earnings24h: 7.62, electricityCost24h: calcElec(5510, ELEC_RATE), netProfit24h: 7.62 - calcElec(5510, ELEC_RATE),
    releaseDate: 'Jan 2026', category: 'INDUSTRIAL', noise: '80dB', weight: '23000g', dimensions: '535×460×180mm', cooling: 'Hydro',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Hydro Cooling'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'jasminer-x44-p-23-4gh', slug: 'jasminer-x44-p-23-4gh',
    name: 'Jasminer X44-P (23.4Gh)', manufacturer: 'Jasminer', coin: 'ETC', algorithm: 'EtHash',
    hashrate: 23.4, hashrateUnit: 'GH/s', power: 2550, powerUnit: 'W', price: 11300,
    earnings24h: 6.96, electricityCost24h: calcElec(2550, ELEC_RATE), netProfit24h: 6.96 - calcElec(2550, ELEC_RATE),
    releaseDate: 'Jun 2025', category: 'PROFESSIONAL', noise: '65dB', weight: '12800g', dimensions: '400×180×280mm', cooling: 'Air',
    specs: ['EtHash Algorithm', 'ETC Mining', 'Air Cooled'], coins: [{ ticker: 'ETC', name: 'Ethereum Classic' }],
  },
  {
    id: 'sealminer-a4-pro-hydro-680th', slug: 'sealminer-a4-pro-hydro-680th',
    name: 'SealMiner A4 Pro Hydro (680Th)', manufacturer: 'Bitdeer', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 680, hashrateUnit: 'TH/s', power: 7412, powerUnit: 'W', price: 8666,
    earnings24h: 6.64, electricityCost24h: calcElec(7412, ELEC_RATE), netProfit24h: 6.64 - calcElec(7412, ELEC_RATE),
    releaseDate: 'May 2026', category: 'PROFESSIONAL', noise: '75dB', weight: '17500g', dimensions: '450×220×300mm', cooling: 'Hydro',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Hydro Cooling'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'antminer-l11-hyd-2u-35gh', slug: 'antminer-l11-hyd-2u-35gh',
    name: 'Antminer L11 Hyd 2U (35Gh)', manufacturer: 'Bitmain', coin: 'DOGE+LTC', algorithm: 'Scrypt',
    hashrate: 35, hashrateUnit: 'GH/s', power: 5775, powerUnit: 'W', price: 9000,
    earnings24h: 6.36, electricityCost24h: calcElec(5775, ELEC_RATE), netProfit24h: 6.36 - calcElec(5775, ELEC_RATE),
    releaseDate: 'Dec 2025', category: 'PROFESSIONAL', noise: '75dB', weight: '16500g', dimensions: '430×195×290mm', cooling: 'Hydro',
    specs: ['Scrypt Algorithm', 'LTC/DOGE Mining', 'Hydro Cooling', '2U Form'], coins: [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
  },
  {
    id: 'antminer-l11-hyd-6u-33gh', slug: 'antminer-l11-hyd-6u-33gh',
    name: 'Antminer L11 Hyd 6U (33Gh)', manufacturer: 'Bitmain', coin: 'DOGE+LTC', algorithm: 'Scrypt',
    hashrate: 33, hashrateUnit: 'GH/s', power: 5676, powerUnit: 'W', price: 9627,
    earnings24h: 5.44, electricityCost24h: calcElec(5676, ELEC_RATE), netProfit24h: 5.44 - calcElec(5676, ELEC_RATE),
    releaseDate: 'Dec 2025', category: 'INDUSTRIAL', noise: '78dB', weight: '22000g', dimensions: '535×460×180mm', cooling: 'Hydro',
    specs: ['Scrypt Algorithm', 'LTC/DOGE Mining', 'Hydro Cooling', '6U Form'], coins: [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
  },
  {
    id: 'sealminer-dl1-air-25gh', slug: 'sealminer-dl1-air-25gh',
    name: 'SealMiner DL1 Air (25Gh)', manufacturer: 'Bitdeer', coin: 'DOGE+LTC', algorithm: 'Scrypt',
    hashrate: 25, hashrateUnit: 'GH/s', power: 3725, powerUnit: 'W', price: 7298,
    earnings24h: 5.50, electricityCost24h: calcElec(3725, ELEC_RATE), netProfit24h: 5.50 - calcElec(3725, ELEC_RATE),
    releaseDate: 'May 2026', category: 'PROFESSIONAL', noise: '72dB', weight: '15500g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['Scrypt Algorithm', 'LTC/DOGE Mining', 'Air Cooled'], coins: [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
  },
  {
    id: 'matches-inibox-850mh', slug: 'matches-inibox-850mh',
    name: 'Matches INIBOX (850Mh)', manufacturer: 'Pinecone', coin: 'INI', algorithm: 'VersaHash',
    hashrate: 850, hashrateUnit: 'MH/s', power: 500, powerUnit: 'W', price: 4065,
    earnings24h: 5.47, electricityCost24h: calcElec(500, ELEC_RATE), netProfit24h: 5.47 - calcElec(500, ELEC_RATE),
    releaseDate: 'Jul 2025', category: 'HOME_MINER', noise: '45dB', weight: '5200g', dimensions: '260×150×220mm', cooling: 'Air',
    specs: ['VersaHash Algorithm', 'INI Mining', 'Home Miner', 'Quiet Operation'], coins: [{ ticker: 'INI', name: 'InitVerse' }],
  },
  {
    id: 'iceriver-aleo-ae2-720mh', slug: 'iceriver-aleo-ae2-720mh',
    name: 'IceRiver ALEO AE2 (720Mh)', manufacturer: 'IceRiver', coin: 'ALEO', algorithm: 'zkSNARK',
    hashrate: 720, hashrateUnit: 'MH/s', power: 1300, powerUnit: 'W', price: 2538,
    earnings24h: 5.41, electricityCost24h: calcElec(1300, ELEC_RATE), netProfit24h: 5.41 - calcElec(1300, ELEC_RATE),
    releaseDate: 'Jul 2025', category: 'HOME_MINER', noise: '60dB', weight: '10500g', dimensions: '380×160×260mm', cooling: 'Air',
    specs: ['zkSNARK Algorithm', 'Aleo Mining', 'Home Miner'], coins: [{ ticker: 'ALEO', name: 'Aleo' }],
  },
  {
    id: 'antminer-s21-xp-plus-hyd-500th', slug: 'antminer-s21-xp-plus-hyd-500th',
    name: 'Antminer S21 XP+ Hyd (500Th)', manufacturer: 'Bitmain', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 500, hashrateUnit: 'TH/s', power: 5500, powerUnit: 'W', price: 9500,
    earnings24h: 4.77, electricityCost24h: calcElec(5500, ELEC_RATE), netProfit24h: 4.77 - calcElec(5500, ELEC_RATE),
    releaseDate: 'Jul 2025', category: 'INDUSTRIAL', noise: '78dB', weight: '19500g', dimensions: '450×220×300mm', cooling: 'Hydro',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Hydro Cooling'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'antminer-l9-17gh', slug: 'antminer-l9-17gh',
    name: 'Antminer L9 (17Gh)', manufacturer: 'Bitmain', coin: 'DOGE+LTC', algorithm: 'Scrypt',
    hashrate: 17, hashrateUnit: 'GH/s', power: 3570, powerUnit: 'W', price: 6800,
    earnings24h: 4.35, electricityCost24h: calcElec(3570, ELEC_RATE), netProfit24h: 4.35 - calcElec(3570, ELEC_RATE),
    releaseDate: 'Jun 2024', category: 'PROFESSIONAL', noise: '70dB', weight: '16000g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['Scrypt Algorithm', 'LTC/DOGE Mining', 'Air Cooled'], coins: [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
  },
  {
    id: 'antminer-ks7-40th', slug: 'antminer-ks7-40th',
    name: 'Antminer KS7 (40Th)', manufacturer: 'Bitmain', coin: 'KAS', algorithm: 'kHeavyHash',
    hashrate: 40, hashrateUnit: 'TH/s', power: 3080, powerUnit: 'W', price: 7900,
    earnings24h: 4.10, electricityCost24h: calcElec(3080, ELEC_RATE), netProfit24h: 4.10 - calcElec(3080, ELEC_RATE),
    releaseDate: 'Dec 2025', category: 'PROFESSIONAL', noise: '75dB', weight: '16500g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['kHeavyHash Algorithm', 'Kaspa Mining', 'Air Cooled'], coins: [{ ticker: 'KAS', name: 'Kaspa' }],
  },
  {
    id: 'whatsminer-m60-172th', slug: 'whatsminer-m60-172th',
    name: 'Whatsminer M60 (172Th)', manufacturer: 'MicroBT', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 172, hashrateUnit: 'TH/s', power: 3422, powerUnit: 'W', price: 4200,
    earnings24h: 3.85, electricityCost24h: calcElec(3422, ELEC_RATE), netProfit24h: 3.85 - calcElec(3422, ELEC_RATE),
    releaseDate: 'Jan 2025', category: 'PROFESSIONAL', noise: '72dB', weight: '15200g', dimensions: '430×215×290mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Air Cooled'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'antminer-s21-pro-234th', slug: 'antminer-s21-pro-234th',
    name: 'Antminer S21 Pro (234Th)', manufacturer: 'Bitmain', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 234, hashrateUnit: 'TH/s', power: 3510, powerUnit: 'W', price: 5500,
    earnings24h: 5.20, electricityCost24h: calcElec(3510, ELEC_RATE), netProfit24h: 5.20 - calcElec(3510, ELEC_RATE),
    releaseDate: 'Mar 2024', category: 'PROFESSIONAL', noise: '75dB', weight: '16200g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['2nm Chip', 'SHA-256', 'Air Cooled'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }, { ticker: 'BCH', name: 'Bitcoin Cash' }],
  },
  {
    id: 'antminer-s21-200th', slug: 'antminer-s21-200th',
    name: 'Antminer S21 (200Th)', manufacturer: 'Bitmain', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 200, hashrateUnit: 'TH/s', power: 3500, powerUnit: 'W', price: 4200,
    earnings24h: 4.45, electricityCost24h: calcElec(3500, ELEC_RATE), netProfit24h: 4.45 - calcElec(3500, ELEC_RATE),
    releaseDate: 'Dec 2023', category: 'PROFESSIONAL', noise: '75dB', weight: '15800g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['7nm Chip', 'SHA-256', 'Air Cooled'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }, { ticker: 'BCH', name: 'Bitcoin Cash' }],
  },
  {
    id: 'whatsminer-m50s-186th', slug: 'whatsminer-m50s-186th',
    name: 'Whatsminer M50S (186Th)', manufacturer: 'MicroBT', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 186, hashrateUnit: 'TH/s', power: 3348, powerUnit: 'W', price: 3800,
    earnings24h: 4.15, electricityCost24h: calcElec(3348, ELEC_RATE), netProfit24h: 4.15 - calcElec(3348, ELEC_RATE),
    releaseDate: 'Jan 2024', category: 'PROFESSIONAL', noise: '72dB', weight: '14900g', dimensions: '430×215×290mm', cooling: 'Air',
    specs: ['6nm Chip', 'SHA-256', 'Air Cooled'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }, { ticker: 'BCH', name: 'Bitcoin Cash' }],
  },
  {
    id: 'antminer-ks5-pro-21th', slug: 'antminer-ks5-pro-21th',
    name: 'Antminer KS5 Pro (21Th)', manufacturer: 'Bitmain', coin: 'KAS', algorithm: 'kHeavyHash',
    hashrate: 21, hashrateUnit: 'TH/s', power: 3150, powerUnit: 'W', price: 8500,
    earnings24h: 22.30, electricityCost24h: calcElec(3150, ELEC_RATE), netProfit24h: 22.30 - calcElec(3150, ELEC_RATE),
    releaseDate: 'Sep 2023', category: 'PROFESSIONAL', noise: '75dB', weight: '16500g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['kHeavyHash Algorithm', 'Kaspa Mining', 'Air Cooled'], coins: [{ ticker: 'KAS', name: 'Kaspa' }],
  },
  {
    id: 'iceriver-ks3-ultra-12th', slug: 'iceriver-ks3-ultra-12th',
    name: 'IceRiver KS3 Ultra (12Th)', manufacturer: 'IceRiver', coin: 'KAS', algorithm: 'kHeavyHash',
    hashrate: 12, hashrateUnit: 'TH/s', power: 3400, powerUnit: 'W', price: 4200,
    earnings24h: 14.60, electricityCost24h: calcElec(3400, ELEC_RATE), netProfit24h: 14.60 - calcElec(3400, ELEC_RATE),
    releaseDate: 'Aug 2023', category: 'PROFESSIONAL', noise: '70dB', weight: '14800g', dimensions: '400×180×280mm', cooling: 'Air',
    specs: ['kHeavyHash Algorithm', 'Kaspa Mining', 'Air Cooled'], coins: [{ ticker: 'KAS', name: 'Kaspa' }],
  },
  {
    id: 'goldshell-xt-box-580g', slug: 'goldshell-xt-box-580g',
    name: 'GoldShell XT-BOX (580G)', manufacturer: 'GoldShell', coin: 'XTM', algorithm: 'SHA3x',
    hashrate: 580, hashrateUnit: 'GH/s', power: 400, powerUnit: 'W', price: 1890,
    earnings24h: 3.20, electricityCost24h: calcElec(400, ELEC_RATE), netProfit24h: 3.20 - calcElec(400, ELEC_RATE),
    releaseDate: 'Jan 2026', category: 'HOME_MINER', noise: '45dB', weight: '3200g', dimensions: '200×150×85mm', cooling: 'Air',
    specs: ['SHA3x Algorithm', 'XTM Mining', 'Desktop Form', 'Quiet'], coins: [{ ticker: 'XTM', name: 'Torrent' }],
  },
  {
    id: 'antminer-d9-1-77th', slug: 'antminer-d9-1-77th',
    name: 'Antminer D9 (1.77Th)', manufacturer: 'Bitmain', coin: 'DASH', algorithm: 'X11',
    hashrate: 1.77, hashrateUnit: 'TH/s', power: 2580, powerUnit: 'W', price: 3500,
    earnings24h: 2.85, electricityCost24h: calcElec(2580, ELEC_RATE), netProfit24h: 2.85 - calcElec(2580, ELEC_RATE),
    releaseDate: 'Mar 2025', category: 'PROFESSIONAL', noise: '72dB', weight: '15500g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['X11 Algorithm', 'DASH Mining', 'Air Cooled'], coins: [{ ticker: 'DASH', name: 'Dash' }],
  },
  {
    id: 'volcminer-d1-hydro-33gh', slug: 'volcminer-d1-hydro-33gh',
    name: 'VolcMiner D1 Hydro (33Gh)', manufacturer: 'VolcMiner', coin: 'DOGE+LTC', algorithm: 'Scrypt',
    hashrate: 33, hashrateUnit: 'GH/s', power: 7600, powerUnit: 'W', price: 10500,
    earnings24h: 7.80, electricityCost24h: calcElec(7600, ELEC_RATE), netProfit24h: 7.80 - calcElec(7600, ELEC_RATE),
    releaseDate: 'Mar 2026', category: 'INDUSTRIAL', noise: '80dB', weight: '26000g', dimensions: '535×460×180mm', cooling: 'Hydro',
    specs: ['Scrypt Algorithm', 'LTC/DOGE Mining', 'Hydro Cooling'], coins: [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
  },
  {
    id: 'elphapex-dg2-plus', slug: 'elphapex-dg2-plus',
    name: 'ElphaPex DG2+ (15Gh)', manufacturer: 'ElphaPex', coin: 'DOGE+LTC', algorithm: 'Scrypt',
    hashrate: 15, hashrateUnit: 'GH/s', power: 2800, powerUnit: 'W', price: 5500,
    earnings24h: 3.95, electricityCost24h: calcElec(2800, ELEC_RATE), netProfit24h: 3.95 - calcElec(2800, ELEC_RATE),
    releaseDate: 'Feb 2025', category: 'PROFESSIONAL', noise: '70dB', weight: '14500g', dimensions: '410×180×270mm', cooling: 'Air',
    specs: ['Scrypt Algorithm', 'LTC/DOGE Mining', 'Air Cooled'], coins: [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
  },
  {
    id: 'canaan-avalon-a1566ha-2u', slug: 'canaan-avalon-a1566ha-2u',
    name: 'Canaan Avalon A1566HA 2U (480Th)', manufacturer: 'Canaan', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 480, hashrateUnit: 'TH/s', power: 8064, powerUnit: 'W', price: 8200,
    earnings24h: 8.90, electricityCost24h: calcElec(8064, ELEC_RATE), netProfit24h: 8.90 - calcElec(8064, ELEC_RATE),
    releaseDate: 'Mar 2026', category: 'INDUSTRIAL', noise: '78dB', weight: '22000g', dimensions: '535×460×180mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', '2U Form Factor', 'Air Cooled'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'canaan-avalon-q-90th', slug: 'canaan-avalon-q-90th',
    name: 'Canaan Avalon Q (90Th)', manufacturer: 'Canaan', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 90, hashrateUnit: 'TH/s', power: 1674, powerUnit: 'W', price: 2800,
    earnings24h: 2.10, electricityCost24h: calcElec(1674, ELEC_RATE), netProfit24h: 2.10 - calcElec(1674, ELEC_RATE),
    releaseDate: 'Jan 2025', category: 'HOME_MINER', noise: '55dB', weight: '8500g', dimensions: '350×150×240mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Home Miner', 'Low Noise'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'canaan-avalon-mini-3-37th', slug: 'canaan-avalon-mini-3-37th',
    name: 'Canaan Avalon Mini 3 (37.5Th)', manufacturer: 'Canaan', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 37.5, hashrateUnit: 'TH/s', power: 800, powerUnit: 'W', price: 1500,
    earnings24h: 0.85, electricityCost24h: calcElec(800, ELEC_RATE), netProfit24h: 0.85 - calcElec(800, ELEC_RATE),
    releaseDate: 'Sep 2024', category: 'HOME_MINER', noise: '40dB', weight: '4500g', dimensions: '280×140×200mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'No Noise', 'Home Miner'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'iceriver-ks0-100gh', slug: 'iceriver-ks0-100gh',
    name: 'IceRiver KS0 (100Gh)', manufacturer: 'IceRiver', coin: 'KAS', algorithm: 'kHeavyHash',
    hashrate: 100, hashrateUnit: 'GH/s', power: 65, powerUnit: 'W', price: 300,
    earnings24h: 0.35, electricityCost24h: calcElec(65, ELEC_RATE), netProfit24h: 0.35 - calcElec(65, ELEC_RATE),
    releaseDate: 'Sep 2023', category: 'HOME_MINER', noise: '40dB', weight: '2500g', dimensions: '180×120×80mm', cooling: 'Air',
    specs: ['kHeavyHash Algorithm', 'Kaspa Mining', 'Ultra Low Power', 'Desktop'], coins: [{ ticker: 'KAS', name: 'Kaspa' }],
  },
  {
    id: 'bitaxe-gamma-601-1-2th', slug: 'bitaxe-gamma-601-1-2th',
    name: 'Bitaxe Gamma 601 (1.2Th)', manufacturer: 'Bitaxe', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 1.2, hashrateUnit: 'TH/s', power: 17, powerUnit: 'W', price: 90,
    earnings24h: 0.01, electricityCost24h: calcElec(17, ELEC_RATE), netProfit24h: 0.01 - calcElec(17, ELEC_RATE),
    releaseDate: 'Aug 2024', category: 'SOLO_MINER', noise: '35dB', weight: '300g', dimensions: '60×40×20mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'SOLO BTC Mining', 'Ultra Compact', 'USB Powered'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'nerdminer-nerdqaxe-2-5th', slug: 'nerdminer-nerdqaxe-2-5th',
    name: 'NerdMiner NerdQaxe+ (2.5Th)', manufacturer: 'NerdMiner', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 2.5, hashrateUnit: 'TH/s', power: 50, powerUnit: 'W', price: 489,
    earnings24h: 0.02, electricityCost24h: calcElec(50, ELEC_RATE), netProfit24h: 0.02 - calcElec(50, ELEC_RATE),
    releaseDate: 'Mar 2025', category: 'SOLO_MINER', noise: '40dB', weight: '500g', dimensions: '80×50×30mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'Compact Design'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'lucky-miner-lv07-1th', slug: 'lucky-miner-lv07-1th',
    name: 'Lucky Miner LV07 (1Th)', manufacturer: 'Lucky Miner', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 1, hashrateUnit: 'TH/s', power: 25, powerUnit: 'W', price: 88,
    earnings24h: 0.01, electricityCost24h: calcElec(25, ELEC_RATE), netProfit24h: 0.01 - calcElec(25, ELEC_RATE),
    releaseDate: 'Jun 2024', category: 'SOLO_MINER', noise: '38dB', weight: '400g', dimensions: '70×45×25mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'Low Cost Entry'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'nerdminer-s19-1th', slug: 'nerdminer-s19-1th',
    name: 'NerdMiner S19 (1Th)', manufacturer: 'NerdMiner', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 1, hashrateUnit: 'TH/s', power: 20, powerUnit: 'W', price: 60,
    earnings24h: 0.01, electricityCost24h: calcElec(20, ELEC_RATE), netProfit24h: 0.01 - calcElec(20, ELEC_RATE),
    releaseDate: 'Jan 2024', category: 'SOLO_MINER', noise: '35dB', weight: '350g', dimensions: '65×40×20mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'Entry Level'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'jingle-miner-btc-solo-lite-1-2th', slug: 'jingle-miner-btc-solo-lite-1-2th',
    name: 'Jingle Miner BTC Solo Lite (1.2Th)', manufacturer: 'Jingle Miner', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 1.2, hashrateUnit: 'TH/s', power: 23, powerUnit: 'W', price: 119,
    earnings24h: 0.01, electricityCost24h: calcElec(23, ELEC_RATE), netProfit24h: 0.01 - calcElec(23, ELEC_RATE),
    releaseDate: 'Sep 2025', category: 'SOLO_MINER', noise: '35dB', weight: '300g', dimensions: '60×40×20mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'USB Powered'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'antminer-z11-135kh', slug: 'antminer-z11-135kh',
    name: 'Antminer Z11 (135kh)', manufacturer: 'Bitmain', coin: 'ZEC+ZEN', algorithm: 'Equihash',
    hashrate: 135, hashrateUnit: 'KH/s', power: 1418, powerUnit: 'W', price: 999,
    earnings24h: 6.01, electricityCost24h: calcElec(1418, ELEC_RATE), netProfit24h: 6.01 - calcElec(1418, ELEC_RATE),
    releaseDate: 'Apr 2019', category: 'PROFESSIONAL', noise: '70dB', weight: '13800g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['Equihash Algorithm', 'ZEC Mining', 'Air Cooled'], coins: [{ ticker: 'ZEC', name: 'Zcash' }, { ticker: 'ZEN', name: 'Horizen' }],
  },
  {
    id: 'innosilicon-a9-plus-zmaster-140kh', slug: 'innosilicon-a9-plus-zmaster-140kh',
    name: 'Innosilicon A9++ ZMaster (140kh)', manufacturer: 'Innosilicon', coin: 'ZEC+ZEN', algorithm: 'Equihash',
    hashrate: 140, hashrateUnit: 'KH/s', power: 1550, powerUnit: 'W', price: 1200,
    earnings24h: 6.04, electricityCost24h: calcElec(1550, ELEC_RATE), netProfit24h: 6.04 - calcElec(1550, ELEC_RATE),
    releaseDate: 'May 2019', category: 'PROFESSIONAL', noise: '70dB', weight: '14000g', dimensions: '420×190×280mm', cooling: 'Air',
    specs: ['Equihash Algorithm', 'ZEC Mining', 'Air Cooled'], coins: [{ ticker: 'ZEC', name: 'Zcash' }, { ticker: 'ZEN', name: 'Horizen' }],
  },
  {
    id: 'innosilicon-a9-zmaster-120kh', slug: 'innosilicon-a9-zmaster-120kh',
    name: 'Innosilicon A9+ ZMaster (120kh)', manufacturer: 'Innosilicon', coin: 'ZEC+ZEN', algorithm: 'Equihash',
    hashrate: 120, hashrateUnit: 'KH/s', power: 1550, powerUnit: 'W', price: 1000,
    earnings24h: 4.65, electricityCost24h: calcElec(1550, ELEC_RATE), netProfit24h: 4.65 - calcElec(1550, ELEC_RATE),
    releaseDate: 'Jan 2019', category: 'PROFESSIONAL', noise: '70dB', weight: '14000g', dimensions: '420×190×280mm', cooling: 'Air',
    specs: ['Equihash Algorithm', 'ZEC Mining', 'Air Cooled'], coins: [{ ticker: 'ZEC', name: 'Zcash' }, { ticker: 'ZEN', name: 'Horizen' }],
  },
  {
    id: 'ice-river-alph-360gh', slug: 'ice-river-alph-360gh',
    name: 'IceRiver ALPH (360Gh)', manufacturer: 'IceRiver', coin: 'ALPH', algorithm: 'Blake3',
    hashrate: 360, hashrateUnit: 'GH/s', power: 1500, powerUnit: 'W', price: 2800,
    earnings24h: 5.50, electricityCost24h: calcElec(1500, ELEC_RATE), netProfit24h: 5.50 - calcElec(1500, ELEC_RATE),
    releaseDate: 'Jun 2024', category: 'PROFESSIONAL', noise: '65dB', weight: '12500g', dimensions: '400×180×280mm', cooling: 'Air',
    specs: ['Blake3 Algorithm', 'Alephium Mining', 'Low Power'], coins: [{ ticker: 'ALPH', name: 'Alephium' }],
  },
  {
    id: 'goldshell-boxx400', slug: 'goldshell-boxx400',
    name: 'GoldShell BOXx400 (400Gh)', manufacturer: 'GoldShell', coin: 'ALPH', algorithm: 'Blake3',
    hashrate: 400, hashrateUnit: 'GH/s', power: 1800, powerUnit: 'W', price: 1200,
    earnings24h: 3.20, electricityCost24h: calcElec(1800, ELEC_RATE), netProfit24h: 3.20 - calcElec(1800, ELEC_RATE),
    releaseDate: 'May 2024', category: 'HOME_MINER', noise: '45dB', weight: '3200g', dimensions: '200×150×85mm', cooling: 'Air',
    specs: ['Blake3 Algorithm', 'Desktop Form', 'Quiet Operation'], coins: [{ ticker: 'ALPH', name: 'Alephium' }],
  },
  {
    id: 'jasminer-x16-q-pro-2-05gh', slug: 'jasminer-x16-q-pro-2-05gh',
    name: 'Jasminer X16-Q Pro (2.05Gh)', manufacturer: 'Jasminer', coin: 'ETC', algorithm: 'EtHash',
    hashrate: 2.05, hashrateUnit: 'GH/s', power: 520, powerUnit: 'W', price: 2400,
    earnings24h: 1.65, electricityCost24h: calcElec(520, ELEC_RATE), netProfit24h: 1.65 - calcElec(520, ELEC_RATE),
    releaseDate: 'Jan 2025', category: 'HOME_MINER', noise: '55dB', weight: '6800g', dimensions: '320×160×240mm', cooling: 'Air',
    specs: ['EtHash Algorithm', 'ETC Mining', 'Quiet Operation'], coins: [{ ticker: 'ETC', name: 'Ethereum Classic' }],
  },
  {
    id: 'bitdeer-sealminer-a2-226th', slug: 'bitdeer-sealminer-a2-226th',
    name: 'Bitdeer SealMiner A2 (226Th)', manufacturer: 'Bitdeer', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 226, hashrateUnit: 'TH/s', power: 3800, powerUnit: 'W', price: 5200,
    earnings24h: 4.80, electricityCost24h: calcElec(3800, ELEC_RATE), netProfit24h: 4.80 - calcElec(3800, ELEC_RATE),
    releaseDate: 'Jan 2025', category: 'PROFESSIONAL', noise: '72dB', weight: '15500g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Air Cooled'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'bitdeer-sealminer-a2-pro-air-255th', slug: 'bitdeer-sealminer-a2-pro-air-255th',
    name: 'SealMiner A2 Pro Air (255Th)', manufacturer: 'Bitdeer', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 255, hashrateUnit: 'TH/s', power: 3790, powerUnit: 'W', price: 5800,
    earnings24h: 5.50, electricityCost24h: calcElec(3790, ELEC_RATE), netProfit24h: 5.50 - calcElec(3790, ELEC_RATE),
    releaseDate: 'Jan 2025', category: 'PROFESSIONAL', noise: '72dB', weight: '15800g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Air Cooled', 'High Efficiency'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'antminer-l11-pro-21gh', slug: 'antminer-l11-pro-21gh',
    name: 'Antminer L11 Pro (21Gh)', manufacturer: 'Bitmain', coin: 'DOGE+LTC', algorithm: 'Scrypt',
    hashrate: 21, hashrateUnit: 'GH/s', power: 3612, powerUnit: 'W', price: 7200,
    earnings24h: 4.80, electricityCost24h: calcElec(3612, ELEC_RATE), netProfit24h: 4.80 - calcElec(3612, ELEC_RATE),
    releaseDate: 'Dec 2025', category: 'PROFESSIONAL', noise: '73dB', weight: '16200g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['Scrypt Algorithm', 'LTC/DOGE Mining', 'Air Cooled', '0.172j/Mh'], coins: [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
  },
  {
    id: 'iceriver-aleo-ae1-lite-300mh', slug: 'iceriver-aleo-ae1-lite-300mh',
    name: 'IceRiver ALEO AE1 Lite (300Mh)', manufacturer: 'IceRiver', coin: 'ALEO', algorithm: 'zkSNARK',
    hashrate: 300, hashrateUnit: 'MH/s', power: 500, powerUnit: 'W', price: 1200,
    earnings24h: 2.80, electricityCost24h: calcElec(500, ELEC_RATE), netProfit24h: 2.80 - calcElec(500, ELEC_RATE),
    releaseDate: 'Sep 2025', category: 'HOME_MINER', noise: '55dB', weight: '8500g', dimensions: '350×150×240mm', cooling: 'Air',
    specs: ['zkSNARK Algorithm', 'Aleo Mining', 'Low Power', 'Home Miner'], coins: [{ ticker: 'ALEO', name: 'Aleo' }],
  },
  {
    id: 'iceriver-kas-ks7-lite-4-2th', slug: 'iceriver-kas-ks7-lite-4-2th',
    name: 'IceRiver KAS KS7 Lite (4.2Th)', manufacturer: 'IceRiver', coin: 'KAS', algorithm: 'kHeavyHash',
    hashrate: 4.2, hashrateUnit: 'TH/s', power: 500, powerUnit: 'W', price: 2800,
    earnings24h: 4.20, electricityCost24h: calcElec(500, ELEC_RATE), netProfit24h: 4.20 - calcElec(500, ELEC_RATE),
    releaseDate: 'Mar 2026', category: 'HOME_MINER', noise: '55dB', weight: '7200g', dimensions: '320×160×240mm', cooling: 'Air',
    specs: ['kHeavyHash Algorithm', 'Kaspa Mining', 'Low Power', 'Home Miner'], coins: [{ ticker: 'KAS', name: 'Kaspa' }],
  },
  {
    id: 'bitaxe-touch-1-6th', slug: 'bitaxe-touch-1-6th',
    name: 'Bitaxe Touch (1.6Th)', manufacturer: 'Bitaxe', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 1.6, hashrateUnit: 'TH/s', power: 22, powerUnit: 'W', price: 346,
    earnings24h: 0.01, electricityCost24h: calcElec(22, ELEC_RATE), netProfit24h: 0.01 - calcElec(22, ELEC_RATE),
    releaseDate: 'Dec 2024', category: 'SOLO_MINER', noise: '35dB', weight: '600g', dimensions: '80×50×25mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'Touch Screen'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'bitaxe-supra-401-600gh', slug: 'bitaxe-supra-401-600gh',
    name: 'Bitaxe Supra 401 (600Gh)', manufacturer: 'Bitaxe', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 600, hashrateUnit: 'GH/s', power: 14, powerUnit: 'W', price: 110,
    earnings24h: 0.01, electricityCost24h: calcElec(14, ELEC_RATE), netProfit24h: 0.01 - calcElec(14, ELEC_RATE),
    releaseDate: 'Jun 2024', category: 'SOLO_MINER', noise: '35dB', weight: '400g', dimensions: '60×40×20mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'Ultra Efficient'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'bitmain-antminer-s19-xp-hyd-293th', slug: 'bitmain-antminer-s19-xp-hyd-293th',
    name: 'Antminer S19 XP+ Hyd (293Th)', manufacturer: 'Bitmain', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 293, hashrateUnit: 'TH/s', power: 5567, powerUnit: 'W', price: 7500,
    earnings24h: 6.20, electricityCost24h: calcElec(5567, ELEC_RATE), netProfit24h: 6.20 - calcElec(5567, ELEC_RATE),
    releaseDate: 'Jun 2025', category: 'INDUSTRIAL', noise: '78dB', weight: '21000g', dimensions: '450×220×300mm', cooling: 'Hydro',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Hydro Cooling'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'canaan-avalon-a15pro-218th', slug: 'canaan-avalon-a15pro-218th',
    name: 'Canaan Avalon A15Pro (218Th)', manufacturer: 'Canaan', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 218, hashrateUnit: 'TH/s', power: 4000, powerUnit: 'W', price: 4800,
    earnings24h: 4.60, electricityCost24h: calcElec(4000, ELEC_RATE), netProfit24h: 4.60 - calcElec(4000, ELEC_RATE),
    releaseDate: 'Feb 2025', category: 'PROFESSIONAL', noise: '72dB', weight: '15200g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Air Cooled', 'A15 Series'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'whatsminer-m66-280th', slug: 'whatsminer-m66-280th',
    name: 'MicroBT Whatsminer M66 (280Th)', manufacturer: 'MicroBT', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 280, hashrateUnit: 'TH/s', power: 5040, powerUnit: 'W', price: 6500,
    earnings24h: 5.90, electricityCost24h: calcElec(5040, ELEC_RATE), netProfit24h: 5.90 - calcElec(5040, ELEC_RATE),
    releaseDate: 'Apr 2025', category: 'INDUSTRIAL', noise: '75dB', weight: '18000g', dimensions: '450×220×300mm', cooling: 'Hydro',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Oil Cooling', 'Immersion Ready'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'antminer-s21-xp-270th', slug: 'antminer-s21-xp-270th',
    name: 'Antminer S21 XP (270Th)', manufacturer: 'Bitmain', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 270, hashrateUnit: 'TH/s', power: 3645, powerUnit: 'W', price: 7000,
    earnings24h: 6.80, electricityCost24h: calcElec(3645, ELEC_RATE), netProfit24h: 6.80 - calcElec(3645, ELEC_RATE),
    releaseDate: 'Jan 2025', category: 'PROFESSIONAL', noise: '75dB', weight: '16200g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Bitcoin Mining', 'Air Cooled', 'High Efficiency'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'plebsource-hammer-miner-scrypt-105mh', slug: 'plebsource-hammer-miner-scrypt-105mh',
    name: 'PlebSource Hammer Miner Scrypt (105Mh)', manufacturer: 'PlebSource', coin: 'DOGE+LTC', algorithm: 'Scrypt',
    hashrate: 105, hashrateUnit: 'MH/s', power: 25, powerUnit: 'W', price: 150,
    earnings24h: 0.02, electricityCost24h: calcElec(25, ELEC_RATE), netProfit24h: 0.02 - calcElec(25, ELEC_RATE),
    releaseDate: 'Jan 2026', category: 'SOLO_MINER', noise: '50dB', weight: '400g', dimensions: '70×45×25mm', cooling: 'Air',
    specs: ['Scrypt Algorithm', 'Solo LTC Mining', 'USB Powered'], coins: [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
  },
  {
    id: 'braiins-bmm100-1th', slug: 'braiins-bmm100-1th',
    name: 'Braiins BMM100 (1Th)', manufacturer: 'Braiins', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 1, hashrateUnit: 'TH/s', power: 40, powerUnit: 'W', price: 200,
    earnings24h: 0.01, electricityCost24h: calcElec(40, ELEC_RATE), netProfit24h: 0.01 - calcElec(40, ELEC_RATE),
    releaseDate: 'Jun 2024', category: 'SOLO_MINER', noise: '40dB', weight: '1300g', dimensions: '120×80×40mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'Open Source Firmware'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'digital-shovel-bluax-1-2th', slug: 'digital-shovel-bluax-1-2th',
    name: 'Digital Shovel BluAx (1.2Th)', manufacturer: 'Digital Shovel', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 1.2, hashrateUnit: 'TH/s', power: 18, powerUnit: 'W', price: 180,
    earnings24h: 0.01, electricityCost24h: calcElec(18, ELEC_RATE), netProfit24h: 0.01 - calcElec(18, ELEC_RATE),
    releaseDate: 'Jul 2025', category: 'SOLO_MINER', noise: '35dB', weight: '300g', dimensions: '60×40×20mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'Compact'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'bitaxe-gamma-duo-650-1-63th', slug: 'bitaxe-gamma-duo-650-1-63th',
    name: 'Bitaxe Gamma Duo 650 (1.63Th)', manufacturer: 'Bitaxe', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 1.63, hashrateUnit: 'TH/s', power: 26, powerUnit: 'W', price: 250,
    earnings24h: 0.01, electricityCost24h: calcElec(26, ELEC_RATE), netProfit24h: 0.01 - calcElec(26, ELEC_RATE),
    releaseDate: 'Feb 2026', category: 'SOLO_MINER', noise: '35dB', weight: '300g', dimensions: '60×40×20mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'Dual Hash Board'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'bitaxe-gamma-turbo-2-4th', slug: 'bitaxe-gamma-turbo-2-4th',
    name: 'Bitaxe Gamma Turbo (2.4Th)', manufacturer: 'Bitaxe', coin: 'BTC', algorithm: 'SHA-256',
    hashrate: 2.4, hashrateUnit: 'TH/s', power: 35, powerUnit: 'W', price: 209,
    earnings24h: 0.02, electricityCost24h: calcElec(35, ELEC_RATE), netProfit24h: 0.02 - calcElec(35, ELEC_RATE),
    releaseDate: 'Mar 2025', category: 'SOLO_MINER', noise: '35dB', weight: '400g', dimensions: '70×45×25mm', cooling: 'Air',
    specs: ['SHA-256 Algorithm', 'Solo BTC Mining', 'High Hashrate'], coins: [{ ticker: 'BTC', name: 'Bitcoin' }],
  },
  {
    id: 'bitmain-antminer-l11-20gh', slug: 'bitmain-antminer-l11-20gh',
    name: 'Antminer L11 (20Gh)', manufacturer: 'Bitmain', coin: 'DOGE+LTC', algorithm: 'Scrypt',
    hashrate: 20, hashrateUnit: 'GH/s', power: 3680, powerUnit: 'W', price: 6200,
    earnings24h: 4.20, electricityCost24h: calcElec(3680, ELEC_RATE), netProfit24h: 4.20 - calcElec(3680, ELEC_RATE),
    releaseDate: 'Dec 2025', category: 'PROFESSIONAL', noise: '73dB', weight: '16000g', dimensions: '430×195×290mm', cooling: 'Air',
    specs: ['Scrypt Algorithm', 'LTC/DOGE Mining', 'Air Cooled'], coins: [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
  },
];

export function getHardwareBySlug(slug: string): MinerEntry | undefined {
  return HARDWARE_MATRIX.find(m => m.slug === slug);
}
