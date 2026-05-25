'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores';

export function LangFontSwitcher() {
  const { language } = useAppStore();

  useEffect(() => {
    const lang = language || 'roman';
    document.documentElement.setAttribute('data-lang', lang);
  }, [language]);

  return null;
}
