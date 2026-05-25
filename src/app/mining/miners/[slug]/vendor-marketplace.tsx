'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, DollarSign, Star } from 'lucide-react';

const FALLBACK_VENDORS = [
  { name: 'ASLMiner', priceOffset: 1.0, redirectUrl: 'https://aslminer.com/?ref=bitcoinurdu', featured: true },
  { name: 'Bitark Miner', priceOffset: 1.02, redirectUrl: 'https://bitark.com/', featured: false },
  { name: 'Coin Mining Central', priceOffset: 1.04, redirectUrl: 'https://coinminingcentral.com/', featured: false },
  { name: 'BT-Miners', priceOffset: 1.03, redirectUrl: 'https://bt-miners.com/', featured: false },
];

interface StoredOverride {
  price: string;
  url: string;
}

export function VendorMarketplace({ hardwareId, price }: { hardwareId: string; price: number }) {
  const [overrides, setOverrides] = useState<Record<string, StoredOverride> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`bu_vendor_${hardwareId}`);
      if (raw) setOverrides(JSON.parse(raw));
    } catch {}
  }, [hardwareId]);

  const vendors = FALLBACK_VENDORS.map((v) => {
    const override = overrides?.[v.name];
    const displayPrice = override?.price || (price * v.priceOffset).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const displayUrl = override?.url || v.redirectUrl;
    return { ...v, displayPrice, displayUrl };
  });

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><DollarSign className="h-5 w-5 text-bitcoin" /> Where to Buy</h2>
      <div className="space-y-3">
        {vendors.map((v) => (
          <a
            key={v.name}
            href={v.displayUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center justify-between p-4 rounded-xl border bg-muted/10 hover:bg-muted/20 hover:border-bitcoin/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              {v.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              <span className="font-semibold text-sm">{v.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-bitcoin flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />{v.displayPrice}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-bitcoin text-white text-xs font-medium group-hover:opacity-90 transition-opacity">
                Buy Now <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Prices are estimates. Visit vendor site for current pricing.</p>
    </div>
  );
}
