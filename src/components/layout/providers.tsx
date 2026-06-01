'use client';

import { ThemeProvider } from '@/components/layout/theme-provider';
import { LangFontSwitcher } from '@/components/layout/lang-font-switcher';
import { SeoSync } from '@/components/layout/seo-sync';
import { ThemeSync } from '@/components/layout/theme-sync';
import { DefaultsSync } from '@/components/layout/defaults-sync';
import { PrivyProvider } from '@/components/layout/privy-provider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <LangFontSwitcher />
      <ThemeSync />
      <DefaultsSync />
      <SeoSync />
      <PrivyProvider>
        {children}
      </PrivyProvider>
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>
  );
}
