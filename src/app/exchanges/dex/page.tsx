import { Metadata } from 'next';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { generateSEO } from '@/lib/seo';
import { Badge } from '@/components/ui/badge';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatNumber } from '@/lib/utils/helpers';

export const metadata: Metadata = generateSEO({
  title: 'Top Decentralized Exchanges (DEX)',
  description: 'Explore decentralized exchange rankings by trading volume, liquidity, pairs, and fees. Compare Uniswap, PancakeSwap, and other top DEX platforms.',
});

interface DexEntry {
  id: string;
  name: string;
  chain: string;
  volume: number;
  liquidity: number;
  pairs: number;
  fee: string;
  rating: number;
}

const dexList: DexEntry[] = [
  { id: 'uniswap', name: 'Uniswap', chain: 'Ethereum', volume: 12000000000, liquidity: 4500000000, pairs: 2000, fee: '0.30%', rating: 4.7 },
  { id: 'pancakeswap', name: 'PancakeSwap', chain: 'BSC', volume: 8000000000, liquidity: 3000000000, pairs: 3500, fee: '0.25%', rating: 4.5 },
  { id: 'raydium', name: 'Raydium', chain: 'Solana', volume: 5000000000, liquidity: 1500000000, pairs: 1200, fee: '0.25%', rating: 4.4 },
  { id: 'traderjoe', name: 'TraderJoe', chain: 'Avalanche', volume: 1500000000, liquidity: 500000000, pairs: 800, fee: '0.30%', rating: 4.2 },
  { id: 'sushiswap', name: 'SushiSwap', chain: 'Ethereum', volume: 2000000000, liquidity: 800000000, pairs: 1500, fee: '0.30%', rating: 4.1 },
  { id: 'curve', name: 'Curve', chain: 'Ethereum', volume: 6000000000, liquidity: 7000000000, pairs: 500, fee: '0.04%', rating: 4.6 },
  { id: 'balancer', name: 'Balancer', chain: 'Ethereum', volume: 1000000000, liquidity: 400000000, pairs: 600, fee: '0.30%', rating: 4.0 },
  { id: 'dydx', name: 'dYdX', chain: 'StarkWare', volume: 4000000000, liquidity: 200000000, pairs: 50, fee: '0.05%', rating: 4.3 },
  { id: 'gmx', name: 'GMX', chain: 'Arbitrum', volume: 3000000000, liquidity: 600000000, pairs: 100, fee: '0.10%', rating: 4.4 },
  { id: 'perpetual', name: 'Perpetual Protocol', chain: 'Optimism', volume: 1500000000, liquidity: 100000000, pairs: 40, fee: '0.10%', rating: 4.0 },
];

function ChainBadge({ chain }: { chain: string }) {
  const colorMap: Record<string, string> = {
    Ethereum: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    BSC: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    Solana: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
    Avalanche: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    StarkWare: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20',
    Arbitrum: 'bg-blue-400/10 text-blue-400 hover:bg-blue-400/20',
    Optimism: 'bg-red-400/10 text-red-400 hover:bg-red-400/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors',
        colorMap[chain] || 'bg-muted text-muted-foreground'
      )}
    >
      {chain}
    </span>
  );
}

export default function DexPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/exchanges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Exchanges
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Top Decentralized Exchanges (DEX)</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore decentralized exchange rankings by trading volume, liquidity, and active users.
          Compare Uniswap, PancakeSwap, Trader Joe, and other top DEX platforms.
        </p>
      </div>

      <AdPlaceholder size="banner" />

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>DEX Name</TableHead>
              <TableHead>Chain</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right">Liquidity</TableHead>
              <TableHead className="text-right">Pairs</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dexList.map((entry, index) => (
              <TableRow key={entry.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <Link
                    href={`/exchanges/${entry.id}`}
                    className="flex items-center gap-3 hover:text-bitcoin transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {entry.name.charAt(0)}
                    </div>
                    <span className="font-medium">{entry.name}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <ChainBadge chain={entry.chain} />
                </TableCell>
                <TableCell className="text-right font-medium">${formatNumber(entry.volume)}</TableCell>
                <TableCell className="text-right">${formatNumber(entry.liquidity)}</TableCell>
                <TableCell className="text-right">{entry.pairs.toLocaleString()}</TableCell>
                <TableCell className="text-right">{entry.fee}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-3 h-3',
                            i < Math.floor(entry.rating)
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'fill-none text-muted-foreground/30'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium ml-1">{entry.rating}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdPlaceholder size="rectangle" />
    </div>
  );
}
