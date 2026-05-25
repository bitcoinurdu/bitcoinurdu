const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync('C:\\Users\\Mraxhar\\.local\\share\\opencode\\tool-output\\aslminer-raw.txt', 'utf-8');
const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const KNOWN_COINS = new Set(['BTC','BCH','BCHBTC','DOGE','LTC','ALEO','ALPH','KAS','ZEC','ZEN','INI','XTM','DASH','ETC','CKB','XMR','SC','SCC','SCP','SUMO']);

function isCoin(s) { return KNOWN_COINS.has(s.toUpperCase().trim()); }

const entries = [];
let i = 0;
while (i < lines.length) {
  const nameLine = lines[i];
  // The name line might contain the name repeated twice
  let name = nameLine;
  // Check if next line is a coin or directly a hashrate
  let coin = 'BTC';
  let idx = i + 1;
  if (idx < lines.length && isCoin(lines[idx])) {
    coin = lines[idx].toUpperCase();
    idx++;
  }
  // Next is hashrate (we need to validate)
  if (idx >= lines.length) break;
  const hashrateLine = lines[idx];
  // Parse hashrate
  const hrMatch = hashrateLine.match(/^([\d.]+)\s*(PH\/s|TH\/s|GH\/s|MH\/s|KH\/s|HH\/s)$/i);
  if (!hrMatch) { i++; continue; }
  const hashrate = parseFloat(hrMatch[1]);
  let hrUnit = hrMatch[2].toUpperCase();
  if (hrUnit === 'HH/S') hrUnit = 'GH/s'; // treat HH/s as GH/s (weird unit)
  
  idx++;
  if (idx >= lines.length) break;
  const powerLine = lines[idx];
  const pwMatch = powerLine.match(/^(\d+)W$/);
  if (!pwMatch) { i = idx; continue; }
  const power = parseInt(pwMatch[1]);
  
  idx++;
  if (idx >= lines.length) break;
  const priceLine = lines[idx];
  const prMatch = priceLine.match(/^\$?([\d,]+(?:\.\d+)?)$/);
  if (!prMatch) { i = idx; continue; }
  const price = parseFloat(prMatch[1].replace(/,/g, ''));
  
  idx++;
  if (idx >= lines.length) break;
  let earnMatch = lines[idx].match(/^\$?(-?[\d.]+)$/);
  if (!earnMatch) { i = idx; continue; }
  const earnings24h = parseFloat(earnMatch[1]);
  
  idx++;
  if (idx >= lines.length) break;
  let elecMatch = lines[idx].match(/^\$?(-?[\d.]+)$/);
  if (!elecMatch) { i = idx; continue; }
  const elecCost = parseFloat(elecMatch[1]);
  
  idx++;
  if (idx >= lines.length) break;
  let netMatch = lines[idx].match(/^\$?(-?[\d.]+)$/);
  if (!netMatch) { i = idx; continue; }
  const netProfit = parseFloat(netMatch[1]);
  
  idx++;
  if (idx >= lines.length) break;
  const paybackStr = lines[idx];
  const paybackDays = paybackStr.includes('Never') ? 99999 : parseInt(paybackStr);
  
  // Clean name - remove repeated parts
  // Check if name has a pattern like "Brand Model Brand Model specs"
  const parts = name.split(/\s+/);
  // Try to find the actual model name
  let cleanName = name;
  // Remove duplicate if the first half matches the second half roughly
  const midPoint = Math.floor(parts.length / 2);
  if (parts.length > 3) {
    const firstHalf = parts.slice(0, midPoint).join(' ');
    const secondHalf = parts.slice(midPoint).join(' ');
    if (secondHalf.startsWith(firstHalf) || firstHalf === secondHalf) {
      cleanName = secondHalf;
    } else if (secondHalf.includes(firstHalf.substring(0, 8)) && firstHalf.length > 8) {
      cleanName = secondHalf;
    }
  }
  // Remove trailing hash/power specs from name
  cleanName = cleanName.replace(/\s+\d+[TGMK]h?\/?s?\d*W?$/i, '').trim();
  cleanName = cleanName.replace(/\s+\d+W$/, '').trim();
  
  // Clean coin field
  let cleanCoin = coin;
  if (coin === 'BCHBTC') cleanCoin = 'BCH+BTC';
  if (coin === 'DOGE') cleanCoin = 'DOGE+LTC';
  if (coin === 'ZEC') cleanCoin = 'ZEC+ZEN';
  
  // Determine category
  let category = 'PROFESSIONAL';
  if (power <= 100 && price <= 100) category = 'SOLO_MINER';
  else if (power <= 500 && price <= 500) category = 'HOME_MINER';
  else if (power <= 200 && price <= 200) category = 'SOLO_MINER';
  else if (hashrate < 1 && hrUnit === 'TH/s' && power < 200) category = 'SOLO_MINER';
  else if (price <= 1000 && power <= 1000) category = 'HOME_MINER';
  else if (power >= 7000) category = 'INDUSTRIAL';
  
  // Solo miners
  if (cleanName.match(/Solo|Solo|Nerd|Bitaxe|Lucky|Hammer|Magic|NerdMiner|NerdQaxe|NerdOCTAxe|PlebSource|BG0|LV0/i)) {
    category = 'SOLO_MINER';
  }
  
  // Generate slug
  const slug = cleanName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
  
  const id = slug;
  
  // Map coin to algorithm and algorithmFull
  const algoMap = {
    'BTC': { algo: 'SHA-256', full: 'SHA-256 (Bitcoin)' },
    'BCH': { algo: 'SHA-256', full: 'SHA-256 (Bitcoin Cash)' },
    'BCH+BTC': { algo: 'SHA-256', full: 'SHA-256 (BTC/BCH)' },
    'DOGE+LTC': { algo: 'Scrypt', full: 'Scrypt (LTC/DOGE)' },
    'LTC': { algo: 'Scrypt', full: 'Scrypt (Litecoin)' },
    'ZEC+ZEN': { algo: 'Equihash', full: 'Equihash (ZEC/ZEN)' },
    'ZEC': { algo: 'Equihash', full: 'Equihash (Zcash)' },
    'KAS': { algo: 'kHeavyHash', full: 'kHeavyHash (Kaspa)' },
    'ALPH': { algo: 'Blake3', full: 'Blake3 (Alephium)' },
    'ALEO': { algo: 'zkSNARK', full: 'zkSNARK (Aleo)' },
    'INI': { algo: 'VersaHash', full: 'VersaHash (InitVerse)' },
    'XTM': { algo: 'SHA3x', full: 'SHA3x (Torrent)' },
    'DASH': { algo: 'X11', full: 'X11 (Dash)' },
    'ETC': { algo: 'EtHash', full: 'EtHash (Ethereum Classic)' },
    'CKB': { algo: 'Eaglesong', full: 'Eaglesong (CKB)' },
    'XMR': { algo: 'RandomX', full: 'RandomX (Monero)' },
  };
  const algoInfo = algoMap[cleanCoin] || { algo: 'SHA-256', full: 'SHA-256 (Bitcoin)' };
  
  // Map coin to ticker list for coins field
  const coinMap = {
    'BTC': [{ ticker: 'BTC', name: 'Bitcoin' }],
    'BCH': [{ ticker: 'BCH', name: 'Bitcoin Cash' }],
    'BCH+BTC': [{ ticker: 'BTC', name: 'Bitcoin' }, { ticker: 'BCH', name: 'Bitcoin Cash' }],
    'DOGE+LTC': [{ ticker: 'LTC', name: 'Litecoin' }, { ticker: 'DOGE', name: 'Dogecoin' }],
    'LTC': [{ ticker: 'LTC', name: 'Litecoin' }],
    'ZEC+ZEN': [{ ticker: 'ZEC', name: 'Zcash' }, { ticker: 'ZEN', name: 'Horizen' }],
    'ZEC': [{ ticker: 'ZEC', name: 'Zcash' }],
    'KAS': [{ ticker: 'KAS', name: 'Kaspa' }],
    'ALPH': [{ ticker: 'ALPH', name: 'Alephium' }],
    'ALEO': [{ ticker: 'ALEO', name: 'Aleo' }],
    'INI': [{ ticker: 'INI', name: 'InitVerse' }],
    'XTM': [{ ticker: 'XTM', name: 'Torrent' }],
    'DASH': [{ ticker: 'DASH', name: 'Dash' }],
    'ETC': [{ ticker: 'ETC', name: 'Ethereum Classic' }],
    'CKB': [{ ticker: 'CKB', name: 'Nervos CKB' }],
    'XMR': [{ ticker: 'XMR', name: 'Monero' }],
  };
  const coins = coinMap[cleanCoin] || [{ ticker: 'BTC', name: 'Bitcoin' }];

  const cooling = power >= 7000 ? 'Hydro' : (power >= 3000 ? 'Air' : 'Air');

  // generate specs
  const specs = [`${algoInfo.algo} Algorithm`];
  if (cleanCoin.includes('BTC') || cleanCoin.includes('BCH')) specs.push('SHA-256 Mining');
  if (cleanCoin === 'DOGE+LTC') specs.push('LTC/DOGE Mining');
  if (cleanName.toLowerCase().includes('solo')) specs.push('Solo Mining');
  if (cooling === 'Hydro') specs.push('Hydro Cooling');
  else specs.push('Air Cooled');
  if (power <= 200) specs.push('Low Power');
  
  entries.push({
    id, slug, name: cleanName,
    manufacturer: cleanName.includes('Antminer') ? 'Bitmain' :
      cleanName.includes('Whats') || cleanName.includes('MicroBT') ? 'MicroBT' :
      cleanName.includes('Canaan') || cleanName.includes('Avalon') ? 'Canaan' :
      cleanName.includes('IceRiver') ? 'IceRiver' :
      cleanName.includes('Goldshell') ? 'GoldShell' :
      cleanName.includes('SealMiner') || cleanName.includes('Bitdeer') ? 'Bitdeer' :
      cleanName.includes('VolcMiner') ? 'VolcMiner' :
      cleanName.includes('Jasminer') ? 'Jasminer' :
      cleanName.includes('ElphaPex') ? 'ElphaPex' :
      cleanName.includes('iPollo') ? 'iPollo' :
      cleanName.includes('iBeLink') ? 'iBeLink' :
      cleanName.includes('Bitaxe') ? 'Bitaxe' :
      cleanName.includes('Nerd') || cleanName.includes('Nerd') ? 'NerdMiner' :
      cleanName.includes('Lucky') ? 'Lucky Miner' :
      cleanName.includes('Bombax') ? 'Bombax' :
      cleanName.includes('Fluminer') ? 'Fluminer' :
      cleanName.includes('Pinecone') || cleanName.includes('INIBOX') ? 'Pinecone' :
      cleanName.includes('Innosilicon') ? 'Innosilicon' :
      cleanName.includes('Magic') || cleanName.includes('BG0') ? 'Magic Miner' :
      cleanName.includes('Baikal') ? 'Baikal' :
      cleanName.includes('PlebSource') ? 'PlebSource' :
      cleanName.includes('DragonBall') ? 'DragonBall' :
      cleanName.includes('Auradine') ? 'Auradine' :
      cleanName.includes('Avalon Nano') ? 'Canaan' :
      cleanName.includes('ForestMiner') ? 'ForestMiner' :
      'Unknown',
    coin: cleanCoin,
    algorithm: algoInfo.algo,
    hashrate, hashrateUnit: hrUnit,
    power, powerUnit: 'W',
    price: Math.round(price),
    earnings24h: Math.round(earnings24h * 100) / 100,
    electricityCost24h: Math.round(elecCost * 100) / 100,
    netProfit24h: Math.round(netProfit * 100) / 100,
    releaseDate: '2024',
    category,
    noise: power >= 7000 ? '80dB' : power >= 3000 ? '75dB' : power >= 1000 ? '65dB' : '45dB',
    weight: power >= 7000 ? '22000g' : power >= 3000 ? '16000g' : power >= 1000 ? '8000g' : '500g',
    dimensions: power >= 7000 ? '535×460×180mm' : power >= 3000 ? '430×195×290mm' : power >= 1000 ? '350×150×240mm' : '200×150×85mm',
    cooling,
    specs: specs.slice(0, 4),
    coins,
  });
  
  i = idx + 1;
}

// Generate TypeScript file
const header = `export const ELEC_RATE = 0.07;

export interface MinerEntry {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  coin: string;
  algorithm: string;
  hashrate: number;
  hashrateUnit: string;
  power: number;
  powerUnit: string;
  price: number;
  earnings24h: number;
  electricityCost24h: number;
  netProfit24h: number;
  releaseDate: string;
  category: string;
  noise: string;
  weight: string;
  dimensions: string;
  cooling: string;
  specs: string[];
  coins: { ticker: string; name: string }[];
}

export function getHardwareBySlug(slug: string): MinerEntry | undefined {
  return HARDWARE_MATRIX.find(m => m.slug === slug);
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const HARDWARE_MATRIX: MinerEntry[] = [
`;

function genEntry(e) {
  return `  {
    id: '${e.id}', slug: '${e.slug}',
    name: '${e.name.replace(/'/g, "\\'")}', manufacturer: '${e.manufacturer}', coin: '${e.coin}', algorithm: '${e.algorithm}',
    hashrate: ${e.hashrate}, hashrateUnit: '${e.hashrateUnit}', power: ${e.power}, powerUnit: 'W', price: ${e.price},
    earnings24h: ${e.earnings24h}, electricityCost24h: ${e.electricityCost24h}, netProfit24h: ${e.netProfit24h},
    releaseDate: '${e.releaseDate}', category: '${e.category}', noise: '${e.noise}', weight: '${e.weight}',
    dimensions: '${e.dimensions}', cooling: '${e.cooling}',
    specs: [${e.specs.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],
    coins: [${e.coins.map(c => `{ ticker: '${c.ticker}', name: '${c.name}' }`).join(', ')}],
  },`;
}

let output = header;
entries.forEach(e => { output += '\n' + genEntry(e); });
output += '\n];\n';

fs.writeFileSync(path.join(__dirname, 'mining-api-generated.ts'), output);
console.log(`Generated ${entries.length} miner entries`);
// Remove duplicates by slug
const slugs = new Set();
const unique = entries.filter(e => {
  if (slugs.has(e.slug)) return false;
  slugs.add(e.slug);
  return true;
});
console.log(`Unique entries: ${unique.length}`);
fs.writeFileSync(path.join(__dirname, 'mining-api-generated.ts'), header + '\n' + unique.map(genEntry).join('\n') + '\n];\n');
console.log(`Final file written with ${unique.length} entries`);
