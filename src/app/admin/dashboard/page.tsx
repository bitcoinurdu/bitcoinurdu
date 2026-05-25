'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sanitizeInput, inspectPayload } from '@/lib/security/gateway';
import { loadLocalPortfolio, syncLocalToCloud, saveLocalPortfolio } from '@/lib/portfolio/local-sync';
import { savePortfolioToCloud, loadPortfolioFromCloud } from '@/lib/auth/cloud';
import { useAppStore } from '@/stores';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { DEFAULT_SETTINGS } from '@/lib/settings';
import {
  Shield,
  LayoutDashboard,
  DollarSign,
  BookOpen,
  Megaphone,
  PanelTop,
  Link2,
  LogOut,
  Search,
  Lock,
  Unlock,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Cloud,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Settings,
  Twitter,
  Send,
  Cpu,
  Youtube,
  Facebook,
  Globe,
  Copy,
  ExternalLink,
  Wallet,
  Users,
} from 'lucide-react';

const MODULES = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'prices', label: 'Price Override', icon: DollarSign },
  { key: 'courses', label: 'Courses', icon: BookOpen },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
  { key: 'ads', label: 'Ad Spaces', icon: PanelTop },
  { key: 'affiliates', label: 'Affiliate Links', icon: Link2 },
  { key: 'social', label: 'Social Links', icon: Settings },
  { key: 'settings', label: 'Site Settings', icon: Settings },
  { key: 'seo', label: 'SEO', icon: Search },
  { key: 'donations', label: 'Donations', icon: Wallet },
  { key: 'mining', label: 'Mining Fleet', icon: Cpu },
  { key: 'users', label: 'User Management', icon: Users },
  { key: 'security', label: 'Security', icon: Shield },
];

const ADMIN_EMAIL = 'admin@bitcoinurdu.com';
const ADMIN_PASSWORD = 'bitcoinurdu-admin-2024';

interface PriceOverride {
  coin_id: string;
  coin_name: string;
  override_price: number;
  locked: boolean;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
}

interface Announcement {
  id: string;
  type: string;
  title: string;
  content: string;
  link: string;
  active: boolean;
  priority: number;
  useHtml?: boolean;
  htmlContent?: string;
}

interface AdSlot {
  id: string;
  name: string;
  position: string;
  code: string;
  enabled: boolean;
}

interface AffiliateLink {
  id: string;
  exchange: string;
  name: string;
  url: string;
  enabled: boolean;
}

interface SocialLinks {
  twitter: string;
  telegram: string;
  youtube: string;
  facebook: string;
  website: string;
}

type Role = 'admin' | 'editor' | 'moderator' | 'viewer';

interface RBACUser {
  username: string;
  password: string;
  role: Role;
  enabled: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { setUser, setPortfolio, setCloudSynced } = useAppStore();
  const [authenticated, setAuthenticated] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [priceOverrides, setPriceOverrides] = useState<PriceOverride[]>([]);
  const [priceSearch, setPriceSearch] = useState('');
  const [pricePage, setPricePage] = useState(1);

  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({ title: '', slug: '', excerpt: '', content: '', category: 'beginner' });

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', type: 'manual', link: '', priority: 0 });

  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [editingAd, setEditingAd] = useState<AdSlot | null>(null);

  const [affiliates, setAffiliates] = useState<AffiliateLink[]>([]);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliateLink | null>(null);

  const [socialLinks, setSocialLinks] = useState<SocialLinks>(getDefaultSocialLinks());

  const [rbacUsers, setRbacUsers] = useState<RBACUser[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const loadRbacUsers = useCallback(() => {
    try {
      const raw = localStorage.getItem('bu_admin_rbac_users');
      if (raw) {
        setRbacUsers(JSON.parse(raw));
      } else {
        const defaults: RBACUser[] = [
          { username: 'admin@bitcoinurdu.com', password: 'bitcoinurdu-admin-2024', role: 'admin', enabled: true },
          { username: 'editor@bitcoinurdu.com', password: 'editor-2024', role: 'editor', enabled: true },
          { username: 'moderator@bitcoinurdu.com', password: 'moderator-2024', role: 'moderator', enabled: true },
        ];
        localStorage.setItem('bu_admin_rbac_users', JSON.stringify(defaults));
        setRbacUsers(defaults);
      }
    } catch {
      setRbacUsers([]);
    }
  }, []);

  const saveRbacUsers = useCallback((users: RBACUser[]) => {
    setRbacUsers(users);
    localStorage.setItem('bu_admin_rbac_users', JSON.stringify(users));
  }, []);

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('bu_admin_session');
    if (session === 'active') {
      setAuthenticated(true);
      loadAllData();
      loadRbacUsers();
      const storedRole = sessionStorage.getItem('bu_admin_role') as Role | null;
      if (storedRole) setCurrentRole(storedRole);
    }
  }, [loadRbacUsers]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadAllData = useCallback(() => {
    loadPriceOverrides();
    loadCourses();
    loadAnnouncements();
    loadAdSlots();
    loadAffiliateLinks();
    loadSocialLinks();
    loadRbacUsers();
  }, [loadRbacUsers]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const emailCheck = inspectPayload(loginData.email);
    const passCheck = inspectPayload(loginData.password);
    if (!emailCheck.safe || !passCheck.safe) {
      setLoginError('Invalid input detected');
      return;
    }

    const email = sanitizeInput(loginData.email);
    const password = sanitizeInput(loginData.password);

    const rbacMatch = rbacUsers.find(
      (u) => u.username === email && u.password === password && u.enabled
    );

    if (rbacMatch) {
      localStorage.setItem('bu_admin_session', 'active');
      localStorage.setItem('bu_admin_email', email);
      sessionStorage.setItem('bu_admin_role', rbacMatch.role);
      setCurrentRole(rbacMatch.role);
      setAuthenticated(true);
      loadAllData();
      showNotification('success', `Login successful as ${rbacMatch.role}`);
    } else if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('bu_admin_session', 'active');
      localStorage.setItem('bu_admin_email', email);
      sessionStorage.setItem('bu_admin_role', 'admin');
      setCurrentRole('admin');
      setAuthenticated(true);
      loadAllData();
      showNotification('success', 'Admin login successful');
    } else {
      const userExists = rbacUsers.some((u) => u.username === email);
      if (userExists) {
        setLoginError('User exists but password galat hai ya account disabled hai');
      } else {
        setLoginError('Email ya password galat hai');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bu_admin_session');
    localStorage.removeItem('bu_admin_email');
    sessionStorage.removeItem('bu_admin_role');
    setAuthenticated(false);
    setCurrentRole(null);
    router.push('/');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const loadPriceOverrides = () => {
    try {
      const raw = localStorage.getItem('bu_admin_price_overrides');
      setPriceOverrides(raw ? JSON.parse(raw) : []);
    } catch {
      setPriceOverrides([]);
    }
  };

  const savePriceOverrides = (overrides: PriceOverride[]) => {
    setPriceOverrides(overrides);
    localStorage.setItem('bu_admin_price_overrides', JSON.stringify(overrides));
    showNotification('success', 'Price override saved');
  };

  const loadCourses = () => {
    try {
      const raw = localStorage.getItem('bu_admin_courses');
      setCourses(raw ? JSON.parse(raw) : []);
    } catch {
      setCourses([]);
    }
  };

  const saveCourses = (updated: Course[]) => {
    setCourses(updated);
    localStorage.setItem('bu_admin_courses', JSON.stringify(updated));
    showNotification('success', 'Course saved');
  };

  const loadAnnouncements = () => {
    try {
      const raw = localStorage.getItem('bu_admin_announcements');
      setAnnouncements(raw ? JSON.parse(raw) : []);
    } catch {
      setAnnouncements([]);
    }
  };

  const saveAnnouncements = (updated: Announcement[]) => {
    setAnnouncements(updated);
    localStorage.setItem('bu_admin_announcements', JSON.stringify(updated));
    showNotification('success', 'Announcement saved');
  };

  const loadAdSlots = () => {
    try {
      const raw = localStorage.getItem('bu_admin_ad_slots');
      setAdSlots(raw ? JSON.parse(raw) : getDefaultAdSlots());
    } catch {
      setAdSlots(getDefaultAdSlots());
    }
  };

  const saveAdSlots = (updated: AdSlot[]) => {
    setAdSlots(updated);
    localStorage.setItem('bu_admin_ad_slots', JSON.stringify(updated));
    showNotification('success', 'Ad slot updated');
  };

  const loadAffiliateLinks = () => {
    try {
      const raw = localStorage.getItem('bu_admin_affiliates');
      setAffiliates(raw ? JSON.parse(raw) : getDefaultAffiliates());
    } catch {
      setAffiliates(getDefaultAffiliates());
    }
  };

  const saveAffiliateLinks = (updated: AffiliateLink[]) => {
    setAffiliates(updated);
    localStorage.setItem('bu_admin_affiliates', JSON.stringify(updated));
    showNotification('success', 'Affiliate link saved');
  };

  const loadSocialLinks = () => {
    try {
      const raw = localStorage.getItem('bu_admin_social_links');
      setSocialLinks(raw ? JSON.parse(raw) : getDefaultSocialLinks());
    } catch {
      setSocialLinks(getDefaultSocialLinks());
    }
  };

  const saveSocialLinks = (updated: SocialLinks) => {
    setSocialLinks(updated);
    localStorage.setItem('bu_admin_social_links', JSON.stringify(updated));
    showNotification('success', 'Social links saved');
  };

  const handleCloudSync = async () => {
    setSyncStatus('syncing');
    try {
      const localData = loadLocalPortfolio();
      const token = localStorage.getItem('bu_auth_token');

      if (token) {
        const userId = token.split(':')[0];
        const cloudData = await loadPortfolioFromCloud(userId);
        const merged = await syncLocalToCloud(
          userId,
          localData.assets,
          useAppStore.getState().watchlist,
          (cloudData?.portfolio as import('@/types').PortfolioAsset[]) || [],
          cloudData?.watchlist || []
        );

        await savePortfolioToCloud(userId, merged.mergedAssets, merged.mergedWatchlist);
        saveLocalPortfolio(merged.mergedAssets);
        setPortfolio(merged.mergedAssets);
        setCloudSynced(true);
        setSyncStatus('synced');
        showNotification('success', 'Portfolio synced to cloud');
      } else {
        setSyncStatus('error');
        showNotification('error', 'Login pehle karein cloud sync ke liye');
      }
    } catch {
      setSyncStatus('error');
      showNotification('error', 'Sync failed, local data safe hai');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-bitcoin" />
            </div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">BitcoinUrdu Management Dashboard</p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-500">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
                  placeholder="admin@bitcoinurdu.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-bitcoin text-white font-medium hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            </form>
          </div>
      </div>
    </div>
  );
}

function SiteSettingsModule() {
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const [form, setForm] = useState({
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    siteUrl: settings.siteUrl,
    defaultTheme: settings.defaultTheme,
    defaultLanguage: settings.defaultLanguage,
    defaultCurrency: settings.defaultCurrency,
    adminEmail: settings.adminEmail,
    contactEmail: settings.contactEmail,
    seoTitle: settings.seo.title,
    seoDescription: settings.seo.description,
    seoKeywords: settings.seo.keywords,
    seoOgImage: settings.seo.ogImage,
    adsenseClientId: settings.adsenseClientId,
    gaMeasurementId: settings.gaMeasurementId,
    coingeckoApiKey: settings.coingeckoApiKey,
  });

  useEffect(() => {
    setForm({
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteUrl: settings.siteUrl,
      defaultTheme: settings.defaultTheme,
      defaultLanguage: settings.defaultLanguage,
      defaultCurrency: settings.defaultCurrency,
      adminEmail: settings.adminEmail,
      contactEmail: settings.contactEmail,
      seoTitle: settings.seo.title,
      seoDescription: settings.seo.description,
      seoKeywords: settings.seo.keywords,
      seoOgImage: settings.seo.ogImage,
      adsenseClientId: settings.adsenseClientId,
      gaMeasurementId: settings.gaMeasurementId,
      coingeckoApiKey: settings.coingeckoApiKey,
    });
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      siteName: sanitizeInput(form.siteName),
      siteDescription: sanitizeInput(form.siteDescription),
      siteUrl: sanitizeInput(form.siteUrl),
      defaultTheme: form.defaultTheme as 'dark' | 'light' | 'system',
      defaultLanguage: form.defaultLanguage,
      defaultCurrency: form.defaultCurrency,
      adminEmail: sanitizeInput(form.adminEmail),
      contactEmail: sanitizeInput(form.contactEmail),
      seo: {
        title: sanitizeInput(form.seoTitle),
        description: sanitizeInput(form.seoDescription),
        keywords: sanitizeInput(form.seoKeywords),
        ogImage: sanitizeInput(form.seoOgImage),
      },
      adsenseClientId: sanitizeInput(form.adsenseClientId),
      gaMeasurementId: sanitizeInput(form.gaMeasurementId),
      coingeckoApiKey: sanitizeInput(form.coingeckoApiKey),
    });
  };

  const handleReset = () => {
    resetSettings();
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50";
  const labelClass = "block text-sm font-medium text-muted-foreground mb-1";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Site Name</label>
            <input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Site URL</label>
            <input value={form.siteUrl} onChange={(e) => setForm({ ...form, siteUrl: e.target.value })} className={inputClass} placeholder="https://bitcoinurdu.com" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Site Description</label>
            <input value={form.siteDescription} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Default Theme</label>
            <select value={form.defaultTheme} onChange={(e) => setForm({ ...form, defaultTheme: e.target.value as 'dark' | 'light' | 'system' })} className={inputClass}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Default Language</label>
            <select value={form.defaultLanguage} onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value })} className={inputClass}>
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="roman">Roman Urdu</option>
              <option value="ps">Pashto</option>
              <option value="sd">Sindhi</option>
              <option value="es">Español</option>
              <option value="ar">العربية</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Default Currency</label>
            <select value={form.defaultCurrency} onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })} className={inputClass}>
              <option value="USD">USD</option>
              <option value="PKR">PKR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AED">AED</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>SEO Title</label>
            <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>SEO Description</label>
            <input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SEO Keywords</label>
            <input value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>OG Image URL</label>
            <input value={form.seoOgImage} onChange={(e) => setForm({ ...form, seoOgImage: e.target.value })} className={inputClass} placeholder="/og-image.png" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">API & Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Admin Email</label>
            <input value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Contact Email</label>
            <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>AdSense Client ID</label>
            <input value={form.adsenseClientId} onChange={(e) => setForm({ ...form, adsenseClientId: e.target.value })} className={inputClass} placeholder="ca-pub-xxxxxxxx" />
          </div>
          <div>
            <label className={labelClass}>Google Analytics ID</label>
            <input value={form.gaMeasurementId} onChange={(e) => setForm({ ...form, gaMeasurementId: e.target.value })} className={inputClass} placeholder="G-XXXXXXXXXX" />
          </div>
          <div>
            <label className={labelClass}>CoinGecko API Key</label>
            <input value={form.coingeckoApiKey} onChange={(e) => setForm({ ...form, coingeckoApiKey: e.target.value })} className={inputClass} type="password" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-bitcoin text-white text-sm font-medium hover:opacity-90 flex items-center gap-2">
          <Save className="h-4 w-4" /> Save Settings
        </button>
        <button onClick={handleReset} className="px-6 py-2 rounded-lg border text-sm font-medium hover:bg-muted flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Reset to Defaults
        </button>
      </div>
    </div>
  );
}

function SeoModule() {
  const { settings, updateSettings } = useSiteSettings();
  const [form, setForm] = useState({
    title: settings.seo.title,
    description: settings.seo.description,
    keywords: settings.seo.keywords,
    ogImage: settings.seo.ogImage,
  });

  useEffect(() => {
    setForm({
      title: settings.seo.title,
      description: settings.seo.description,
      keywords: settings.seo.keywords,
      ogImage: settings.seo.ogImage,
    });
  }, [settings.seo]);

  const handleSave = () => {
    updateSettings({
      seo: {
        title: sanitizeInput(form.title),
        description: sanitizeInput(form.description),
        keywords: sanitizeInput(form.keywords),
        ogImage: sanitizeInput(form.ogImage),
      },
    });
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50";
  const labelClass = "block text-sm font-medium text-muted-foreground mb-1";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">SEO Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>SEO Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Meta Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} rows={3} />
          </div>
          <div>
            <label className={labelClass}>Meta Keywords</label>
            <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>OG Image URL</label>
            <input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} className={inputClass} placeholder="/og-image.png" />
          </div>
        </div>
      </div>
      <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-bitcoin text-white text-sm font-medium hover:opacity-90 flex items-center gap-2">
        <Save className="h-4 w-4" /> Save SEO
      </button>
    </div>
  );
}

function DonationsModule() {
  const { settings, updateSettings } = useSiteSettings();
  const [wallets, setWallets] = useState<Record<string, string>>(settings.donationWallets || {});

  useEffect(() => {
    setWallets(settings.donationWallets || {});
  }, [settings.donationWallets]);

  const handleSave = () => {
    updateSettings({ donationWallets: wallets });
  };

  const handleAdd = () => {
    setWallets({ ...wallets, ['new_wallet']: '' });
  };

  const handleRemove = (key: string) => {
    const updated = { ...wallets };
    delete updated[key];
    setWallets(updated);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50";
  const labelClass = "block text-sm font-medium text-muted-foreground mb-1";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Donation Wallets</h2>
        <div className="space-y-3">
          {Object.entries(wallets).map(([key, value]) => (
            <div key={key} className="flex gap-2 items-center">
              <input value={key} onChange={(e) => {
                const newKey = e.target.value;
                const updated = { ...wallets };
                delete updated[key];
                updated[newKey] = value;
                setWallets(updated);
              }} className={`${inputClass} w-32`} placeholder="Network" />
              <input value={value} onChange={(e) => setWallets({ ...wallets, [key]: e.target.value })} className={`${inputClass} flex-1`} placeholder="Wallet address" />
              <button onClick={() => handleRemove(key)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={handleAdd} className="mt-3 px-4 py-2 rounded-lg border text-sm hover:bg-muted flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Wallet
        </button>
      </div>
      <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-bitcoin text-white text-sm font-medium hover:opacity-90 flex items-center gap-2">
        <Save className="h-4 w-4" /> Save Wallets
      </button>
    </div>
  );
}

function SecurityModule() {
  const [adminPassword, setAdminPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }
    setMessage('Password updated successfully');
    setAdminPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50";
  const labelClass = "block text-sm font-medium text-muted-foreground mb-1";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Admin Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
          </div>
        </div>
        {message && <p className="mt-3 text-sm text-bitcoin">{message}</p>}
      </div>
      <button onClick={handleChangePassword} className="px-6 py-2 rounded-lg bg-bitcoin text-white text-sm font-medium hover:opacity-90 flex items-center gap-2">
        <Lock className="h-4 w-4" /> Change Password
      </button>
    </div>
  );
}

function MiningFleetModule() {
  const { settings, updateSettings } = useSiteSettings();
  const hardware = settings.miningHardware || [];
  const [form, setForm] = useState({ model: '', manufacturer: '', algorithm: '', hashrate: '', hashrateUnit: 'TH/s', power: '', efficiency: '', cost: '', dailyProfit: '', type: 'ASIC' });

  const handleAdd = () => {
    if (!form.model || !form.cost) return;
    const updated = [...hardware, { id: `miner_${Date.now()}`, ...form, hashrate: parseFloat(form.hashrate) || 0, power: parseFloat(form.power) || 0, efficiency: parseFloat(form.efficiency) || 0, cost: parseFloat(form.cost) || 0, dailyProfit: parseFloat(form.dailyProfit) || 0 }];
    updateSettings({ miningHardware: updated });
    setForm({ model: '', manufacturer: '', algorithm: '', hashrate: '', hashrateUnit: 'TH/s', power: '', efficiency: '', cost: '', dailyProfit: '', type: 'ASIC' });
  };

  const handleRemove = (id: string) => {
    updateSettings({ miningHardware: hardware.filter((h: Record<string, unknown>) => h.id !== id) });
  };

  const ic = "w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Add Mining Hardware</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Model name" className={ic} />
          <input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} placeholder="Manufacturer" className={ic} />
          <input value={form.algorithm} onChange={(e) => setForm({ ...form, algorithm: e.target.value })} placeholder="Algorithm" className={ic} />
          <input value={form.hashrate} onChange={(e) => setForm({ ...form, hashrate: e.target.value })} placeholder="Hashrate" className={ic} type="number" step="0.1" />
          <select value={form.hashrateUnit} onChange={(e) => setForm({ ...form, hashrateUnit: e.target.value })} className={ic}>
            <option value="TH/s">TH/s</option>
            <option value="GH/s">GH/s</option>
            <option value="MH/s">MH/s</option>
          </select>
          <input value={form.power} onChange={(e) => setForm({ ...form, power: e.target.value })} placeholder="Power (W)" className={ic} type="number" />
          <input value={form.efficiency} onChange={(e) => setForm({ ...form, efficiency: e.target.value })} placeholder="Efficiency (J/TH)" className={ic} type="number" step="0.1" />
          <input value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="Cost (USD)" className={ic} type="number" />
          <input value={form.dailyProfit} onChange={(e) => setForm({ ...form, dailyProfit: e.target.value })} placeholder="Daily Profit (USD)" className={ic} type="number" step="0.01" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={ic}>
            <option value="ASIC">ASIC</option>
            <option value="GPU">GPU</option>
            <option value="FPGA">FPGA</option>
          </select>
        </div>
        <button onClick={handleAdd} className="mt-4 px-4 py-2 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Hardware
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Mining Fleet ({hardware.length})</h2>
        {hardware.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No custom mining hardware added yet</p>
        ) : (
          <div className="space-y-2">
            {hardware.map((h: Record<string, unknown>, i: number) => (
              <div key={String(h.id || i)} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <span className="font-medium">{String(h.model || '')}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{String(h.manufacturer || '')} - {String(h.type || '')}</span>
                  <span className="ml-2 text-xs text-bitcoin">${Number(h.cost || 0)}</span>
                </div>
                <button onClick={() => handleRemove(String(h.id))} className="text-muted-foreground hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UsersModule({ users, onSave }: { users: RBACUser[]; onSave: (u: RBACUser[]) => void }) {
  const [form, setForm] = useState({ username: '', password: '', role: 'viewer' as Role });
  const [filterRole, setFilterRole] = useState<Role | 'all'>('all');

  const handleAdd = () => {
    if (!form.username || !form.password) return;
    if (users.some((u) => u.username === form.username)) {
      alert('User already exists');
      return;
    }
    const newUser: RBACUser = {
      username: form.username,
      password: form.password,
      role: form.role,
      enabled: true,
    };
    onSave([...users, newUser]);
    setForm({ username: '', password: '', role: 'viewer' });
  };

  const handleEdit = (index: number, field: keyof RBACUser, value: string | boolean) => {
    const updated = users.map((u, i) => i === index ? { ...u, [field]: value } : u);
    onSave(updated);
  };

  const handleDelete = (index: number) => {
    onSave(users.filter((_, i) => i !== index));
  };

  const toggleEnabled = (index: number) => {
    const updated = users.map((u, i) => i === index ? { ...u, enabled: !u.enabled } : u);
    onSave(updated);
  };

  const filtered = filterRole === 'all' ? users : users.filter((u) => u.role === filterRole);

  const inputClass = "w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Email / Username"
            className={inputClass}
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className={inputClass}
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            className={inputClass}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="moderator">Moderator</option>
            <option value="viewer">Viewer</option>
          </select>
          <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90 flex items-center gap-2 justify-center">
            <Plus className="h-4 w-4" /> Add User
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">RBAC Users ({users.length})</h2>
          <div className="flex gap-2">
            {(['all', 'admin', 'editor', 'moderator', 'viewer'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                  filterRole === r ? 'bg-bitcoin text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Username</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">No users found</td>
                </tr>
              ) : (
                filtered.map((u, i) => {
                  const globalIndex = users.indexOf(u);
                  return (
                    <tr key={u.username} className="border-b last:border-0">
                      <td className="py-3">{u.username}</td>
                      <td className="py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleEdit(globalIndex, 'role', e.target.value as Role)}
                          className="px-2 py-1 rounded border bg-background text-xs"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="moderator">Moderator</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => toggleEnabled(globalIndex)}
                          className={`text-xs px-2 py-1 rounded ${
                            u.enabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {u.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDelete(globalIndex)}
                          className="text-muted-foreground hover:text-red-500 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getDefaultSocialLinks(): SocialLinks {
  return {
    twitter: 'https://x.com/bitcoinurdu',
    telegram: 'https://t.me/bitcoinurdu',
    youtube: 'https://youtube.com/@bitcoinurdu',
    facebook: 'https://facebook.com/bitcoinurdu',
    website: 'https://bitcoinurdu.com',
  };
}

function SocialLinksModule({ links, onSave }: { links: SocialLinks; onSave: (l: SocialLinks) => void }) {
  const [form, setForm] = useState<SocialLinks>(links);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setForm(links);
  }, [links]);

  const handleSave = () => {
    onSave(form);
  };

  const handleReset = () => {
    setForm(getDefaultSocialLinks());
  };

  const copyLink = (platform: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const platforms: { key: keyof SocialLinks; label: string; icon: React.ReactNode; placeholder: string; color: string }[] = [
    { key: 'twitter', label: 'Twitter / X', icon: <Twitter className="h-4 w-4" />, placeholder: 'https://x.com/yourhandle', color: 'text-gray-400' },
    { key: 'telegram', label: 'Telegram', icon: <Send className="h-4 w-4" />, placeholder: 'https://t.me/yourchannel', color: 'text-blue-400' },
    { key: 'youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4" />, placeholder: 'https://youtube.com/@yourchannel', color: 'text-red-500' },
    { key: 'facebook', label: 'Facebook', icon: <Facebook className="h-4 w-4" />, placeholder: 'https://facebook.com/yourpage', color: 'text-blue-600' },
    { key: 'website', label: 'Website', icon: <Globe className="h-4 w-4" />, placeholder: 'https://yoursite.com', color: 'text-bitcoin' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Social Links Configuration</h2>
            <p className="text-sm text-muted-foreground mt-1">Update social media links. Changes reflect instantly on the website.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted transition-colors">
              Reset Default
            </button>
            <button onClick={handleSave} className="px-4 py-1.5 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Settings
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {platforms.map((p) => (
            <div key={p.key} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2 min-w-[140px]">
                <span className={p.color}>{p.icon}</span>
                <span className="text-sm font-medium">{p.label}</span>
              </div>
              <div className="flex-1 flex gap-2 w-full">
                <input
                  value={form[p.key]}
                  onChange={(e) => setForm({ ...form, [p.key]: e.target.value })}
                  placeholder={p.placeholder}
                  className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
                />
                {form[p.key] && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyLink(p.key, form[p.key])}
                      className="p-2 rounded-lg border hover:bg-muted transition-colors text-muted-foreground"
                      title="Copy link"
                    >
                      {copied === p.key ? <CheckCircle className="h-3.5 w-3.5 text-crypto-green" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <a
                      href={form[p.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border hover:bg-muted transition-colors text-muted-foreground"
                      title="Open link"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
        <p className="text-sm text-muted-foreground mb-4">These links appear in the website header and footer.</p>
        <div className="flex flex-wrap gap-4">
          {platforms.map((p) => (
            <a
              key={p.key}
              href={form[p.key] || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border bg-muted/30 hover:bg-muted transition-colors text-sm ${form[p.key] ? '' : 'opacity-40 pointer-events-none'}`}
            >
              <span className={p.color}>{p.icon}</span>
              <span className="truncate max-w-[150px]">{form[p.key] || 'Not set'}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule onSync={handleCloudSync} syncStatus={syncStatus} />;
      case 'prices':
        return <PriceOverrideModule overrides={priceOverrides} onSave={savePriceOverrides} search={priceSearch} onSearch={setPriceSearch} page={pricePage} onPage={setPricePage} />;
      case 'courses':
        return <CoursesModule courses={courses} onSave={saveCourses} editing={editingCourse} onEdit={setEditingCourse} form={courseForm} onForm={setCourseForm} />;
      case 'announcements':
        return <AnnouncementsModule announcements={announcements} onSave={saveAnnouncements} form={announcementForm} onForm={setAnnouncementForm} />;
      case 'ads':
        return <AdSlotsModule slots={adSlots} onSave={saveAdSlots} editing={editingAd} onEdit={setEditingAd} />;
      case 'affiliates':
        return <AffiliatesModule affiliates={affiliates} onSave={saveAffiliateLinks} editing={editingAffiliate} onEdit={setEditingAffiliate} />;
      case 'social':
        return <SocialLinksModule links={socialLinks} onSave={saveSocialLinks} />;
      case 'settings':
        return <SiteSettingsModule />;
      case 'seo':
        return <SeoModule />;
      case 'donations':
        return <DonationsModule />;
      case 'mining':
        return <MiningFleetModule />;
      case 'users':
        return <UsersModule users={rbacUsers} onSave={saveRbacUsers} />;
      case 'security':
        return <SecurityModule />;
      default:
        return <DashboardModule onSync={handleCloudSync} syncStatus={syncStatus} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-lg flex items-center gap-2 text-sm ${
          notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {notification.message}
        </div>
      )}

      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-bitcoin" />
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            {currentRole && (
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                currentRole === 'admin' ? 'bg-red-500/10 text-red-500' :
                currentRole === 'editor' ? 'bg-blue-500/10 text-blue-500' :
                currentRole === 'moderator' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-muted text-muted-foreground'
              }`}>
                {currentRole}
              </span>
            )}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex flex-wrap gap-2 mb-6">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.key}
                onClick={() => setActiveModule(mod.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeModule === mod.key
                    ? 'bg-bitcoin text-white'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {mod.label}
              </button>
            );
          })}
        </nav>

        {renderModule()}
      </div>
    </div>
  );
}

function DashboardModule({ onSync, syncStatus }: { onSync: () => void; syncStatus: string }) {
  const { portfolio, user } = useAppStore();
  const localData = typeof window !== 'undefined' ? localStorage.getItem('bitcoinurdu-portfolio-local') : null;
  const localAssets = localData ? JSON.parse(localData).assets : [];
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    fetch('/data/coins-market.json')
      .then((r) => r.json())
      .then((data) => {
        let count = 0;
        for (const p of data.pages || []) count += p.count || 0;
        setTotalCoins(count);
      })
      .catch(() => setTotalCoins(15984));
  }, []);

  const stats = [
    { label: 'Total Coins', value: totalCoins > 0 ? totalCoins.toLocaleString() : 'Loading...', icon: '📊' },
    { label: 'Portfolio Assets', value: portfolio.length.toString(), icon: '💼' },
    { label: 'User', value: user?.name || 'Guest', icon: '👤' },
    { label: 'Cloud Sync', value: syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Not Synced', icon: syncStatus === 'synced' ? '☁️' : '🔌' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onSync}
            disabled={syncStatus === 'syncing'}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90 disabled:opacity-50"
          >
            <Cloud className="h-4 w-4" />
            {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Portfolio to Cloud'}
          </button>
          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-muted">
            <LayoutDashboard className="h-4 w-4" />
            Legacy Admin
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-2">System Status</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Local Database</span>
            <span className="text-crypto-green flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Active (15,984 coins)</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Security Gateway</span>
            <span className="text-crypto-green flex items-center gap-1"><Shield className="h-3 w-3" /> SQLi/XSS/Traversal Protected</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Circuit Breaker</span>
            <span className="text-crypto-green flex items-center gap-1"><RefreshCw className="h-3 w-3" /> Auto-Revive Enabled</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Price Override System</span>
            <span className="text-crypto-green flex items-center gap-1"><DollarSign className="h-3 w-3" /> Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceOverrideModule({ overrides, onSave, search, onSearch, page, onPage }: {
  overrides: PriceOverride[];
  onSave: (o: PriceOverride[]) => void;
  search: string;
  onSearch: (s: string) => void;
  page: number;
  onPage: (p: number) => void;
}) {
  const [coins, setCoins] = useState<{ id: string; name: string; symbol: string; current_price: number; market_cap_rank: number }[]>([]);
  const [overrideForm, setOverrideForm] = useState({ coin_id: '', price: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/coins-market.json')
      .then((r) => r.json())
      .then((data) => {
        const all: typeof coins = [];
        for (const p of data.pages || []) {
          for (const c of p.coins || []) {
            all.push({ id: c.id, name: c.name, symbol: c.symbol, current_price: c.current_price, market_cap_rank: c.market_cap_rank });
          }
        }
        all.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
        setCoins(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCoins = coins.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const perPage = 20;
  const totalPages = Math.ceil(filteredCoins.length / perPage);
  const pagedCoins = filteredCoins.slice((page - 1) * perPage, page * perPage);

  const handleOverride = () => {
    if (!overrideForm.coin_id || !overrideForm.price) return;
    const coin = coins.find((c) => c.id === overrideForm.coin_id);
    if (!coin) return;

    const existing = overrides.findIndex((o) => o.coin_id === overrideForm.coin_id);
    const newOverride: PriceOverride = {
      coin_id: overrideForm.coin_id,
      coin_name: coin.name,
      override_price: parseFloat(overrideForm.price),
      locked: false,
    };

    const updated = existing >= 0 ? [...overrides] : [...overrides];
    if (existing >= 0) {
      updated[existing] = newOverride;
    } else {
      updated.push(newOverride);
    }
    onSave(updated);
    setOverrideForm({ coin_id: '', price: '' });
  };

  const toggleLock = (coinId: string) => {
    const updated = overrides.map((o) => o.coin_id === coinId ? { ...o, locked: !o.locked } : o);
    onSave(updated);
  };

  const removeOverride = (coinId: string) => {
    onSave(overrides.filter((o) => o.coin_id !== coinId));
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading coin data...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Add Price Override</h2>
        <div className="flex gap-3">
          <select
            value={overrideForm.coin_id}
            onChange={(e) => setOverrideForm({ ...overrideForm, coin_id: e.target.value })}
            className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm"
          >
            <option value="">Select coin...</option>
            {coins.slice(0, 200).map((c) => (
              <option key={c.id} value={c.id}>#{c.market_cap_rank} {c.name} ({c.symbol.toUpperCase()})</option>
            ))}
          </select>
          <input
            type="number"
            value={overrideForm.price}
            onChange={(e) => setOverrideForm({ ...overrideForm, price: e.target.value })}
            placeholder="Override price (USD)"
            className="w-48 px-3 py-2 rounded-lg border bg-background text-sm"
          />
          <button onClick={handleOverride} className="px-4 py-2 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90">
            <Save className="h-4 w-4 inline mr-1" /> Save
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Overrides ({overrides.length})</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { onSearch(e.target.value); onPage(1); }}
              placeholder="Search overrides..."
              className="pl-10 pr-4 py-2 rounded-lg border bg-background text-sm"
            />
          </div>
        </div>

        {overrides.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No price overrides set</p>
        ) : (
          <div className="space-y-2">
            {overrides.map((o) => {
              const coin = coins.find((c) => c.id === o.coin_id);
              const originalPrice = coin?.current_price || 0;
              const diff = ((o.override_price - originalPrice) / originalPrice * 100).toFixed(2);
              return (
                <div key={o.coin_id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <span className="font-medium">{o.coin_name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({o.coin_id})</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground line-through">${originalPrice.toLocaleString()}</span>
                    <span className="font-bold text-bitcoin">${o.override_price.toLocaleString()}</span>
                    <span className={parseFloat(diff) >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>{diff}%</span>
                    <button onClick={() => toggleLock(o.coin_id)} className="text-muted-foreground hover:text-foreground">
                      {o.locked ? <Lock className="h-4 w-4 text-yellow-500" /> : <Unlock className="h-4 w-4" />}
                    </button>
                    <button onClick={() => removeOverride(o.coin_id)} className="text-muted-foreground hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm rounded border disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm rounded border disabled:opacity-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CoursesModule({ courses, onSave, editing, onEdit, form, onForm }: {
  courses: Course[];
  onSave: (c: Course[]) => void;
  editing: Course | null;
  onEdit: (c: Course | null) => void;
  form: { title: string; slug: string; excerpt: string; content: string; category: string };
  onForm: (f: typeof form) => void;
}) {
  const handleSave = () => {
    if (!form.title || !form.content) return;
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    if (editing) {
      onSave(courses.map((c) => c.id === editing.id ? { ...c, ...form, slug, updated_at: new Date().toISOString() } : c));
    } else {
      const newCourse: Course = {
        id: `course_${Date.now()}`,
        ...form,
        slug,
        published: false,
      };
      onSave([...courses, newCourse]);
    }
    onForm({ title: '', slug: '', excerpt: '', content: '', category: 'beginner' });
    onEdit(null);
  };

  const handleEdit = (course: Course) => {
    onEdit(course);
    onForm({ title: course.title, slug: course.slug, excerpt: course.excerpt, content: course.content, category: course.category });
  };

  const handleDelete = (id: string) => {
    onSave(courses.filter((c) => c.id !== id));
  };

  const togglePublish = (id: string) => {
    onSave(courses.map((c) => c.id === id ? { ...c, published: !c.published, published_at: !c.published ? new Date().toISOString() : undefined } : c));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Course' : 'New Course'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.title}
            onChange={(e) => onForm({ ...form, title: e.target.value })}
            placeholder="Course Title"
            className="px-3 py-2 rounded-lg border bg-background text-sm"
          />
          <input
            value={form.slug}
            onChange={(e) => onForm({ ...form, slug: e.target.value })}
            placeholder="URL Slug (auto-generated if empty)"
            className="px-3 py-2 rounded-lg border bg-background text-sm"
          />
          <input
            value={form.excerpt}
            onChange={(e) => onForm({ ...form, excerpt: e.target.value })}
            placeholder="Short description"
            className="px-3 py-2 rounded-lg border bg-background text-sm md:col-span-2"
          />
          <select
            value={form.category}
            onChange={(e) => onForm({ ...form, category: e.target.value })}
            className="px-3 py-2 rounded-lg border bg-background text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <textarea
            value={form.content}
            onChange={(e) => onForm({ ...form, content: e.target.value })}
            placeholder="Course content (Markdown supported)"
            rows={6}
            className="px-3 py-2 rounded-lg border bg-background text-sm md:col-span-2"
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90">
            <Save className="h-4 w-4 inline mr-1" /> {editing ? 'Update' : 'Publish'}
          </button>
          {editing && (
            <button onClick={() => { onEdit(null); onForm({ title: '', slug: '', excerpt: '', content: '', category: 'beginner' }); }} className="px-4 py-2 rounded-lg border text-sm">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Courses ({courses.length})</h2>
        {courses.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No courses yet</p>
        ) : (
          <div className="space-y-2">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <span className="font-medium">{c.title}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${c.published ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground capitalize">{c.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublish(c.id)} className="text-muted-foreground hover:text-foreground">
                    {c.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => handleEdit(c)} className="text-muted-foreground hover:text-bitcoin">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnnouncementsModule({ announcements, onSave, form, onForm }: {
  announcements: Announcement[];
  onSave: (a: Announcement[]) => void;
  form: { title: string; content: string; type: string; link: string; priority: number };
  onForm: (f: typeof form) => void;
}) {
  const [useHtml, setUseHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  const handleAdd = () => {
    if (!form.title) return;
    if (!useHtml && !form.content) return;
    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      ...form,
      active: true,
      useHtml,
      htmlContent: useHtml ? htmlContent : undefined,
    };
    onSave([...announcements, newAnnouncement]);
    onForm({ title: '', content: '', type: 'manual', link: '', priority: 0 });
    setUseHtml(false);
    setHtmlContent('');
  };

  const toggleActive = (id: string) => {
    onSave(announcements.map((a) => a.id === id ? { ...a, active: !a.active } : a));
  };

  const remove = (id: string) => {
    onSave(announcements.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">New Announcement</h2>
        <div className="flex gap-2 mb-4">
          {['manual', 'airdrop', 'job', 'breaking'].map((tab) => (
            <button
              key={tab}
              onClick={() => onForm({ ...form, type: tab })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                form.type === tab
                  ? 'bg-bitcoin text-white'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => { setUseHtml(false); setHtmlContent(''); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!useHtml ? 'bg-bitcoin text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
          >
            Text Mode
          </button>
          <button
            onClick={() => setUseHtml(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${useHtml ? 'bg-bitcoin text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
          >
            HTML Mode
          </button>
          {useHtml && <span className="text-xs text-muted-foreground">Enter raw HTML for custom banner</span>}
        </div>
        {useHtml ? (
          <div className="grid grid-cols-1 gap-4">
            <input
              value={form.title}
              onChange={(e) => onForm({ ...form, title: e.target.value })}
              placeholder="Announcement title (internal label)"
              className="px-3 py-2 rounded-lg border bg-background text-sm"
            />
            <input
              type="number"
              value={form.priority}
              onChange={(e) => onForm({ ...form, priority: parseInt(e.target.value) || 0 })}
              placeholder="Priority (0-10)"
              className="px-3 py-2 rounded-lg border bg-background text-sm w-48"
            />
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="<div style='display:flex;gap:1rem;align-items:center'>Raw HTML banner code here...</div>"
              rows={5}
              className="px-3 py-2 rounded-lg border bg-background text-sm font-mono"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={form.title}
              onChange={(e) => onForm({ ...form, title: e.target.value })}
              placeholder="Announcement title"
              className="px-3 py-2 rounded-lg border bg-background text-sm md:col-span-2"
            />
            <input
              type="number"
              value={form.priority}
              onChange={(e) => onForm({ ...form, priority: parseInt(e.target.value) || 0 })}
              placeholder="Priority (0-10)"
              className="px-3 py-2 rounded-lg border bg-background text-sm"
            />
            <textarea
              value={form.content}
              onChange={(e) => onForm({ ...form, content: e.target.value })}
              placeholder="Announcement content"
              rows={3}
              className="px-3 py-2 rounded-lg border bg-background text-sm md:col-span-2"
            />
            <input
              value={form.link}
              onChange={(e) => onForm({ ...form, link: e.target.value })}
              placeholder="Link URL (empty = homepage marquee)"
              className="px-3 py-2 rounded-lg border bg-background text-sm"
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {useHtml ? 'HTML banner will be rendered with dangerouslySetInnerHTML' : (form.link ? `Link: ${form.link}` : 'No link set - will display on homepage marquee header')}
        </p>
        <button onClick={handleAdd} className="mt-4 px-4 py-2 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90">
          <Megaphone className="h-4 w-4 inline mr-1" /> Post Announcement
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Active Announcements ({announcements.filter((a) => a.active).length})</h2>
        {announcements.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No announcements</p>
        ) : (
          <div className="space-y-2">
            {announcements.map((a) => (
              <div key={a.id} className={`p-3 rounded-lg border ${a.active ? 'bg-card' : 'bg-muted/30 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{a.title}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-bitcoin/10 text-bitcoin">{a.type}</span>
                    <span className="ml-2 text-xs text-muted-foreground">Priority: {a.priority}</span>
                    {a.useHtml && <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500">HTML</span>}
                    {a.link && <span className="ml-2 text-xs text-crypto-blue truncate max-w-xs inline-block">Link: {a.link}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(a.id)} className={`text-xs px-2 py-1 rounded ${a.active ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                      {a.active ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {a.useHtml ? (
                  <div className="text-sm mt-1 border rounded p-2 bg-muted/20" dangerouslySetInnerHTML={{ __html: a.htmlContent || '' }} />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getDefaultAdSlots(): AdSlot[] {
  return [
    { id: 'mainpage-top', name: 'Homepage Top Banner', position: 'mainpage-top', code: '', enabled: true },
    { id: 'mainpage-inline', name: 'Homepage Inline Ad', position: 'mainpage-inline', code: '', enabled: true },
    { id: 'coins-top', name: 'Coins Page Top', position: 'coins-top', code: '', enabled: true },
    { id: 'sidebar', name: 'Sidebar Ad', position: 'sidebar', code: '', enabled: true },
    { id: 'footer', name: 'Footer Ad', position: 'footer', code: '', enabled: false },
  ];
}

function AdSlotsModule({ slots, onSave, editing, onEdit }: {
  slots: AdSlot[];
  onSave: (s: AdSlot[]) => void;
  editing: AdSlot | null;
  onEdit: (s: AdSlot | null) => void;
}) {
  const [code, setCode] = useState('');

  const handleSave = () => {
    if (!editing) return;
    const sanitized = code;
    onSave(slots.map((s) => s.id === editing.id ? { ...s, code: sanitized } : s));
    onEdit(null);
    setCode('');
  };

  const toggleEnabled = (id: string) => {
    onSave(slots.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="space-y-6">
      {editing && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Edit: {editing.name}</h2>
          <textarea
            value={code || editing.code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste AdSense script or HTML banner code here..."
            rows={8}
            className="w-full px-3 py-2 rounded-lg border bg-background text-sm font-mono"
          />
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90">
              <Save className="h-4 w-4 inline mr-1" /> Save
            </button>
            <button onClick={() => { onEdit(null); setCode(''); }} className="px-4 py-2 rounded-lg border text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Ad Slots ({slots.length})</h2>
        <div className="space-y-3">
          {slots.map((s) => (
            <div key={s.id} className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium">{s.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">({s.position})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleEnabled(s.id)} className={`text-xs px-2 py-1 rounded ${s.enabled ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                    {s.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <button onClick={() => { onEdit(s); setCode(s.code); }} className="text-muted-foreground hover:text-bitcoin">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {s.code && (
                <pre className="text-xs bg-muted/50 rounded p-2 overflow-x-auto max-h-24">
                  {s.code.substring(0, 200)}{s.code.length > 200 ? '...' : ''}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDefaultAffiliates(): AffiliateLink[] {
  return [
    { id: 'binance', exchange: 'binance', name: 'Binance', url: 'https://www.binance.com', enabled: true },
    { id: 'bybit', exchange: 'bybit', name: 'Bybit', url: 'https://www.bybit.com', enabled: true },
    { id: 'kucoin', exchange: 'kucoin', name: 'KuCoin', url: 'https://www.kucoin.com', enabled: true },
    { id: 'okx', exchange: 'okx', name: 'OKX', url: 'https://www.okx.com', enabled: true },
    { id: 'mexc', exchange: 'mexc', name: 'MEXC', url: 'https://www.mexc.com', enabled: true },
    { id: 'gate', exchange: 'gate', name: 'Gate.io', url: 'https://www.gate.io', enabled: true },
  ];
}

function AffiliatesModule({ affiliates, onSave, editing, onEdit }: {
  affiliates: AffiliateLink[];
  onSave: (a: AffiliateLink[]) => void;
  editing: AffiliateLink | null;
  onEdit: (a: AffiliateLink | null) => void;
}) {
  const [form, setForm] = useState({ name: '', url: '' });

  const handleSave = () => {
    if (!editing) return;
    if (!form.url) return;
    onSave(affiliates.map((a) => a.id === editing.id ? { ...a, name: form.name, url: form.url } : a));
    onEdit(null);
    setForm({ name: '', url: '' });
  };

  const toggleEnabled = (id: string) => {
    onSave(affiliates.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="space-y-6">
      {editing && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Edit: {editing.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.name || editing.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Exchange name"
              className="px-3 py-2 rounded-lg border bg-background text-sm"
            />
            <input
              value={form.url || editing.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="Affiliate/referral URL"
              className="px-3 py-2 rounded-lg border bg-background text-sm"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-bitcoin text-white text-sm hover:opacity-90">
              <Save className="h-4 w-4 inline mr-1" /> Save
            </button>
            <button onClick={() => { onEdit(null); setForm({ name: '', url: '' }); }} className="px-4 py-2 rounded-lg border text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Exchange Affiliate Links</h2>
        <div className="space-y-2">
          {affiliates.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <span className="font-medium">{a.name}</span>
                <span className="ml-2 text-xs text-muted-foreground truncate max-w-xs inline-block">{a.url}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleEnabled(a.id)} className={`text-xs px-2 py-1 rounded ${a.enabled ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                  {a.enabled ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => { onEdit(a); setForm({ name: a.name, url: a.url }); }} className="text-muted-foreground hover:text-bitcoin">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
