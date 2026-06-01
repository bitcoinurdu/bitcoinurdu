import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Zap, DollarSign, Shield, Wifi, HeadphonesIcon, ExternalLink } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'Mining Hosting',
  description: 'Compare Bitcoin mining hosting services. Colocation for ASIC miners with competitive electricity rates and reliable infrastructure.',
});

const hosts = [
  { name: 'Compass Mining', location: 'USA / Canada', rate: '$0.06-0.08/kWh', setup: '$500', minSpace: '1 unit', features: ['24/7 monitoring', 'Remote management', 'Insurance available', 'Global shipping'], rating: 4.5, url: 'https://compassmining.io' },
  { name: 'Marathon Digital', location: 'USA', rate: '$0.05-0.07/kWh', setup: '$500', minSpace: '10 units', features: ['Institutional grade', 'Self-mining', 'Fleet management', 'Public company'], rating: 4.4, url: 'https://marathondigital.com' },
  { name: 'Bitdeer', location: 'USA / Norway / Bhutan', rate: '$0.04-0.07/kWh', setup: '$300', minSpace: '1 unit', features: ['Cloud mining', 'Colocation', 'Global data centers', 'Low rates'], rating: 4.3, url: 'https://bitdeer.com' },
  { name: 'Core Scientific', location: 'USA', rate: '$0.07-0.09/kWh', setup: '$1000', minSpace: '100 units', features: ['Institutional grade', 'High density', 'Liquid cooling', 'Public company'], rating: 4.7, url: 'https://corescientific.com' },
  { name: 'Luxor Technology', location: 'USA', rate: '$0.06-0.08/kWh', setup: '$750', minSpace: '10 units', features: ['Hashrate marketplace', 'Pool integration', 'API access', 'Fleet management'], rating: 4.4, url: 'https://luxor.tech' },
  { name: 'Compass Mining 2', location: 'USA / Canada / Europe', rate: '$0.05-0.09/kWh', setup: '$400', minSpace: '1 unit', features: ['Multi-location', 'Remote reboot', 'Real-time power', 'Support 24/7'], rating: 4.2, url: 'https://compassmining.io/hosting' },
];

export default function MiningHostingPage() {
  return (
    <div className="space-y-8">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining Hosting</h1>
        <p className="text-muted-foreground mt-1">ASIC colocation and mining hosting services. Compare electricity rates, setup fees, and features across hosting providers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-4 text-center"><DollarSign className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold text-bitcoin">$0.04-0.09</p><p className="text-xs text-muted-foreground">Electricity Rate / kWh</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><Building2 className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold text-bitcoin">Global</p><p className="text-xs text-muted-foreground">Data Center Locations</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><Shield className="h-5 w-5 text-bitcoin mx-auto mb-1" /><p className="text-2xl font-bold text-bitcoin">24/7</p><p className="text-xs text-muted-foreground">Monitoring & Support</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hosts.map((h) => (
          <Card key={h.name} className="hover:border-bitcoin/30 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{h.name}</CardTitle>
                <Badge variant={h.rating >= 4.5 ? 'green' : h.rating >= 4.0 ? 'secondary' : 'outline'}>{h.rating}★</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{h.location}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Power Rate</span><span className="text-crypto-green font-medium">{h.rate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Setup Fee</span><span>{h.setup}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Min. Space</span><span>{h.minSpace}</span></div>
              <div className="space-y-1 pt-1 border-t">
                {h.features.map((f) => <div key={f} className="flex items-center gap-2 text-muted-foreground"><Shield className="h-3 w-3 text-crypto-green" />{f}</div>)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Hosting Checklist</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2"><Shield className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /><div><strong>Power Contract</strong><p className="text-muted-foreground">Ensure fixed or capped electricity rates. Variable rates can destroy profitability.</p></div></div>
          <div className="flex gap-2"><Wifi className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /><div><strong>Network Reliability</strong><p className="text-muted-foreground">99.9%+ uptime SLA with redundant internet connections and backup power.</p></div></div>
          <div className="flex gap-2"><HeadphonesIcon className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /><div><strong>Support Response</strong><p className="text-muted-foreground">24/7 technical support. Average response time under 2 hours for critical issues.</p></div></div>
          <div className="flex gap-2"><Shield className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /><div><strong>Insurance</strong><p className="text-muted-foreground">Check if your hardware is insured against theft, fire, flood, and power surges.</p></div></div>
        </CardContent>
      </Card>
    </div>
  );
}
