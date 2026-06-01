'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronLeft, Search, Gift, CheckCircle, Clock, AlertTriangle, Wallet } from 'lucide-react';

interface RetroAirdrop {
  id: string;
  title: string;
  protocol: string;
  description: string;
  estimatedValue: string;
  eligibility: string;
  deadline: string;
  status: 'claimable' | 'upcoming' | 'ended';
  chains: string[];
  url: string;
  category: string;
}

const retroAirdrops: RetroAirdrop[] = [
  { id: 'r1', title: 'EigenLayer Restaking Rewards', protocol: 'EigenLayer', description: 'Early restakers ko token mila hai. Abhi tak claim kar sakte hain agar aapne January 2024 se pehle stake kiya tha.', estimatedValue: '$500 - $5,000', eligibility: 'Restaked ETH before Jan 2024', deadline: '30 June 2026', status: 'claimable', chains: ['Ethereum'], url: 'https://www.eigenlayer.xyz', category: 'Restaking' },
  { id: 'r2', title: 'LayerZero OFT Holders', protocol: 'LayerZero', description: 'Cross-chain bridge users ko airdrop mila. Agar aapne LayerZero protocol use kiya hai to claim karein.', estimatedValue: '$100 - $2,000', eligibility: 'Used LayerZero bridge', deadline: '15 July 2026', status: 'claimable', chains: ['Ethereum', 'Arbitrum', 'Optimism'], url: 'https://layerzero.network', category: 'Bridge' },
  { id: 'r3', title: 'Jupiter Aggregator Traders', protocol: 'Jupiter', description: 'Solana ke top DEX aggregator ke traders ko retroactive airdrop. Trading volume ke hisaab se mila hai.', estimatedValue: '$200 - $3,000', eligibility: 'Traded on Jupiter before Oct 2023', deadline: '1 August 2026', status: 'claimable', chains: ['Solana'], url: 'https://jup.ag', category: 'DEX' },
  { id: 'r4', title: 'ENS Domain Holders', protocol: 'Ethereum Name Service', description: 'Jo logon ne ENS domain register kiya unko retroactive reward mila hai. .eth holders ke liye.', estimatedValue: '$50 - $500', eligibility: 'Registered ENS domain before Oct 2022', deadline: '31 December 2026', status: 'claimable', chains: ['Ethereum'], url: 'https://ens.domains', category: 'Identity' },
  { id: 'r5', title: 'Blur NFT Traders', protocol: 'Blur', description: 'NFT marketplace pe traders ko airdrop mila. Listing aur bidding ke liye rewards.', estimatedValue: '$100 - $2,000', eligibility: 'Listed/bid on Blur before Feb 2023', deadline: '1 September 2026', status: 'claimable', chains: ['Ethereum'], url: 'https://blur.io', category: 'NFT' },
  { id: 'r6', title: 'zkSync Era Users', protocol: 'zkSync', description: 'Layer 2 bridge aur swap users ko upcoming retroactive drop. Abhi eligibility check karein.', estimatedValue: '$200 - $4,000', eligibility: 'Used zkSync Era mainnet', deadline: 'TBA', status: 'upcoming', chains: ['zkSync Era'], url: 'https://zksync.io', category: 'Layer 2' },
  { id: 'r7', title: 'StarkNet Early Users', protocol: 'StarkNet', description: 'StarkNet ke early adopters ko token airdrop hua hai. Bridge, swap aur dApp use karne walon ke liye.', estimatedValue: '$150 - $2,500', eligibility: 'Used StarkNet before Nov 2022', deadline: '15 August 2026', status: 'claimable', chains: ['StarkNet'], url: 'https://starknet.io', category: 'Layer 2' },
  { id: 'r8', title: 'Uniswap V3 Liquidity Providers', protocol: 'Uniswap', description: 'LPs ko retroactive UNI tokens mile. Liquidity provide karne walon ke liye bonus.', estimatedValue: '$300 - $3,000', eligibility: 'Provided liquidity on Uniswap V3', deadline: '30 September 2026', status: 'claimable', chains: ['Ethereum', 'Arbitrum', 'Optimism'], url: 'https://uniswap.org', category: 'DeFi' },
  { id: 'r9', title: 'Aavegotchi Players', protocol: 'Aavegotchi', description: 'Game ke active players ko GHST token airdrop. Gotchi Owners aur farmers ke liye.', estimatedValue: '$50 - $500', eligibility: 'Active Aavegotchi player', deadline: '1 October 2026', status: 'claimable', chains: ['Polygon'], url: 'https://aavegotchi.com', category: 'GameFi' },
  { id: 'r10', title: 'Scroll Users', protocol: 'Scroll', description: 'Scroll L2 ke early users ko upcoming retroactive drop. Bridge aur use karein abhi se.', estimatedValue: '$100 - $1,500', eligibility: 'Used Scroll mainnet', deadline: 'TBA', status: 'upcoming', chains: ['Scroll'], url: 'https://scroll.io', category: 'Layer 2' },
];

const categories = ['All', 'DeFi', 'Layer 2', 'NFT', 'Bridge', 'DEX', 'GameFi', 'Restaking', 'Identity'];

export default function RetroactiveAirdropsPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  let filtered = retroAirdrops.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.protocol.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === 'All' || a.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <Link href="/airdrops" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to Airdrops
      </Link>

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gift className="h-6 w-6 text-purple-500" />
          Retroactive Airdrops
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Protocols that reward early users with tokens based on past activity
        </p>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <AlertTriangle className="h-4 w-4 text-blue-500 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Always verify airdrop legitimacy. Never share private keys or seed phrases. Official websites se hi claim karein.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search retroactive airdrops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              cat === c ? 'bg-bitcoin text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((a) => (
          <Card key={a.id} className="hover:shadow-md transition-all border-l-4 border-l-purple-500/40">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold">{a.title}</h3>
                    <Badge variant={a.status === 'claimable' ? 'green' : a.status === 'upcoming' ? 'secondary' : 'red'} className="text-[10px]">
                      {a.status === 'claimable' ? 'CLAIM NOW' : a.status.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">{a.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.protocol}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Wallet className="h-3 w-3" /> Est. {a.estimatedValue}</span>
                    <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {a.eligibility}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.deadline}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {a.chains.map((chain) => (
                      <Badge key={chain} variant="outline" className="text-[10px]">{chain}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Button variant="bitcoin" size="sm" asChild className="text-xs h-7">
                    <a href={a.url} target="_blank" rel="noopener noreferrer">
                      Claim <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Gift className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-sm font-semibold mb-1">No retroactive airdrops found</h3>
            <p className="text-xs text-muted-foreground">Try changing your search or category.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
