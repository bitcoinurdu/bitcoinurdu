import type { SEOConfig } from '@/types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitcoinurdu.com';
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'BitcoinUrdu';
export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_DESCRIPTION ||
  "The World's Elite Multi-lingual Crypto Platform - Live Prices & Portfolio Tracker";

export function generateSEO(config: Partial<SEOConfig> = {}): SEOConfig {
  return {
    title: config.title || SITE_NAME,
    description: config.description || SITE_DESCRIPTION,
    keywords: config.keywords || [
      'bitcoin',
      'bitcoin price today',
      'crypto',
      'cryptocurrency',
      'crypto price tracker',
      'crypto trading',
      'airdrops',
      'free crypto airdrops',
      'crypto airdrops 2026',
      'portfolio tracker',
      'crypto portfolio',
      'trading',
      'pakistan',
      'urdu',
      'bitcoin urdu',
      'crypto urdu',
      'crypto news',
      'bitcoin news',
      'ethereum price',
      'crypto jobs',
      'web3 jobs',
      'blockchain jobs',
      'crypto market today',
      'live crypto prices',
      'crypto calculator',
      'usdt price',
      'usdt to usd',
      'crypto investment',
      'learn crypto',
      'crypto guide',
      'bitcoin kya hai',
      'crypto kya hai',
      'blockchain kya hai',
      'crypto mining',
      'defi',
      'nft',
      'best crypto wallet',
      'crypto exchange',
      'dogecoin price',
      'solana price',
      'xrp price',
      'cardano price',
      'shiba inu price',
      'crypto alerts',
      'bitcoin halving 2026',
      'crypto prediction 2026',
    ],
    og_image: config.og_image || `${SITE_URL}/og-image.png`,
    canonical: config.canonical || SITE_URL,
    robots: config.robots || 'index, follow',
    schema: config.schema,
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}

export function generateWebsiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/bitcoinurdu',
      'https://t.me/bitcoinurdu',
      'https://discord.gg/bitcoinurdu',
    ],
  };
}
