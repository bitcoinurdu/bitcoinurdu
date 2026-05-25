CREATE TABLE IF NOT EXISTS coins (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  image TEXT,
  current_price REAL NOT NULL DEFAULT 0,
  market_cap REAL NOT NULL DEFAULT 0,
  market_cap_rank INTEGER,
  total_volume REAL NOT NULL DEFAULT 0,
  price_change_percentage_1h REAL,
  price_change_percentage_24h REAL,
  price_change_percentage_7d REAL,
  circulating_supply REAL,
  total_supply REAL,
  max_supply REAL,
  ath REAL,
  ath_date TEXT,
  atl REAL,
  atl_date TEXT,
  last_updated TEXT,
  fully_diluted_valuation REAL,
  high_24h REAL,
  low_24h REAL,
  price_change_24h REAL,
  market_cap_change_24h REAL,
  market_cap_change_percentage_24h REAL
);

CREATE INDEX IF NOT EXISTS idx_coins_rank ON coins(market_cap_rank);
CREATE INDEX IF NOT EXISTS idx_coins_symbol ON coins(symbol);
CREATE INDEX IF NOT EXISTS idx_coins_name ON coins(name);
CREATE INDEX IF NOT EXISTS idx_coins_24h_change ON coins(price_change_percentage_24h);
CREATE INDEX IF NOT EXISTS idx_coins_market_cap ON coins(market_cap);
