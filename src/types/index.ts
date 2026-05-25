export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank?: number;
  total_volume: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  price_change_percentage_1y?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  ath?: number;
  ath_date?: string;
  atl?: number;
  atl_date?: string;
  contract_address?: string;
  platforms?: Record<string, string>;
  description?: Record<string, string>;
  links?: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
    };
  };
  genesis_date?: string;
  sentiment_votes_up_percentage?: number;
  public_interest_score?: number;
  community_score?: number;
  developer_score?: number;
  liquidity_score?: number;
}

export interface Airdrop {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'upcoming' | 'confirmed' | 'ended';
  network: string[];
  token: string;
  estimated_value: string;
  snapshot_date?: string;
  claim_date?: string;
  end_date?: string;
  funding: {
    amount: string;
    investors: string[];
    rounds: string[];
  };
  steps: {
    title: string;
    description: string;
    link: string;
  }[];
  links: {
    website: string;
    twitter: string;
    discord: string;
    telegram: string;
    docs: string;
    claim?: string;
  };
  risk_score: number;
  eligibility: {
    min_balance?: string;
    min_transactions?: number;
    requirements: string[];
  };
  image: string;
  created_at: string;
  updated_at: string;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  high_24h: number;
  low_24h: number;
  open: number;
  previous_close: number;
  currency: string;
  exchange: string;
  type: 'stock' | 'forex' | 'commodity' | 'crypto' | 'etf' | 'index';
  region: string;
  last_updated: string;
}

export interface PortfolioAsset {
  id: string;
  coin_id: string;
  name: string;
  symbol: string;
  quantity: number;
  buy_price: number;
  current_price: number;
  total_invested: number;
  current_value: number;
  pnl: number;
  pnl_percent: number;
  added_at: string;
}

export interface Alert {
  id: string;
  type: 'price' | 'listing' | 'airdrop';
  target_id: string;
  target_name: string;
  condition: 'above' | 'below' | 'equals';
  value: number;
  active: boolean;
  triggered: boolean;
  created_at: string;
  triggered_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'blog' | 'news' | 'research';
  author: string;
  featured_image: string;
  tags: string[];
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer' | 'moderator';
  permissions: ('view' | 'edit' | 'delete' | 'publish' | 'admin')[];
  avatar?: string;
  created_at: string;
  last_login?: string;
  active: boolean;
}

export interface AdSlot {
  id: string;
  name: string;
  position: 'header' | 'sidebar' | 'inline' | 'footer' | 'sticky';
  type: 'adsense' | 'html' | 'sponsored' | 'banner';
  code: string;
  enabled: boolean;
  pages: string[];
  impressions: number;
  clicks: number;
}

export interface DonationWallet {
  id: string;
  network: string;
  token: string;
  address: string;
  qr_code: string;
  enabled: boolean;
}

export interface Language {
  code: string;
  name: string;
  native_name: string;
  direction: 'ltr' | 'rtl';
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  og_image: string;
  canonical: string;
  robots: string;
  schema?: Record<string, unknown>;
}

export interface SiteConfig {
  name: string;
  url: string;
  description: string;
  logo: string;
  favicon: string;
  social: {
    twitter: string;
    telegram: string;
    discord: string;
    youtube: string;
  };
  adsense: {
    client_id: string;
  };
  analytics: {
    ga_id: string;
  };
}
