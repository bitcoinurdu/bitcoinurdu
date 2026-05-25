-- Unified Site Settings SSOT Schema
-- D1 Migration: v1

CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')),
    version INTEGER DEFAULT 1
);

-- Seed default settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES
    ('site_name', 'BitcoinUrdu'),
    ('site_description', 'The World''s Elite Multi-lingual Crypto Platform'),
    ('site_url', 'https://bitcoinurdu.com'),
    ('default_theme', 'dark'),
    ('default_language', 'en'),
    ('default_currency', 'USD'),
    ('admin_email', 'admin@bitcoinurdu.com'),
    ('contact_email', 'contact@bitcoinurdu.com'),
    ('seo_title', 'BitcoinUrdu - Live Crypto Prices, News & Education'),
    ('seo_description', 'Track live crypto prices in PKR, USD & more. Learn Bitcoin & blockchain in Urdu, Roman Urdu, Sindhi & Pashto.'),
    ('seo_keywords', 'bitcoin, crypto, cryptocurrency, live prices, multi-lingual, global platform'),
    ('seo_og_image', '/og-image.png'),
    ('adsense_client_id', ''),
    ('ga_measurement_id', ''),
    ('coingecko_api_key', ''),
    ('social_links', '{"twitter":"https://x.com/bitcoinurdu","telegram":"https://t.me/bitcoinurdu","youtube":"https://youtube.com/@bitcoinurdu","facebook":"https://facebook.com/bitcoinurdu","website":"https://bitcoinurdu.com"}'),
    ('announcements', '[]'),
    ('ad_slots', '[]'),
    ('affiliate_links', '[]'),
    ('courses', '[]'),
    ('price_overrides', '{}'),
    ('donation_wallets', '{}'),
    ('version', '1');

-- Rate cache table
CREATE TABLE IF NOT EXISTS rate_cache (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')),
    ttl_seconds INTEGER DEFAULT 300
);

-- Announcements table for structured management
CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    enabled INTEGER DEFAULT 1,
    start_date TEXT,
    end_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Ad slots table for dynamic ad management
CREATE TABLE IF NOT EXISTS ad_slots (
    id TEXT PRIMARY KEY,
    page TEXT NOT NULL,
    position TEXT NOT NULL,
    size TEXT NOT NULL,
    enabled INTEGER DEFAULT 1,
    code TEXT DEFAULT '',
    priority INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
