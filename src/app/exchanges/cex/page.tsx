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
  title: 'Top Centralized Exchanges (CEX)',
  description: 'Browse and compare centralized cryptocurrency exchanges ranked by trading volume, fees, supported coins, and user ratings.',
});

interface CexEntry {
  id: string;
  name: string;
  volume: number;
  coins: number;
  pairs: number;
  fee: string;
  rating: number;
}

const cexList: CexEntry[] = [
  { id: 'binance', name: 'Binance', volume: 76800000000, coins: 420, pairs: 1800, fee: '0.10%', rating: 4.8 },
  { id: 'coinbase', name: 'Coinbase', volume: 3200000000, coins: 250, pairs: 450, fee: '0.50%', rating: 4.5 },
  { id: 'kraken', name: 'Kraken', volume: 1500000000, coins: 230, pairs: 400, fee: '0.16%', rating: 4.6 },
  { id: 'bybit', name: 'Bybit', volume: 25000000000, coins: 300, pairs: 600, fee: '0.10%', rating: 4.4 },
  { id: 'okx', name: 'OKX', volume: 18000000000, coins: 350, pairs: 700, fee: '0.08%', rating: 4.5 },
  { id: 'kucoin', name: 'KuCoin', volume: 5000000000, coins: 700, pairs: 1400, fee: '0.10%', rating: 4.3 },
  { id: 'gateio', name: 'Gate.io', volume: 4000000000, coins: 1700, pairs: 3500, fee: '0.20%', rating: 4.2 },
  { id: 'bitget', name: 'Bitget', volume: 8000000000, coins: 600, pairs: 800, fee: '0.10%', rating: 4.3 },
  { id: 'mexc', name: 'MEXC', volume: 6000000000, coins: 2000, pairs: 4000, fee: '0.10%', rating: 4.1 },
  { id: 'htx', name: 'HTX', volume: 3500000000, coins: 500, pairs: 1000, fee: '0.20%', rating: 4.0 },
];

export default function CexPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/exchanges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Exchanges
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Top Centralized Exchanges (CEX)</h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse and compare centralized cryptocurrency exchanges including Binance, Coinbase,
          Kraken, and more. Ranked by 24h trading volume.
        </p>
      </div>

      <AdPlaceholder size="banner" />

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Exchange</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right">Coins</TableHead>
              <TableHead className="text-right">Pairs</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cexList.map((entry, index) => (
              <TableRow key={entry.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <Link
                    href={`/exchanges/${entry.id}`}
                    className="flex items-center gap-3 hover:text-bitcoin transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {entry.name.charAt(0)}
                    </div>
                    <span className="font-medium">{entry.name}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">CEX</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">${formatNumber(entry.volume)}</TableCell>
                <TableCell className="text-right">{entry.coins.toLocaleString()}</TableCell>
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
