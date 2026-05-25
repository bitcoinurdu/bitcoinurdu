'use client';

import { ThemeProvider } from '@/components/layout/theme-provider';
import { LangFontSwitcher } from '@/components/layout/lang-font-switcher';
import { SeoSync } from '@/components/layout/seo-sync';
import { ThemeSync } from '@/components/layout/theme-sync';
import { DefaultsSync } from '@/components/layout/defaults-sync';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LangFontSwitcher />
      <ThemeSync />
      <DefaultsSync />
      <SeoSync />
      {children}
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>
  );
}
