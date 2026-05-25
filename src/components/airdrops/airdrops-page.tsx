'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Clock, CheckCircle, XCircle, Gift, ExternalLink, Wallet } from 'lucide-react';
import { AirdropsAd } from '@/components/ads/ad-slots';
import { fetchCmsData } from '@/lib/cms/unified';

const NETWORKS = ['All', 'ETH', 'BSC', 'SOL', 'BASE', 'ARB', 'OP', 'zkSync'];

export function AirdropsPage() {
  const [search, setSearch] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('All');
  const [airdrops, setAirdrops] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCmsData().then((data) => {
      setAirdrops(data.airdrops as unknown as Record<string, unknown>[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-3 w-3 text-crypto-green" />;
      case 'upcoming': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-3 w-3 text-crypto-blue" />;
      case 'ended': return <XCircle className="h-3 w-3 text-crypto-red" />;
      default: return null;
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-crypto-green';
    if (score <= 60) return 'text-yellow-500';
    return 'text-crypto-red';
  };

  const filtered = airdrops.filter((a) => {
    const matchesSearch = String(a.title).toLowerCase().includes(search.toLowerCase()) || String(a.description).toLowerCase().includes(search.toLowerCase());
    const matchesNetwork = selectedNetwork === 'All' || (Array.isArray(a.networks) && (a.networks as string[]).includes(selectedNetwork));
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
          <div className="p-2 rounded-lg bg-bitcoin/10 border border-bitcoin/20">
            <Wallet className="h-6 w-6 text-bitcoin" />
          </div>
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

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
        </TabsList>

        {['all', 'active', 'upcoming', 'confirmed'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.filter((a) => tab === 'all' || a.status === tab).map((airdrop) => (
                <Link key={String(airdrop.id)} href={`/airdrops/${airdrop.id}`}>
                  <Card className="card-hover h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{String(airdrop.title)}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{String(airdrop.description)}</p>
                        </div>
                        <Badge variant={airdrop.status === 'active' ? 'green' : airdrop.status === 'upcoming' ? 'bitcoin' : 'default'}>
                          {getStatusIcon(String(airdrop.status))}<span className="ml-1 capitalize">{String(airdrop.status)}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(airdrop.networks) && (airdrop.networks as string[]).map((net) => (<Badge key={net} variant="secondary" className="text-xs">{net}</Badge>))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Est. Value</span><p className="font-medium">{String(airdrop.estimatedValue)}</p></div>
                        <div><span className="text-muted-foreground">Risk</span><p className={`font-medium ${getRiskColor(Number(airdrop.riskScore))}`}>{Number(airdrop.riskScore) <= 30 ? 'Low' : Number(airdrop.riskScore) <= 60 ? 'Medium' : 'High'}</p></div>
                        <div><span className="text-muted-foreground">Funding</span><p className="font-medium">{String(airdrop.funding)}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
