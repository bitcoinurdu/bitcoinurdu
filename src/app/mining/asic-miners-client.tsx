'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ShoppingCart, TrendingUp, Cpu, Zap, DollarSign, Hash, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { AnnouncementBar } from '@/components/admin/announcement-bar';

interface AslProduct {
  id: number;
  name: string;
  image_url: string;
  image_alt: string;
  algorithm: string;
  miner_price: string;
  coin_name: string;
  coin_price: number | string;
  difficulty: string;
  network_hashrate: string;
  blockreward: string;
  hashrate: string;
  unit: string;
  power: string;
  volume: number;
  coins: { price: number; difficulty: number; reward: number; reward_block: number; coin: string }[];
}

const ELEC_PRESETS = [0.03, 0.06, 0.08, 0.12];
const ASL_REF = 'https://aslminer.com/?ref=Bitcoinurdu';
const POLL_MS = 120000;

const UNIT_MULTIPLIER: Record<string, number> = { P: 1e15, T: 1e12, G: 1e9, M: 1e6, K: 1e3 };
const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin', LTC: 'litecoin', DOGE: 'dogecoin', BCH: 'bitcoin-cash', DASH: 'dash',
  ZEC: 'zcash', ETC: 'ethereum-classic', KAS: 'kaspa', CKB: 'nervos-network',
  XMR: 'monero', SC: 'siacoin', ALPH: 'alephium', ALEO: 'aleo', XTM: 'torrent',
  GRIN: 'grin', KDA: 'kadena', ZEN: 'horizen', RXD: 'radiant', NEXA: 'nexa',
  INI: 'ini-crypto', CCR: 'conflux-network',
};

const COIN_NETWORK: Record<string, { networkHPS: number; blockTimeSec: number; blockReward: number }> = {
  BTC: { networkHPS: 750e18, blockTimeSec: 600, blockReward: 3.125 },
  KAS: { networkHPS: 850e18, blockTimeSec: 1, blockReward: 56.94 },
  ZEC: { networkHPS: 16.4e15, blockTimeSec: 75, blockReward: 1.25 },
  ALPH: { networkHPS: 3.5e15, blockTimeSec: 120, blockReward: 0.625 },
  ALEO: { networkHPS: 200e12, blockTimeSec: 10, blockReward: 23.5 },
  ETC: { networkHPS: 3e15, blockTimeSec: 13, blockReward: 2.56 },
  LTC: { networkHPS: 800e12, blockTimeSec: 150, blockReward: 6.25 },
  DOGE: { networkHPS: 900e12, blockTimeSec: 60, blockReward: 10000 },
  KDA: { networkHPS: 500e15, blockTimeSec: 1, blockReward: 0.53 },
  ZEN: { networkHPS: 5e9, blockTimeSec: 150, blockReward: 2.5 },
  RXD: { networkHPS: 10e12, blockTimeSec: 60, blockReward: 375 },
  NEXA: { networkHPS: 50e12, blockTimeSec: 10, blockReward: 10000 },
  SC: { networkHPS: 800e15, blockTimeSec: 10, blockReward: 31250 },
  CKB: { networkHPS: 300e12, blockTimeSec: 17, blockReward: 431 },
  INI: { networkHPS: 500e6, blockTimeSec: 60, blockReward: 10 },
  CCR: { networkHPS: 100e12, blockTimeSec: 10, blockReward: 100 },
};

function getManufacturer(name: string): string {
  const brands = ['Bitmain', 'MicroBT', 'Whatsminer', 'Canaan', 'Goldshell', 'IceRiver', 'iPollo', 'Jasminer', 'Bitdeer', 'SealMiner', 'VolcMiner', 'Bitaxe', 'NerdMiner', 'NerdQaxe', 'Nerdaxe', 'NerdNos', 'NerdOCTaxe', 'Lucky Miner', 'Lucky miner', 'Pinecone', 'iBeLink', 'BOMBAX', 'Fluminer', 'ElphaPex', 'DragonBall', 'PlebSource', 'Braiins', 'Digital Shovel', 'Jingle Miner', 'Matches', 'Innosilicon', 'Baikal', 'Magic', 'Magicminer', 'NM'];
  for (const b of brands) {
    if (name.toLowerCase().includes(b.toLowerCase())) return b;
  }
  const match = name.match(/^(\S+)/);
  return match ? match[1] : 'Unknown';
}

function formatCompact(n: number): string {
  if (!n || isNaN(n)) return '\u2014';
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(2);
}

function formatHashrate(v: number, unit: string): string {
  const mult = UNIT_MULTIPLIER[unit.toUpperCase()] || 1;
  const th = (v * mult) / 1e12;
  if (th >= 1) return `${th.toFixed(1)} TH/s`;
  const gh = (v * mult) / 1e9;
  if (gh >= 1) return `${gh.toFixed(1)} GH/s`;
  const mh = (v * mult) / 1e6;
  if (mh >= 1) return `${mh.toFixed(1)} MH/s`;
  const kh = (v * mult) / 1e3;
  if (kh >= 1) return `${kh.toFixed(1)} kH/s`;
  return `${v} ${unit}H/s`;
}

function formatEfficiency(power: number, hPerSec: number): { value: number; unit: string } {
  if (hPerSec <= 0) return { value: 0, unit: 'J/TH' };
  const th = hPerSec / 1e12;
  if (th >= 1) return { value: power / th, unit: 'J/TH' };
  const gh = hPerSec / 1e9;
  if (gh >= 1) return { value: power / gh, unit: 'J/GH' };
  const mh = hPerSec / 1e6;
  if (mh >= 1) return { value: power / mh, unit: 'J/MH' };
  const kh = hPerSec / 1e3;
  return { value: power / kh, unit: 'J/kH' };
}

function fixImageUrl(url: string): string {
  if (!url) return '';
  return url.replace('http://aosenlang.huaqiutong.com', 'https://aslminer.com');
}

function toNum(v: string | number | undefined, fallback = 0): number {
  if (v === undefined || v === null) return fallback;
  if (typeof v === 'number') return isFinite(v) ? v : fallback;
  const n = parseFloat(v);
  return isFinite(n) ? n : fallback;
}

const CG_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin,dogecoin,bitcoin-cash,dash,zcash,ethereum-classic,kaspa,monero,siacoin,alephium,aleo,radiant,nervos-network,nexa,horizen,kadena,grin&vs_currencies=usd';

export function AsicMinersClient() {
  const [products, setProducts] = useState<AslProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [elecCost, setElecCost] = useState(0.06);
  const [sortBy, setSortBy] = useState<'profit' | 'hashrate' | 'efficiency' | 'price'>('profit');
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [algoFilter, setAlgoFilter] = useState('');
  const [coinFilter, setCoinFilter] = useState('');
  const [coinPrices, setCoinPrices] = useState<Record<string, number>>({});
  const [networkTh, setNetworkTh] = useState(0);
  const [btcDiff, setBtcDiff] = useState(92300000000000);
  const [btcBlockReward, setBtcBlockReward] = useState(3.125);
  const [time, setTime] = useState(Date.now());

  const fetchAll = useCallback(async () => {
    try {
      const [productsRes, priceRes] = await Promise.all([
        fetch('/api/aslminers'),
        fetch(CG_URL),
      ]);

      if (productsRes.ok) {
        const json = await productsRes.json();
        const all: AslProduct[] = json.data?.All || [];
        setProducts(all);
      }

      if (priceRes.ok) {
        const prices = await priceRes.json();
        const mapped: Record<string, number> = {};
        for (const [key, val] of Object.entries(prices)) {
          mapped[key] = (val as Record<string, number>).usd || 0;
        }
        setCoinPrices(mapped);
      }

      fetch('https://mempool.space/api/v1/mining/hashrate/1d')
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.currentHashrate) setNetworkTh(d.currentHashrate / 1e12); })
        .catch(() => {});

      fetch('https://mempool.space/api/v1/difficulty/adjustment')
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.difficulty) setBtcDiff(d.difficulty); })
        .catch(() => {});

      fetch('https://mempool.space/api/blocks/tip/height')
        .then(r => r.ok ? r.json() : null)
        .then(h => {
          if (h) {
            const era = Math.floor(h / 210000);
            setBtcBlockReward(50 / Math.pow(2, era));
          }
        })
        .catch(() => {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(() => {
      fetchAll();
      setTime(Date.now());
    }, POLL_MS);
    return () => clearInterval(id);
  }, [fetchAll]);

  const btcPrice = coinPrices['bitcoin'] || 0;

  const filterOptions = useMemo(() => {
    const brands = new Set<string>();
    const algos = new Set<string>();
    const coins = new Set<string>();
    for (const p of products) {
      const m = getManufacturer(p.name);
      if (m && m !== 'Unknown') brands.add(m);
      if (p.algorithm && String(p.algorithm).trim()) algos.add(String(p.algorithm));
      if (p.coin_name && String(p.coin_name).trim()) coins.add(String(p.coin_name));
    }
    return {
      brands: Array.from(brands).sort(),
      algos: Array.from(algos).sort(),
      coins: Array.from(coins).sort(),
    };
  }, [products]);

  const enriched = useMemo(() => {
    return products
      .filter((p) => {
        const h = toNum(p.hashrate);
        const w = toNum(p.power);
        return h > 0 && w > 0;
      })
      .map((p) => {
        const hashrate = toNum(p.hashrate);
        const power = toNum(p.power);
        const price = Math.max(0, toNum(p.miner_price));
        const coinName = p.coin_name || 'BTC';
        const coinId = COINGECKO_IDS[(coinName as string)] || 'bitcoin';
        const cgPrice = coinPrices[coinId] || 0;

        const coin = p.coins?.[0];
        const rawCoinPrice = toNum(p.coin_price);
        let coinPrice = 0;
        if (coin && coin.price > 0) coinPrice = coin.price;
        else if (rawCoinPrice > 0) coinPrice = rawCoinPrice;
        else coinPrice = cgPrice || btcPrice || 0;

        const unitMult = UNIT_MULTIPLIER[p.unit.toUpperCase()] || 1;
        const hashratePerSec = hashrate * unitMult;

        let grossUsd = 0;
        const isSHA256 = p.algorithm === 'SHA-256' || String(p.algorithm).toUpperCase() === 'SHA-256';

        const apiNetHash = toNum((coin as any)?.network_hashrate || (p as any).network_hashrate) || 0;
        const apiBlockTime = toNum((coin as any)?.block_time || (p as any).block_time || (p as any).blocktime) || 0;
        const apiBlockReward = toNum(coin?.reward_block || p.blockreward) || 0;

        if (isSHA256 && apiNetHash <= 0) {
          const diff = btcDiff > 0 ? btcDiff : 92300000000000;
          const reward = btcBlockReward > 0 ? btcBlockReward : 3.125;
          const price = btcPrice || coinPrice;
          const sharesPerDay = hashratePerSec * 86400;
          const blocksPerDay = sharesPerDay / (diff * 4294967296);
          grossUsd = blocksPerDay * reward * price;
        } else {
          const networkHPS = apiNetHash > 0 ? apiNetHash : (COIN_NETWORK[coinName]?.networkHPS || 1e12);
          const blockSec = apiBlockTime > 0 ? apiBlockTime : (COIN_NETWORK[coinName]?.blockTimeSec || 60);
          const blockRwd = apiBlockReward > 0 ? apiBlockReward : (COIN_NETWORK[coinName]?.blockReward || 1);
          if (networkHPS > 0 && blockSec > 0 && blockRwd > 0) {
            const minerShare = hashratePerSec / networkHPS;
            const blocksPerDay = 86400 / blockSec;
            grossUsd = minerShare * blocksPerDay * blockRwd * coinPrice;
          }
        }

        const powerCost = (power / 1000) * 24 * elecCost;
        const netUsd = grossUsd - powerCost;
        const paybackDays = netUsd > 0 && price > 0 ? price / netUsd : 99999;
        const roi = price > 0 ? (netUsd * 365 / price) * 100 : 0;
        const eff = formatEfficiency(power, hashratePerSec);
        const efficiency = eff.value;
        const efficiencyUnit = eff.unit;
        const manufacturer = getManufacturer(p.name);

        return { ...p, hashrate, power, price, coinPrice, grossUsd, netUsd, powerCost, paybackDays, roi, efficiency, efficiencyUnit, manufacturer, hashratePerSec, unitMult };
      })
      .filter((p) => p.hashrate > 0 && p.power > 0);
  }, [products, coinPrices, btcPrice, elecCost, time]);

  const filtered = useMemo(() => {
    let list = enriched;
    if (brandFilter) {
      list = list.filter((p) => p.manufacturer.toLowerCase() === brandFilter.toLowerCase());
    }
    if (algoFilter) {
      list = list.filter((p) => String(p.algorithm || '').toLowerCase() === algoFilter.toLowerCase());
    }
    if (coinFilter) {
      list = list.filter((p) => String(p.coin_name || '').toLowerCase() === coinFilter.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.algorithm || '').toLowerCase().includes(q) ||
        (p.coin_name || '').toLowerCase().includes(q) ||
        p.manufacturer.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      switch (sortBy) {
        case 'profit': return b.netUsd - a.netUsd;
        case 'hashrate': return b.hashratePerSec - a.hashratePerSec;
        case 'efficiency': return a.efficiency - b.efficiency;
        case 'price': return a.price - b.price;
        default: return 0;
      }
    });
  }, [enriched, search, sortBy, brandFilter, algoFilter, coinFilter]);

  const totalTh = filtered.reduce((s, p) => s + p.hashratePerSec / 1e12, 0);
  const profitableCount = filtered.filter(p => p.netUsd > 0).length;
  const totalGross = filtered.reduce((s, p) => s + p.grossUsd, 0);
  const avgThPerDay = totalTh > 0 ? totalGross / totalTh : 0;

  return (
    <div>
      <AnnouncementBar />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">ASIC Miners</h1>
          <p className="text-sm text-gray-400 mt-1">
            Live profitability &bull; BTC: ${btcPrice.toLocaleString()} &bull; {networkTh > 0 ? `${formatCompact(networkTh)} TH/s network` : 'Loading network...'}
          </p>
        </div>
        {loading && <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4">
          <label className="text-sm font-medium text-gray-300 mb-2 block">Your Electricity Cost ($/kWh)</label>
          <p className="text-xs text-gray-500 mb-3">Pakistan: $0.03-0.08 &bull; UAE: $0.08 &bull; USA: $0.12</p>
          <div className="flex items-center gap-4 mb-3">
            <input
              type="range" min="0.01" max="0.50" step="0.01"
              value={elecCost}
              onChange={(e) => setElecCost(parseFloat(e.target.value))}
              className="flex-1 accent-orange-500"
            />
            <span className="text-lg font-bold text-orange-400 min-w-[60px] text-right">${elecCost.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            {ELEC_PRESETS.map((v) => (
              <button key={v} onClick={() => setElecCost(v)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${elecCost === v ? 'bg-orange-500 text-white' : 'bg-[#1e1e2e] text-gray-400 hover:bg-[#2a2a3e]'}`}
              >${v.toFixed(2)}</button>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4">
          <div className="text-sm font-medium text-gray-300 mb-3">Sort by:</div>
          <div className="flex flex-wrap gap-2">
            {([
              { key: 'profit', label: 'Daily Profit', icon: TrendingUp },
              { key: 'hashrate', label: 'Hashrate', icon: Hash },
              { key: 'efficiency', label: 'Efficiency', icon: Zap },
              { key: 'price', label: 'Price', icon: DollarSign },
            ] as const).map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.key} onClick={() => setSortBy(s.key as typeof sortBy)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortBy === s.key ? 'bg-orange-500 text-white' : 'bg-[#1e1e2e] text-gray-400 hover:bg-[#2a2a3e]'}`}
                ><Icon className="h-3 w-3" /> {s.label}</button>
              );
            })}
          </div>
        </div>
      </div>

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-3">
            <p className="text-xs text-gray-500">BTC Price</p>
            <p className="text-lg font-bold text-white">${btcPrice.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-3">
            <p className="text-xs text-gray-500">Network Hashrate</p>
            <p className="text-lg font-bold text-white">{networkTh > 0 ? `${formatCompact(networkTh)} TH/s` : '\u2014'}</p>
          </div>
          <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-3">
            <p className="text-xs text-gray-500">$/TH/s per day</p>
            <p className="text-lg font-bold text-white">${btcPrice > 0 && networkTh > 0 ? ((btcPrice * 3.125 * 144) / networkTh).toFixed(4) : '\u2014'}</p>
          </div>
          <div className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-3">
            <p className="text-xs text-gray-500">Profitable Miners</p>
            <p className="text-lg font-bold text-green-400">{profitableCount}/{filtered.length}</p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="space-y-3 mb-4">
          <div>
            <div className="text-xs font-medium text-gray-400 mb-2">Brand:</div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setBrandFilter('')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${!brandFilter ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-[#1e1e2e] text-gray-400 hover:bg-[#2a2a3e] border border-[#2a2a3e]'}`}
              >All</button>
              {filterOptions.brands.slice(0, 20).map((b) => (
                <button key={b} onClick={() => setBrandFilter(brandFilter === b ? '' : b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${brandFilter === b ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-[#1e1e2e] text-gray-400 hover:bg-[#2a2a3e] border border-[#2a2a3e]'}`}
                >{b}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400 mb-2">Algorithms:</div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setAlgoFilter('')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${!algoFilter ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-[#1e1e2e] text-gray-400 hover:bg-[#2a2a3e] border border-[#2a2a3e]'}`}
              >All</button>
              {filterOptions.algos.map((a) => (
                <button key={a} onClick={() => setAlgoFilter(algoFilter === a ? '' : a)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${algoFilter === a ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-[#1e1e2e] text-gray-400 hover:bg-[#2a2a3e] border border-[#2a2a3e]'}`}
                >{a}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400 mb-2">Crypto currencies:</div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setCoinFilter('')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${!coinFilter ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-[#1e1e2e] text-gray-400 hover:bg-[#2a2a3e] border border-[#2a2a3e]'}`}
              >All</button>
              {filterOptions.coins.map((c) => (
                <button key={c} onClick={() => setCoinFilter(coinFilter === c ? '' : c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${coinFilter === c ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-[#1e1e2e] text-gray-400 hover:bg-[#2a2a3e] border border-[#2a2a3e]'}`}
                >{c}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" placeholder="Search miners by name, algorithm, or coin..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12121a] border border-[#1e1e2e] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-72 rounded-xl bg-[#12121a] border border-[#1e1e2e] animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p) => {
              const imgSrc = fixImageUrl(p.image_url);
              return (
                <div key={p.id} className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-4 hover:border-orange-500/30 transition-all group">
                  <div className="flex items-start gap-4 mb-3">
                    {imgSrc && (
                      <div className="w-20 h-20 rounded-xl bg-[#0d0d14] flex items-center justify-center p-2 shrink-0">
                        <img src={imgSrc} alt={p.image_alt || p.name} className="w-full h-full object-contain" loading="lazy" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{p.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{p.manufacturer} &bull; {p.algorithm || 'N/A'} &bull; {p.coin_name || 'N/A'}</p>
                      <p className="text-lg font-bold text-orange-400 mt-1">${p.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">MSRP</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div className="bg-[#0d0d14] rounded-lg p-2">
                      <span className="text-gray-500 block">Hashrate</span>
                      <span className="text-white font-semibold">{formatHashrate(p.hashrate, p.unit)}</span>
                    </div>
                    <div className="bg-[#0d0d14] rounded-lg p-2">
                      <span className="text-gray-500 block">Power</span>
                      <span className="text-white font-semibold">{p.power}W</span>
                    </div>
                    <div className="bg-[#0d0d14] rounded-lg p-2">
                      <span className="text-gray-500 block">Efficiency</span>
                      <span className="text-white font-semibold">{(p as any).efficiencyUnit ? `${p.efficiency.toFixed(1)} ${(p as any).efficiencyUnit}` : `${p.efficiency.toFixed(1)} J/TH`}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Daily Revenue</span>
                      <span className="text-green-400 font-medium">${p.grossUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Elec Cost/day</span>
                      <span className="text-red-400 font-medium">-${p.powerCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#1e1e2e] pt-1">
                      <span className="text-gray-300 font-medium">Daily Profit</span>
                      <span className={`font-bold ${p.netUsd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {p.netUsd >= 0 ? '+' : ''}${p.netUsd.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly</span>
                      <span className={`font-medium ${p.netUsd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {p.netUsd >= 0 ? '+' : ''}${(p.netUsd * 30).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Break-even</span>
                      <span className="text-gray-300 font-medium">
                        {p.paybackDays >= 99999 ? 'Never' : p.paybackDays < 365 ? `${Math.round(p.paybackDays)} days` : `${(p.paybackDays / 365).toFixed(1)} years`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ROI/yr</span>
                      <span className={`font-medium ${p.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {p.roi >= 0 ? '+' : ''}{p.roi.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <a href={ASL_REF} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all"
                  ><ShoppingCart className="h-4 w-4" /> Buy (1)</a>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Cpu className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No miners found</p>
              <p className="text-xs mt-1">Try adjusting your search</p>
            </div>
          )}

          <div className="mt-6 p-4 rounded-xl bg-[#12121a] border border-[#1e1e2e]">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500">
                Profitability calculations are estimates based on current coin prices &amp; network difficulty from ASL Miners &amp; CoinGecko.
                Mining revenue changes daily. Some links may be affiliate links &mdash; we earn a small commission at no extra cost to you.
                Always DYOR before purchasing miners.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
