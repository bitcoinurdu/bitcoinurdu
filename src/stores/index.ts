import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Coin, PortfolioAsset, Alert, Airdrop } from '@/types';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

interface AppState {
  language: string;
  currency: string;
  theme: 'dark' | 'light' | 'system';
  watchlist: string[];
  portfolio: PortfolioAsset[];
  alerts: Alert[];
  searchQuery: string;
  user: User | null;
  cloudSynced: boolean;
  setLanguage: (lang: string) => void;
  setCurrency: (currency: string) => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  toggleWatchlist: (coinId: string) => void;
  isInWatchlist: (coinId: string) => boolean;
  addPortfolioAsset: (asset: PortfolioAsset) => void;
  removePortfolioAsset: (id: string) => void;
  updatePortfolioAsset: (id: string, updates: Partial<PortfolioAsset>) => void;
  setPortfolio: (portfolio: PortfolioAsset[]) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setUser: (user: User | null) => void;
  setCloudSynced: (synced: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      currency: 'USD',
      theme: 'dark',
      watchlist: [],
      portfolio: [],
      alerts: [],
      searchQuery: '',
      user: null,
      cloudSynced: false,
      setLanguage: (lang) => set({ language: lang }),
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
      toggleWatchlist: (coinId) =>
        set((state) => ({
          watchlist: state.watchlist.includes(coinId)
            ? state.watchlist.filter((id) => id !== coinId)
            : [...state.watchlist, coinId],
        })),
      isInWatchlist: (coinId) => get().watchlist.includes(coinId),
      addPortfolioAsset: (asset) =>
        set((state) => ({ portfolio: [...state.portfolio, asset] })),
      removePortfolioAsset: (id) =>
        set((state) => ({
          portfolio: state.portfolio.filter((a) => a.id !== id),
        })),
      updatePortfolioAsset: (id, updates) =>
        set((state) => ({
          portfolio: state.portfolio.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      setPortfolio: (portfolio) => set({ portfolio }),
      addAlert: (alert) =>
        set((state) => ({ alerts: [...state.alerts, alert] })),
      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== id),
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setUser: (user) => set({ user }),
      setCloudSynced: (cloudSynced) => set({ cloudSynced }),
    }),
    {
      name: 'bitcoinurdu-storage',
      version: 3,
    }
  )
);

interface CryptoStore {
  coins: Coin[];
  trending: Coin[];
  gainers: Coin[];
  losers: Coin[];
  categories: Record<string, unknown>[];
  selectedCoin: Coin | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  setCoins: (coins: Coin[]) => void;
  setTrending: (coins: Coin[]) => void;
  setGainersLosers: (gainers: Coin[], losers: Coin[]) => void;
  setCategories: (categories: Record<string, unknown>[]) => void;
  setSelectedCoin: (coin: Coin | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshData: () => void;
}

export const useCryptoStore = create<CryptoStore>((set) => ({
  coins: [],
  trending: [],
  gainers: [],
  losers: [],
  categories: [],
  selectedCoin: null,
  loading: false,
  error: null,
  lastUpdated: 0,
  setCoins: (coins) => set({ coins, lastUpdated: Date.now() }),
  setTrending: (trending) => set({ trending }),
  setGainersLosers: (gainers, losers) => set({ gainers, losers }),
  setCategories: (categories) => set({ categories }),
  setSelectedCoin: (selectedCoin) => set({ selectedCoin }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  refreshData: () => set({ lastUpdated: Date.now() }),
}));

interface AirdropStore {
  airdrops: Airdrop[];
  selectedAirdrop: Airdrop | null;
  loading: boolean;
  setAirdrops: (airdrops: Airdrop[]) => void;
  setSelectedAirdrop: (airdrop: Airdrop | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAirdropStore = create<AirdropStore>((set) => ({
  airdrops: [],
  selectedAirdrop: null,
  loading: false,
  setAirdrops: (airdrops) => set({ airdrops }),
  setSelectedAirdrop: (selectedAirdrop) => set({ selectedAirdrop }),
  setLoading: (loading) => set({ loading }),
}));
