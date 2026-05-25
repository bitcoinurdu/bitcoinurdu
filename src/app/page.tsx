import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import HomePageClient from './home-page-client';

export const metadata: Metadata = generateSEO({
  title: 'BitcoinUrdu - The World\'s Elite Multi-lingual Crypto Platform',
  description: 'Live crypto prices, airdrops, jobs, portfolio tracking aur AI insights',
});

async function getGlobalData() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global', {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getUSDCoins() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h,24h,7d',
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getTrendingCoins() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/search/trending', {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getFearGreedIndex() {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1', {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [globalData, usdCoins, trendingData, fearGreedData] = await Promise.all([
    getGlobalData(),
    getUSDCoins(),
    getTrendingCoins(),
    getFearGreedIndex(),
  ]);

  const coinsWithUSD = (usdCoins || []).map((c: Record<string, unknown>) => ({
    ...c,
    usd_price: c.current_price as number,
  }));

  const tickerCoins = (usdCoins || []).slice(0, 10);

  return (
    <HomePageClient
      globalData={globalData}
      coins={coinsWithUSD}
      trendingData={trendingData}
      fearGreedData={fearGreedData}
      tickerCoins={tickerCoins}
    />
  );
}
