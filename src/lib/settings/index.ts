export interface SocialLinks {
  twitter: string;
  telegram: string;
  youtube: string;
  facebook: string;
  website: string;
}

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'airdrop' | 'job' | 'breaking' | 'manual';
  enabled: boolean;
  startDate?: string;
  endDate?: string;
}

export interface AdSlot {
  id: string;
  page: string;
  position: 'header-728x90' | 'sidebar-300x250' | 'sponsored-article' | 'inline-336x280' | 'mobile-sticky-320x50';
  size: string;
  enabled: boolean;
  code: string;
  priority: number;
}

export interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  description: string;
  enabled: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  url: string;
  price: string;
  enabled: boolean;
}

export interface PriceOverride {
  [coinId: string]: {
    price: number;
    change24h: number;
  };
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  defaultTheme: 'dark' | 'light' | 'system';
  defaultLanguage: string;
  defaultCurrency: string;
  adminEmail: string;
  contactEmail: string;
  seo: SeoSettings;
  adsenseClientId: string;
  gaMeasurementId: string;
  coingeckoApiKey: string;
  socialLinks: SocialLinks;
  announcements: Announcement[];
  adSlots: AdSlot[];
  affiliateLinks: AffiliateLink[];
  courses: Course[];
  priceOverrides: PriceOverride;
  donationWallets: Record<string, string>;
  miningHardware: Record<string, unknown>[];
  version: string;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'BitcoinUrdu',
  siteDescription: "The World's Elite Multi-lingual Crypto Platform",
  siteUrl: 'https://bitcoinurdu.com',
  defaultTheme: 'dark',
  defaultLanguage: 'en',
  defaultCurrency: 'USD',
  adminEmail: 'admin@bitcoinurdu.com',
  contactEmail: 'contact@bitcoinurdu.com',
  seo: {
    title: 'BitcoinUrdu - Live Crypto Prices, News & Education',
    description: 'Track live crypto prices globally. Learn Bitcoin & blockchain in multiple languages including Urdu, English, Spanish, Arabic & more.',
    keywords: 'bitcoin, crypto, cryptocurrency, live prices, multi-lingual, global crypto platform',
    ogImage: '/og-image.png',
  },
  adsenseClientId: '',
  gaMeasurementId: '',
  coingeckoApiKey: '',
  socialLinks: {
    twitter: 'https://x.com/bitcoinurdu',
    telegram: 'https://t.me/bitcoinurdu',
    youtube: 'https://youtube.com/@bitcoinurdu',
    facebook: 'https://facebook.com/bitcoinurdu',
    website: 'https://bitcoinurdu.com',
  },
  announcements: [],
  adSlots: [
    { id: 'header-728x90', page: 'all', position: 'header-728x90', size: '728x90', enabled: false, code: '', priority: 1 },
    { id: 'sidebar-300x250', page: 'coins', position: 'sidebar-300x250', size: '300x250', enabled: false, code: '', priority: 2 },
    { id: 'sponsored-article', page: 'blog', position: 'sponsored-article', size: 'native', enabled: false, code: '', priority: 3 },
    { id: 'inline-336x280', page: 'all', position: 'inline-336x280', size: '336x280', enabled: false, code: '', priority: 4 },
    { id: 'mobile-sticky-320x50', page: 'all', position: 'mobile-sticky-320x50', size: '320x50', enabled: false, code: '', priority: 5 },
  ],
  affiliateLinks: [],
  courses: [],
  priceOverrides: {},
  donationWallets: {},
  miningHardware: [],
  version: '1',
  updatedAt: new Date().toISOString(),
};

const CACHE_KEY = 'bu_settings_ssot';
const CACHE_TTL = 60000; // 1 minute cache

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const cached = getCache();
    if (cached) return cached;

    const res = await fetch('/api/settings', {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error('Settings fetch failed');

    const raw = await res.json();
    const settings = parseRawSettings(raw);
    setCache(settings);
    return settings;
  } catch {
    return getCache() || DEFAULT_SETTINGS;
  }
}

export async function updateSetting(key: string, value: unknown): Promise<SiteSettings> {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });

    if (!res.ok) throw new Error('Update failed');

    invalidateCache();
    const settings = await fetchSettings();
    broadcastUpdate(settings);
    return settings;
  } catch {
    return getCache() || DEFAULT_SETTINGS;
  }
}

export async function updateSettings(updates: Partial<Record<string, unknown>>): Promise<SiteSettings> {
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });

    if (!res.ok) throw new Error('Bulk update failed');

    invalidateCache();
    const settings = await fetchSettings();
    broadcastUpdate(settings);
    return settings;
  } catch {
    return getCache() || DEFAULT_SETTINGS;
  }
}

export function resetSettings(): SiteSettings {
  invalidateCache();
  broadcastUpdate(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

function parseRawSettings(raw: Record<string, string>): SiteSettings {
  return {
    siteName: raw.site_name || DEFAULT_SETTINGS.siteName,
    siteDescription: raw.site_description || DEFAULT_SETTINGS.siteDescription,
    siteUrl: raw.site_url || DEFAULT_SETTINGS.siteUrl,
    defaultTheme: (raw.default_theme as 'dark' | 'light' | 'system') || DEFAULT_SETTINGS.defaultTheme,
    defaultLanguage: raw.default_language || DEFAULT_SETTINGS.defaultLanguage,
    defaultCurrency: raw.default_currency || DEFAULT_SETTINGS.defaultCurrency,
    adminEmail: raw.admin_email || DEFAULT_SETTINGS.adminEmail,
    contactEmail: raw.contact_email || DEFAULT_SETTINGS.contactEmail,
    seo: {
      title: raw.seo_title || DEFAULT_SETTINGS.seo.title,
      description: raw.seo_description || DEFAULT_SETTINGS.seo.description,
      keywords: raw.seo_keywords || DEFAULT_SETTINGS.seo.keywords,
      ogImage: raw.seo_og_image || DEFAULT_SETTINGS.seo.ogImage,
    },
    adsenseClientId: raw.adsense_client_id || DEFAULT_SETTINGS.adsenseClientId,
    gaMeasurementId: raw.ga_measurement_id || DEFAULT_SETTINGS.gaMeasurementId,
    coingeckoApiKey: raw.coingecko_api_key || DEFAULT_SETTINGS.coingeckoApiKey,
    socialLinks: parseJSON(raw.social_links, DEFAULT_SETTINGS.socialLinks),
    announcements: parseJSON(raw.announcements, DEFAULT_SETTINGS.announcements),
    adSlots: parseJSON(raw.ad_slots, DEFAULT_SETTINGS.adSlots),
    affiliateLinks: parseJSON(raw.affiliate_links, DEFAULT_SETTINGS.affiliateLinks),
    courses: parseJSON(raw.courses, DEFAULT_SETTINGS.courses),
    priceOverrides: parseJSON(raw.price_overrides, DEFAULT_SETTINGS.priceOverrides),
    donationWallets: parseJSON(raw.donation_wallets, DEFAULT_SETTINGS.donationWallets),
    miningHardware: parseJSON(raw.mining_hardware, DEFAULT_SETTINGS.miningHardware),
    version: raw.version || DEFAULT_SETTINGS.version,
    updatedAt: new Date().toISOString(),
  };
}

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getCache(): SiteSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data as SiteSettings;
  } catch {
    return null;
  }
}

function setCache(settings: SiteSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: settings,
    timestamp: Date.now(),
  }));
}

function invalidateCache(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CACHE_KEY);
}

function broadcastUpdate(settings: SiteSettings): void {
  if (typeof window === 'undefined') return;
  setCache(settings);
  window.dispatchEvent(new CustomEvent('bu_settings_updated', { detail: settings }));

  try {
    const channel = new BroadcastChannel('bu_settings_sync');
    channel.postMessage(settings);
    channel.close();
  } catch {}
}

export function listenForUpdates(callback: (settings: SiteSettings) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail) callback(detail);
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === CACHE_KEY && e.newValue) {
      try {
        const { data } = JSON.parse(e.newValue);
        callback(data);
      } catch {}
    }
  };

  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel('bu_settings_sync');
    channel.onmessage = (e) => callback(e.data);
  } catch {}

  window.addEventListener('bu_settings_updated', handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener('bu_settings_updated', handler);
    window.removeEventListener('storage', storageHandler);
    channel?.close();
  };
}
