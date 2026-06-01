import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Zap, Download, CheckCircle, ExternalLink } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'Mining Firmware',
  description: 'Compare custom mining firmware like Braiins OS, Hive OS, Vnish, and others. Boost ASIC hashrate and efficiency with optimized firmware.',
});

const firmwares = [
  { name: 'Braiins OS+', cost: 'Free / Premium $5/mo', hashrateBoost: '+15-25%', powerSave: '-20%', features: ['Auto-tuning', 'Power optimization', 'Remote monitoring', 'Overclock/undervolt', 'Mining + signing'], chips: ['Bitmain 7nm+', 'MicroBT'], url: 'https://braiins.com' },
  { name: 'Hive OS', cost: 'Free up to 4 rigs', hashrateBoost: '+5-10%', powerSave: '-10%', features: ['Dashboard', 'Auto-tuning', 'Remote access', 'Profit switch', 'Mobile app'], chips: ['Bitmain', 'MicroBT', 'Goldshell', 'iPollo'], url: 'https://hiveos.farm' },
  { name: 'Vnish', cost: 'From $25/rig', hashrateBoost: '+20-30%', powerSave: '-25%', features: ['Max hashrate', 'Deep tuning', 'Power scaling', 'Miner status', 'API access'], chips: ['Bitmain 7nm+', 'Whatsminer'], url: 'https://vnish.io' },
  { name: 'Awesome Miner', cost: 'Free / Pro $199', hashrateBoost: '+0-5%', powerSave: '-5%', features: ['Multi-vendor', 'Profit switching', 'Alerts', 'Reporting', 'Windows/Linux'], chips: ['All major'], url: 'https://www.awesomeminer.com' },
  { name: 'asic.to', cost: 'From $20/rig', hashrateBoost: '+25-35%', powerSave: '-30%', features: ['Max boost', 'Custom tuning', 'Hashrate guarantee', 'Priority support'], chips: ['Bitmain S19/S21', 'Whatsminer M50/M60'], url: '#' },
];

export default function MiningFirmwarePage() {
  return (
    <div className="space-y-8">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining Firmware</h1>
        <p className="text-muted-foreground mt-1">Boost your ASIC performance with custom firmware. Compare Braiins OS, Hive OS, Vnish, and more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-4 text-center"><Zap className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold text-crypto-green">+15-35%</p><p className="text-xs text-muted-foreground">Hashrate Boost</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><Zap className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold text-crypto-green">-20-30%</p><p className="text-xs text-muted-foreground">Power Reduction</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><Zap className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold">3-6 mo</p><p className="text-xs text-muted-foreground">ROI Improvement</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {firmwares.map((fw) => (
          <Card key={fw.name} className="hover:border-bitcoin/30 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{fw.name}</CardTitle>
                <Badge variant={fw.cost.includes('Free') ? 'green' : 'secondary'}>{fw.cost}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-crypto-green/10 p-2 text-center"><p className="text-crypto-green font-bold">{fw.hashrateBoost}</p><p className="text-xs text-muted-foreground">Hashrate</p></div>
                <div className="rounded-lg bg-crypto-blue/10 p-2 text-center"><p className="text-crypto-green font-bold">{fw.powerSave}</p><p className="text-xs text-muted-foreground">Power Save</p></div>
              </div>
              <div className="space-y-1">
                {fw.features.map((f) => <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-3 w-3 text-crypto-green" />{f}</div>)}
              </div>
              <div className="flex flex-wrap gap-1">
                {fw.chips.map((c) => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
              </div>
              {fw.url !== '#' && (
                <a href={fw.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-bitcoin hover:underline">
                  Visit {fw.name} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
