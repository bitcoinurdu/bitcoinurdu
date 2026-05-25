'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/stores';
import { useSiteSettings } from '@/hooks/use-site-settings';

export function DefaultsSync() {
  const { settings } = useSiteSettings();
  const { language, currency, setLanguage, setCurrency } = useAppStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const hasUserLang = localStorage.getItem('bitcoinurdu-storage');
    if (!hasUserLang) {
      if (settings.defaultLanguage && settings.defaultLanguage !== language) {
        setLanguage(settings.defaultLanguage);
      }
      if (settings.defaultCurrency && settings.defaultCurrency !== currency) {
        setCurrency(settings.defaultCurrency);
      }
    } else {
      try {
        const stored = JSON.parse(hasUserLang);
        const state = stored.state;
        if (!state.language && settings.defaultLanguage) {
          setLanguage(settings.defaultLanguage);
        }
        if (!state.currency && settings.defaultCurrency) {
          setCurrency(settings.defaultCurrency);
        }
      } catch {}
    }
  }, [settings.defaultLanguage, settings.defaultCurrency]);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const raw = localStorage.getItem('bu_site_settings');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.defaultLanguage) setLanguage(parsed.defaultLanguage);
          if (parsed.defaultCurrency) setCurrency(parsed.defaultCurrency);
        } catch {}
      }
    };

    window.addEventListener('bu_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('bu_settings_updated', handleSettingsUpdate);
  }, [setLanguage, setCurrency]);

  return null;
}
