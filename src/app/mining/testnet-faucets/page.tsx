'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Droplets, Search, Star, CheckCircle } from 'lucide-react';
import { AnnouncementBar } from '@/components/admin/announcement-bar';

const FAUCETS = [
  { chain: 'Ethereum Sepolia', network: 'Testnet', url: 'https://sepoliafaucet.com/', alt: ['https://faucets.chainstack.com/sepolia-faucet', 'https://www.alchemy.com/faucets/ethereum-sepolia'], token: 'SepoliaETH', free: true, daily: '0.5 ETH/day', icon: '⟠', color: '#627EEA' },
  { chain: 'Ethereum Holesky', network: 'Testnet', url: 'https://holeskyfaucet.io/', alt: ['https://faucets.chainstack.com/holesky-faucet'], token: 'HoleskyETH', free: true, daily: '1 ETH/day', icon: '⟠', color: '#627EEA' },
  { chain: 'Base Sepolia', network: 'Testnet', url: 'https://www.alchemy.com/faucets/base-sepolia', alt: ['https://faucets.chainstack.com/base-sepolia-faucet'], token: 'BaseETH', free: true, daily: '0.5 ETH/day', icon: '🔵', color: '#0052FF' },
  { chain: 'Arbitrum Sepolia', network: 'Testnet', url: 'https://www.alchemy.com/faucets/arbitrum-sepolia', alt: ['https://faucets.chainstack.com/arbitrum-sepolia-faucet'], token: 'ArbETH', free: true, daily: '0.5 ETH/day', icon: '🔵', color: '#28A0F0' },
  { chain: 'Optimism Sepolia', network: 'Testnet', url: 'https://www.alchemy.com/faucets/optimism-sepolia', alt: ['https://faucets.chainstack.com/optimism-sepolia-faucet'], token: 'OptETH', free: true, daily: '0.5 ETH/day', icon: '🔴', color: '#FF0420' },
  { chain: 'Polygon Amoy', network: 'Testnet', url: 'https://faucet.polygon.technology/', alt: ['https://www.alchemy.com/faucets/polygon-amoy'], token: 'POL', free: true, daily: '0.5 POL/day', icon: '🟣', color: '#8247E5' },
  { chain: 'BNB Chain Testnet', network: 'Testnet', url: 'https://www.bnbchain.org/en/testnet-faucet', alt: ['https://testnet.bnbchain.org/faucet-smart'], token: 'tBNB', free: true, daily: '1 tBNB/day', icon: '🟡', color: '#F0B90B' },
  { chain: 'Avalanche Fuji', network: 'Testnet', url: 'https://faucet.avax.network/', alt: ['https://www.alchemy.com/faucets/avalanche-fuji-testnet'], token: 'AVAX', free: true, daily: '2 AVAX/day', icon: '🔺', color: '#E84142' },
  { chain: 'zkSync Sepolia', network: 'Testnet', url: 'https://www.alchemy.com/faucets/zksync-sepolia', alt: ['https://faucets.chainstack.com/zksync-sepolia-faucet'], token: 'ETH', free: true, daily: '0.5 ETH/day', icon: '🔵', color: '#4E529A' },
  { chain: 'Starknet Sepolia', network: 'Testnet', url: 'https://starknet-faucet.vercel.app/', alt: ['https://www.alchemy.com/faucets/starknet-sepolia'], token: 'STRK', free: true, daily: '0.01 STRK/day', icon: '🔴', color: '#EC796B' },
  { chain: 'Scroll Sepolia', network: 'Testnet', url: 'https://www.alchemy.com/faucets/scroll-sepolia', alt: ['https://scrollfaucet.com/'], token: 'ETH', free: true, daily: '0.5 ETH/day', icon: '🟡', color: '#FDD835' },
  { chain: 'Linea Sepolia', network: 'Testnet', url: 'https://www.alchemy.com/faucets/linea-sepolia', alt: ['https://faucets.chainstack.com/linea-sepolia-faucet'], token: 'ETH', free: true, daily: '0.5 ETH/day', icon: '⚫', color: '#000000' },
  { chain: 'Blast Sepolia', network: 'Testnet', url: 'https://www.alchemy.com/faucets/blast-sepolia', alt: [], token: 'ETH', free: true, daily: '0.5 ETH/day', icon: '🟡', color: '#F4D03F' },
  { chain: 'Mantle Sepolia', network: 'Testnet', url: 'https://www.alchemy.com/faucets/mantle-sepolia', alt: [], token: 'MNT', free: true, daily: '1 MNT/day', icon: '🟢', color: '#00C9A7' },
  { chain: 'Solana Devnet', network: 'Testnet', url: 'https://faucet.solana.com/', alt: ['https://www.alchemy.com/faucets/solana-devnet'], token: 'SOL', free: true, daily: '2 SOL/day', icon: '🟣', color: '#9945FF' },
  { chain: 'Sui Testnet', network: 'Testnet', url: 'https://faucet.sui.io/', alt: [], token: 'SUI', free: true, daily: '1 SUI/day', icon: '🟢', color: '#6FBCF0' },
  { chain: 'Aptos Testnet', network: 'Testnet', url: 'https://aptos.dev/network/faucet', alt: ['https://www.alchemy.com/faucets/aptos-testnet'], token: 'APT', free: true, daily: '1 APT/day', icon: '🟢', color: '#4CD9C0' },
  { chain: 'Sei Testnet', network: 'Testnet', url: 'https://www.alchemy.com/faucets/sei-testnet', alt: [], token: 'SEI', free: true, daily: '1 SEI/day', icon: '🔴', color: '#9B1C2F' },
  { chain: 'Berachain Testnet', network: 'Testnet', url: 'https://bartio.faucet.berachain.com/', alt: [], token: 'BERA', free: true, daily: '1 BERA/day', icon: '🔴', color: '#D42828' },
];

export default function TestnetFaucetsPage() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');

  const filtered = FAUCETS.filter(f =>
    f.chain.toLowerCase().includes(search.toLowerCase()) ||
    f.token.toLowerCase().includes(search.toLowerCase())
  );

  const copyAddress = (chain: string) => {
    setCopied(chain);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <AnnouncementBar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Droplets className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Testnet Faucets</h1>
          <p className="text-gray-400">Free testnet tokens for all major chains. Build and test your dApps!</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-green-400 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" /> {FAUCETS.length} Faucets Available
            </Badge>
          </div>
        </div>

        <div className="relative mb-6 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" placeholder="Search chains..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12121a] border border-[#1e1e2e] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f) => (
            <Card key={f.chain} className="border-[#1e1e2e] bg-[#12121a] hover:border-blue-500/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{f.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{f.chain}</h3>
                      <p className="text-xs text-gray-500">{f.token}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-500/30 text-[10px]">
                    <Star className="h-2 w-2 mr-0.5" /> FREE
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Daily limit: {f.daily}
                </div>
                <div className="flex gap-2">
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <button className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1">
                      Get Tokens <ExternalLink className="h-3 w-3" />
                    </button>
                  </a>
                  {f.alt[0] && (
                    <a href={f.alt[0]} target="_blank" rel="noopener noreferrer">
                      <button className="px-3 py-2 rounded-lg border border-[#1e1e2e] bg-[#0d0d14] text-gray-400 hover:text-white text-xs transition-colors">
                        Alt
                      </button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-[#1e1e2e] bg-[#12121a]">
          <CardHeader>
            <CardTitle className="text-sm">Faucet Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-400 space-y-2">
            <p>• Most faucets require you to sign in with GitHub or Google</p>
            <p>• Some faucets have daily limits - come back tomorrow for more</p>
            <p>• If one faucet is empty, try the alternative links</p>
            <p>• Use testnet tokens for deploying contracts, testing dApps, and exploring protocols</p>
            <p>• Never send real tokens to testnet addresses!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
