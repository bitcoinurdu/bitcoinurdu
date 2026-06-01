'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, Clock, Zap, Sun } from 'lucide-react';

const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA', gmUrl: 'https://www.geam.io/', explorer: 'https://etherscan.io', gasTip: '~$0.01-0.10' },
  { id: 'base', name: 'Base', color: '#0052FF', gmUrl: 'https://www.geam.io/', explorer: 'https://basescan.org', gasTip: '~$0.001' },
  { id: 'arbitrum', name: 'Arbitrum', color: '#28A0F0', gmUrl: 'https://www.geam.io/', explorer: 'https://arbiscan.io', gasTip: '~$0.001' },
  { id: 'optimism', name: 'Optimism', color: '#FF0420', gmUrl: 'https://www.geam.io/', explorer: 'https://optimistic.etherscan.io', gasTip: '~$0.001' },
  { id: 'polygon', name: 'Polygon', color: '#8247E5', gmUrl: 'https://gm.xyz/', explorer: 'https://polygonscan.com', gasTip: '~$0.001' },
  { id: 'bsc', name: 'BNB Chain', color: '#F0B90B', gmUrl: 'https://gm.xyz/', explorer: 'https://bscscan.com', gasTip: '~$0.001' },
  { id: 'avalanche', name: 'Avalanche', color: '#E84142', gmUrl: 'https://gm.xyz/', explorer: 'https://snowtrace.io', gasTip: '~$0.01' },
  { id: 'zksync', name: 'zkSync Era', color: '#4E529A', gmUrl: 'https://gm.xyz/', explorer: 'https://explorer.zksync.io', gasTip: '~$0.001' },
  { id: 'starknet', name: 'Starknet', color: '#EC796B', gmUrl: 'https://gm.xyz/', explorer: 'https://starkscan.co', gasTip: '~$0.001' },
  { id: 'scroll', name: 'Scroll', color: '#FDD835', gmUrl: 'https://gm.xyz/', explorer: 'https://scrollscan.com', gasTip: '~$0.001' },
  { id: 'linea', name: 'Linea', color: '#000000', gmUrl: 'https://gm.xyz/', explorer: 'https://lineascan.build', gasTip: '~$0.001' },
  { id: 'blast', name: 'Blast', color: '#F4D03F', gmUrl: 'https://gm.xyz/', explorer: 'https://blastscan.io', gasTip: '~$0.001' },
  { id: 'mantle', name: 'Mantle', color: '#00C9A7', gmUrl: 'https://gm.xyz/', explorer: 'https://mantlescan.xyz', gasTip: '~$0.001' },
  { id: 'mode', name: 'Mode', color: '#000000', gmUrl: 'https://gm.xyz/', explorer: 'https://explorer.mode.network', gasTip: '~$0.001' },
  { id: 'sei', name: 'Sei', color: '#9B1C2F', gmUrl: 'https://gm.xyz/', explorer: 'https://seitrace.com', gasTip: '~$0.001' },
  { id: 'solana', name: 'Solana', color: '#9945FF', gmUrl: 'https://gm.xyz/', explorer: 'https://solscan.io', gasTip: '~$0.001' },
];

export default function OnchainGMPage() {
  const [checkedToday, setCheckedToday] = useState<Record<string, boolean>>({});
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const d = new Date().toISOString().split('T')[0];
    setTodayDate(d);
    try {
      const raw = localStorage.getItem(`bu_gm_${d}`);
      if (raw) setCheckedToday(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleGM = (chainId: string) => {
    const updated = { ...checkedToday, [chainId]: !checkedToday[chainId] };
    setCheckedToday(updated);
    localStorage.setItem(`bu_gm_${todayDate}`, JSON.stringify(updated));
  };

  const doneCount = Object.values(checkedToday).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <Sun className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Onchain GM</h1>
          <p className="text-gray-400">Send daily GM across all chains. Build your onchain presence!</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="text-green-400 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" /> {doneCount}/{CHAINS.length} Done Today
            </Badge>
            <Badge variant="outline" className="text-gray-400 border-gray-500/30">
              <Clock className="h-3 w-3 mr-1" /> {todayDate}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAINS.map((chain) => {
            const done = !!checkedToday[chain.id];
            return (
              <Card key={chain.id} className={`border transition-all ${done ? 'border-green-500/50 bg-green-500/5' : 'border-[#1e1e2e] bg-[#12121a] hover:border-orange-500/30'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }} />
                      <span className="text-sm font-semibold text-white">{chain.name}</span>
                    </div>
                    {done && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Zap className="h-3 w-3" /> Gas: {chain.gasTip}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant={done ? 'outline' : 'default'} className={`flex-1 text-xs ${done ? 'border-green-500/30 text-green-400' : 'bg-orange-500 hover:bg-orange-600'}`} onClick={() => toggleGM(chain.id)}>
                      {done ? 'Done ✓' : 'GM'}
                    </Button>
                    <a href={chain.gmUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="text-xs border-[#1e1e2e]">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 border-[#1e1e2e] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-sm">About Onchain GM</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-400 space-y-2">
            <p>Daily onchain GM (Good Morning) transactions help you build an active onchain presence across multiple chains.</p>
            <p>This can qualify you for potential airdrops from protocols that reward active onchain users.</p>
            <p>Click <strong>GM</strong> to mark a chain as done, or click the <strong>link icon</strong> to open the GM DApp directly.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
