'use client';

import React, { useState, useMemo } from 'react';

interface MinerData {
  id: string;
  name: string;
  brand: string;
  algo: string;
  coins: string[];
  hashrate: number;
  hashUnit: string;
  power: number;
  price: number;
  grossProfitDay: number;
}

const ASIC_MINERS: MinerData[] = [
  { id: 'asic-1', name: 'GoldShell XT-BOX (580G)', brand: 'GoldShell', algo: 'SHA3x', coins: ['CHAT'], hashrate: 580, hashUnit: 'GH/s', power: 400, price: 1890, grossProfitDay: 2.10 },
  { id: 'asic-2', name: 'IceRiver ALEO AE3 (2Gh)', brand: 'IceRiver', algo: 'zkSNARK', coins: ['ALEO'], hashrate: 2, hashUnit: 'GH/s', power: 3400, price: 5880, grossProfitDay: 18.50 },
  { id: 'asic-3', name: 'IceRiver ALPH Miner (360Gh)', brand: 'IceRiver', algo: 'Blake3', coins: ['ALPH'], hashrate: 360, hashUnit: 'GH/s', power: 1500, price: 2800, grossProfitDay: 9.20 },
  { id: 'asic-4', name: 'IceRiver ALEO AE2 (720Mh)', brand: 'IceRiver', algo: 'zkSNARK', coins: ['ALEO'], hashrate: 720, hashUnit: 'MH/s', power: 1300, price: 2538, grossProfitDay: 5.80 },
  { id: 'asic-5', name: 'GoldShell BOXx400', brand: 'GoldShell', algo: 'Blake3', coins: ['ALPH', 'IRON'], hashrate: 400, hashUnit: 'GH/s', power: 1800, price: 1200, grossProfitDay: 4.10 },
  { id: 'asic-6', name: 'Antminer Z15 Pro', brand: 'Bitmain', algo: 'Equihash', coins: ['ZEC', 'ZEN'], hashrate: 420, hashUnit: 'KH/s', power: 1510, price: 3200, grossProfitDay: 3.80 },
  { id: 'asic-7', name: 'Antminer S23 Hyd (1.16Ph)', brand: 'Bitmain', algo: 'SHA-256', coins: ['BTC'], hashrate: 1.16, hashUnit: 'PH/s', power: 11020, price: 7757, grossProfitDay: 61.02 },
  { id: 'asic-8', name: 'SealMiner A4 Ultra Hydro', brand: 'Bitdeer', algo: 'SHA-256', coins: ['BTC'], hashrate: 886, hashUnit: 'TH/s', power: 8372, price: 9980, grossProfitDay: 46.60 },
  { id: 'asic-9', name: 'Matches INIBOX Pro (2.4Gh)', brand: 'Pinecone', algo: 'VersaHash', coins: ['INI'], hashrate: 2.4, hashUnit: 'GH/s', power: 1280, price: 7799, grossProfitDay: 15.76 },
  { id: 'asic-10', name: 'Matches INIBOX (850Mh)', brand: 'Pinecone', algo: 'VersaHash', coins: ['INI'], hashrate: 850, hashUnit: 'MH/s', power: 500, price: 4065, grossProfitDay: 5.47 },
  { id: 'asic-11', name: 'Antminer L9', brand: 'Bitmain', algo: 'Scrypt', coins: ['LTC', 'DOGE'], hashrate: 3.8, hashUnit: 'GH/s', power: 3260, price: 6800, grossProfitDay: 12.55 },
  { id: 'asic-12', name: 'Whatsminer M60S', brand: 'MicroBT', algo: 'SHA-256', coins: ['BTC', 'BCH'], hashrate: 186, hashUnit: 'TH/s', power: 3348, price: 3800, grossProfitDay: 9.78 },
];

export default function MiningHardwareDashboard() {
  const [elecCost, setElecCost] = useState<number>(0.10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  const brands = useMemo(() => {
    const set = new Set(ASIC_MINERS.map(m => m.brand));
    return ['All', ...Array.from(set)];
  }, []);

  const computedMiners = useMemo(() => {
    return ASIC_MINERS.map(miner => {
      const dailyKwh = (miner.power * 24) / 1000;
      const dailyElecCost = dailyKwh * elecCost;
      const netProfitDay = miner.grossProfitDay - dailyElecCost;

      let paybackDays = 'Infinite';
      if (netProfitDay > 0) {
        paybackDays = Math.ceil(miner.price / netProfitDay) + ' Days';
      }

      return {
        ...miner,
        dailyElecCost,
        netProfitDay,
        paybackDays
      };
    }).filter(miner => {
      const matchesSearch = miner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            miner.algo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === 'All' || miner.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [elecCost, searchQuery, selectedBrand]);

  return (
    <div className="w-full max-w-[100vw] min-h-screen px-4 md:px-8 mx-auto bg-background text-foreground py-8 font-sans">

      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xl mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-border pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-primary flex items-center gap-2">
              ⛏️ Professional ASIC Mining Hardware Hub
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Industrial ASIC computing profitability terminal. Adjusted values bypass local storage and display true net values.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-muted/60 p-4 rounded-2xl border border-border">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">⚡ Elec. Cost / kWh</span>
              <span className="text-[10px] text-primary font-medium">Overwrites raw computing power cost</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 font-bold text-muted-foreground text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={elecCost}
                onChange={(e) => setElecCost(Number(e.target.value) || 0)}
                className="w-32 h-11 pl-7 pr-3 rounded-xl border border-input bg-background font-bold text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
          <div className="md:col-span-8 flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">🔍 Search ASIC Model / Algorithm</label>
            <input
              type="text"
              placeholder="Search Antminer, IceRiver, SHA-256..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-4 flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">🏢 ASIC Brand Filter</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold text-xs uppercase tracking-wider">
                <th className="py-4 px-4 whitespace-nowrap">ASIC Miner / Model</th>
                <th className="py-4 px-4 whitespace-nowrap">Algorithm / Coin</th>
                <th className="py-4 px-4 whitespace-nowrap">Hashrate</th>
                <th className="py-4 px-4 whitespace-nowrap">Power (W)</th>
                <th className="py-4 px-4 whitespace-nowrap">Hardware Price</th>
                <th className="py-4 px-4 whitespace-nowrap">Gross / Day</th>
                <th className="py-4 px-4 whitespace-nowrap">Elec / Day</th>
                <th className="py-4 px-4 whitespace-nowrap">Net / Day</th>
                <th className="py-4 px-4 whitespace-nowrap">Est. Payback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {computedMiners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground font-semibold">
                    No verified ASIC hardware found matching filters.
                  </td>
                </tr>
              ) : (
                computedMiners.map((miner) => (
                  <tr key={miner.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-foreground">{miner.name}</div>
                      <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{miner.brand}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs font-semibold text-foreground bg-muted border border-border px-2 py-0.5 rounded-md inline-block">
                        {miner.algo}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {miner.coins.map(c => (
                          <span key={c} className="text-[10px] bg-bitcoin/10 text-bitcoin font-black px-1.5 py-0.2 rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-foreground">
                      {miner.hashrate} {miner.hashUnit}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground font-mono">
                      {miner.power.toLocaleString()}W
                    </td>
                    <td className="py-4 px-4 font-bold text-foreground">
                      ${miner.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-foreground font-semibold">
                      ${miner.grossProfitDay.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-crypto-red font-mono text-xs">
                      -${miner.dailyElecCost.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-black font-mono text-base ${miner.netProfitDay > 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                        {miner.netProfitDay > 0 ? '+' : ''}${miner.netProfitDay.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        miner.netProfitDay > 0 ? 'bg-crypto-green/10 text-crypto-green' : 'bg-crypto-red/10 text-crypto-red'
                      }`}>
                        {miner.paybackDays}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
