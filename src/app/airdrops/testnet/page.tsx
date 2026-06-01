'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronLeft, Search, Beaker, CheckCircle, Clock, Zap, Coins } from 'lucide-react';

interface TestnetAirdrop {
  id: string;
  title: string;
  protocol: string;
  description: string;
  network: string;
  token: string;
  faucetUrl: string;
  status: 'active' | 'upcoming' | 'ended';
  tasks: string[];
  estimatedReward: string;
  deadline: string;
}

const testnetAirdrops: TestnetAirdrop[] = [
  { id: 't1', title: 'Monad Testnet', protocol: 'Monad', description: 'Monad L1 blockchain ka testnet. High throughput parallel EVM. Testnet tokens claim karein aur transactions karein.', network: 'Monad Testnet', token: 'MON', faucetUrl: 'https://testnet.monad.xyz', status: 'active', tasks: ['Get testnet MON tokens', 'Swap onDEX', 'Provide liquidity', 'Deploy smart contract'], estimatedReward: 'Potential mainnet airdrop', deadline: 'Ongoing' },
  { id: 't2', title: 'Berachain Bartio', protocol: 'Berachain', description: 'Berachain ka Bartio testnet live hai. Proof of Liquidity consensus. Test karein aur airdrop ke liye qualify karein.', network: 'Bartio Testnet', token: 'BERA', faucetUrl: 'https://bartio.faucet.berachain.com', status: 'active', tasks: ['Claim BERA faucet tokens', 'Swap on BEX', 'Provide liquidity', 'Mint NFT'], estimatedReward: 'Mainnet BERA tokens', deadline: 'Q3 2026' },
  { id: 't3', title: 'Movement Labs Testnet', protocol: 'Movement', description: 'Move-based L2 on Ethereum. Testnet pe Move VM try karein aur early contributor banein.', network: 'Movement Testnet', token: 'MOVE', faucetUrl: 'https://docs.movementlabs.xyz', status: 'active', tasks: ['Bridge testnet tokens', 'Deploy Move module', 'Execute transactions'], estimatedReward: 'MOVE token airdrop', deadline: 'TBA' },
  { id: 't4', title: 'Sei Devnet', protocol: 'Sei', description: 'Sei blockchain ka parallelized EVM testnet. Fast finality try karein.', network: 'Sei Devnet', token: 'SEI', faucetUrl: 'https:// sei.com/faucet', status: 'active', tasks: ['Get devnet SEI', 'Transfer tokens', 'Interact with dApps'], estimatedReward: 'SEI rewards', deadline: 'Ongoing' },
  { id: 't5', title: 'Scroll Testnet', protocol: 'Scroll', description: 'Scroll zkEVM L2 ka testnet. Zero knowledge proof rollup test karein.', network: 'Scroll Sepolia', token: 'ETH', faucetUrl: 'https://scroll.io/faucet', status: 'active', tasks: ['Get Sepolia ETH', 'Bridge to Scroll', 'Swap on DEX', 'Lend/Borrow'], estimatedReward: 'SCR tokens potential', deadline: 'Ongoing' },
  { id: 't6', title: 'Linea Testnet', protocol: 'Linea', description: 'ConsenSys ka zkEVM L2. MetaMask integration ke sath test karein.', network: 'Linea Goerli', token: 'ETH', faucetUrl: 'https://linea.build/faucet', status: 'active', tasks: ['Claim Goerli ETH', 'Bridge to Linea', 'Use dApps'], estimatedReward: 'LINEA potential airdrop', deadline: 'Ongoing' },
  { id: 't7', title: 'Blast Testnet', protocol: 'Blast', description: 'L2 with native yield. Testnet pe yield earning try karein.', network: 'Blast Testnet', token: 'ETH', faucetUrl: 'https://blast.io/faucet', status: 'active', tasks: ['Get testnet ETH', 'Deposit for yield', 'Bridge assets'], estimatedReward: 'BLAST tokens', deadline: 'Ongoing' },
  { id: 't8', title: 'Mantle Testnet', protocol: 'Mantle', description: 'BitDAO backed L2. Testnet pe governance aur DeFi try karein.', network: 'Mantle Testnet', token: 'MNT', faucetUrl: 'https://mantle.xyz/faucet', status: 'active', tasks: ['Claim MNT tokens', 'Vote on proposals', 'Use DeFi protocols'], estimatedReward: 'MNT rewards', deadline: 'Ongoing' },
  { id: 't9', title: 'Mode Testnet', protocol: 'Mode', description: 'OP Stack based L2. Modular DEFI chain. Testnet participation se airdrop milega.', network: 'Mode Testnet', token: 'ETH', faucetUrl: 'https://mode.network/faucet', status: 'active', tasks: ['Get testnet ETH', 'Bridge to Mode', 'Provide liquidity'], estimatedReward: 'MODE tokens', deadline: 'Q4 2026' },
  { id: 't10', title: 'Fraxtal Testnet', protocol: 'Frax Finance', description: 'Frax ka modular L2. FXTL points testnet pe earn karein.', network: 'Fraxtal Testnet', token: 'frxETH', faucetUrl: 'https://fraxtal.xyz/faucet', status: 'active', tasks: ['Claim testnet frxETH', 'Bridge assets', 'Provide liquidity'], estimatedReward: 'FXTL points to tokens', deadline: 'Ongoing' },
  { id: 't11', title: 'Sonic Testnet', protocol: 'Sonic Labs', description: 'Formerly Fantom. High performance L1. Testnet pe Opera try karein.', network: 'Sonic Testnet', token: 'S', faucetUrl: 'https://sonic.build/faucet', status: 'active', tasks: ['Get testnet S tokens', 'Deploy contracts', 'Test DeFi'], estimatedReward: 'SONIC airdrop', deadline: 'Ongoing' },
  { id: 't12', title: 'Abstract Testnet', protocol: 'Abstract', description: 'Consumer-focused L2. NFT aur social features. Early testnet users ko reward milega.', network: 'Abstract Testnet', token: 'ETH', faucetUrl: 'https://abstract.xyz/faucet', status: 'upcoming', tasks: ['Claim testnet ETH', 'Mint NFTs', 'Social features test'], estimatedReward: 'ABSTRACT tokens', deadline: 'TBA' },
];

const networks = ['All', 'Ethereum L2', 'Move', 'Solana', 'Cosmos'];

export default function TestnetAirdropsPage() {
  const [search, setSearch] = useState('');
  const [net, setNet] = useState('All');

  let filtered = testnetAirdrops.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.protocol.toLowerCase().includes(search.toLowerCase());
    const matchNet = net === 'All' || (net === 'Ethereum L2' && (a.network.includes('Scroll') || a.network.includes('Linea') || a.network.includes('Blast') || a.network.includes('Mode') || a.network.includes('Fraxtal') || a.network.includes('Mantle'))) || (net === 'Move' && a.network.includes('Movement')) || (net === 'Solana' && a.network.includes('Sei')) || (net === 'Cosmos' && false);
    return matchSearch && matchNet;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <Link href="/airdrops" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to Airdrops
      </Link>

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Beaker className="h-6 w-6 text-green-500" />
          Testnet Airdrops
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Participate in testnets, earn free test tokens, and qualify for mainnet airdrops
        </p>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
        <Zap className="h-4 w-4 text-green-500 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Testnet tokens ki koi real value nahi hoti. Mainnet launch pe airdrop mil sakta hai. Sirf official faucets use karein.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search testnet airdrops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {networks.map((n) => (
          <button
            key={n}
            onClick={() => setNet(n)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              net === n ? 'bg-bitcoin text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((a) => (
          <Card key={a.id} className="hover:shadow-md transition-all border-l-4 border-l-green-500/40">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold">{a.title}</h3>
                    <Badge variant={a.status === 'active' ? 'green' : a.status === 'upcoming' ? 'secondary' : 'red'} className="text-[10px]">
                      {a.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.protocol} &bull; {a.network}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>

                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground"><Coins className="h-3 w-3" /> Token: {a.token}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {a.deadline}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {a.tasks.map((task, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{task}</Badge>
                    ))}
                  </div>

                  <p className="text-xs font-semibold text-crypto-green">{a.estimatedReward}</p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Button variant="bitcoin" size="sm" asChild className="text-xs h-7">
                    <a href={a.faucetUrl} target="_blank" rel="noopener noreferrer">
                      Faucet <ExternalLink className="h-3 w-3 ml-1" />
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
            <Beaker className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-sm font-semibold mb-1">No testnet airdrops found</h3>
            <p className="text-xs text-muted-foreground">Try changing your search or filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
