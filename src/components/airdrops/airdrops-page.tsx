'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Clock, CheckCircle, Gift, ExternalLink, Wallet } from 'lucide-react';
import { AirdropsAd } from '@/components/ads/ad-slots';
import { fetchCmsData } from '@/lib/cms/unified';
import { formatNumber } from '@/lib/utils/helpers';

const NETWORKS = ['All', 'ETH', 'BSC', 'SOL', 'BASE', 'ARB', 'OP', 'zkSync'];

const FALLBACK_AIRDROPS = [
  { id: 'eigenlayer', title: 'EigenLayer Restakers', description: 'EigenLayer protocol ke early restakers ko retroactive airdrop. Agar aapne Ethereum validators ke saath restaking ki hai to claim karein.', status: 'active', networks: ['ETH'], estimatedValue: '$500 - $5,000+', funding: '$150M+', riskScore: 15, url: 'https://www.eigenlayer.xyz', deadline: '30 June 2026' },
  { id: 'layerzero', title: 'LayerZero OFT Holders', description: 'Cross-chain bridge users ko airdrop mila. Agar aapne LayerZero protocol use kiya hai to claim karein.', status: 'active', networks: ['ETH', 'ARB', 'OP'], estimatedValue: '$100 - $2,000', funding: '$265M+', riskScore: 20, url: 'https://layerzero.network', deadline: '15 July 2026' },
  { id: 'jupiter', title: 'Jupiter Aggregator Traders', description: 'Solana ke top DEX aggregator ke traders ko retroactive airdrop. Trading volume ke hisaab se mila hai.', status: 'active', networks: ['SOL'], estimatedValue: '$200 - $3,000', funding: '$100M+', riskScore: 10, url: 'https://jup.ag', deadline: '1 August 2026' },
  { id: 'ens', title: 'ENS Domain Holders', description: 'Jo logon ne ENS domain register kiya unko retroactive reward mila hai. .eth holders ke liye.', status: 'active', networks: ['ETH'], estimatedValue: '$50 - $500', funding: '$50M+', riskScore: 5, url: 'https://ens.domains', deadline: '31 December 2026' },
  { id: 'blur', title: 'Blur NFT Traders', description: 'NFT marketplace pe traders ko airdrop mila. Listing aur bidding ke liye rewards.', status: 'active', networks: ['ETH'], estimatedValue: '$100 - $2,000', funding: '$70M+', riskScore: 25, url: 'https://blur.io', deadline: '1 September 2026' },
  { id: 'zksync', title: 'zkSync Era Users', description: 'Layer 2 bridge aur swap users ko upcoming retroactive drop. Abhi eligibility check karein.', status: 'upcoming', networks: ['zkSync'], estimatedValue: '$200 - $4,000', funding: '$458M+', riskScore: 15, url: 'https://zksync.io', deadline: 'TBA' },
  { id: 'starknet', title: 'StarkNet Early Users', description: 'StarkNet ke early adopters ko token airdrop hua hai. Bridge, swap aur dApp use karne walon ke liye.', status: 'active', networks: ['ETH'], estimatedValue: '$150 - $2,500', funding: '$282M+', riskScore: 20, url: 'https://starknet.io', deadline: '15 August 2026' },
  { id: 'uniswap-v3', title: 'Uniswap V3 Liquidity Providers', description: 'LPs ko retroactive UNI tokens mile. Liquidity provide karne walon ke liye bonus.', status: 'active', networks: ['ETH', 'ARB', 'OP'], estimatedValue: '$300 - $3,000', funding: '$176M+', riskScore: 10, url: 'https://uniswap.org', deadline: '30 September 2026' },
  { id: 'scroll', title: 'Scroll Users', description: 'Scroll L2 ke early users ko upcoming retroactive drop. Bridge aur use karein abhi se.', status: 'upcoming', networks: ['ETH'], estimatedValue: '$100 - $1,500', funding: '$80M+', riskScore: 25, url: 'https://scroll.io', deadline: 'TBA' },
  { id: 'linea', title: 'Linea Park Users', description: 'Linea L2 ke active users ko upcoming airdrop. Consensys backed L2 hai.', status: 'upcoming', networks: ['ETH'], estimatedValue: '$100 - $2,000', funding: '$75M+', riskScore: 20, url: 'https://linea.build', deadline: 'TBA' },
  { id: 'sei', title: 'Sei Network Stakers', description: 'Sei blockchain ke stakers aur validators ko retroactive airdrop.', status: 'active', networks: ['ETH', 'SOL'], estimatedValue: '$50 - $1,000', funding: '$120M+', riskScore: 10, url: 'https://sei.io', deadline: '15 October 2026' },
  { id: 'fuel', title: 'Fuel Network Early Users', description: 'Fuel modular execution layer ke early testers ko upcoming airdrop.', status: 'upcoming', networks: ['ETH'], estimatedValue: '$100 - $3,000', funding: '$81M+', riskScore: 20, url: 'https://fuel.network', deadline: 'TBA' },
];

export function AirdropsPage() {
  const [search, setSearch] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('All');
  const [airdrops, setAirdrops] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    fetchCmsData().then((data) => {
      const cms = data.airdrops as unknown as Record<string, unknown>[];
      setAirdrops(cms.length > 0 ? cms : FALLBACK_AIRDROPS as unknown as Record<string, unknown>[]);
      setLoading(false);
    }).catch(() => {
      setAirdrops(FALLBACK_AIRDROPS as unknown as Record<string, unknown>[]);
      setLoading(false);
    });
  }, []);

  const filtered = airdrops.filter((a) => {
    const s = String(a.title).toLowerCase();
    const d = String(a.description).toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = s.includes(q) || d.includes(q);
    const networks = a.networks;
    const matchesNetwork = selectedNetwork === 'All' || (Array.isArray(networks) && (networks as string[]).includes(selectedNetwork));
    return matchesSearch && matchesNetwork;
  });

  if (loading) {
    return <div className="text-center py-12"><p className="text-muted-foreground">Loading airdrops...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Gift className="h-8 w-8 text-crypto-purple" />Crypto Airdrops</h1>
          <p className="text-muted-foreground mt-1">Discover and track the best crypto airdrops.</p>
        </div>
        <Link href="/airdrop-checker"><Button variant="bitcoin">Airdrop Checker</Button></Link>
      </div>

      <Link href="/portfolio" className="block rounded-2xl border bg-gradient-to-r from-bitcoin/10 via-bitcoin/5 to-background p-4 sm:p-6 hover:from-bitcoin/15 transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-bitcoin/10 border border-bitcoin/20"><Wallet className="h-6 w-6 text-bitcoin" /></div>
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg font-bold">Track Your Portfolio</p>
            <p className="text-sm text-muted-foreground">Monitor your crypto holdings, profit & loss, and transaction history.</p>
          </div>
          <div className="shrink-0 text-bitcoin font-semibold text-sm">Open &rarr;</div>
        </div>
      </Link>

      <AirdropsAd className="my-4" />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search airdrops..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {NETWORKS.map((net) => (
            <Button key={net} variant={selectedNetwork === net ? 'default' : 'outline'} size="sm" onClick={() => setSelectedNetwork(net)}>{net}</Button>
          ))}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        {['all', 'active', 'upcoming'].map((t) => (
          <TabsContent key={t} value={t} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.filter((a) => t === 'all' || a.status === t).map((airdrop) => (
                <div key={String(airdrop.id)} className="rounded-xl border bg-background/60 backdrop-blur-md shadow-lg shadow-black/5 hover:shadow-md transition-all border-l-4 border-l-purple-500/40">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold">{String(airdrop.title)}</h3>
                          <Badge variant={airdrop.status === 'active' ? 'green' : 'bitcoin'}>
                            {airdrop.status === 'active' ? <Clock className="h-3 w-3 inline mr-1" /> : <CheckCircle className="h-3 w-3 inline mr-1" />}
                            {String(airdrop.status === 'active' ? 'CLAIM NOW' : 'UPCOMING')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{String(airdrop.description)}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Wallet className="h-3 w-3" /> {String(airdrop.estimatedValue)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(airdrop.networks) && (airdrop.networks as string[]).map((net) => (
                            <Badge key={net} variant="secondary" className="text-[10px]">{net}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <a href={String(airdrop.url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-bitcoin text-white hover:bg-bitcoin-dark rounded-md px-3 text-xs h-7">
                          Claim <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.filter((a) => t === 'all' || a.status === t).length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">No airdrops found</div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
