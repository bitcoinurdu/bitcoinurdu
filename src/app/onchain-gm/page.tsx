import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { ExternalLink, MessageCircle, Zap } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'Onchain GM - Web3 Social',
  description: 'Send daily gm onchain. Web3 social platform for the crypto community.',
});

const protocols = [
  { name: 'Lens Protocol', url: 'https://lens.xyz', desc: 'Decentralized social graph. Post gm onchain daily.', chain: 'Polygon' },
  { name: 'Farcaster', url: 'https://farcaster.xyz', desc: 'Sufficiently decentralized social network. Cast gm every day.', chain: 'Optimism' },
  { name: 'DeSo', url: 'https://deso.com', desc: 'Decentralized social blockchain. Earn for posting gm.', chain: 'DeSo' },
  { name: 'CyberConnect', url: 'https://cyberconnect.me', desc: 'Web3 social network for builders and creators.', chain: 'BSC' },
  { name: 'PUSH Protocol', url: 'https://push.org', desc: 'Decentralized communication for web3.', chain: 'ETH' },
  { name: 'XMTP', url: 'https://xmtp.org', desc: 'Encrypted messaging for web3 apps.', chain: 'ETH' },
];

export default function OnchainGmPage() {
  return (
    <div className="space-y-8 px-2 md:px-8 py-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold">gm ☀️</h1>
        <p className="text-muted-foreground mt-2 text-lg">Say gm onchain, earn rewards, build your web3 identity.</p>
      </div>

      <div className="rounded-xl border bg-gradient-to-r from-bitcoin/5 via-background to-background p-6">
        <h2 className="font-semibold mb-3">What is Onchain GM?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Onchain GM is the daily crypto ritual of posting "gm" (good morning) on web3 social protocols. It helps build your onchain reputation, earn protocol rewards, and stay active in the decentralized social ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {protocols.map((p) => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border bg-background/60 p-4 hover:border-bitcoin/40 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold flex items-center gap-2">{p.name} <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{p.chain}</span></h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </a>
        ))}
      </div>

      <div className="rounded-xl border bg-muted/30 p-6">
        <h2 className="font-semibold mb-3">Why Say GM Onchain?</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><Zap className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /> Build your onchain reputation and social graph</li>
          <li className="flex items-start gap-2"><Zap className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /> Earn protocol rewards and airdrop eligibility</li>
          <li className="flex items-start gap-2"><Zap className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /> Stay connected with the web3 community</li>
          <li className="flex items-start gap-2"><Zap className="h-4 w-4 text-bitcoin shrink-0 mt-0.5" /> Create a permanent onchain diary of your daily interactions</li>
        </ul>
      </div>
    </div>
  );
}
