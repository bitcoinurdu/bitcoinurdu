// Script to fetch all coins from CoinGecko and save locally in chunks
// Run with: node scripts/fetch-all-coins.js

const fs = require('fs');
const path = require('path');

const COINGECKO = 'https://api.coingecko.com/api/v3';
const DATA_DIR = path.join(__dirname, '..', 'data');
const COINS_FILE = path.join(DATA_DIR, 'coins-market.json');
const DELAY_MS = 5000; // 5 seconds between successful requests
const RATE_LIMIT_WAIT_MS = 30000; // 30 seconds when hitting 429

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllCoinIds(retries = 3) {
  console.log('Fetching all coin IDs from CoinGecko...');
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${COINGECKO}/coins/list`);
      if (res.ok) {
        const data = await res.json();
        console.log(`Found ${data.length} total coins`);
        return data;
      }
      
      if (res.status === 429 && attempt < retries) {
        console.log(`  ⚠️  Rate limited (429). Waiting ${RATE_LIMIT_WAIT_MS/1000}s before retry...`);
        await sleep(RATE_LIMIT_WAIT_MS);
        continue;
      }
    } catch (err) {
      console.log(`  ⚠️  Network error: ${err.message}. Retrying...`);
      await sleep(5000);
    }
  }
  
  throw new Error('Failed to fetch coin list after retries');
}

async function fetchCoinMarketData(page, perPage = 250, maxRetries = 5) {
  const url = `${COINGECKO}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d`;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      
      if (res.ok) {
        return await res.json();
      }
      
      if (res.status === 429) {
        console.log(`  ⚠️  Rate limited (429). Waiting ${RATE_LIMIT_WAIT_MS/1000}s (attempt ${attempt}/${maxRetries})...`);
        await sleep(RATE_LIMIT_WAIT_MS);
        // Continue to next attempt - retry same page
        continue;
      }
      
      // Other errors (404, 500, etc.)
      console.log(`  ⚠️  HTTP ${res.status} on page ${page}`);
      return null;
      
    } catch (err) {
      console.log(`  ⚠️  Network error: ${err.message}. Waiting 10s before retry...`);
      await sleep(10000);
    }
  }
  
  // All retries exhausted
  console.log(`  ❌ Failed to fetch page ${page} after ${maxRetries} attempts`);
  return null;
}

function loadExistingData() {
  if (fs.existsSync(COINS_FILE)) {
    try {
      const raw = fs.readFileSync(COINS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        pages: parsed.pages || [],
        lastUpdated: parsed.lastUpdated,
        totalCoins: parsed.totalCoins || 0,
        totalPages: parsed.totalPages || 0,
      };
    } catch {
      return { pages: [], lastUpdated: null, totalCoins: 0, totalPages: 0 };
    }
  }
  return { pages: [], lastUpdated: null, totalCoins: 0, totalPages: 0 };
}

function saveData(data) {
  fs.writeFileSync(COINS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function main() {
  try {
    // Step 1: Fetch all coin IDs
    const allCoinIds = await fetchAllCoinIds();
    const totalCoins = allCoinIds.length;
    const totalPages = Math.ceil(totalCoins / 250);

    console.log(`\nTotal coins: ${totalCoins}`);
    console.log(`Total pages to fetch: ${totalPages}`);
    console.log(`Estimated time: ~${Math.ceil(totalPages * DELAY_MS / 1000)} seconds\n`);

    // Step 2: Load existing data (resume if interrupted)
    const existing = loadExistingData();
    const existingPages = existing.pages || [];
    
    // Build set of already-fetched page numbers
    const fetchedPageNumbers = new Set(existingPages.map(p => p.page));
    const startPage = 1;

    if (existingPages.length > 0) {
      const lastPage = Math.max(...existingPages.map(p => p.page));
      const totalFetched = existingPages.reduce((sum, p) => sum + p.count, 0);
      console.log(`Resuming: already have ${existingPages.length} pages (${totalFetched} coins), last page: ${lastPage}\n`);
    }

    // Step 3: Fetch page by page, skipping already-fetched pages
    const allPages = [...existingPages];
    let consecutiveFailures = 0;
    const MAX_CONSECUTIVE_FAILURES = 3;

    for (let page = startPage; page <= totalPages; page++) {
      // Skip if we already have this page
      if (fetchedPageNumbers.has(page)) {
        continue;
      }

      console.log(`Fetching page ${page}/${totalPages}...`);
      const coins = await fetchCoinMarketData(page, 250);

      if (coins === null) {
        // Failed to fetch (not rate limited, actual error)
        consecutiveFailures++;
        console.log(`  Skipping page ${page} (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES} consecutive failures)`);
        
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          console.log(`\n  ⚠️  ${MAX_CONSECUTIVE_FAILURES} consecutive failures. Pausing 60s before continuing...`);
          await sleep(60000);
          consecutiveFailures = 0;
        }
        continue;
      }

      if (coins.length === 0) {
        console.log(`  Empty response on page ${page}. This is normal for high page numbers.`);
        // Don't break - there might be data on later pages (unlikely but safe)
        continue;
      }

      // Success - reset failure counter
      consecutiveFailures = 0;

      // Check if we already have this page (duplicate protection)
      const existingIndex = allPages.findIndex(p => p.page === page);
      const pageData = {
        page,
        count: coins.length,
        fetchedAt: new Date().toISOString(),
        coins,
      };

      if (existingIndex >= 0) {
        // Replace existing page data
        allPages[existingIndex] = pageData;
        console.log(`  🔄 Updated page ${page} (${coins.length} coins)`);
      } else {
        // Append new page
        allPages.push(pageData);
        console.log(`  ✅ Saved page ${page} (${coins.length} coins)`);
      }

      // Sort pages by page number
      allPages.sort((a, b) => a.page - b.page);

      const totalFetched = allPages.reduce((sum, p) => sum + p.count, 0);
      console.log(`  📊 Total: ${totalFetched}/${totalCoins} coins across ${allPages.length} pages`);

      // Save immediately after each page
      saveData({
        lastUpdated: new Date().toISOString(),
        totalCoins,
        totalPages: allPages.length,
        pages: allPages,
      });

      // Delay between requests
      if (page < totalPages) {
        await sleep(DELAY_MS);
      }
    }

    const finalTotal = allPages.reduce((sum, p) => sum + p.count, 0);
    const finalData = {
      lastUpdated: new Date().toISOString(),
      totalCoins,
      totalPages: allPages.length,
      pages: allPages,
    };

    saveData(finalData);

    console.log('\n' + '='.repeat(60));
    console.log('✅ DONE!');
    console.log(`Total coin IDs: ${totalCoins}`);
    console.log(`Pages fetched: ${allPages.length}`);
    console.log(`Coins with market data: ${finalTotal}`);
    console.log(`Saved to: ${COINS_FILE}`);
    console.log(`File size: ${(fs.statSync(COINS_FILE).size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Last updated: ${finalData.lastUpdated}`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
