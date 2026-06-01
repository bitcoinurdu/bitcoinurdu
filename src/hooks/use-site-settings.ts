import { useState, useEffect, useCallback, useRef } from 'react';
import {
  type SiteSettings,
  DEFAULT_SETTINGS,
  fetchSettings,
  updateSetting,
  updateSettings,
  resetSettings,
  listenForUpdates,
} from '@/lib/settings';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetchSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    }).catch(() => {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
    });

    const cleanup = listenForUpdates((s) => {
      setSettings(s);
    });

    const adminSyncHandler = () => {
      fetchSettings().then(setSettings).catch(() => {});
    };
    window.addEventListener('bu:admin:update', adminSyncHandler);

    return () => {
      cleanup();
      window.removeEventListener('bu:admin:update', adminSyncHandler);
    };
  }, []);

  const updateSingle = useCallback(async (key: string, value: unknown) => {
    const updated = await updateSetting(key, value);
    setSettings(updated);
    return updated;
  }, []);

  const updateBulk = useCallback(async (updates: Partial<Record<string, unknown>>) => {
    const updated = await updateSettings(updates);
    setSettings(updated);
    return updated;
  }, []);

  const reset = useCallback(() => {
    const defaults = resetSettings();
    setSettings(defaults);
    return defaults;
  }, []);

  return {
    settings,
    loading,
    updateSetting: updateSingle,
    updateSettings: updateBulk,
    resetSettings: reset,
  };
}
