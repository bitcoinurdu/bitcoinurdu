import type { PortfolioAsset } from '@/types';

const LOCAL_PORTFOLIO_KEY = 'bitcoinurdu-portfolio-local';
const LOCAL_VERSION_KEY = 'bitcoinurdu-portfolio-version';
const CURRENT_VERSION = 2;

export interface LocalPortfolioData {
  assets: PortfolioAsset[];
  lastSynced: string | null;
  version: number;
}

function generateId(): string {
  return `pf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function loadLocalPortfolio(): LocalPortfolioData {
  try {
    const raw = localStorage.getItem(LOCAL_PORTFOLIO_KEY);
    if (!raw) {
      return { assets: [], lastSynced: null, version: CURRENT_VERSION };
    }
    const parsed = JSON.parse(raw) as LocalPortfolioData;
    if (parsed.version < CURRENT_VERSION) {
      migratePortfolio(parsed);
    }
    return parsed;
  } catch {
    return { assets: [], lastSynced: null, version: CURRENT_VERSION };
  }
}

export function saveLocalPortfolio(assets: PortfolioAsset[]): void {
  try {
    const data: LocalPortfolioData = {
      assets,
      lastSynced: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
    localStorage.setItem(LOCAL_PORTFOLIO_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[Portfolio] Failed to save locally:', err);
  }
}

export function addLocalAsset(asset: Omit<PortfolioAsset, 'id' | 'added_at'>): PortfolioAsset {
  const data = loadLocalPortfolio();
  const newAsset: PortfolioAsset = {
    ...asset,
    id: generateId(),
    added_at: new Date().toISOString(),
  };
  data.assets.push(newAsset);
  saveLocalPortfolio(data.assets);
  return newAsset;
}

export function removeLocalAsset(assetId: string): boolean {
  const data = loadLocalPortfolio();
  const before = data.assets.length;
  data.assets = data.assets.filter((a) => a.id !== assetId);
  if (data.assets.length < before) {
    saveLocalPortfolio(data.assets);
    return true;
  }
  return false;
}

export function updateLocalAsset(assetId: string, updates: Partial<PortfolioAsset>): boolean {
  const data = loadLocalPortfolio();
  const idx = data.assets.findIndex((a) => a.id === assetId);
  if (idx === -1) return false;
  data.assets[idx] = { ...data.assets[idx], ...updates };
  saveLocalPortfolio(data.assets);
  return true;
}

export function clearLocalPortfolio(): void {
  localStorage.removeItem(LOCAL_PORTFOLIO_KEY);
}

function migratePortfolio(data: LocalPortfolioData): void {
  if (data.version < 2) {
    for (const asset of data.assets) {
      if (!asset.coin_id) {
        asset.coin_id = asset.symbol.toLowerCase();
      }
    }
  }
  data.version = CURRENT_VERSION;
  saveLocalPortfolio(data.assets);
}

export async function syncLocalToCloud(
  userId: string,
  localAssets: PortfolioAsset[],
  localWatchlist: string[],
  cloudAssets: PortfolioAsset[],
  cloudWatchlist: string[]
): Promise<{ mergedAssets: PortfolioAsset[]; mergedWatchlist: string[] }> {
  const assetMap = new Map<string, PortfolioAsset>();

  for (const asset of cloudAssets) {
    assetMap.set(asset.coin_id, asset);
  }

  for (const asset of localAssets) {
    const existing = assetMap.get(asset.coin_id);
    if (existing) {
      const localAdded = new Date(asset.added_at).getTime();
      const cloudAdded = new Date(existing.added_at).getTime();
      if (localAdded > cloudAdded) {
        assetMap.set(asset.coin_id, {
          ...existing,
          quantity: existing.quantity + asset.quantity,
          total_invested: existing.total_invested + asset.total_invested,
        });
      }
    } else {
      assetMap.set(asset.coin_id, asset);
    }
  }

  const mergedAssets = Array.from(assetMap.values());
  const mergedWatchlist = [...new Set([...cloudWatchlist, ...localWatchlist])];

  return { mergedAssets, mergedWatchlist };
}

export function calculatePortfolioPNL(
  assets: PortfolioAsset[],
  livePrices: Record<string, { current_price: number; price_change_percentage_24h?: number }>
) {
  let totalInvested = 0;
  let totalValue = 0;
  const assetDetails = assets.map((asset) => {
    const live = livePrices[asset.coin_id];
    const currentPrice = live?.current_price || asset.current_price;
    const currentValue = currentPrice * asset.quantity;
    const pnl = currentValue - asset.total_invested;
    const pnlPercent = asset.total_invested > 0 ? (pnl / asset.total_invested) * 100 : 0;

    totalInvested += asset.total_invested;
    totalValue += currentValue;

    return {
      ...asset,
      currentPrice,
      currentValue,
      pnl,
      pnlPercent,
      priceChange24h: live?.price_change_percentage_24h,
    };
  });

  const totalPnl = totalValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  return {
    assets: assetDetails,
    totalInvested,
    totalValue,
    totalPnl,
    totalPnlPercent,
  };
}
