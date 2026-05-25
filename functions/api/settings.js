// Firebase Firestore-backed settings API for Cloudflare Pages
// Uses Firestore REST API with OAuth2 service account authentication

const PROJECT_ID = 'bu-opencode';
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Firebase service account credentials (fallback - set env vars in Cloudflare Pages for production)
const FIREBASE_PRIVATE_KEY_FALLBACK = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDE1OCDEOefYGvN
jpiPTnjTGReuBdp+RlpB2gnbO5siz2KL1QItRbOiiLm1hCNpSxxH9T5VRLlDi+hU
tx6H+4n1iBKDwNBqvf5yP7yFiDAhxl+4jsc5cSUQmPGfeHDEGaQ2ifYWKQGR3Mc9
lReV0d82JeqC385Kg7GgJWPK4Vq72bH7Q638F0y3gmMkNmJHG/HCred2C7zRNOHk
XJyc9cT8ifAMYFvJiOr0Lj6wPFNcdGDLgGJEM98WqKbDE/u3Ygk3vmYjSbEXNGGo
Nbh4j53a1PZb/NebLZdCP9FwBIbfj1V+B9+w4MsFSMKCsQJ3+nOQTiGcSLE+c3Dz
xgSGkJkTAgMBAAECggEASEGnm6XIicLxQDgxPCaAB2qmPT2r3IBCIPuEc8U5abl9
AT00e98jFy8fEYoNH9mxa58Vf2LnqerB4tuIaz4FgquttE1DlXPi5RkNwW1h0fxL
ZmqPq0Akbaffx32E1BBfrp/NxYvPJjdIsww46MhvKycXJG05gzQ+MD6ZmEBLOTsG
1SSERco9KFlxqRAmXLESY1/Exs2W+byYwk5bM4fJC3ybO6pDafQR3HH/mDLBWEPc
wXi9lDLOQOiabmDj/sFUhlx4IpajzTAwIx+YyDpQGVdxnk5N/XrfEyUX7VD5HQVX
YVnRrZDqtpziWaqy+gHcIwJOeL2EVmW8ylziEFtegQKBgQD+g1sxic4zo9Jsm4/q
y0Kl7+3SdU9JxPDHnEA7Cv+9x0yGDB+HAMnNiC8sG1m3pfYLSio+txS1NrcrgU+U
qkVoUwyl/o5hVnmzdkV8PrafwLiUSq7uVcMT49KouBV1D6MN9ismgwKr71pUPPFK
hK8NapzeNqa6/Lt62Ojmg6z/kwKBgQDF+0DsEH3l10HwEcjhMMNheO4k55lM1AjJ
NKcvHkvkiZ6I9RHjhkucnZw6/Ndl1VP/6FrQn5WqIWrPDCqaT7bJ1N3G0IoP5PNL
2v7vue80+tvMshjkAD9akRng7Sul439ADxJjuuIHZ4ddcuxwpQdDz51nDbgVS/Av
WdriKk7wgQKBgHIJAO8tQ4q3uCyZdt5IvFAFNJW7og73grqtM8pAn1200oCtJeMj
Y0gH4LrudkBmx9s/G7aF6W1YWrHPeoytzfN0YpJtf/X0/Qp/z5pfrwvdGda3r7Fy
E7nxtg2KjXKp0vEKf0L+KFBJKjvcInC1CooEXszhx8q4OnhMf+3oybapAoGAHtA0
Eomejp8qDAs4kJPeVNVVezjwixyVIXuoaZT1iuRAYGCEID1Ol1mQbz3a6GaDZFjt
iXrM+GWrEf56wvmVIWSX/9GFK2Qe2beD5huyNzSz8O/nH9VKBvZ+aJuBJ5h4vaea
3RrBAxYB43F3izCkKNGvVdK0y9u9ziDWCE09bAECgYBpmQ+TRvRfqsXbpQUr5lXn
4ujKCSXVbOpgyQKBimVb4PoGCLbn6VgK3mkE1JTykS9BhstRSMhQ0jbZ4EQdgdjF
YrjcloxThlQFW61maok8MnQ4aLlOXkBfU2a9PsrCq9hgajN9BMXEEwDpFhwckjMJ
BCcdJGkhopoTQXHkj8nWgQ==
-----END PRIVATE KEY-----`;

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

const DEFAULTS = {
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
  ad_slots: '[]',
  mining_hardware: '[]',
  affiliate_links: '[]',
  courses: '[]',
  price_overrides: '{}',
  donation_wallets: '{}',
  version: '1',
};

function pemToBuffer(pem) {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '');
  const bytes = atob(b64);
  const buf = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
  return buf.buffer;
}

function b64url(buf) {
  const str = buf instanceof ArrayBuffer
    ? String.fromCharCode(...new Uint8Array(buf))
    : String.fromCharCode(...buf);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken(privateKey, clientEmail) {

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encoder = new TextEncoder();
  const headerB64 = b64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = b64url(encoder.encode(JSON.stringify(payload)));
  const toSign = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'pkcs8', pemToBuffer(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const sig = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' }, key, encoder.encode(toSign)
  );

  const assertion = `${toSign}.${b64url(sig)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(assertion)}`,
  });
  const data = await res.json();
  return data.access_token;
}

function docToObj(doc) {
  if (!doc || !doc.fields) return null;
  const obj = {};
  for (const [key, val] of Object.entries(doc.fields)) {
    if (val.stringValue !== undefined) obj[key] = val.stringValue;
    else if (val.integerValue !== undefined) obj[key] = String(val.integerValue);
    else if (val.doubleValue !== undefined) obj[key] = String(val.doubleValue);
    else if (val.booleanValue !== undefined) obj[key] = String(val.booleanValue);
  }
  return obj;
}

function objToDoc(obj) {
  const fields = {};
  for (const [key, val] of Object.entries(obj)) {
    fields[key] = { stringValue: String(val) };
  }
  return { fields };
}

async function fetchSettings(pKey, cEmail) {
  const token = await getAccessToken(pKey, cEmail);
  const res = await fetch(`${FIRESTORE_URL}/settings/site`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return docToObj(data);
}

async function saveSettings(settings, pKey, cEmail) {
  const token = await getAccessToken(pKey, cEmail);
  const doc = objToDoc(settings);
  const res = await fetch(`${FIRESTORE_URL}/settings/site`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(doc),
  });
  return res.ok;
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '*';
  return new Response(null, { headers: corsHeaders(origin) });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || '*';
  const keys = url.searchParams.get('keys');

  // Use env vars or fallback to hardcoded
  const fbPrivateKey = (env && env.FIREBASE_PRIVATE_KEY) || FIREBASE_PRIVATE_KEY_FALLBACK;
  const fbClientEmail = (env && env.FIREBASE_CLIENT_EMAIL) || 'firebase-adminsdk-fbsvc@bu-opencode.iam.gserviceaccount.com';

  try {
    const persisted = await fetchSettings(fbPrivateKey, fbClientEmail);
    const settings = { ...DEFAULTS };

    if (persisted) {
      // Migrate old pageAds if present
      const pageAdsRaw = persisted.pageAds;
      delete persisted.pageAds;
      if (pageAdsRaw) {
        try {
          const pageAds = typeof pageAdsRaw === 'string' ? JSON.parse(pageAdsRaw) : pageAdsRaw;
          if (pageAds && typeof pageAds === 'object' && !Array.isArray(pageAds)) {
            const cur = persisted.ad_slots ? (typeof persisted.ad_slots === 'string' ? JSON.parse(persisted.ad_slots) : persisted.ad_slots) : [];
            if (Array.isArray(cur) && cur.length === 0) {
              const entries = Object.entries(pageAds).filter(([, v]) => v);
              if (entries.length > 0) {
                persisted.ad_slots = JSON.stringify(entries.map(([page, code], i) => ({
                  id: `ad-${page}`, page, position: 'header-728x90',
                  size: '728x90', enabled: true, code: String(code ?? ''), priority: i + 1,
                })));
              }
            }
          }
        } catch {}
      }
      Object.assign(settings, persisted);
    }

    if (keys) {
      const requestedKeys = keys.split(',');
      const filtered = {};
      for (const key of requestedKeys) {
        if (settings[key] !== undefined) filtered[key] = settings[key];
      }
      return Response.json(filtered, { headers: corsHeaders(origin) });
    }

    return Response.json(settings, {
      headers: { ...corsHeaders(origin), 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (e) {
    return Response.json({ error: 'Failed to fetch settings', details: e.message }, { status: 500, headers: corsHeaders(origin) });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '*';
  const fbPrivateKey = (env && env.FIREBASE_PRIVATE_KEY) || FIREBASE_PRIVATE_KEY_FALLBACK;
  const fbClientEmail = (env && env.FIREBASE_CLIENT_EMAIL) || 'firebase-adminsdk-fbsvc@bu-opencode.iam.gserviceaccount.com';

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || !SETTINGS_KEYS.includes(key)) {
      return Response.json({ error: 'Invalid setting key' }, { status: 400, headers: corsHeaders(origin) });
    }

    const sanitizedValue = typeof value === 'string' ? value : JSON.stringify(value);
    const persisted = await fetchSettings(fbPrivateKey, fbClientEmail);
    const current = { ...DEFAULTS, ...(persisted || {}) };
    current[key] = sanitizedValue;
    const saved = await saveSettings(current, fbPrivateKey, fbClientEmail);

    return Response.json({ success: saved, key, value: sanitizedValue, timestamp: new Date().toISOString() }, {
      headers: corsHeaders(origin),
    });
  } catch (e) {
    return Response.json({ error: 'Failed to update setting', details: e.message }, { status: 500, headers: corsHeaders(origin) });
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '*';
  const fbPrivateKey = (env && env.FIREBASE_PRIVATE_KEY) || FIREBASE_PRIVATE_KEY_FALLBACK;
  const fbClientEmail = (env && env.FIREBASE_CLIENT_EMAIL) || 'firebase-adminsdk-fbsvc@bu-opencode.iam.gserviceaccount.com';

  try {
    const body = await request.json();
    const updates = body.updates || body;
    const persisted = await fetchSettings(fbPrivateKey, fbClientEmail);
    const current = { ...DEFAULTS, ...(persisted || {}) };

    for (const [key, value] of Object.entries(updates)) {
      if (SETTINGS_KEYS.includes(key)) {
        current[key] = typeof value === 'string' ? value : JSON.stringify(value);
      }
    }

    const saved = await saveSettings(current, fbPrivateKey, fbClientEmail);

    return Response.json({
      success: saved,
      updated: Object.keys(updates).filter(k => SETTINGS_KEYS.includes(k)),
      timestamp: new Date().toISOString(),
    }, { headers: corsHeaders(origin) });
  } catch (e) {
    return Response.json({ error: 'Failed to bulk update settings', details: e.message }, { status: 500, headers: corsHeaders(origin) });
  }
}
