import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = generateSEO({ title: 'Coin Categories' });

const categories = [
  { name: 'Layer 1', count: 150, change: 2.5 },
  { name: 'Layer 2', count: 45, change: 5.2 },
  { name: 'DeFi', count: 320, change: -1.3 },
  { name: 'NFT', count: 85, change: 3.1 },
  { name: 'Gaming', count: 120, change: 4.7 },
  { name: 'Meme', count: 200, change: -2.8 },
  { name: 'AI', count: 65, change: 8.3 },
  { name: 'RWA', count: 40, change: 1.9 },
  { name: 'Privacy', count: 30, change: -0.5 },
  { name: 'Oracle', count: 15, change: 3.4 },
  { name: 'Storage', count: 25, change: 1.2 },
  { name: 'DEX', count: 55, change: 2.1 },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Coin Categories</h1>
        <p className="text-muted-foreground mt-1">Browse cryptocurrencies by sector and category.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link key={cat.name} href={`/coins?category=${cat.name.toLowerCase()}`} className="card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{cat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{cat.count} coins</Badge>
                <span className={cat.change >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>
                  {cat.change >= 0 ? '+' : ''}{cat.change.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Link>
        ))}
      </div>
    </div>
  );
}
