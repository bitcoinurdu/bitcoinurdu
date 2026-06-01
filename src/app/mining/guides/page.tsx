import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Video, FileText, ChevronRight, Cpu, Wrench, BarChart3, Shield, Coins } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'Mining Guides',
  description: 'Step-by-step mining guides for beginners and advanced miners. Learn how to mine Bitcoin, ASIC setup, GPU mining, and profit optimization.',
});

const guides = [
  { title: 'Bitcoin Mining for Beginners', desc: 'Learn how Bitcoin mining works, what equipment you need, and how to get started with your first miner.', icon: BookOpen, level: 'Beginner', readTime: '10 min', href: '/mining' },
  { title: 'How to Set Up an ASIC Miner', desc: 'Complete walkthrough for setting up your Antminer or Whatsminer — from unboxing to hashing.', icon: Cpu, level: 'Intermediate', readTime: '15 min', href: '/mining/asic' },
  { title: 'GPU Mining Guide 2025', desc: 'Build a GPU mining rig with the best graphics cards. Compare AMD vs NVIDIA for mining profitability.', icon: Video, level: 'Intermediate', readTime: '12 min', href: '/mining/gpu' },
  { title: 'Mining Profitability Calculator', desc: 'How to calculate your mining profits accurately. Account for electricity, pool fees, and hardware costs.', icon: BarChart3, level: 'Beginner', readTime: '8 min', href: '/mining/calculator' },
  { title: 'Choosing the Right Mining Pool', desc: 'Compare PPS, PPLNS, FPPS, and SOLO mining pools. Find the best pool for your mining setup.', icon: Shield, level: 'Beginner', readTime: '7 min', href: '/mining/pools' },
  { title: 'Mining Firmware Guide', desc: 'Boost your hashrate with custom firmware like Braiins OS, Hive OS, or Vnish. Step-by-step flashing guide.', icon: Wrench, level: 'Advanced', readTime: '20 min', href: '/mining/firmware' },
  { title: 'CPU Mining: Is It Still Profitable?', desc: 'Can you mine crypto with your CPU in 2025? We analyze RandomX, VerusHash, and other CPU-friendly algorithms.', icon: Cpu, level: 'Beginner', readTime: '6 min', href: '/mining/cpu' },
  { title: 'Mining Altcoins Guide', desc: 'Diversify your mining income by mining altcoins like Kaspa, Monero, Litecoin, and Zcash.', icon: Coins, level: 'Intermediate', readTime: '10 min', href: '/mining/profitability' },
];

export default function MiningGuidesPage() {
  return (
    <div className="space-y-8">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>

      <div>
        <h1 className="text-3xl font-bold">Mining Guides</h1>
        <p className="text-muted-foreground mt-1">Step-by-step tutorials for every mining skill level. From your first hash to optimizing a mining farm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((g) => (
          <Link key={g.title} href={g.href}>
            <Card className="h-full hover:border-bitcoin/30 hover:bg-bitcoin/5 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl p-3 bg-bitcoin/10 shrink-0">
                    <g.icon className="h-6 w-6 text-bitcoin" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{g.title}</h3>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{g.desc}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="bg-bitcoin/10 text-bitcoin px-2 py-0.5 rounded">{g.level}</span>
                      <span>{g.readTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
