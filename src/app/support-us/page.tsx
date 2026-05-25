'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { Twitter, Facebook, MessageCircle, Send, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { generateSEO } from '@/lib/seo';

const SITE_URL = 'https://bitcoinurdu.pages.dev';

export default function SupportUsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: 'X (Twitter)', icon: Twitter, url: `https://twitter.com/intent/tweet?text=Check%20out%20BitcoinUrdu%20-%20The%20World's%20Elite%20Crypto%20Platform!&url=${encodeURIComponent(SITE_URL)}`, color: 'hover:bg-gray-800 hover:text-white' },
    { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`, color: 'hover:bg-blue-600 hover:text-white' },
    { name: 'WhatsApp', icon: MessageCircle, url: `https://wa.me/?text=Check%20out%20BitcoinUrdu%20-%20The%20World's%20Elite%20Crypto%20Platform!%20${encodeURIComponent(SITE_URL)}`, color: 'hover:bg-green-600 hover:text-white' },
    { name: 'Telegram', icon: Send, url: `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=Check%20out%20BitcoinUrdu%20-%20The%20World's%20Elite%20Crypto%20Platform!`, color: 'hover:bg-blue-500 hover:text-white' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Hamari Madad Karein</h1>
        <p className="text-muted-foreground mt-2">BitcoinUrdu ko free aur behtar banane mein hamari madad karein.</p>
      </div>

      {/* Share Section */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-bitcoin/10 flex items-center justify-center text-sm font-bold text-bitcoin">1</span>
          BitcoinUrdu Share Karein
        </h2>
        <p className="text-sm text-muted-foreground">Apne doston aur social media par hamara platform share karein.</p>
        
        <div className="flex flex-wrap gap-2">
          {shareLinks.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${s.color}`}
            >
              <s.icon className="h-4 w-4" />
              {s.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <code className="flex-1 text-sm">{SITE_URL}</code>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-background border text-sm hover:bg-accent transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copy Ho Gaya!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Ad Blocker */}
      <div className="rounded-xl border bg-card p-6 space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-bitcoin/10 flex items-center justify-center text-sm font-bold text-bitcoin">2</span>
          Ad Blocker Band Karein
        </h2>
        <p className="text-sm text-muted-foreground">Hamari site par ads allow karein taake hamari revenue mein madad mile.</p>
      </div>

      {/* Donate */}
      <div className="rounded-xl border bg-card p-6 space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-bitcoin/10 flex items-center justify-center text-sm font-bold text-bitcoin">3</span>
          Crypto Donate Karein
        </h2>
        <p className="text-sm text-muted-foreground">Kisi bhi amount ki crypto donation se hamari madad karein.</p>
        <Link href="/donate" className="inline-flex items-center gap-1 text-sm text-bitcoin hover:underline">
          Donate Page <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Feedback */}
      <div className="rounded-xl border bg-card p-6 space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-bitcoin/10 flex items-center justify-center text-sm font-bold text-bitcoin">4</span>
          Feedback Dein
        </h2>
        <p className="text-sm text-muted-foreground">Apni suggestions share karein taake hum behtar ban sakein.</p>
        <Link href="/contact" className="inline-flex items-center gap-1 text-sm text-bitcoin hover:underline">
          Contact Page <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
