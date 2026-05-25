'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Twitter, Facebook, MessageCircle, Send, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { fetchCmsData } from '@/lib/cms/unified';

const SITE_URL = typeof window !== 'undefined' ? window.location.href : '';

interface AirdropStep {
  title: string;
  description: string;
  link?: string;
  warning?: boolean;
}

interface AirdropData {
  id: string;
  name: string;
  token: string;
  status: string;
  network: string[];
  estimatedValue: string;
  riskScore: number;
  description: string;
  walletSetup: string[];
  steps: AirdropStep[];
  links: { website: string; twitter: string; discord?: string; telegram?: string; claim?: string };
  snapshotDate?: string;
  claimDate?: string;
  endDate?: string;
  funding?: { amount: string; investors: string[] };
  tips: string[];
}

export function AirdropDetailClient({ id }: { id: string }) {
  const [airdrop, setAirdrop] = useState<AirdropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    fetchCmsData().then((data) => {
      const airdrops = (data.airdrops as unknown as AirdropData[]) || [];
      const found = airdrops.find((a) => a.id === id);
      setAirdrop(found || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="text-center py-12"><p className="text-muted-foreground">Load ho raha hai...</p></div>;
  }

  if (!airdrop) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Airdrop Nahi Mila</h1>
        <p className="text-muted-foreground">Yeh airdrop abhi available nahi hai.</p>
        <Link href="/airdrops" className="text-bitcoin hover:underline">← Wapis Airdrops pe jayein</Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: 'bg-crypto-green/10 text-crypto-green',
    upcoming: 'bg-yellow-500/10 text-yellow-500',
    confirmed: 'bg-blue-500/10 text-blue-500',
    live: 'bg-red-500/10 text-red-500 animate-pulse',
    ended: 'bg-muted text-muted-foreground',
  };

  const statusLabels: Record<string, string> = {
    active: 'Active - Qualify Now',
    upcoming: 'Upcoming - Get Ready',
    confirmed: 'Confirmed - Airdrop Announced',
    live: '🔴 LIVE - Claim Now!',
    ended: 'Ended',
  };

  const shareUrl = encodeURIComponent(SITE_URL);
  const shareText = encodeURIComponent(`Check out ${airdrop.name} Airdrop on BitcoinUrdu! Est. Value: ${airdrop.estimatedValue}`);
  const shareLinks = [
    { name: 'X', icon: Twitter, url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, color: 'hover:bg-gray-800 hover:text-white' },
    { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, color: 'hover:bg-blue-600 hover:text-white' },
    { name: 'WhatsApp', icon: MessageCircle, url: `https://wa.me/?text=${shareText}%20${shareUrl}`, color: 'hover:bg-green-600 hover:text-white' },
    { name: 'Telegram', icon: Send, url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`, color: 'hover:bg-blue-500 hover:text-white' },
  ];

  return (
    <div className="space-y-6">
      {/* CLAIM BANNER */}
      {airdrop.status === 'live' && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <div>
              <h3 className="font-bold text-red-500">🔴 {airdrop.name} Claim is LIVE!</h3>
              <p className="text-sm text-muted-foreground">Claim deadline: {airdrop.endDate}. Jaldi claim karein!</p>
            </div>
          </div>
          <div className="flex gap-2">
            {airdrop.links.claim && (
              <a href={airdrop.links.claim} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                Claim Now →
              </a>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold">{airdrop.name} Airdrop</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[airdrop.status]}`}>
            {statusLabels[airdrop.status]}
          </span>
          <button
            onClick={() => setShowShare(!showShare)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg border text-sm hover:bg-accent transition-colors"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
        <p className="text-muted-foreground mt-1">{airdrop.token} Token • Est. Value: {airdrop.estimatedValue}</p>

        {/* SHARE DROPDOWN */}
        {showShare && (
          <div className="mt-3 p-3 rounded-lg border bg-card flex flex-wrap gap-2">
            {shareLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${s.color}`}
              >
                <s.icon className="h-4 w-4" />
                {s.name}
              </a>
            ))}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Link Copy!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* ABOUT */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-3">About {airdrop.name}</h2>
            <p className="text-muted-foreground">{airdrop.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {airdrop.network.map((net) => (
                <span key={net} className="px-2 py-1 rounded-md bg-muted text-xs">{net}</span>
              ))}
            </div>
          </div>

          {/* WALLET SETUP */}
          {airdrop.walletSetup && airdrop.walletSetup.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">🔧 Wallet Setup Guide</h2>
              <ol className="space-y-3">
                {airdrop.walletSetup.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">{i + 1}</span>
                    <p className="text-sm">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* STEPS TO QUALIFY */}
          {airdrop.steps && airdrop.steps.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">📋 Steps to Qualify</h2>
              <ol className="space-y-4">
                {airdrop.steps.map((step, i) => (
                  <li key={i} className={`p-4 rounded-lg border ${step.warning ? 'border-yellow-500/30 bg-yellow-500/5' : ''}`}>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-bitcoin text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{step.title}</h3>
                          {step.warning && <span className="text-xs text-yellow-500 font-medium">⚠ Important</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        {step.link && (
                          <a href={step.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm text-bitcoin hover:underline">
                            Open Link <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* TIPS */}
          {airdrop.tips && airdrop.tips.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold mb-3">💡 Pro Tips</h2>
              <ul className="space-y-2">
                {airdrop.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-bitcoin mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* QUICK INFO */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${statusColors[airdrop.status]}`}>{statusLabels[airdrop.status]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token</span>
                <span className="font-medium">{airdrop.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Value</span>
                <span className="font-medium">{airdrop.estimatedValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Score</span>
                <span className={`font-medium ${airdrop.riskScore <= 20 ? 'text-crypto-green' : airdrop.riskScore <= 40 ? 'text-yellow-500' : 'text-crypto-red'}`}>
                  {airdrop.riskScore <= 20 ? 'Low' : airdrop.riskScore <= 40 ? 'Medium' : 'High'} ({airdrop.riskScore})
                </span>
              </div>
              {airdrop.snapshotDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Snapshot</span>
                  <span className="font-medium">{airdrop.snapshotDate}</span>
                </div>
              )}
              {airdrop.claimDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Claim</span>
                  <span className="font-medium">{airdrop.claimDate}</span>
                </div>
              )}
              {airdrop.endDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium text-red-500">{airdrop.endDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* FUNDING */}
          {airdrop.funding && (
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-3">Funding</h3>
              <div className="text-2xl font-bold text-bitcoin mb-2">{airdrop.funding.amount}</div>
              <div className="flex flex-wrap gap-1">
                {airdrop.funding.investors.map((inv) => (
                  <span key={inv} className="px-2 py-1 rounded-md bg-muted text-xs">{inv}</span>
                ))}
              </div>
            </div>
          )}

          {/* LINKS */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4">Official Links</h3>
            <div className="space-y-2">
              <a href={airdrop.links.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                🌐 Website <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
              <a href={airdrop.links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                𝕏 Twitter <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
              {airdrop.links.discord && (
                <a href={airdrop.links.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  💬 Discord <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              )}
              {airdrop.links.telegram && (
                <a href={airdrop.links.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  📱 Telegram <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              )}
              {airdrop.links.claim && (
                <a href={airdrop.links.claim} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 font-medium">
                  🔴 Claim Now <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              )}
            </div>
          </div>

          {/* AIRDROP CHECKER */}
          <div className="rounded-xl border bg-bitcoin/5 border-bitcoin/20 p-6 text-center">
            <h3 className="font-semibold mb-2">Check Eligibility</h3>
            <p className="text-sm text-muted-foreground mb-4">Apni wallet address daal ke check karein.</p>
            <a href="/airdrop-checker" className="inline-block px-6 py-2 rounded-lg bg-bitcoin text-white text-sm font-medium hover:bg-bitcoin-dark transition-colors">
              Check Now →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
