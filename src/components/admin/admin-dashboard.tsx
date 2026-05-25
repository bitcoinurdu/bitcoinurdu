'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/helpers';
import {
  LayoutDashboard, Coins, Gift, Users, FileText, BookOpen, Image,
  Wallet, Search, Shield, Bell, Database, Settings, Globe, Menu, X,
  LogOut, Eye, EyeOff, Lock, Key, Plus, Trash2, Save, Edit, Check, Loader2,
  Briefcase, ChevronDown, Zap,
} from 'lucide-react';
import { fetchCmsData, updateCmsData, DEFAULT_CMS_DATA } from '@/lib/cms/unified';

// Legacy admin - migrated to unified settings engine
// All JSONBin operations now route through /api/settings

const adminNav = [
  { label: 'Dashboard', section: 'dashboard', icon: LayoutDashboard },
  { label: 'Coins', section: 'coins', icon: Coins },
  { label: 'Categories', section: 'categories', icon: BookOpen },
  { label: 'Airdrops', section: 'airdrops', icon: Gift },
  { label: 'Markets', section: 'markets', icon: Search },
  { label: 'Jobs', section: 'jobs', icon: Briefcase },
  { label: 'Users', section: 'users', icon: Users },
  { label: 'Blog', section: 'blog', icon: FileText },
  { label: 'Pages', section: 'pages', icon: BookOpen },
  { label: 'Ads', section: 'ads', icon: Image },
  { label: 'Announcements', section: 'announcements', icon: Zap },
  { label: 'APIs', section: 'apis', icon: Globe },
  { label: 'Mining', section: 'mining', icon: Zap },
  { label: 'Donations', section: 'donations', icon: Wallet },
  { label: 'SEO', section: 'seo', icon: Search },
  { label: 'Legal', section: 'legal', icon: Shield },
  { label: 'Alerts', section: 'notifications', icon: Bell },
  { label: 'Logs', section: 'logs', icon: Database },
  { label: 'Backups', section: 'backups', icon: Database },
  { label: 'Security', section: 'security', icon: Lock },
  { label: 'Settings', section: 'settings', icon: Settings },
];

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [data, setData] = useState<Record<string, unknown>>({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; message: string; onConfirm: (() => void) | null }>({ open: false, message: '', onConfirm: null });

  useEffect(() => {
    loadData();
    const auth = sessionStorage.getItem('bu_admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  async function loadData() {
    try {
      const cmsData = await fetchCmsData();
      setData(cmsData as unknown as Record<string, unknown>);
    } catch (e) {
      console.error('Load failed:', e);
      setData(DEFAULT_CMS_DATA as unknown as Record<string, unknown>);
    }
    setDataLoaded(true);
  }

  const saveData = useCallback(async (updates: Record<string, unknown>) => {
    setSaveStatus('saving');
    try {
      await updateCmsData(updates as Partial<Record<string, unknown>>);
      setData((prev) => ({ ...prev, ...updates }));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return true;
    } catch {
      setSaveStatus('error');
      return false;
    }
  }, [data]);

  const handleLogin = () => {
    const adminPass = String((data.adminSettings as Record<string, string>)?.password || 'bitcoinurdu2024');
    if (password === adminPass) {
      const twoFA = (data.adminSettings as Record<string, boolean>)?.twoFactorEnabled;
      if (twoFA) { setShow2FA(true); setError(''); }
      else completeLogin();
    } else setError('Invalid password');
  };

  const handle2FA = () => {
    if (twoFactorCode === '123456') completeLogin();
    else setError('Invalid 2FA code');
  };

  const completeLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('bu_admin_auth', 'true');
    setShow2FA(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setShow2FA(false);
    setTwoFactorCode('');
    sessionStorage.removeItem('bu_admin_auth');
  };

  const handleChangePassword = async () => {
    const currentPass = String((data.adminSettings as Record<string, string>)?.password || 'bitcoinurdu2024');
    if (oldPassword !== currentPass) { setError('Current password incorrect'); return; }
    if (newPassword.length < 8) { setError('Min 8 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    await saveData({ adminSettings: { ...(data.adminSettings as Record<string, unknown>), password: newPassword, lastPasswordChange: new Date().toISOString() } });
    setShowChangePassword(false); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); setError('');
  };

  function askConfirm(message: string, onYes: () => void) {
    setConfirmDialog({ open: true, message, onConfirm: onYes });
  }

  function handleConfirmYes() {
    if (confirmDialog.onConfirm) confirmDialog.onConfirm();
    setConfirmDialog({ open: false, message: '', onConfirm: null });
  }

  function handleConfirmNo() {
    setConfirmDialog({ open: false, message: '', onConfirm: null });
  }

  if (!dataLoaded) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-bitcoin" /></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center"><Lock className="h-12 w-12 text-bitcoin mx-auto mb-2" /><CardTitle>Admin Login</CardTitle><p className="text-sm text-muted-foreground">Enter admin credentials</p></CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (show2FA ? handle2FA() : handleLogin())} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
            {show2FA && <Input placeholder="2FA Code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handle2FA()} />}
            {error && <p className="text-sm text-crypto-red">{error}</p>}
            <Button onClick={show2FA ? handle2FA : handleLogin} variant="bitcoin" className="w-full">{show2FA ? 'Verify 2FA' : 'Login'}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full bg-card border-r p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-bold text-lg">Admin</h2><button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button></div>
            <nav className="space-y-1">{adminNav.map((item) => (<button key={item.section} onClick={() => { setActiveSection(item.section); setSidebarOpen(false); }} className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm', activeSection === item.section ? 'bg-bitcoin/10 text-bitcoin' : 'hover:bg-accent')}>{<item.icon className="h-4 w-4" />}{item.label}</button>))}</nav>
          </div>
        </div>
      )}

      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-card border-r">
        <div className="p-4 border-b"><h1 className="font-bold text-lg">BitcoinUrdu Admin</h1></div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">{adminNav.map((item) => (<button key={item.section} onClick={() => setActiveSection(item.section)} className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm', activeSection === item.section ? 'bg-bitcoin/10 text-bitcoin' : 'hover:bg-accent')}>{<item.icon className="h-4 w-4" />}{item.label}</button>))}</nav>
        <div className="p-4 border-t"><button onClick={logout} className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><LogOut className="h-4 w-4" />Logout</button></div>
      </aside>

      <main className="lg:ml-64 p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-accent" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
              <div><h1 className="text-xl font-bold capitalize">{activeSection}</h1><p className="text-sm text-muted-foreground">Manage your {activeSection}</p></div>
            </div>
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' && <span className="text-sm text-muted-foreground flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Saving...</span>}
              {saveStatus === 'saved' && <span className="text-sm text-crypto-green flex items-center gap-1"><Check className="h-3 w-3" /> Saved to JSONBin!</span>}
              {saveStatus === 'error' && <span className="text-sm text-crypto-red">Save failed</span>}
              <Link href="/"><Button variant="outline" size="sm"><Globe className="h-4 w-4 mr-1.5" />View Site</Button></Link>
            </div>
          </div>
        </div>

        <SectionContent section={activeSection} data={data} onSave={saveData} />

        {showChangePassword && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input type="password" placeholder="Current Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                <Input type="password" placeholder="New Password (min 8 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {error && <p className="text-sm text-crypto-red">{error}</p>}
                <div className="flex gap-2">
                  <Button onClick={handleChangePassword} className="flex-1" variant="bitcoin">Update</Button>
                  <Button onClick={() => { setShowChangePassword(false); setError(''); }} variant="outline" className="flex-1">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {confirmDialog.open && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
              <CardHeader><CardTitle>Confirm Action</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{confirmDialog.message}</p>
                <div className="flex gap-2">
                  <Button onClick={handleConfirmYes} variant="bitcoin" className="flex-1">Yes</Button>
                  <Button onClick={handleConfirmNo} variant="outline" className="flex-1">No</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function SectionContent({ section, data, onSave }: { section: string; data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  switch (section) {
    case 'dashboard': return <DashboardSection data={data} />;
    case 'coins': return <CoinsSection data={data} onSave={onSave} />;
    case 'categories': return <CategoriesSection data={data} onSave={onSave} />;
    case 'airdrops': return <AirdropsSection data={data} onSave={onSave} />;
    case 'markets': return <MarketsSection data={data} onSave={onSave} />;
    case 'jobs': return <JobsSection data={data} onSave={onSave} />;
    case 'users': return <UsersSection />;
    case 'blog': return <BlogSection data={data} onSave={onSave} />;
    case 'pages': return <PagesSection />;
    case 'ads': return <AdsSection data={data} onSave={onSave} />;
    case 'announcements': return <AnnouncementsSection data={data} onSave={onSave} />;
    case 'apis': return <ApisSection data={data} onSave={onSave} />;
    case 'mining': return <MiningSection data={data} onSave={onSave} />;
    case 'donations': return <DonationsSection data={data} onSave={onSave} />;
    case 'seo': return <SEOSection data={data} onSave={onSave} />;
    case 'legal': return <LegalSection data={data} onSave={onSave} />;
    case 'notifications': return <NotificationsSection />;
    case 'logs': return <LogsSection />;
    case 'backups': return <BackupsSection />;
    case 'security': return <SecuritySection data={data} onSave={onSave} />;
    case 'settings': return <SettingsSection data={data} onSave={onSave} />;
    default: return <div>Section not found</div>;
  }
}

function DashboardSection({ data }: { data: Record<string, unknown> }) {
  const coins = (data.coins as Record<string, unknown>[]) || [];
  const blogPosts = (data.blogPosts as Record<string, unknown>[]) || [];
  const airdrops = (data.airdrops as Record<string, unknown>[]) || [];
  const jobs = (data.jobs as Record<string, unknown>[]) || [];
  const ads = (data.ads as Record<string, unknown>[]) || [];
  const adOrders = (data.adOrders as Record<string, unknown>[]) || [];
  const pendingOrders = adOrders.filter((o) => (o as Record<string, string>).status === 'pending');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Coins</p><p className="text-2xl font-bold mt-1">{coins.length}</p></div><div className="p-3 rounded-full bg-blue-500/10"><Coins className="h-6 w-6 text-blue-500" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Blog Posts</p><p className="text-2xl font-bold mt-1">{blogPosts.length}</p></div><div className="p-3 rounded-full bg-green-500/10"><FileText className="h-6 w-6 text-green-500" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Airdrops</p><p className="text-2xl font-bold mt-1">{airdrops.length}</p></div><div className="p-3 rounded-full bg-purple-500/10"><Gift className="h-6 w-6 text-purple-500" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Jobs</p><p className="text-2xl font-bold mt-1">{jobs.length}</p></div><div className="p-3 rounded-full bg-yellow-500/10"><Briefcase className="h-6 w-6 text-yellow-500" /></div></div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active Ads</p><p className="text-2xl font-bold mt-1">{ads.filter((a) => (a as Record<string, boolean>).enabled !== false).length}</p></div><div className="p-3 rounded-full bg-cyan-500/10"><Image className="h-6 w-6 text-cyan-500" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending Orders</p><p className="text-2xl font-bold mt-1">{pendingOrders.length}</p></div><div className="p-3 rounded-full bg-orange-500/10"><Bell className="h-6 w-6 text-orange-500" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Site Status</p><p className="text-2xl font-bold mt-1 text-crypto-green">Live</p></div><div className="p-3 rounded-full bg-green-500/10"><Shield className="h-6 w-6 text-green-500" /></div></div></CardContent></Card>
      </div>
    </div>
  );
}

function CoinsSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const coins = (data.coins as Record<string, unknown>[]) || [];
  const categories = (data.categories as Record<string, unknown>[]) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [newCoin, setNewCoin] = useState({ id: '', name: '', symbol: '', category: 'layer-1', active: true });

  const startEdit = (c: Record<string, unknown>) => { setEditingId(String(c.id)); setEditData({ ...c }); };
  const saveEdit = async () => { await onSave({ coins: coins.map((c) => String(c.id) === editingId ? editData : c) }); setEditingId(null); };
  const addCoin = async () => { if (!newCoin.id || !newCoin.name) return; await onSave({ coins: [...coins, { ...newCoin, price: 0, marketCap: 0, change24h: 0 }] }); setNewCoin({ id: '', name: '', symbol: '', category: 'layer-1', active: true }); };
  const removeCoin = async (id: string) => { await onSave({ coins: coins.filter((c) => String(c.id) !== id) }); };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Add New Coin</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Input placeholder="ID (e.g., bitcoin)" value={newCoin.id} onChange={(e) => setNewCoin({ ...newCoin, id: e.target.value })} className="flex-1 min-w-[150px]" />
            <Input placeholder="Name" value={newCoin.name} onChange={(e) => setNewCoin({ ...newCoin, name: e.target.value })} className="flex-1 min-w-[150px]" />
            <Input placeholder="Symbol" value={newCoin.symbol} onChange={(e) => setNewCoin({ ...newCoin, symbol: e.target.value })} className="w-24" />
            <select className="input w-40" value={newCoin.category} onChange={(e) => setNewCoin({ ...newCoin, category: e.target.value })}>
              {categories.map((c) => (<option key={String(c.id)} value={String(c.id)}>{String(c.name)}</option>))}
            </select>
            <Button onClick={addCoin} variant="bitcoin"><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>All Coins ({coins.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {coins.map((c) => (
            <div key={String(c.id)} className="p-3 rounded-lg border">
              {editingId === String(c.id) ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Input placeholder="ID" value={String(editData.id || '')} onChange={(e) => setEditData({ ...editData, id: e.target.value })} />
                    <Input placeholder="Name" value={String(editData.name || '')} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                    <Input placeholder="Symbol" value={String(editData.symbol || '')} onChange={(e) => setEditData({ ...editData, symbol: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm" variant="bitcoin"><Save className="h-4 w-4 mr-1" />Save</Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{String(c.name)} <span className="text-muted-foreground text-sm">({String(c.symbol)})</span></p>
                    <p className="text-sm text-muted-foreground">{String(c.category)} {c.active !== false ? '• Active' : '• Disabled'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={c.active !== false ? 'green' : 'secondary'}>{c.active !== false ? 'Active' : 'Disabled'}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(c as Record<string, unknown>)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => removeCoin(String(c.id))}><Trash2 className="h-4 w-4 text-crypto-red" /></Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CategoriesSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const categories = (data.categories as Record<string, unknown>[]) || [
    { id: 'layer-1', name: 'Layer 1', slug: 'layer-1', active: true, coinCount: 45 },
    { id: 'layer-2', name: 'Layer 2', slug: 'layer-2', active: true, coinCount: 20 },
    { id: 'defi', name: 'DeFi', slug: 'defi', active: true, coinCount: 320 },
    { id: 'nft', name: 'NFT', slug: 'nft', active: true, coinCount: 85 },
    { id: 'gaming', name: 'Gaming', slug: 'gaming', active: true, coinCount: 120 },
    { id: 'meme', name: 'Meme', slug: 'meme', active: true, coinCount: 200 },
    { id: 'ai', name: 'AI', slug: 'ai', active: true, coinCount: 65 },
    { id: 'rwa', name: 'RWA', slug: 'rwa', active: true, coinCount: 40 },
    { id: 'privacy', name: 'Privacy', slug: 'privacy', active: true, coinCount: 30 },
    { id: 'oracle', name: 'Oracle', slug: 'oracle', active: true, coinCount: 15 },
    { id: 'storage', name: 'Storage', slug: 'storage', active: true, coinCount: 25 },
    { id: 'dex', name: 'DEX', slug: 'dex', active: true, coinCount: 55 },
  ];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [newCat, setNewCat] = useState({ id: '', name: '', slug: '' });

  const startEdit = (c: Record<string, unknown>) => { setEditingId(String(c.id)); setEditData({ ...c }); };
  const saveEdit = async () => { await onSave({ categories: categories.map((c) => String(c.id) === editingId ? editData : c) }); setEditingId(null); };
  const addCat = async () => { if (!newCat.id || !newCat.name) return; await onSave({ categories: [...categories, { ...newCat, active: true, coinCount: 0 }] }); setNewCat({ id: '', name: '', slug: '' }); };
  const removeCat = async (id: string) => { await onSave({ categories: categories.filter((c) => String(c.id) !== id) }); };

  return (
    <Card>
      <CardHeader><CardTitle>Manage Categories ({categories.length})</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg border bg-muted/30">
          <p className="text-sm font-medium mb-2">Add New Category</p>
          <div className="flex gap-2">
            <Input placeholder="ID (e.g., layer-1)" value={newCat.id} onChange={(e) => setNewCat({ ...newCat, id: e.target.value })} />
            <Input placeholder="Name" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
            <Input placeholder="Slug" value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} />
            <Button onClick={addCat} variant="bitcoin"><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
        </div>
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={String(c.id)} className="p-3 rounded-lg border">
              {editingId === String(c.id) ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="ID" value={String(editData.id || '')} onChange={(e) => setEditData({ ...editData, id: e.target.value })} />
                    <Input placeholder="Name" value={String(editData.name || '')} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                    <Input placeholder="Slug" value={String(editData.slug || '')} onChange={(e) => setEditData({ ...editData, slug: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm" variant="bitcoin"><Save className="h-4 w-4 mr-1" />Save</Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{String(c.name)}</p>
                    <p className="text-sm text-muted-foreground">{String(c.slug)} - {Number(c.coinCount) || 0} coins</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={c.active !== false ? 'green' : 'secondary'}>{c.active !== false ? 'Active' : 'Disabled'}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(c as Record<string, unknown>)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => onSave({ categories: categories.map((x) => String(x.id) === String(c.id) ? { ...x, active: !(x as Record<string, boolean>).active } : x) })}><Check className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => removeCat(String(c.id))}><Trash2 className="h-4 w-4 text-crypto-red" /></Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MarketsSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const markets = (data.markets as Record<string, unknown>[]) || [
    { id: 'btc-usd', name: 'BTC/USD', type: 'crypto', exchange: 'Binance', price: 67500, active: true },
    { id: 'eth-usd', name: 'ETH/USD', type: 'crypto', exchange: 'Binance', price: 3450, active: true },
    { id: 'aapl', name: 'Apple Inc.', type: 'stock', exchange: 'NASDAQ', price: 189, active: true },
    { id: 'gold', name: 'Gold', type: 'commodity', exchange: 'COMEX', price: 2340, active: true },
  ];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [newMarket, setNewMarket] = useState({ id: '', name: '', type: 'crypto', exchange: '', price: '' });

  const startEdit = (m: Record<string, unknown>) => { setEditingId(String(m.id)); setEditData({ ...m }); };
  const saveEdit = async () => { await onSave({ markets: markets.map((m) => String(m.id) === editingId ? editData : m) }); setEditingId(null); };
  const addMarket = async () => { if (!newMarket.id || !newMarket.name) return; await onSave({ markets: [...markets, { ...newMarket, price: parseFloat(newMarket.price) || 0, active: true }] }); setNewMarket({ id: '', name: '', type: 'crypto', exchange: '', price: '' }); };
  const removeMarket = async (id: string) => { await onSave({ markets: markets.filter((m) => String(m.id) !== id) }); };

  return (
    <Card>
      <CardHeader><CardTitle>Manage Markets ({markets.length})</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg border bg-muted/30">
          <p className="text-sm font-medium mb-2">Add New Market</p>
          <div className="flex flex-wrap gap-2">
            <Input placeholder="ID" value={newMarket.id} onChange={(e) => setNewMarket({ ...newMarket, id: e.target.value })} />
            <Input placeholder="Name" value={newMarket.name} onChange={(e) => setNewMarket({ ...newMarket, name: e.target.value })} />
            <select className="input w-32" value={newMarket.type} onChange={(e) => setNewMarket({ ...newMarket, type: e.target.value })}>
              <option value="crypto">Crypto</option><option value="stock">Stock</option><option value="commodity">Commodity</option>
            </select>
            <Input placeholder="Exchange" value={newMarket.exchange} onChange={(e) => setNewMarket({ ...newMarket, exchange: e.target.value })} />
            <Input placeholder="Price" type="number" value={newMarket.price} onChange={(e) => setNewMarket({ ...newMarket, price: e.target.value })} />
            <Button onClick={addMarket} variant="bitcoin"><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
        </div>
        <div className="space-y-2">
          {markets.map((m) => (
            <div key={String(m.id)} className="p-3 rounded-lg border">
              {editingId === String(m.id) ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Input placeholder="ID" value={String(editData.id || '')} onChange={(e) => setEditData({ ...editData, id: e.target.value })} />
                    <Input placeholder="Name" value={String(editData.name || '')} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                    <Input placeholder="Price" type="number" value={String(editData.price || '')} onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm" variant="bitcoin"><Save className="h-4 w-4 mr-1" />Save</Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{String(m.name)}</p>
                    <p className="text-sm text-muted-foreground">{String(m.exchange)} • ${Number(m.price).toLocaleString()} • {String(m.type)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={m.active !== false ? 'green' : 'secondary'}>{m.active !== false ? 'Active' : 'Disabled'}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(m as Record<string, unknown>)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => removeMarket(String(m.id))}><Trash2 className="h-4 w-4 text-crypto-red" /></Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AirdropsSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const airdrops = (data.airdrops as Record<string, unknown>[]) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [newAirdrop, setNewAirdrop] = useState({ id: '', title: '', description: '', status: 'active', networks: '', estimatedValue: '' });

  const startEdit = (a: Record<string, unknown>) => { setEditingId(String(a.id)); setEditData({ ...a }); };
  const saveEdit = async () => { await onSave({ airdrops: airdrops.map((a) => String(a.id) === editingId ? editData : a) }); setEditingId(null); };
  const addAirdrop = async () => {
    if (!newAirdrop.id || !newAirdrop.title) return;
    await onSave({ airdrops: [...airdrops, { ...newAirdrop, networks: newAirdrop.networks.split(',').map((s) => s.trim()), riskScore: 30, funding: 'TBA', steps: [] }] });
    setNewAirdrop({ id: '', title: '', description: '', status: 'active', networks: '', estimatedValue: '' });
  };
  const removeAirdrop = async (id: string) => { await onSave({ airdrops: airdrops.filter((a) => String(a.id) !== id) }); };

  return (
    <Card>
      <CardHeader><CardTitle>Manage Airdrops ({airdrops.length})</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg border bg-muted/30">
          <p className="text-sm font-medium mb-2">Add New Airdrop</p>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input placeholder="ID" value={newAirdrop.id} onChange={(e) => setNewAirdrop({ ...newAirdrop, id: e.target.value })} />
              <Input placeholder="Title" value={newAirdrop.title} onChange={(e) => setNewAirdrop({ ...newAirdrop, title: e.target.value })} />
              <select className="input w-32" value={newAirdrop.status} onChange={(e) => setNewAirdrop({ ...newAirdrop, status: e.target.value })}>
                <option value="active">Active</option><option value="upcoming">Upcoming</option><option value="ended">Ended</option>
              </select>
            </div>
            <Input placeholder="Description" value={newAirdrop.description} onChange={(e) => setNewAirdrop({ ...newAirdrop, description: e.target.value })} />
            <div className="flex gap-2">
              <Input placeholder="Networks (comma separated)" value={newAirdrop.networks} onChange={(e) => setNewAirdrop({ ...newAirdrop, networks: e.target.value })} />
              <Input placeholder="Est. Value" value={newAirdrop.estimatedValue} onChange={(e) => setNewAirdrop({ ...newAirdrop, estimatedValue: e.target.value })} />
            </div>
            <Button onClick={addAirdrop} variant="bitcoin"><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
        </div>
        <div className="space-y-2">
          {airdrops.map((a) => (
            <div key={String(a.id)} className="p-3 rounded-lg border">
              {editingId === String(a.id) ? (
                <div className="space-y-2">
                  <Input placeholder="Title" value={String(editData.title || '')} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                  <Input placeholder="Description" value={String(editData.description || '')} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm" variant="bitcoin"><Save className="h-4 w-4 mr-1" />Save</Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{String(a.title)}</p>
                    <p className="text-sm text-muted-foreground">{String(a.status)} • {String(a.networks)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={a.status === 'active' ? 'green' : a.status === 'upcoming' ? 'bitcoin' : 'secondary'}>{String(a.status)}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(a as Record<string, unknown>)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => removeAirdrop(String(a.id))}><Trash2 className="h-4 w-4 text-crypto-red" /></Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function JobsSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const jobs = (data.jobs as Record<string, unknown>[]) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [newJob, setNewJob] = useState({ id: '', title: '', company: '', type: 'full-time', location: '', salary: '', description: '' });

  const startEdit = (j: Record<string, unknown>) => { setEditingId(String(j.id)); setEditData({ ...j }); };
  const saveEdit = async () => { await onSave({ jobs: jobs.map((j) => String(j.id) === editingId ? editData : j) }); setEditingId(null); };
  const addJob = async () => { if (!newJob.id || !newJob.title) return; await onSave({ jobs: [...jobs, { ...newJob, active: true, postedAt: new Date().toISOString() }] }); setNewJob({ id: '', title: '', company: '', type: 'full-time', location: '', salary: '', description: '' }); };
  const removeJob = async (id: string) => { await onSave({ jobs: jobs.filter((j) => String(j.id) !== id) }); };
  const toggleActive = async (id: string) => { await onSave({ jobs: jobs.map((j) => String(j.id) === id ? { ...j, active: !(j as Record<string, boolean>).active } : j) }); };

  return (
    <Card>
      <CardHeader><CardTitle>Manage Jobs ({jobs.length})</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg border bg-muted/30">
          <p className="text-sm font-medium mb-2">Add New Job</p>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input placeholder="ID" value={newJob.id} onChange={(e) => setNewJob({ ...newJob, id: e.target.value })} />
              <Input placeholder="Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
              <Input placeholder="Company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <select className="input w-40" value={newJob.type} onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}>
                <option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="remote">Remote</option>
              </select>
              <Input placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
              <Input placeholder="Salary" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} />
            </div>
            <Input placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
            <Button onClick={addJob} variant="bitcoin"><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
        </div>
        <div className="space-y-2">
          {jobs.map((j) => (
            <div key={String(j.id)} className="p-3 rounded-lg border">
              {editingId === String(j.id) ? (
                <div className="space-y-2">
                  <Input placeholder="Title" value={String(editData.title || '')} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                  <Input placeholder="Company" value={String(editData.company || '')} onChange={(e) => setEditData({ ...editData, company: e.target.value })} />
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm" variant="bitcoin"><Save className="h-4 w-4 mr-1" />Save</Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{String(j.title)}</p>
                    <p className="text-sm text-muted-foreground">{String(j.company)} • {String(j.type)} • {String(j.location)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={j.active !== false ? 'green' : 'secondary'}>{j.active !== false ? 'Active' : 'Disabled'}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(j as Record<string, unknown>)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(String(j.id))}><Check className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => removeJob(String(j.id))}><Trash2 className="h-4 w-4 text-crypto-red" /></Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BlogSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const posts = (data.blogPosts as Record<string, unknown>[]) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [newPost, setNewPost] = useState({ id: '', title: '', excerpt: '', content: '', category: 'news', image: '' });

  const startEdit = (p: Record<string, unknown>) => { setEditingId(String(p.id)); setEditData({ ...p }); };
  const saveEdit = async () => { await onSave({ blogPosts: posts.map((p) => String(p.id) === editingId ? editData : p) }); setEditingId(null); };
  const addPost = async () => { if (!newPost.id || !newPost.title) return; await onSave({ blogPosts: [...posts, { ...newPost, published: true, date: new Date().toISOString(), author: 'Admin' }] }); setNewPost({ id: '', title: '', excerpt: '', content: '', category: 'news', image: '' }); };
  const removePost = async (id: string) => { await onSave({ blogPosts: posts.filter((p) => String(p.id) !== id) }); };

  return (
    <Card>
      <CardHeader><CardTitle>Blog CMS ({posts.length})</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg border bg-muted/30">
          <p className="text-sm font-medium mb-2">Add New Post</p>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input placeholder="ID (slug)" value={newPost.id} onChange={(e) => setNewPost({ ...newPost, id: e.target.value })} />
              <Input placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
              <select className="input w-32" value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}>
                <option value="news">News</option><option value="guide">Guide</option><option value="analysis">Analysis</option><option value="tutorial">Tutorial</option>
              </select>
            </div>
            <Input placeholder="Excerpt" value={newPost.excerpt} onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })} />
            <Input placeholder="Image URL" value={newPost.image} onChange={(e) => setNewPost({ ...newPost, image: e.target.value })} />
            <textarea className="input min-h-[100px] resize-none" placeholder="Content (Markdown supported)" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} />
            <Button onClick={addPost} variant="bitcoin"><Plus className="h-4 w-4 mr-1" />Add Post</Button>
          </div>
        </div>
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={String(p.id)} className="p-3 rounded-lg border">
              {editingId === String(p.id) ? (
                <div className="space-y-2">
                  <Input placeholder="Title" value={String(editData.title || '')} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                  <Input placeholder="Excerpt" value={String(editData.excerpt || '')} onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })} />
                  <textarea className="input min-h-[100px] resize-none" placeholder="Content" value={String(editData.content || '')} onChange={(e) => setEditData({ ...editData, content: e.target.value })} />
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm" variant="bitcoin"><Save className="h-4 w-4 mr-1" />Save</Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{String(p.title)}</p>
                    <p className="text-sm text-muted-foreground">{String(p.category)} • {String(p.date || '').split('T')[0]}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={p.published !== false ? 'green' : 'secondary'}>{p.published !== false ? 'Published' : 'Draft'}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(p as Record<string, unknown>)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => removePost(String(p.id))}><Trash2 className="h-4 w-4 text-crypto-red" /></Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UsersSection() {
  return (
    <Card>
      <CardHeader><CardTitle>Users Management</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Total Users</p><p className="text-2xl font-bold mt-1">1,247</p></CardContent></Card>
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Active Today</p><p className="text-2xl font-bold mt-1">342</p></CardContent></Card>
            <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">New This Week</p><p className="text-2xl font-bold mt-1">89</p></CardContent></Card>
          </div>
          <p className="text-muted-foreground text-sm">User management features coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PagesSection() {
  const pages = [{ name: 'About', path: '/about' }, { name: 'Contact', path: '/contact' }, { name: 'Privacy Policy', path: '/privacy-policy' }, { name: 'Terms', path: '/terms' }, { name: 'Disclaimer', path: '/disclaimer' }, { name: 'Advertise', path: '/advertise' }, { name: 'Support Us', path: '/support-us' }, { name: 'Donate', path: '/donate' }];
  return (<Card><CardHeader><CardTitle>Pages</CardTitle></CardHeader><CardContent><div className="space-y-2">{pages.map((p) => (<div key={p.path} className="flex items-center justify-between p-3 rounded-lg border"><div><p className="font-medium">{p.name}</p><p className="text-sm text-muted-foreground">{p.path}</p></div><Badge variant="green">Published</Badge></div>))}</div></CardContent></Card>);
}

function AdsSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const adSlots = (data.ads as { id: string; page: string; position: string; size: string; enabled: boolean; code: string; priority: number }[]) || [];
  const pageAds: Record<string, { code: string; enabled: boolean; startDate: string; endDate: string; clicks?: number }> = {};
  adSlots.forEach(a => { pageAds[a.page] = { code: a.code, enabled: a.enabled, startDate: '', endDate: '', clicks: 0 }; });
  const adOrders = (data.adOrders as Record<string, unknown>[]) || [];
  const adPaymentInfo = (data.adPaymentInfo as { walletAddress?: string; easypaisaNumber?: string; jazzcashNumber?: string; easypaisaTitle?: string; jazzcashTitle?: string }) || {};

  const PAGE_LIST = [
    { id: 'mainpage', name: '🏠 Main Page', desc: 'Homepage top banner', color: 'bg-green-500' },
    { id: 'coins', name: '🪙 Coins Page', desc: 'Coins listing page', color: 'bg-yellow-500' },
    { id: 'blog', name: '✍️ Blog Page', desc: 'Blog listing page', color: 'bg-blue-500' },
    { id: 'learn', name: '📖 Learn Bitcoin', desc: 'Learning center', color: 'bg-purple-500' },
    { id: 'airdrops', name: '🎁 Airdrops', desc: 'Airdrops listing', color: 'bg-pink-500' },
    { id: 'jobs', name: '💼 Jobs Page', desc: 'Jobs listing page', color: 'bg-orange-500' },
    { id: 'markets', name: '📊 Markets', desc: 'Markets overview', color: 'bg-cyan-500' },
    { id: 'news', name: '📰 News Page', desc: 'Crypto news', color: 'bg-red-500' },
    { id: 'research', name: '🔬 Research', desc: 'Research articles', color: 'bg-indigo-500' },
  ];

  const [activeTab, setActiveTab] = useState<'pages' | 'orders' | 'payments' | 'analytics'>('pages');
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [walletEdit, setWalletEdit] = useState(adPaymentInfo.walletAddress || '');
  const [easypaisaNumber, setEasypaisaNumber] = useState(adPaymentInfo.easypaisaNumber || '');
  const [jazzcashNumber, setJazzcashNumber] = useState(adPaymentInfo.jazzcashNumber || '');
  const [easypaisaTitle, setEasypaisaTitle] = useState(adPaymentInfo.easypaisaTitle || '');
  const [jazzcashTitle, setJazzcashTitle] = useState(adPaymentInfo.jazzcashTitle || '');

  const savePageAd = async (pageId: string, updates: Partial<{ code: string; enabled: boolean; startDate: string; endDate: string; clicks: number }>) => {
    const current = pageAds[pageId] || { code: '', enabled: false, startDate: '', endDate: '', clicks: 0 };
    const merged = { ...current, ...updates };
    const newSlot = { id: `ad-${pageId}`, page: pageId, position: 'inline-336x280' as const, size: '336x280', priority: 1, enabled: merged.enabled, code: merged.code };
    const existing = adSlots.findIndex(a => a.page === pageId);
    let newAdSlots = [...adSlots];
    if (existing >= 0) newAdSlots[existing] = { ...newAdSlots[existing], ...newSlot };
    else newAdSlots.push(newSlot);
    await onSave({ ads: newAdSlots });
  };

  const savePaymentInfo = async () => {
    await onSave({ adPaymentInfo: { walletAddress: walletEdit, easypaisaNumber, jazzcashNumber, easypaisaTitle, jazzcashTitle } });
  };

  const approveOrder = async (orderId: string) => {
    await onSave({ adOrders: adOrders.map((o) => String(o.id) === orderId ? { ...o, status: 'approved', approvedAt: new Date().toISOString() } : o) });
  };

  const rejectOrder = async (orderId: string) => {
    await onSave({ adOrders: adOrders.map((o) => String(o.id) === orderId ? { ...o, status: 'rejected', rejectedAt: new Date().toISOString() } : o) });
  };

  const deleteOrder = async (orderId: string) => {
    await onSave({ adOrders: adOrders.filter((o) => String(o.id) !== orderId) });
  };

  const resetClicks = async (pageId: string) => {
    const ad = pageAds[pageId];
    if (!ad) return;
    const newSlot = { id: `ad-${pageId}`, page: pageId, position: 'inline-336x280' as const, size: '336x280', priority: 1, enabled: ad.enabled, code: ad.code };
    const existing = adSlots.findIndex(a => a.page === pageId);
    let newAdSlots = [...adSlots];
    if (existing >= 0) newAdSlots[existing] = { ...newAdSlots[existing], ...newSlot };
    else newAdSlots.push(newSlot);
    await onSave({ ads: newAdSlots });
  };

  const pendingOrders = adOrders.filter((o) => (o as Record<string, string>).status === 'pending');
  const approvedOrders = adOrders.filter((o) => (o as Record<string, string>).status === 'approved');
  const rejectedOrders = adOrders.filter((o) => (o as Record<string, string>).status === 'rejected');

  const now = new Date();
  const totalClicks = PAGE_LIST.reduce((sum, p) => sum + ((pageAds[p.id]?.clicks) || 0), 0);
  const activeAdsCount = PAGE_LIST.filter((p) => {
    const ad = pageAds[p.id];
    if (!ad?.enabled) return false;
    if (ad.startDate && new Date(ad.startDate) > now) return false;
    if (ad.endDate && new Date(ad.endDate) < now) return false;
    return true;
  }).length;

  const getNextAvailableDate = (pageId: string) => {
    const ad = pageAds[pageId];
    if (!ad?.endDate) return 'Anytime';
    const end = new Date(ad.endDate);
    return end < now ? 'Available Now' : end.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getAdStatus = (pageId: string) => {
    const ad = pageAds[pageId];
    if (!ad?.enabled) return { label: 'Disabled', color: 'bg-gray-500' };
    if (!ad.code) return { label: 'No Code', color: 'bg-gray-400' };
    const start = ad.startDate ? new Date(ad.startDate) : null;
    const end = ad.endDate ? new Date(ad.endDate) : null;
    if (start && start > now) return { label: 'Scheduled', color: 'bg-blue-500' };
    if (end && end < now) return { label: 'Expired', color: 'bg-red-500' };
    return { label: 'Live', color: 'bg-green-500' };
  };

  const tabs = [
    { key: 'pages' as const, label: '📄 Page Ads', count: PAGE_LIST.length },
    { key: 'orders' as const, label: '📦 Orders', count: adOrders.length },
    { key: 'payments' as const, label: '💳 Payments', count: 0 },
    { key: 'analytics' as const, label: '📊 Analytics', count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{activeAdsCount}</p>
            <p className="text-xs text-muted-foreground">Active Ads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{totalClicks}</p>
            <p className="text-xs text-muted-foreground">Total Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">{pendingOrders.length}</p>
            <p className="text-xs text-muted-foreground">Pending Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-500">{approvedOrders.length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <Badge variant={activeTab === tab.key ? 'default' : 'secondary'} className="text-xs h-5 px-1.5">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Page Ads Tab */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAGE_LIST.map((page) => {
            const ad = pageAds[page.id] || { code: '', enabled: false, startDate: '', endDate: '', clicks: 0 };
            const status = getAdStatus(page.id);
            const isExpanded = expandedPage === page.id;
            const daysLeft = ad.endDate ? Math.ceil((new Date(ad.endDate).getTime() - now.getTime()) / 86400000) : null;

            return (
              <Card key={page.id} className="overflow-hidden">
                <div className={`h-1 ${page.color}`} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{page.name}</p>
                      <p className="text-xs text-muted-foreground">{page.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${status.color} text-white text-xs`}>{status.label}</Badge>
                      <button onClick={() => setExpandedPage(isExpanded ? null : page.id)} className="p-1 hover:bg-muted rounded">
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <p className="text-muted-foreground">Clicks</p>
                      <p className="font-bold text-sm">{ad.clicks || 0}</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <p className="text-muted-foreground">Ends</p>
                      <p className="font-bold text-sm">{daysLeft !== null ? (daysLeft > 0 ? `${daysLeft}d` : 'Today') : '—'}</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <p className="text-muted-foreground">Next Slot</p>
                      <p className="font-bold text-sm">{getNextAvailableDate(page.id)}</p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Ad Code (HTML/Script)</label>
                        <textarea
                          className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
                          placeholder="Paste ad HTML or script here..."
                          value={ad.code}
                          onChange={(e) => savePageAd(page.id, { code: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium mb-1 block">Start Date</label>
                          <Input type="date" className="text-xs" value={ad.startDate} onChange={(e) => savePageAd(page.id, { startDate: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">End Date</label>
                          <Input type="date" className="text-xs" value={ad.endDate} onChange={(e) => savePageAd(page.id, { endDate: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ad.enabled}
                            onChange={(e) => savePageAd(page.id, { enabled: e.target.checked })}
                            className="rounded"
                          />
                          Enable Ad
                        </label>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => resetClicks(page.id)}>Reset Clicks</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {pendingOrders.length > 0 && (
            <Card className="border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-500">
                  <Bell className="h-5 w-5" />
                  Pending Orders ({pendingOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingOrders.map((order) => {
                  const isExpanded = expandedOrder === String(order.id);
                  return (
                    <div key={String(order.id)} className="p-4 rounded-lg border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{String((order as Record<string, string>).name || 'Unknown')}</p>
                          <p className="text-sm text-muted-foreground">{String((order as Record<string, string>).email)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="bitcoin">${String((order as Record<string, number>).total)}</Badge>
                          <Button variant="ghost" size="sm" onClick={() => setExpandedOrder(isExpanded ? null : String(order.id))}>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="space-y-3 pt-3 border-t">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><p className="text-muted-foreground">Package</p><p className="font-medium">{String((order as Record<string, string>).package)}</p></div>
                            <div><p className="text-muted-foreground">Pages</p><p className="font-medium">{String((order as Record<string, string>).pages || 'N/A')}</p></div>
                            <div><p className="text-muted-foreground">Payment Method</p><p className="font-medium">{String((order as Record<string, string>).paymentMethod)}</p></div>
                            <div><p className="text-muted-foreground">TXID</p><p className="font-medium font-mono text-xs">{String((order as Record<string, string>).trxId || 'N/A')}</p></div>
                            <div><p className="text-muted-foreground">Duration</p><p className="font-medium">{String((order as Record<string, string>).duration)}</p></div>
                            <div><p className="text-muted-foreground">Date</p><p className="font-medium">{String((order as Record<string, string>).date || '').split('T')[0]}</p></div>
                          </div>
                          {!!(order as Record<string, string>).htmlCode && (
                            <div>
                              <p className="text-sm font-medium mb-1">HTML Code</p>
                              <pre className="p-3 rounded bg-muted text-xs font-mono overflow-x-auto max-h-[150px] whitespace-pre-wrap">{String((order as Record<string, string>).htmlCode)}</pre>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button onClick={() => approveOrder(String(order.id))} variant="bitcoin" size="sm"><Check className="h-4 w-4 mr-1" />Approve & Activate</Button>
                            <Button onClick={() => rejectOrder(String(order.id))} variant="outline" size="sm" className="text-red-500">Reject</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {approvedOrders.length > 0 && (
            <Card className="border-green-500/30">
              <CardHeader><CardTitle className="flex items-center gap-2 text-green-500"><Check className="h-5 w-5" />Approved Orders ({approvedOrders.length})</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {approvedOrders.map((order) => (
                  <div key={String(order.id)} className="p-3 rounded-lg border flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{String((order as Record<string, string>).name || 'Unknown')}</p>
                      <p className="text-xs text-muted-foreground">${String((order as Record<string, number>).total)} • {String((order as Record<string, string>).package)} • Approved: {String((order as Record<string, string>).approvedAt || '').split('T')[0]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="green">Live</Badge>
                      <Button variant="ghost" size="sm" className="text-red-500 h-7 w-7 p-0" onClick={() => deleteOrder(String(order.id))}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {rejectedOrders.length > 0 && (
            <Card className="border-red-500/30">
              <CardHeader><CardTitle className="flex items-center gap-2 text-red-500">Rejected Orders ({rejectedOrders.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {rejectedOrders.map((order) => (
                  <div key={String(order.id)} className="p-3 rounded-lg border flex items-center justify-between opacity-60">
                    <div>
                      <p className="font-medium text-sm">{String((order as Record<string, string>).name)}</p>
                      <p className="text-xs text-muted-foreground">${String((order as Record<string, number>).total)} • Rejected: {String((order as Record<string, string>).rejectedAt || '').split('T')[0]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="red">Rejected</Badge>
                      <Button variant="ghost" size="sm" className="text-red-500 h-7 w-7 p-0" onClick={() => deleteOrder(String(order.id))}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {adOrders.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No ad orders yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>💳 Payment Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Ye settings advertise page par show hongi. Users inhi methods se payment karenge.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Crypto */}
              <div className="p-4 rounded-lg border space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">₿</span>
                  <h3 className="font-semibold">Crypto (USDT TRC20)</h3>
                </div>
                <Input
                  placeholder="Enter your USDT TRC20 wallet address..."
                  value={walletEdit}
                  onChange={(e) => setWalletEdit(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              {/* EasyPaisa */}
              <div className="p-4 rounded-lg border space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📱</span>
                  <h3 className="font-semibold">EasyPaisa</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Account Title</label>
                    <Input placeholder="Name" value={easypaisaTitle} onChange={(e) => setEasypaisaTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Mobile Number</label>
                    <Input placeholder="0300-1234567" value={easypaisaNumber} onChange={(e) => setEasypaisaNumber(e.target.value)} className="font-mono" />
                  </div>
                </div>
              </div>

              {/* JazzCash */}
              <div className="p-4 rounded-lg border space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <h3 className="font-semibold">JazzCash</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Account Title</label>
                    <Input placeholder="Name" value={jazzcashTitle} onChange={(e) => setJazzcashTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Mobile Number</label>
                    <Input placeholder="0300-1234567" value={jazzcashNumber} onChange={(e) => setJazzcashNumber(e.target.value)} className="font-mono" />
                  </div>
                </div>
              </div>

              <Button onClick={savePaymentInfo} variant="bitcoin" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Ad Performance Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">Har page ke ad clicks aur status ka overview</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PAGE_LIST.map((page) => {
                  const ad = pageAds[page.id] || { code: '', enabled: false, startDate: '', endDate: '', clicks: 0 };
                  const status = getAdStatus(page.id);
                  const maxClicks = Math.max(...PAGE_LIST.map((p) => (pageAds[p.id]?.clicks) || 0), 1);
                  const clickPercent = ((ad.clicks || 0) / maxClicks) * 100;

                  return (
                    <div key={page.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className={`w-1 h-10 rounded ${page.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{page.name}</p>
                          <Badge className={`${status.color} text-white text-xs`}>{status.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${page.color} rounded-full transition-all`} style={{ width: `${clickPercent}%` }} />
                          </div>
                          <span className="text-sm font-bold w-12 text-right">{ad.clicks || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{totalClicks}</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{activeAdsCount}</p>
                  <p className="text-sm text-muted-foreground">Active Ads</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{PAGE_LIST.length - activeAdsCount}</p>
                  <p className="text-sm text-muted-foreground">Available Slots</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{adOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function MiningSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const hardware = (data.miningHardware as Record<string, unknown>[]) || [];
  const [model, setModel] = useState('');
  const [mfr, setMfr] = useState('');
  const [algo, setAlgo] = useState('');
  const [hr, setHr] = useState('');
  const [hrUnit, setHrUnit] = useState('TH/s');
  const [power, setPower] = useState('');
  const [cost, setCost] = useState('');
  const [profit, setProfit] = useState('');

  const addHardware = async () => {
    if (!model.trim()) return;
    const entry = { id: `hw_${Date.now()}`, model: model.trim(), manufacturer: mfr.trim() || 'Generic', algorithm: algo.trim(), hashrate: Number(hr) || 0, hashrateUnit: hrUnit, power: Number(power) || 0, cost: Number(cost) || 0, dailyProfit: Number(profit) || 0 };
    await onSave({ miningHardware: [...hardware, entry] });
    setModel(''); setMfr(''); setAlgo(''); setHr(''); setPower(''); setCost(''); setProfit('');
  };

  const removeHardware = async (id: string) => {
    await onSave({ miningHardware: hardware.filter(h => h.id !== id) });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-bitcoin" />
            Mining Hardware Manager
          </CardTitle>
          <p className="text-sm text-muted-foreground">ASIC/GPU mining hardware database admin. Ye data website par mining pages mein show hoga.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Input placeholder="Model" value={model} onChange={e => setModel(e.target.value)} className="text-sm" />
            <Input placeholder="Manufacturer" value={mfr} onChange={e => setMfr(e.target.value)} className="text-sm" />
            <Input placeholder="Algorithm" value={algo} onChange={e => setAlgo(e.target.value)} className="text-sm" />
            <Input placeholder="Hashrate" value={hr} onChange={e => setHr(e.target.value)} className="text-sm" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <select value={hrUnit} onChange={e => setHrUnit(e.target.value)} className="h-11 rounded-md border bg-background px-3 text-sm">
              <option>TH/s</option><option>GH/s</option><option>MH/s</option><option>KH/s</option><option>PH/s</option>
            </select>
            <Input placeholder="Power (W)" value={power} onChange={e => setPower(e.target.value)} className="text-sm" />
            <Input placeholder="Cost (USD)" value={cost} onChange={e => setCost(e.target.value)} className="text-sm" />
            <Input placeholder="Daily Profit (USD)" value={profit} onChange={e => setProfit(e.target.value)} className="text-sm" />
            <Button onClick={addHardware} variant="bitcoin" className="h-11"><Plus className="h-4 w-4 mr-2" />Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hardware Database ({hardware.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {hardware.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No mining hardware added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground text-xs uppercase"><th className="pb-2 pr-3">Model</th><th className="pb-2 pr-3">Mfr</th><th className="pb-2 pr-3">Algorithm</th><th className="pb-2 pr-3">Hashrate</th><th className="pb-2 pr-3">Power</th><th className="pb-2 pr-3">Cost</th><th className="pb-2 pr-3">Profit/day</th><th className="pb-2"></th></tr></thead>
                <tbody className="divide-y">
                  {hardware.map((h: Record<string, unknown>) => (
                    <tr key={String(h.id)} className="text-sm hover:bg-muted/50">
                      <td className="py-2 pr-3 font-medium">{String(h.model || '')}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{String(h.manufacturer || '')}</td>
                      <td className="py-2 pr-3">{String(h.algorithm || '')}</td>
                      <td className="py-2 pr-3 font-mono">{Number(h.hashrate) || 0} {String(h.hashrateUnit || '')}</td>
                      <td className="py-2 pr-3">{Number(h.power) || 0}W</td>
                      <td className="py-2 pr-3">${Number(h.cost) || 0}</td>
                      <td className="py-2 pr-3 text-crypto-green">${Number(h.dailyProfit) || 0}/d</td>
                      <td><button onClick={() => removeHardware(String(h.id))} className="text-red-500 hover:text-red-700 text-xs p-1"><Trash2 className="h-3.5 w-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AnnouncementsSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const announcements = (data.announcements as { id: string; text: string; type: string; link?: string; active?: boolean; createdAt?: string }[]) || [];
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<'airdrop' | 'job' | 'manual'>('manual');
  const [newLink, setNewLink] = useState('');

  const addAnnouncement = async () => {
    if (!newText.trim()) return;
    const newAnn = {
      id: `ann_${Date.now()}`,
      text: newText.trim(),
      type: newType,
      link: newLink.trim() || undefined,
      active: true,
      createdAt: new Date().toISOString(),
    };
    await onSave({ announcements: [...announcements, newAnn] });
    setNewText('');
    setNewLink('');
  };

  const toggleActive = async (id: string) => {
    await onSave({
      announcements: announcements.map((a) => a.id === id ? { ...a, active: !a.active } : a),
    });
  };

  const deleteAnnouncement = async (id: string) => {
    await onSave({ announcements: announcements.filter((a) => a.id !== id) });
  };

  const activeCount = announcements.filter((a) => a.active !== false).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-bitcoin" />
            Announcements Manager
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Header mein announcement banner show hoga. New jobs/airdrops par auto bhi trigger hota hai.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New */}
          <div className="p-4 rounded-lg border space-y-3 bg-muted/20">
            <h3 className="font-semibold text-sm">New Announcement</h3>
            <div>
              <label className="text-xs font-medium mb-1 block">Message</label>
              <Input
                placeholder="🎉 New airdrop live! / 💼 New job opportunity..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as 'airdrop' | 'job' | 'manual')}
                  className="w-full h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
                >
                  <option value="manual">📢 Manual</option>
                  <option value="airdrop">🎁 Airdrop</option>
                  <option value="job">💼 Job</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Link (optional)</label>
                <Input placeholder="/airdrops/new-coin" value={newLink} onChange={(e) => setNewLink(e.target.value)} />
              </div>
            </div>
            <Button onClick={addAnnouncement} variant="bitcoin" className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Publish Announcement
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold text-green-500">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold text-gray-500">{announcements.length - activeCount}</p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold text-blue-500">{announcements.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2">
            {announcements.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No announcements yet</p>
            )}
            {[...announcements].reverse().map((ann) => (
              <div key={ann.id} className={`p-3 rounded-lg border flex items-center justify-between ${ann.active === false ? 'opacity-50' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={ann.type === 'airdrop' ? 'bitcoin' : ann.type === 'job' ? 'default' : 'secondary'} className="text-xs">
                      {ann.type === 'airdrop' ? '🎁' : ann.type === 'job' ? '💼' : '📢'} {ann.type}
                    </Badge>
                    {ann.active === false && <Badge variant="red" className="text-xs">Inactive</Badge>}
                  </div>
                  <p className="text-sm font-medium mt-1 truncate">{ann.text}</p>
                  {ann.link && <p className="text-xs text-muted-foreground">{ann.link}</p>}
                  <p className="text-xs text-muted-foreground mt-0.5">{ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ''}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleActive(ann.id)}>
                    {ann.active === false ? 'Activate' : 'Deactivate'}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteAnnouncement(ann.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ApisSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const DEFAULT_APIS: Record<string, { enabled: boolean; baseUrl: string; apiKey?: string; headerKey?: string; accessKey?: string; binId?: string; description: string }> = {
    coingecko: { enabled: true, baseUrl: 'https://api.coingecko.com/api/v3', headerKey: 'x-cg-demo-key', description: 'Coin prices, market data, coin details, trending, categories' },
    binance: { enabled: true, baseUrl: 'https://api.binance.com/api/v3', description: 'Binance exchange prices and trading pairs' },
    dexscreener: { enabled: true, baseUrl: 'https://api.dexscreener.com/latest', description: 'DEX token prices, liquidity, trading pairs' },
    defillama: { enabled: true, baseUrl: 'https://api.llama.fi', description: 'DeFi TVL, protocol data, chain analytics' },
    jsonbin: { enabled: true, baseUrl: 'https://api.jsonbin.io/v3', apiKey: '$2a$10$JNXixSu1HicEzD5diMw1ZedAGQkmr4Iwze6Qc6g8L3s89vsrUpGAG', headerKey: 'X-Master-Key', binId: '6a0b09d4a92aa659e32f87bd', description: 'CMS data storage (content, ads, settings, blog, jobs)' },
  };

  const savedApis = (data.apiConfig as Record<string, { enabled: boolean; baseUrl: string; apiKey?: string; headerKey?: string; accessKey?: string; binId?: string }>) || {};
  const [apiConfig, setApiConfig] = useState<Record<string, { enabled: boolean; baseUrl: string; apiKey?: string; headerKey?: string; accessKey?: string; binId?: string }>>(() => {
    const merged = { ...DEFAULT_APIS };
    for (const key of Object.keys(merged)) { if (savedApis[key]) { merged[key] = { ...merged[key], ...savedApis[key] }; } }
    return merged;
  });
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  const saveApis = async () => { await onSave({ apiConfig }); };
  const testApi = async (id: string) => {
    setTestingId(id);
    const api = apiConfig[id];
    if (!api) { setTestingId(null); return; }
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (api.apiKey && api.headerKey) headers[api.headerKey] = api.apiKey;
      const testUrl = id === 'coingecko' ? `${api.baseUrl}/ping` : id === 'binance' ? `${api.baseUrl}/ping` : id === 'dexscreener' ? `${api.baseUrl}/dex/pairs/solana/So11111111111111111111111111111111111111112` : id === 'defillama' ? `${api.baseUrl}/v2/chains` : id === 'jsonbin' ? `${api.baseUrl}/b/6a0b09d4a92aa659e32f87bd/latest` : api.baseUrl;
      const res = await fetch(testUrl, { headers, method: 'GET' });
      if (res.ok) setTestResults({ ...testResults, [id]: { success: true, message: `Connected! Status: ${res.status}` } });
      else setTestResults({ ...testResults, [id]: { success: false, message: `Failed: ${res.status} ${res.statusText}` } });
    } catch (e: unknown) { setTestResults({ ...testResults, [id]: { success: false, message: `Error: ${e instanceof Error ? e.message : 'Unknown'}` } }); }
    setTestingId(null);
  };
  const resetToDefault = async () => { setApiConfig({ ...DEFAULT_APIS }); await onSave({ apiConfig: DEFAULT_APIS }); };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>API Configuration</CardTitle><p className="text-sm text-muted-foreground">Sab APIs yahan se manage karein. URL, API key, header change kar sakte hain. Test button se connection verify karein.</p></CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(apiConfig).map(([id, api]) => {
            const testResult = testResults[id];
            return (
               <div key={id} className="p-4 rounded-lg border space-y-3">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3"><Badge variant={api.enabled ? 'green' : 'secondary'} className="capitalize">{id}</Badge><span className="text-sm text-muted-foreground">{id} API</span></div>
                   <div className="flex items-center gap-2">
                     <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={api.enabled} onChange={(e) => setApiConfig({ ...apiConfig, [id]: { ...api, enabled: e.target.checked } })} className="rounded" />Enabled</label>
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   <div><label className="text-sm font-medium mb-1 block">Base URL</label><Input value={api.baseUrl} onChange={(e) => setApiConfig({ ...apiConfig, [id]: { ...api, baseUrl: e.target.value } })} placeholder="https://api.example.com/v1" className="font-mono text-xs" /></div>
                   <div><label className="text-sm font-medium mb-1 block">Header Key Name</label><Input value={api.headerKey || ''} onChange={(e) => setApiConfig({ ...apiConfig, [id]: { ...api, headerKey: e.target.value } })} placeholder="e.g., x-cg-demo-key, X-Master-Key" className="font-mono text-xs" /></div>
                 </div>
                 <div><label className="text-sm font-medium mb-1 block">API Key</label><Input type="password" value={api.apiKey || ''} onChange={(e) => setApiConfig({ ...apiConfig, [id]: { ...api, apiKey: e.target.value } })} placeholder="Enter API key (leave empty if not needed)" className="font-mono text-xs" /></div>
                 {id === 'jsonbin' && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <div><label className="text-sm font-medium mb-1 block">X-Access-Key</label><Input type="password" value={(api as Record<string, unknown>).accessKey as string || ''} onChange={(e) => setApiConfig({ ...apiConfig, [id]: { ...api, accessKey: e.target.value } })} placeholder="X-Access-Key" className="font-mono text-xs" /></div>
                     <div><label className="text-sm font-medium mb-1 block">Bin ID</label><Input value={(api as Record<string, unknown>).binId as string || ''} onChange={(e) => setApiConfig({ ...apiConfig, [id]: { ...api, binId: e.target.value } })} placeholder="6a0b09d4a92aa659e32f87bd" className="font-mono text-xs" /></div>
                   </div>
                 )}
                 <div className="flex items-center gap-2">
                   <Button onClick={() => testApi(id)} variant="outline" size="sm" disabled={testingId === id}>{testingId === id ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Zap className="h-4 w-4 mr-1" />}Test Connection</Button>
                   {testResult && (<span className={`text-sm ${testResult.success ? 'text-crypto-green' : 'text-crypto-red'}`}>{testResult.success ? '✓' : '✗'} {testResult.message}</span>)}
                 </div>
               </div>
            );
          })}
          <div className="flex gap-2">
            <Button onClick={saveApis} variant="bitcoin" className="flex-1"><Save className="h-4 w-4 mr-1" />Save All APIs</Button>
            <Button onClick={resetToDefault} variant="outline">Reset to Default</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>API Usage Guide</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border bg-muted/30"><p className="font-medium mb-1">Auto-Update</p><p className="text-muted-foreground">APIs save hote hi automatically update ho jati hain. Koi rebuild ya deploy ki zaroorat nahi.</p></div>
            <div className="p-3 rounded-lg border bg-muted/30"><p className="font-medium mb-1">API Keys</p><p className="text-muted-foreground">CoinGecko free key: <code className="bg-muted px-1 rounded">CG-API-KEY</code> header use karta hai. Pro plan ke liye paid key lagayein.</p></div>
            <div className="p-3 rounded-lg border bg-muted/30"><p className="font-medium mb-1">Custom Endpoints</p><p className="text-muted-foreground">Agar koi API down ho to alternative URL set kar sakte hain. Test button se verify karein pehle.</p></div>
            <div className="p-3 rounded-lg border bg-muted/30"><p className="font-medium mb-1">Available APIs</p><ul className="text-muted-foreground list-disc list-inside space-y-0.5"><li><strong>CoinGecko</strong> - Coin prices, market data, trending, search</li><li><strong>Binance</strong> - Exchange prices, 24h tickers</li><li><strong>DexScreener</strong> - DEX pairs, liquidity, new tokens</li><li><strong>DeFiLlama</strong> - TVL, protocol analytics, chain data</li><li><strong>JSONBin</strong> - CMS storage (content, ads, settings)</li></ul></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DonationsSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const wallets = (data.donationWallets as Record<string, unknown>[]) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [newWallet, setNewWallet] = useState({ network: '', token: '', address: '', qrImage: '' });

  const startEdit = (w: Record<string, unknown>) => { setEditingId(String(w.id)); setEditData({ ...w }); };
  const saveEdit = async () => { await onSave({ donationWallets: wallets.map((w) => String(w.id) === editingId ? editData : w) }); setEditingId(null); };
  const addWallet = async () => { if (!newWallet.network || !newWallet.token || !newWallet.address) return; const id = `${newWallet.token.toLowerCase()}-${newWallet.network.toLowerCase().replace(/\s/g, '')}`; await onSave({ donationWallets: [...wallets, { ...newWallet, id, enabled: true }] }); setNewWallet({ network: '', token: '', address: '', qrImage: '' }); };
  const removeWallet = async (id: string) => { await onSave({ donationWallets: wallets.filter((w) => String(w.id) !== id) }); };
  const toggleWallet = async (id: string) => { await onSave({ donationWallets: wallets.map((w) => String(w.id) === id ? { ...w, enabled: !(w as Record<string, boolean>).enabled } : w) }); };

  return (
    <Card>
      <CardHeader><CardTitle>Donation Wallets ({wallets.length})</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg border bg-muted/30">
          <p className="text-sm font-medium mb-2">Add New Wallet</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <Input placeholder="Network (e.g., Bitcoin)" value={newWallet.network} onChange={(e) => setNewWallet({ ...newWallet, network: e.target.value })} />
            <Input placeholder="Token (e.g., BTC)" value={newWallet.token} onChange={(e) => setNewWallet({ ...newWallet, token: e.target.value })} />
          </div>
          <div className="flex gap-2 mb-2">
            <Input placeholder="Wallet Address" value={newWallet.address} onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })} className="flex-1" />
            <Input placeholder="QR Image URL (optional)" value={newWallet.qrImage} onChange={(e) => setNewWallet({ ...newWallet, qrImage: e.target.value })} className="flex-1" />
          </div>
          <p className="text-xs text-muted-foreground mb-2">QR Image URL chhod dein to wallet address se auto QR generate hoga</p>
          <Button onClick={addWallet} variant="bitcoin"><Plus className="h-4 w-4 mr-1" />Add Wallet</Button>
        </div>
        <div className="space-y-2">
          {wallets.map((w) => (
            <div key={String(w.id)} className="p-3 rounded-lg border">
              {editingId === String(w.id) ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input placeholder="Network" value={String(editData.network || '')} onChange={(e) => setEditData({ ...editData, network: e.target.value })} />
                    <Input placeholder="Token" value={String(editData.token || '')} onChange={(e) => setEditData({ ...editData, token: e.target.value })} />
                  </div>
                  <Input placeholder="Wallet Address" value={String(editData.address || '')} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
                  <Input placeholder="QR Image URL (optional)" value={String(editData.qrImage || '')} onChange={(e) => setEditData({ ...editData, qrImage: e.target.value })} />
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm" variant="bitcoin"><Save className="h-4 w-4 mr-1" />Save</Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(w as Record<string, string>).qrImage ? (<img src={String((w as Record<string, string>).qrImage)} alt="QR" className="w-12 h-12 rounded-lg object-cover border" />) : (<div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">{String(w.token)}</div>)}
                    <div><p className="font-medium">{String(w.token)} ({String(w.network)})</p><p className="text-xs text-muted-foreground truncate max-w-xs">{String(w.address)}</p></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={(w as Record<string, boolean>).enabled ? 'green' : 'secondary'}>{(w as Record<string, boolean>).enabled ? 'Active' : 'Disabled'}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(w as Record<string, unknown>)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleWallet(String(w.id))}><Check className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => removeWallet(String(w.id))}><Trash2 className="h-4 w-4 text-crypto-red" /></Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SEOSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const seo = (data.seoSettings as Record<string, string>) || {};
  const [formData, setFormData] = useState({ title: seo.title || '', description: seo.description || '', keywords: seo.keywords || '', ogImage: seo.ogImage || '' });
  useEffect(() => { setFormData({ title: seo.title || '', description: seo.description || '', keywords: seo.keywords || '', ogImage: seo.ogImage || '' }); }, [seo]);
  const handleSave = () => { onSave({ seoSettings: formData }); };
  return (
    <Card><CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader><CardContent className="space-y-4">
      <div><label className="text-sm font-medium">Site Title</label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
      <div><label className="text-sm font-medium">Description</label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
      <div><label className="text-sm font-medium">Keywords</label><Input value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} /></div>
      <div><label className="text-sm font-medium">OG Image URL</label><Input value={formData.ogImage} onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })} /></div>
      <Button onClick={handleSave} variant="bitcoin"><Save className="h-4 w-4 mr-2" />Save</Button>
    </CardContent></Card>
  );
}

function LegalSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const legal = (data.legalPages as Record<string, string>) || {};
  const [active, setActive] = useState('privacy-policy');
  const [content, setContent] = useState(legal['privacy-policy'] || '');
  useEffect(() => { setContent(legal[active] || ''); }, [active, legal]);
  const handleSave = () => { onSave({ legalPages: { ...legal, [active]: content } }); };
  return (
    <Card><CardHeader><CardTitle>Legal Pages</CardTitle></CardHeader><CardContent className="space-y-4">
      <div className="flex gap-2">{['privacy-policy', 'terms', 'disclaimer'].map((p) => (<Button key={p} variant={active === p ? 'default' : 'outline'} size="sm" onClick={() => setActive(p)}>{p.replace('-', ' ')}</Button>))}</div>
      <textarea className="input min-h-[400px] resize-none font-mono text-xs" value={content} onChange={(e) => setContent(e.target.value)} />
      <Button onClick={handleSave} variant="bitcoin"><Save className="h-4 w-4 mr-2" />Save</Button>
    </CardContent></Card>
  );
}

function NotificationsSection() {
  return (<Card><CardHeader><CardTitle>Notifications</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">No notifications yet.</p></CardContent></Card>);
}

function LogsSection() {
  return (<Card><CardHeader><CardTitle>Activity Logs</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Logs will appear here.</p></CardContent></Card>);
}

function BackupsSection() {
  return (<Card><CardHeader><CardTitle>Backups</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Data is stored on JSONBin. Manual backup not needed.</p></CardContent></Card>);
}

function SecuritySection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const admin = (data.adminSettings as Record<string, boolean>) || {};
  const [enable2FA, setEnable2FA] = useState(admin.twoFactorEnabled || false);
  useEffect(() => { setEnable2FA(admin.twoFactorEnabled || false); }, [admin.twoFactorEnabled]);
  const toggle2FA = async () => { const updated = !enable2FA; setEnable2FA(updated); await onSave({ adminSettings: { ...(data.adminSettings as Record<string, unknown>), twoFactorEnabled: updated } }); };
  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>Security</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg border"><div><p className="font-medium">Two-Factor Authentication</p><p className="text-sm text-muted-foreground">{enable2FA ? 'Enabled' : 'Disabled'}</p></div><Badge variant={enable2FA ? 'green' : 'secondary'}>{enable2FA ? 'Active' : 'Inactive'}</Badge></div>
        <Button onClick={toggle2FA} variant={enable2FA ? 'outline' : 'bitcoin'} className="w-full">{enable2FA ? 'Disable 2FA' : 'Enable 2FA'}</Button>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Security Logs</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Security logs will appear here.</p></CardContent></Card>
    </div>
  );
}

function SettingsSection({ data, onSave }: { data: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void }) {
  const [formData, setFormData] = useState({ siteName: String(data.siteName || 'BitcoinUrdu'), siteDescription: String(data.siteDescription || ''), siteUrl: String(data.siteUrl || '') });
  useEffect(() => { setFormData({ siteName: String(data.siteName || 'BitcoinUrdu'), siteDescription: String(data.siteDescription || ''), siteUrl: String(data.siteUrl || '') }); }, [data.siteName, data.siteDescription, data.siteUrl]);
  const handleSave = () => { onSave(formData); };
  return (
    <Card><CardHeader><CardTitle>Site Settings</CardTitle></CardHeader><CardContent className="space-y-4">
      <div><label className="text-sm font-medium">Site Name</label><Input value={formData.siteName} onChange={(e) => setFormData({ ...formData, siteName: e.target.value })} /></div>
      <div><label className="text-sm font-medium">Description</label><Input value={formData.siteDescription} onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })} /></div>
      <div><label className="text-sm font-medium">Site URL</label><Input value={formData.siteUrl} onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })} /></div>
      <Button onClick={handleSave} variant="bitcoin"><Save className="h-4 w-4 mr-2" />Save</Button>
    </CardContent></Card>
  );
}
