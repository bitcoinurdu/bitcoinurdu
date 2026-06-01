import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Calendar, ExternalLink, ChevronRight } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'Mining News',
  description: 'Latest cryptocurrency mining news. ASIC releases, difficulty updates, mining regulations, and industry developments.',
});

const articles = [
  { title: 'Bitmain Launches Antminer S21 Pro with 234 TH/s', date: '2025-05-20', category: 'Hardware', summary: 'Bitmain announced the Antminer S21 Pro, delivering 234 TH/s at 15 J/TH efficiency. The new 2nm chip promises 20% better efficiency than previous generation.', readMore: '/mining' },
  { title: 'Bitcoin Difficulty Hits New All-Time High of 92.3 Trillion', date: '2025-05-18', category: 'Network', summary: 'Bitcoin mining difficulty reached a new record of 92.3 trillion as more hashpower joins the network following the latest halving.', readMore: '/mining' },
  { title: 'MicroBT Unveils Whatsminer M60S with 194 TH/s', date: '2025-05-15', category: 'Hardware', summary: 'MicroBT released the Whatsminer M60S, competing directly with Bitmain\'s S21 series. The M60S offers 194 TH/s at 16.3 J/TH.', readMore: '/mining' },
  { title: 'Bitcoin Halving 2025: What Miners Need to Know', date: '2025-05-10', category: 'Analysis', summary: 'The block reward has been reduced to 3.125 BTC. Miners must optimize efficiency and reduce costs to maintain profitability.', readMore: '/mining/calculator' },
  { title: 'Kaspa Mining Gains Popularity Among ASIC Miners', date: '2025-05-05', category: 'Altcoins', summary: 'Kaspa (KAS) has become one of the most profitable coins to mine with ASICs. Multiple manufacturers now produce KHeavyHash miners.', readMore: '/mining/profitability' },
  { title: 'Clean Energy Mining Initiative Expands to 5 New Countries', date: '2025-04-28', category: 'Sustainability', summary: 'The Bitcoin Mining Council reports 58% of mining now uses renewable energy. New hydro-powered mining farms opened in South America.', readMore: '/mining' },
  { title: 'New Customs Firmware Boosts S19 Hashrate by 30%', date: '2025-04-20', category: 'Software', summary: 'Vnish released a new firmware version for Antminer S19 series, claiming up to 30% hashrate increase with proper cooling.', readMore: '/mining/firmware' },
  { title: 'Foundry USA Becomes Largest Bitcoin Mining Pool', date: '2025-04-15', category: 'Pools', summary: 'Foundry Digital\'s mining pool now controls over 30% of Bitcoin\'s total hashrate, becoming the largest pool by market share.', readMore: '/mining/pools' },
  { title: 'GPU Mining Sees Resurgence with Kaspa and Alephium', date: '2025-04-10', category: 'GPU', summary: 'New GPU-friendly algorithms like kHeavyHash and Blake3 are making GPU mining profitable again, with RTX 4090 earning $3+/day.', readMore: '/mining/gpu' },
  { title: 'Mining Hosting Rates Drop as Energy Prices Stabilize', date: '2025-04-05', category: 'Industry', summary: 'ASIC colocation rates have dropped 15% year-over-year as global energy prices stabilize and more data center capacity comes online.', readMore: '/mining/hosting' },
];

export default function MiningNewsPage() {
  return (
    <div className="space-y-8">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining News</h1>
        <p className="text-muted-foreground mt-1">Latest cryptocurrency mining news, hardware releases, difficulty updates, and industry analysis.</p>
      </div>

      <div className="space-y-4">
        {articles.map((a) => (
          <Card key={a.title} className="hover:border-bitcoin/30 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl p-3 bg-bitcoin/10 shrink-0 hidden sm:block">
                  <Newspaper className="h-6 w-6 text-bitcoin" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className="text-xs">{a.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{a.date}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{a.summary}</p>
                  <Link href={a.readMore} className="text-sm text-bitcoin hover:underline inline-flex items-center gap-1">
                    Read more <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
