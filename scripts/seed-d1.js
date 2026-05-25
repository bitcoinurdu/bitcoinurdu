// D1 Database Seeder - Reads coins-market.json and seeds into Cloudflare D1
// Usage: npx wrangler d1 execute bitcoinurdu-db --remote --file=./scripts/seed-d1.sql
// Or:    node scripts/seed-d1.js (uses wrangler API)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_FILE = path.join(__dirname, '..', 'data', 'coins-market.json');
const BATCH_SIZE = 100; // D1 supports up to 100 statements per batch

// Create the SQL schema
const CREATE_TABLE_SQL = `
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
`;

function loadCoinData() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`Data file not found: ${DATA_FILE}`);
  }
  console.log('Loading coin data...');
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const parsed = JSON.parse(raw);

  const allCoins = [];
  for (const page of parsed.pages) {
    for (const coin of page.coins) {
      allCoins.push(coin);
    }
  }
  console.log(`Loaded ${allCoins.length} coins from ${parsed.pages.length} pages`);
  return allCoins;
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function generateInsertSQL(coins) {
  const statements = [];

  for (let i = 0; i < coins.length; i += BATCH_SIZE) {
    const batch = coins.slice(i, i + BATCH_SIZE);
    const values = batch.map((c) => {
      const vals = [
        escapeSql(c.id),
        escapeSql(c.symbol?.toLowerCase()),
        escapeSql(c.name),
        escapeSql(c.image),
        c.current_price ?? 0,
        c.market_cap ?? 0,
        c.market_cap_rank ?? 'NULL',
        c.total_volume ?? 0,
        c.price_change_percentage_1h_in_currency ?? 'NULL',
        c.price_change_percentage_24h ?? 'NULL',
        c.price_change_percentage_7d_in_currency ?? 'NULL',
        c.circulating_supply ?? 'NULL',
        c.total_supply ?? 'NULL',
        c.max_supply ?? 'NULL',
        c.ath ?? 'NULL',
        escapeSql(c.ath_date),
        c.atl ?? 'NULL',
        escapeSql(c.atl_date),
        escapeSql(c.last_updated),
        c.fully_diluted_valuation ?? 'NULL',
        c.high_24h ?? 'NULL',
        c.low_24h ?? 'NULL',
        c.price_change_24h ?? 'NULL',
        c.market_cap_change_24h ?? 'NULL',
        c.market_cap_change_percentage_24h ?? 'NULL',
      ];
      return `(${vals.join(',')})`;
    }).join(',');

    statements.push(
      `INSERT OR REPLACE INTO coins (id, symbol, name, image, current_price, market_cap, market_cap_rank, total_volume, price_change_percentage_1h, price_change_percentage_24h, price_change_percentage_7d, circulating_supply, total_supply, max_supply, ath, ath_date, atl, atl_date, last_updated, fully_diluted_valuation, high_24h, low_24h, price_change_24h, market_cap_change_24h, market_cap_change_percentage_24h) VALUES ${values};`
    );
  }

  return statements;
}

function main() {
  const args = process.argv.slice(2);
  const mode = args.includes('--remote') ? 'remote' : 'local';

  console.log(`\n${'='.repeat(60)}`);
  console.log(`D1 Database Seeder (${mode} mode)`);
  console.log(`${'='.repeat(60)}\n`);

  const coins = loadCoinData();

  console.log('\nGenerating SQL...');
  const sqlStatements = generateInsertSQL(coins);
  console.log(`Generated ${sqlStatements.length} batch statements`);

  const fullSQL = CREATE_TABLE_SQL + '\n' + sqlStatements.join('\n');
  const sqlFile = path.join(__dirname, 'seed-d1.sql');
  fs.writeFileSync(sqlFile, fullSQL, 'utf-8');

  const sqlSizeMB = (fs.statSync(sqlFile).size / 1024 / 1024).toFixed(2);
  console.log(`SQL file: ${sqlFile} (${sqlSizeMB} MB)`);

  console.log(`\nRunning: npx wrangler d1 execute bitcoinurdu-db --file="${sqlFile}"${mode === 'remote' ? ' --remote' : ''}`);

  try {
    const cmd = `npx wrangler d1 execute bitcoinurdu-db --file="${sqlFile}"${mode === 'remote' ? ' --remote' : ''}`;
    execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`\n✅ Seeded ${coins.length} coins into D1 database (${mode})`);
  } catch (err) {
    console.error('\n❌ Failed to execute SQL. Make sure wrangler is installed and D1 database exists.');
    console.error('Create database: npx wrangler d1 create bitcoinurdu-db');
    process.exit(1);
  }
}

main();
