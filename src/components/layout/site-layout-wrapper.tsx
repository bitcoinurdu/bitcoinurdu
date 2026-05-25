'use client';

import { usePathname } from 'next/navigation';
import { GlobalTicker } from '@/components/layout/global-ticker';
import { GlobalStatsBar } from '@/components/crypto/global-stats-bar';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { AdminSyncBridge } from '@/components/ads/ad-slots';

export function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AdminSyncBridge />
      <div className="relative flex min-h-screen flex-col w-full max-w-[100vw] overflow-x-hidden">
        <GlobalTicker />
        <GlobalStatsBar initialData={null} />
        <SiteHeader />
        <main className="flex-1 w-full">
          <div className="w-full max-w-[100vw] min-h-screen px-2 md:px-8 mx-auto grid grid-cols-12 gap-4 overflow-x-hidden">
            <div className="col-span-12">{children}</div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
