'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useSiteSettings } from '@/hooks/use-site-settings';

export function ThemeSync() {
  const { settings } = useSiteSettings();
  const { theme, setTheme } = useTheme();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && settings.defaultTheme) {
      const savedTheme = localStorage.getItem('bu_theme_override');
      const targetTheme = savedTheme || settings.defaultTheme;
      if (theme !== targetTheme) {
        setTheme(targetTheme);
      }
      setInitialized(true);
    }
  }, [settings.defaultTheme, theme, setTheme, initialized]);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const raw = localStorage.getItem('bu_site_settings');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.defaultTheme && parsed.defaultTheme !== theme) {
            setTheme(parsed.defaultTheme);
          }
        } catch {}
      }
    };

    window.addEventListener('bu_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('bu_settings_updated', handleSettingsUpdate);
  }, [theme, setTheme]);

  return null;
}
