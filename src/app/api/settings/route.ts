import { NextRequest, NextResponse } from 'next/server';

const JSONBIN_BIN_ID = process.env.NEXT_PUBLIC_JSONBIN_BIN_ID || '6a0b09d4a92aa659e32f87bd';
const JSONBIN_API_KEY = process.env.JSONBIN_MASTER_KEY || '$2a$10$JNXixSu1HicEzD5diMw1ZedAGQkmr4Iwze6Qc6g8L3s89vsrUpGAG';

const SETTINGS_KEYS = [
  'site_name', 'site_description', 'site_url',
  'default_theme', 'default_language', 'default_currency',
  'admin_email', 'contact_email',
  'seo_title', 'seo_description', 'seo_keywords', 'seo_og_image',
  'adsense_client_id', 'ga_measurement_id', 'coingecko_api_key',
  'social_links', 'announcements', 'ad_slots', 'mining_hardware',
  'affiliate_links', 'courses', 'price_overrides',
  'donation_wallets', 'version',
];

const DEFAULTS: Record<string, string> = {
  site_name: 'BitcoinUrdu',
  site_description: "The World's Elite Multi-lingual Crypto Platform",
  site_url: 'https://bitcoinurdu.com',
  default_theme: 'dark',
  default_language: 'en',
  default_currency: 'USD',
  admin_email: 'admin@bitcoinurdu.com',
  contact_email: 'contact@bitcoinurdu.com',
  seo_title: 'BitcoinUrdu - Live Crypto Prices, News & Education',
  seo_description: 'Track live crypto prices globally. Learn Bitcoin & blockchain in multiple languages.',
  seo_keywords: 'bitcoin, crypto, cryptocurrency, live prices, multi-lingual, global crypto platform',
  seo_og_image: '/og-image.png',
  adsense_client_id: '',
  ga_measurement_id: '',
  coingecko_api_key: '',
  social_links: JSON.stringify({
    twitter: 'https://x.com/bitcoinurdu',
    telegram: 'https://t.me/bitcoinurdu',
    youtube: 'https://youtube.com/@bitcoinurdu',
    facebook: 'https://facebook.com/bitcoinurdu',
    website: 'https://bitcoinurdu.com',
  }),
  announcements: '[]',
  ad_slots: JSON.stringify([
    { id: 'mainpage', page: 'mainpage', name: 'Homepage Top Banner', position: 'header-728x90', size: '728x90', code: '', enabled: true, priority: 1 },
    { id: 'coins', page: 'coins', name: 'Coins Page Top', position: 'sidebar-300x250', size: '300x250', code: '', enabled: true, priority: 2 },
    { id: 'blog', page: 'blog', name: 'Blog Page', position: 'sponsored-article', size: 'native', code: '', enabled: true, priority: 3 },
    { id: 'learn', page: 'learn', name: 'Learn Bitcoin', position: 'inline-336x280', size: '336x280', code: '', enabled: true, priority: 4 },
    { id: 'airdrops', page: 'airdrops', name: 'Airdrops', position: 'inline-336x280', size: '336x280', code: '', enabled: true, priority: 5 },
    { id: 'jobs', page: 'jobs', name: 'Jobs', position: 'inline-336x280', size: '336x280', code: '', enabled: true, priority: 6 },
    { id: 'markets', page: 'markets', name: 'Markets', position: 'inline-336x280', size: '336x280', code: '', enabled: true, priority: 7 },
    { id: 'news', page: 'news', name: 'News Page', position: 'inline-336x280', size: '336x280', code: '', enabled: true, priority: 8 },
    { id: 'research', page: 'research', name: 'Research', position: 'inline-336x280', size: '336x280', code: '', enabled: true, priority: 9 },
  ]),
  mining_hardware: '[]',
  affiliate_links: '[]',
  courses: '[]',
  price_overrides: '{}',
  donation_wallets: '{}',
  version: '1',
};

async function fetchFromJsonbin(): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
      },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.record || null;
  } catch {
    return null;
  }
}

async function saveToJsonbin(settings: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
      },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function getAllSettings(): Promise<Record<string, string>> {
  const settings: Record<string, string> = { ...DEFAULTS };
  const persisted = await fetchFromJsonbin();
  if (!persisted) return settings;

  // Migrate old pageAds (Record<string,string>) to ad_slots (AdSlot[])
  const pageAdsRaw = (persisted as Record<string, unknown>)['pageAds'];
  delete (persisted as Record<string, unknown>)['pageAds'];
  if (pageAdsRaw) {
    try {
      const pageAds = typeof pageAdsRaw === 'string' ? JSON.parse(pageAdsRaw) : pageAdsRaw;
      if (pageAds && typeof pageAds === 'object' && !Array.isArray(pageAds)) {
        const curRaw = persisted['ad_slots'];
        const cur = curRaw ? (typeof curRaw === 'string' ? JSON.parse(curRaw) : curRaw) : [];
        if (Array.isArray(cur) && cur.length === 0) {
          const entries = Object.entries(pageAds as Record<string, unknown>).filter(([, v]) => v);
          if (entries.length > 0) {
            persisted['ad_slots'] = JSON.stringify(
              entries.map(([page, code], i) => ({
                id: `ad-${page}`,
                page,
                position: 'header-728x90',
                size: '728x90',
                enabled: true,
                code: String(code ?? ''),
                priority: i + 1,
              }))
            ) as unknown as string;
          }
        }
      }
    } catch { /* migration failed, ignore */ }
  }

  Object.assign(settings, persisted);

  if (settings.ad_slots === '[]' || settings.ad_slots === JSON.stringify([])) {
    settings.ad_slots = DEFAULTS.ad_slots;
  }

  return settings;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keys = searchParams.get('keys');

  try {
    const allSettings = await getAllSettings();

    if (keys) {
      const requestedKeys = keys.split(',');
      const filtered = requestedKeys.reduce((acc, key) => {
        if (allSettings[key] !== undefined) acc[key] = allSettings[key];
        return acc;
      }, {} as Record<string, string>);
      return NextResponse.json(filtered);
    }

    return NextResponse.json(allSettings, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || !SETTINGS_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Invalid setting key' }, { status: 400 });
    }

    const sanitizedValue = typeof value === 'string' ? value : JSON.stringify(value);
    const current = await getAllSettings();
    current[key] = sanitizedValue;
    const saved = await saveToJsonbin(current);

    return NextResponse.json({
      success: saved,
      key,
      value: sanitizedValue,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updates = body.updates || body;

    const current = await getAllSettings();
    for (const [key, value] of Object.entries(updates)) {
      if (SETTINGS_KEYS.includes(key)) {
        current[key] = typeof value === 'string' ? value : JSON.stringify(value);
      }
    }

    const saved = await saveToJsonbin(current);

    return NextResponse.json({
      success: saved,
      updated: Object.keys(updates).filter(k => SETTINGS_KEYS.includes(k)),
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to bulk update settings' }, { status: 500 });
  }
}
