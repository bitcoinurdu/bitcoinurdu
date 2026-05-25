import type { SiteSettings, Announcement, AdSlot, SocialLinks } from '@/lib/settings';
import { DEFAULT_SETTINGS } from '@/lib/settings';

const CMS_CACHE_KEY = 'bu_cms_data_v2';
const CMS_CACHE_TTL = 120000; // 2 minutes

export interface CmsData {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  coins: Record<string, unknown>[];
  airdrops: Record<string, unknown>[];
  blogPosts: Record<string, unknown>[];
  pages: Record<string, unknown>[];
  ads: AdSlot[];
  miningHardware: Record<string, unknown>[];
  announcements: Announcement[];
  socialLinks: SocialLinks;
  donationWallets: Record<string, string>;
  seoSettings: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  legalPages: Record<string, string>;
  team: Record<string, unknown>[];
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    popularCoins: string[];
  };
}

export const DEFAULT_CMS_DATA: CmsData = {
  siteName: DEFAULT_SETTINGS.siteName,
  siteDescription: DEFAULT_SETTINGS.siteDescription,
  siteUrl: DEFAULT_SETTINGS.siteUrl,
  coins: [],
  airdrops: [],
  blogPosts: [],
  pages: [],
  ads: DEFAULT_SETTINGS.adSlots,
  miningHardware: [],
  announcements: DEFAULT_SETTINGS.announcements,
  socialLinks: DEFAULT_SETTINGS.socialLinks,
  donationWallets: DEFAULT_SETTINGS.donationWallets,
  seoSettings: DEFAULT_SETTINGS.seo,
  legalPages: {
    'privacy-policy': '# Privacy Policy\n\nLast updated: 2024',
    'terms': '# Terms of Service\n\nLast updated: 2024',
    'disclaimer': '# Disclaimer\n\nLast updated: 2024',
  },
  team: [],
  homepage: {
    heroTitle: "The World's Elite Crypto Platform",
    heroSubtitle: 'Live prices, airdrops, portfolio tracking, aur AI insights',
    popularCoins: ['bitcoin', 'ethereum', 'binancecoin'],
  },
};

export async function fetchCmsData(): Promise<CmsData> {
  try {
    const cached = getCmsCache();
    if (cached) return cached;

    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('CMS fetch failed');

    const raw = await res.json();
    const data = mapSettingsToCms(raw);
    setCmsCache(data);
    return data;
  } catch {
    return getCmsCache() || DEFAULT_CMS_DATA;
  }
}

export async function updateCmsData(updates: Partial<CmsData>): Promise<CmsData> {
  try {
    const mapped = mapCmsToSettings(updates);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: mapped }),
    });

    if (!res.ok) throw new Error('CMS update failed');

    const current = await fetchCmsData();
    return { ...current, ...updates };
  } catch {
    return DEFAULT_CMS_DATA;
  }
}

function mapSettingsToCms(raw: Record<string, string>): CmsData {
  return {
    siteName: raw.site_name || DEFAULT_CMS_DATA.siteName,
    siteDescription: raw.site_description || DEFAULT_CMS_DATA.siteDescription,
    siteUrl: raw.site_url || DEFAULT_CMS_DATA.siteUrl,
    coins: DEFAULT_CMS_DATA.coins,
    airdrops: DEFAULT_CMS_DATA.airdrops,
    blogPosts: DEFAULT_CMS_DATA.blogPosts,
    pages: DEFAULT_CMS_DATA.pages,
    ads: parseJSON(raw.ad_slots, DEFAULT_CMS_DATA.ads),
    miningHardware: parseJSON(raw.mining_hardware, DEFAULT_CMS_DATA.miningHardware),
    announcements: parseJSON(raw.announcements, DEFAULT_CMS_DATA.announcements),
    socialLinks: parseJSON(raw.social_links, DEFAULT_CMS_DATA.socialLinks),
    donationWallets: parseJSON(raw.donation_wallets, DEFAULT_CMS_DATA.donationWallets),
    seoSettings: {
      title: raw.seo_title || DEFAULT_CMS_DATA.seoSettings.title,
      description: raw.seo_description || DEFAULT_CMS_DATA.seoSettings.description,
      keywords: raw.seo_keywords || DEFAULT_CMS_DATA.seoSettings.keywords,
      ogImage: raw.seo_og_image || DEFAULT_CMS_DATA.seoSettings.ogImage,
    },
    legalPages: DEFAULT_CMS_DATA.legalPages,
    team: DEFAULT_CMS_DATA.team,
    homepage: DEFAULT_CMS_DATA.homepage,
  };
}

function mapCmsToSettings(updates: Partial<CmsData>): Record<string, string> {
  const mapped: Record<string, string> = {};
  if (updates.siteName) mapped.site_name = updates.siteName;
  if (updates.siteDescription) mapped.site_description = updates.siteDescription;
  if (updates.siteUrl) mapped.site_url = updates.siteUrl;
  if (updates.ads) mapped.ad_slots = JSON.stringify(updates.ads);
  if (updates.miningHardware) mapped.mining_hardware = JSON.stringify(updates.miningHardware);
  if (updates.announcements) mapped.announcements = JSON.stringify(updates.announcements);
  if (updates.socialLinks) mapped.social_links = JSON.stringify(updates.socialLinks);
  if (updates.donationWallets) mapped.donation_wallets = JSON.stringify(updates.donationWallets);
  if (updates.seoSettings) {
    mapped.seo_title = updates.seoSettings.title;
    mapped.seo_description = updates.seoSettings.description;
    mapped.seo_keywords = updates.seoSettings.keywords;
    mapped.seo_og_image = updates.seoSettings.ogImage;
  }
  return mapped;
}

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getCmsCache(): CmsData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CMS_CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CMS_CACHE_TTL) return null;
    return data as CmsData;
  } catch {
    return null;
  }
}

function setCmsCache(data: CmsData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CMS_CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now(),
  }));
}
