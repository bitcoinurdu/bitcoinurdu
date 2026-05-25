'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/helpers';
import { useSiteSettings } from '@/hooks/use-site-settings';
import type { AdSlot } from '@/lib/settings';

const PAGE_ADS = [
  'mainpage',
  'coins',
  'blog',
  'learn',
  'airdrops',
  'jobs',
  'markets',
  'news',
  'research',
  'ai',
] as const;

type PageAdType = (typeof PAGE_ADS)[number];

interface AdSlotsProps {
  page: PageAdType;
  className?: string;
}

const ADMIN_SYNC_KEY = 'bu_admin_sync';

export function TurnstileWidget({ id }: { id?: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).turnstile) {
      (window as any).turnstile.render(`#${id || 'cf-turnstile'}`, {
        sitekey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
      });
    }
  }, [id]);
  return <div id={id || 'cf-turnstile'} />;
}

function useAdminSync() {
  const [syncVersion, setSyncVersion] = useState(0);

  useEffect(() => {
    const handler = () => {
      try {
        const v = localStorage.getItem(ADMIN_SYNC_KEY);
        if (v) setSyncVersion((prev) => prev + 1);
      } catch {}
    };
    window.addEventListener('storage', handler);
    window.addEventListener('bu:admin:update', handler);
    const interval = setInterval(handler, 5000);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('bu:admin:update', handler);
      clearInterval(interval);
    };
  }, []);

  return syncVersion;
}

export function AdSlots({ page, className }: AdSlotsProps) {
  const { settings } = useSiteSettings();
  const [adSlot, setAdSlot] = useState<AdSlot | null>(null);
  const [loaded, setLoaded] = useState(false);
  const syncVersion = useAdminSync();

  useEffect(() => {
    let matchingSlot = settings.adSlots?.find(
      (s) => s.enabled && (s.page === page || s.page === 'all')
    );
    if (!matchingSlot) {
      try {
        const raw = localStorage.getItem('bu_admin_ad_slots');
        if (raw) {
          const localSlots: AdSlot[] = JSON.parse(raw);
          matchingSlot = localSlots.find(
            (s) => s.enabled && (s.page === page || s.page === 'all')
          );
        }
      } catch {}
    }
    setAdSlot(matchingSlot || null);
    setLoaded(true);
  }, [settings.adSlots, page, syncVersion]);

  if (!loaded || !adSlot || !adSlot.code) {
    return (
      <Link
        href="/advertise"
        className={cn(
          'my-4 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/10 p-4 text-center text-sm text-muted-foreground hover:border-bitcoin/40 hover:text-bitcoin hover:bg-bitcoin/5 transition-all cursor-pointer',
          className
        )}
      >
        📢 Advertise Here - {page}
      </Link>
    );
  }

  return (
    <div className={cn('my-4 overflow-hidden rounded-lg', className)}>
      <div dangerouslySetInnerHTML={{ __html: adSlot.code }} />
    </div>
  );
}

export function MainpageAd({ className }: { className?: string }) {
  return <AdSlots page="mainpage" className={className} />;
}

export function CoinsAd({ className }: { className?: string }) {
  return <AdSlots page="coins" className={className} />;
}

export function BlogAd({ className }: { className?: string }) {
  return <AdSlots page="blog" className={className} />;
}

export function LearnAd({ className }: { className?: string }) {
  return <AdSlots page="learn" className={className} />;
}

export function AirdropsAd({ className }: { className?: string }) {
  return <AdSlots page="airdrops" className={className} />;
}

export function JobsAd({ className }: { className?: string }) {
  return <AdSlots page="jobs" className={className} />;
}

export function MarketsAd({ className }: { className?: string }) {
  return <AdSlots page="markets" className={className} />;
}

export function NewsAd({ className }: { className?: string }) {
  return <AdSlots page="news" className={className} />;
}

export function ResearchAd({ className }: { className?: string }) {
  return <AdSlots page="research" className={className} />;
}

export function AiAd({ className }: { className?: string }) {
  return <AdSlots page="ai" className={className} />;
}

export const AdminSyncBridge = () => {
  useAdminSync();
  return null;
};
