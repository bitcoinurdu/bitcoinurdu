import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, ExternalLink, Star, CheckCircle, Zap, Coins, DollarSign } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'Mining Pools',
  description: 'Compare mining pools by fee structure, payout methods, and supported algorithms.',
});

const pools = [
  { name: 'F2Pool', url: 'https://f2pool.com', fee: '2.5%', payout: 'Daily', minPayout: '0.001 BTC', coins: ['BTC', 'ETH', 'LTC', 'DASH', 'ZEC', 'XMR', 'KAS'], features: ['PPS+', 'FPPS', 'Real-time stats', 'Mobile app'], region: 'Global' },
  { name: 'Antpool', url: 'https://antpool.com', fee: '2.0%', payout: 'Daily', minPayout: '0.001 BTC', coins: ['BTC', 'BCH', 'LTC', 'ETH', 'ETC', 'ZEC'], features: ['PPS', 'PPLNS', 'FPPS', 'Cloud mining'], region: 'Global' },
  { name: 'Poolin', url: 'https://poolin.com', fee: '2.5%', payout: 'Daily', minPayout: '0.005 BTC', coins: ['BTC', 'ETH', 'LTC', 'DASH', 'ZEC', 'DOGE'], features: ['PPS+', 'FPPS', 'Wallet integrated', 'API'], region: 'Global' },
  { name: 'ViaBTC', url: 'https://viabtc.com', fee: '2.0%', payout: 'Daily', minPayout: '0.001 BTC', coins: ['BTC', 'BCH', 'LTC', 'ETH', 'ETC', 'ZEC', 'DASH'], features: ['PPS+', 'PPLNS', 'Cloud mining', 'Exchange'], region: 'Global' },
  { name: 'BTC.com', url: 'https://btc.com', fee: '1.5%', payout: 'Daily', minPayout: '0.001 BTC', coins: ['BTC', 'BCH', 'ETH', 'LTC'], features: ['FPPS', 'PPLNS', 'Full node', 'App'], region: 'Global' },
  { name: 'Slush Pool', url: 'https://slushpool.com', fee: '2.0%', payout: 'Daily', minPayout: '0.001 BTC', coins: ['BTC', 'ZEC'], features: ['Score-based', 'PPLNS', 'Transparent', 'First pool'], region: 'EU/Global' },
  { name: 'Foundry USA', url: 'https://foundrydigital.com', fee: '1.0%', payout: 'Daily', minPayout: '0.01 BTC', coins: ['BTC'], features: ['PPS+', 'Institutional', 'Low fee', 'US-based'], region: 'North America' },
  { name: 'Binance Pool', url: 'https://pool.binance.com', fee: '2.5%', payout: 'Daily', minPayout: '0.0005 BTC', coins: ['BTC', 'ETH', 'LTC', 'DASH', 'ZEC', 'ETC'], features: ['PPS+', 'FPPS', 'Exchange integration', 'Zero fee option'], region: 'Global' },
  { name: 'NiceHash', url: 'https://nicehash.com', fee: '2.0%', payout: 'Daily', minPayout: '0.001 BTC', coins: ['BTC'], features: ['Marketplace', 'Auto-switch', 'GPU/ASIC', 'Overclocking'], region: 'Global' },
  { name: '2Miners', url: 'https://2miners.com', fee: '1.0%', payout: 'Daily', minPayout: '0.001 BTC', coins: ['ETH', 'ETC', 'ZEC', 'XMR', 'RVN', 'ERGO', 'KAS'], features: ['SOLO', 'PPLNS', 'Low fee', 'Multi-coin'], region: 'Global' },
  { name: 'K1 Pool', url: 'https://k1pool.com', fee: '1.0%', payout: 'Daily', minPayout: '0.005 BTC', coins: ['KAS', 'ZEC', 'ETC', 'XMR'], features: ['PPLNS', 'SOLO', 'Low fee', 'Real-time'], region: 'Global' },
  { name: 'WoolyPooly', url: 'https://woolypooly.com', fee: '1.0%', payout: 'Daily', minPayout: '0.001 BTC', coins: ['KAS', 'XMR', 'ZEP', 'RTM', 'NEOX'], features: ['PPLNS', 'Low fee', 'Mobile app', 'Auto-payout'], region: 'Global' },
];

export default function MiningPoolsPage() {
  return (
    <div className="space-y-8">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>

      <div>
        <h1 className="text-3xl font-bold">Mining Pools</h1>
        <p className="text-muted-foreground mt-1">Compare top mining pools by fee structure, payout methods, and supported algorithms. Choose the right pool to maximize your mining profits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-bitcoin">{pools.length}+</p><p className="text-sm text-muted-foreground">Active Pools</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-bitcoin">1.0-2.5%</p><p className="text-sm text-muted-foreground">Fee Range</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-bitcoin">Daily</p><p className="text-sm text-muted-foreground">Payout Frequency</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Pool Comparison</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Min Payout</TableHead>
                  <TableHead>Coins</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools.map((pool) => (
                  <TableRow key={pool.name}>
                    <TableCell className="font-medium">{pool.name}</TableCell>
                    <TableCell>{pool.fee}</TableCell>
                    <TableCell>{pool.minPayout}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pool.coins.slice(0, 3).map((c) => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                        {pool.coins.length > 3 && <span className="text-xs text-muted-foreground">+{pool.coins.length - 3}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pool.features.slice(0, 2).map((f) => <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{pool.region}</TableCell>
                    <TableCell>
                      <a href={pool.url} target="_blank" rel="noopener noreferrer" className="text-bitcoin hover:underline text-sm flex items-center gap-1">
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-bitcoin" /> How to Choose a Pool</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2"><CheckCircle className="h-4 w-4 text-crypto-green shrink-0 mt-0.5" /><div><strong>Pool Fees</strong><p className="text-muted-foreground">Lower fees (1-2%) mean more profit. Some pools offer zero-fee promotions.</p></div></div>
            <div className="flex gap-2"><CheckCircle className="h-4 w-4 text-crypto-green shrink-0 mt-0.5" /><div><strong>Payout Structure</strong><p className="text-muted-foreground">PPS offers stable payouts per share. PPLNS rewards based on your contribution to found blocks.</p></div></div>
            <div className="flex gap-2"><CheckCircle className="h-4 w-4 text-crypto-green shrink-0 mt-0.5" /><div><strong>Minimum Payout</strong><p className="text-muted-foreground">Lower minimums mean you get paid faster. Essential for small-scale miners.</p></div></div>
            <div className="flex gap-2"><CheckCircle className="h-4 w-4 text-crypto-green shrink-0 mt-0.5" /><div><strong>Server Location</strong><p className="text-muted-foreground">Choose a pool with servers close to you for lower latency and fewer rejected shares.</p></div></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-bitcoin" /> Pool Features Explained</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2"><div className="font-medium w-16 text-bitcoin">PPS</div><div className="text-muted-foreground">Pay Per Share — guaranteed payment for each valid share submitted.</div></div>
            <div className="flex gap-2"><div className="font-medium w-16 text-bitcoin">PPLNS</div><div className="text-muted-foreground">Pay Per Last N Shares — rewards based on your contribution to recently found blocks.</div></div>
            <div className="flex gap-2"><div className="font-medium w-16 text-bitcoin">FPPS</div><div className="text-muted-foreground">Full Pay Per Share — includes transaction fees in rewards.</div></div>
            <div className="flex gap-2"><div className="font-medium w-16 text-bitcoin">SOLO</div><div className="text-muted-foreground">Solo mining — keep 100% of block reward, but only get paid when you find a block.</div></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
