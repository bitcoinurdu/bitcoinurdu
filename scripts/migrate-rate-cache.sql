-- Rate cache table for fail-safe API fallback
CREATE TABLE IF NOT EXISTS rate_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_cache_key ON rate_cache(key);

-- Insert default fallback values
INSERT OR IGNORE INTO rate_cache (key, value, updated_at) VALUES
  ('gold', '{"gold_24k_per_oz":2650,"gold_22k_per_oz":2430,"gold_21k_per_oz":2319,"gold_18k_per_oz":1988,"gold_per_gram_24k":85.2,"silver_per_oz":30.5,"silver_per_gram":0.98,"lastUpdated":"2026-05-21T00:00:00.000Z"}', datetime('now')),
  ('fiat', '{"usd_pkr":278,"usd_eur":0.92,"usd_gbp":0.79,"usd_aed":3.6725,"usd_sar":3.75,"lastUpdated":"2026-05-21T00:00:00.000Z"}', datetime('now')),
  ('crypto', '{"coins":[],"global":{"total_market_cap":2500000000000,"total_volume":100000000000,"btc_dominance":54,"eth_dominance":17,"active_cryptocurrencies":15984,"lastUpdated":"2026-05-21T00:00:00.000Z"}}', datetime('now'));
