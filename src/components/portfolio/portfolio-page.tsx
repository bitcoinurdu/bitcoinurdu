'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores';
import { formatCurrency, formatPercent, downloadCSV, generateId } from '@/lib/utils/helpers';
import {
  loadLocalPortfolio,
  addLocalAsset,
  removeLocalAsset,
  updateLocalAsset,
  calculatePortfolioPNL,
  syncLocalToCloud,
} from '@/lib/portfolio/local-sync';
import { savePortfolioToCloud, loadPortfolioFromCloud } from '@/lib/auth/cloud';
import type { LocalCoin } from '@/hooks/use-coins';
import {
  Plus,
  Trash2,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  DollarSign,
  Percent,
  Clock,
  Info,
  Search,
  Cloud,
  CheckCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#F7931A', '#627EEA', '#0ECB81', '#F6465D', '#7B61FF', '#1E88E5', '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'];

const texts: Record<string, Record<string, string>> = {
  roman: {
    title: 'Portfolio Tracker',
    desc: 'Apni crypto investments ko live prices ke sath track karein.',
    export: 'Export CSV',
    addAsset: 'Asset Add Karein',
    addAssetTitle: 'Asset Add Karein',
    coinName: 'Coin ka naam (e.g., Bitcoin)',
    symbol: 'Symbol (e.g., BTC)',
    quantity: 'Miqdar',
    buyPrice: 'Khareed Price (USD)',
    addToPortfolio: 'Portfolio Mein Add Karein',
    storageTitle: 'Data Storage Info',
    storageDesc: 'Aapka portfolio data aapke browser ke localStorage mein saved hai. Login karne par cloud mein sync ho jayega.',
    totalInvested: 'Total Invested',
    currentValue: 'Current Value',
    updating: 'Prices update ho rahi hain...',
    totalPnl: 'Total PNL',
    assets: 'Assets',
    bestPerformer: 'Best Performer',
    worstPerformer: 'Worst Performer',
    holdings: 'Holdings',
    allocation: 'Allocation',
    noAssets: 'Abhi koi asset nahi hai',
    noAssetsDesc: 'Apna pehla crypto asset add karein taake live prices ke sath portfolio track kar sakein.',
    trackInvestments: 'Investments Track Karein',
    trackInvestmentsDesc: 'Apni crypto holdings ek jagah monitor karein.',
    livePrices: 'Live Prices',
    livePricesDesc: 'Local database (15,984 coins) se real-time prices.',
    pnlAnalysis: 'PNL Analysis',
    pnlAnalysisDesc: 'Apne munafa aur nuksan ek nazar mein dekhein.',
    searchCoins: 'Coin search karein...',
    selectCoin: 'Coin select karein',
    syncCloud: 'Cloud Sync',
    syncDesc: 'Login karein taake portfolio kisi bhi device se access ho.',
  },
  ur: {
    title: 'پورٹ فولیو ٹریکر',
    desc: 'لائیو قیمتوں کے ساتھ اپنی کرپٹو سرمایہ کاری کو ٹریک کریں۔',
    export: 'ایکسپورٹ CSV',
    addAsset: 'اثاثہ شامل کریں',
    addAssetTitle: 'اثاثہ شامل کریں',
    coinName: 'سکے کا نام',
    symbol: 'علامت',
    quantity: 'مقدار',
    buyPrice: 'خرید قیمت (USD)',
    addToPortfolio: 'پورٹ فولیو میں شامل کریں',
    storageTitle: 'ڈیٹا اسٹوریج',
    storageDesc: 'براؤزر localStorage میں محفوظ۔ لاگن پر کلاؤڈ سنک۔',
    totalInvested: 'کل سرمایہ کاری',
    currentValue: 'موجودہ قیمت',
    updating: 'قیمتیں اپڈیٹ...',
    totalPnl: 'کل منافع/نقصان',
    assets: 'اثاثے',
    bestPerformer: 'بہترین',
    worstPerformer: 'کمترین',
    holdings: 'ہولڈنگز',
    allocation: 'تقسیم',
    noAssets: 'کوئی اثاثہ نہیں',
    noAssetsDesc: 'پہلا اثاثہ شامل کریں۔',
    trackInvestments: 'سرمایہ کاری ٹریک',
    trackInvestmentsDesc: 'ایک جگہ مانیٹر کریں۔',
    livePrices: 'لائیو قیمتیں',
    livePricesDesc: '15,984 coins لوکل ڈیٹابیس۔',
    pnlAnalysis: 'منافع/نقصان',
    pnlAnalysisDesc: 'ایک نظر میں دیکھیں۔',
    searchCoins: 'تلاش...',
    selectCoin: 'منتخب کریں',
    syncCloud: 'کلاؤڈ سنک',
    syncDesc: 'لاگن کریں۔',
  },
  ps: { title: 'پورټ فولیو ټریکر', desc: 'خپله پانګونه ټریک کړئ.', export: 'ایکسپورټ', addAsset: 'زیات کړئ', addAssetTitle: 'زیات کړئ', coinName: 'نوم', symbol: 'نښه', quantity: 'مقدار', buyPrice: 'بیه', addToPortfolio: 'زیات کړئ', storageTitle: 'زیرمه', storageDesc: 'localStorage کې خوندي.', totalInvested: 'ټوله پانګونه', currentValue: 'اوسنۍ بیه', updating: 'اپډیټ...', totalPnl: 'ګټه/زیان', assets: 'شتمنۍ', bestPerformer: 'غوره', worstPerformer: 'کمترین', holdings: 'هولډینګز', allocation: 'ویش', noAssets: 'نشته', noAssetsDesc: 'زیات کړئ.', trackInvestments: 'ټریک', trackInvestmentsDesc: 'وګورئ.', livePrices: 'بیې', livePricesDesc: 'لوکل ډاټابیس.', pnlAnalysis: 'تحلیل', pnlAnalysisDesc: 'وګورئ.', searchCoins: 'لټون...', selectCoin: 'وټاکئ', syncCloud: 'سنک', syncDesc: 'ننوځئ.' },
  sd: { title: 'پورٽ فوليو ٽريڪر', desc: 'سيڙپڪاري ٽريڪ ڪريو.', export: 'ايڪسپورٽ', addAsset: 'شامل ڪريو', addAssetTitle: 'شامل ڪريو', coinName: 'نالو', symbol: 'علامت', quantity: 'مقدار', buyPrice: 'قيمت', addToPortfolio: 'شامل ڪريو', storageTitle: 'اسٽوريج', storageDesc: 'localStorage ۾ محفوظ.', totalInvested: 'ڪل سيڙپڪاري', currentValue: 'موجوده قيمت', updating: 'اپڊيٽ...', totalPnl: 'نفعو/نقصان', assets: 'اثاثا', bestPerformer: 'بهترين', worstPerformer: 'گهٽ', holdings: 'هولڊنگز', allocation: 'ورڇ', noAssets: 'ناهي', noAssetsDesc: 'شامل ڪريو.', trackInvestments: 'ٽريڪ', trackInvestmentsDesc: 'ڏسو.', livePrices: 'قيمتون', livePricesDesc: 'لوڪل ڊيٽابيس.', pnlAnalysis: 'تجزيو', pnlAnalysisDesc: 'ڏسو.', searchCoins: 'ڳوليو...', selectCoin: 'چونڊيو', syncCloud: 'سنڪ', syncDesc: 'لاگ ان.' },
  en: {
    title: 'Portfolio Tracker',
    desc: 'Track your crypto investments with live prices.',
    export: 'Export CSV',
    addAsset: 'Add Asset',
    addAssetTitle: 'Add Asset',
    coinName: 'Coin Name (e.g., Bitcoin)',
    symbol: 'Symbol (e.g., BTC)',
    quantity: 'Quantity',
    buyPrice: 'Buy Price (USD)',
    addToPortfolio: 'Add to Portfolio',
    storageTitle: 'Data Storage Info',
    storageDesc: 'Your portfolio is saved in browser localStorage. Login to sync to cloud.',
    totalInvested: 'Total Invested',
    currentValue: 'Current Value',
    updating: 'Updating prices...',
    totalPnl: 'Total PNL',
    assets: 'Assets',
    bestPerformer: 'Best Performer',
    worstPerformer: 'Worst Performer',
    holdings: 'Holdings',
    allocation: 'Allocation',
    noAssets: 'No assets yet',
    noAssetsDesc: 'Add your first crypto asset to start tracking.',
    trackInvestments: 'Track Investments',
    trackInvestmentsDesc: 'Monitor your crypto holdings in one place.',
    livePrices: 'Live Prices',
    livePricesDesc: 'Real-time prices from local database (15,984 coins).',
    pnlAnalysis: 'PNL Analysis',
    pnlAnalysisDesc: 'See your profits and losses at a glance.',
    searchCoins: 'Search coins...',
    selectCoin: 'Select a coin',
    syncCloud: 'Cloud Sync',
    syncDesc: 'Login to access portfolio from any device.',
  },
  hi: { title: 'पोर्टफोलियो ट्रैकर', desc: 'लाइव कीमतों के साथ अपने क्रिप्टो निवेशों को ट्रैक करें।', export: 'CSV निर्यात', addAsset: 'संपत्ति जोड़ें', addAssetTitle: 'संपत्ति जोड़ें', coinName: 'सिक्का का नाम', symbol: 'प्रतीक', quantity: 'मात्रा', buyPrice: 'खरीद मूल्य', addToPortfolio: 'पोर्टफोलियो में जोड़ें', storageTitle: 'डेटा भंडारण', storageDesc: 'आपका पोर्टफोलियो ब्राउज़र localStorage में सहेजा गया है।', totalInvested: 'कुल निवेश', currentValue: 'वर्तमान मूल्य', updating: 'मूल्य अपडेट हो रहे हैं...', totalPnl: 'कुल लाभ/हानि', assets: 'संपत्तियां', bestPerformer: 'सर्वश्रेष्ठ', worstPerformer: 'सबसे खराब', holdings: 'होल्डिंग्स', allocation: 'आवंटन', noAssets: 'अभी कोई संपत्ति नहीं', noAssetsDesc: 'ट्रैकिंग शुरू करने के लिए अपनी पहली क्रिप्टो संपत्ति जोड़ें।', trackInvestments: 'निवेश ट्रैक करें', trackInvestmentsDesc: 'अपनी क्रिप्टो होल्डिंग्स को एक जगह मॉनिटर करें।', livePrices: 'लाइव कीमतें', livePricesDesc: 'स्थानीय डेटाबेस (15,984 सिक्के) से रीयल-टाइम कीमतें।', pnlAnalysis: 'लाभ/हानि विश्लेषण', pnlAnalysisDesc: 'अपने लाभ और हानि को एक नज़र में देखें।', searchCoins: 'सिक्के खोजें...', selectCoin: 'एक सिक्का चुनें', syncCloud: 'क्लाउड सिंक', syncDesc: 'किसी भी डिवाइस से पोर्टफोलियो एक्सेस करने के लिए लॉगिन करें।' },
  fr: { title: 'Gestionnaire de Portefeuille', desc: 'Suivez vos investissements crypto avec des prix en direct.', export: 'Exporter CSV', addAsset: 'Ajouter un actif', addAssetTitle: 'Ajouter un actif', coinName: 'Nom de la pièce', symbol: 'Symbole', quantity: 'Quantité', buyPrice: "Prix d'achat", addToPortfolio: 'Ajouter au portefeuille', storageTitle: 'Stockage des données', storageDesc: 'Votre portefeuille est sauvegardé dans le localStorage du navigateur.', totalInvested: 'Total investi', currentValue: 'Valeur actuelle', updating: 'Mise à jour des prix...', totalPnl: 'PNL total', assets: 'Actifs', bestPerformer: 'Meilleur', worstPerformer: 'Pire', holdings: 'Portefeuille', allocation: 'Répartition', noAssets: 'Aucun actif', noAssetsDesc: 'Ajoutez votre premier actif crypto pour commencer.', trackInvestments: 'Suivi des investissements', trackInvestmentsDesc: 'Surveillez vos avoirs crypto en un seul endroit.', livePrices: 'Prix en direct', livePricesDesc: 'Prix en temps réel depuis la base de données locale.', pnlAnalysis: 'Analyse PNL', pnlAnalysisDesc: "Voyez vos profits et pertes en un coup d'oeil.", searchCoins: 'Rechercher des pièces...', selectCoin: 'Sélectionner une pièce', syncCloud: 'Synchronisation Cloud', syncDesc: 'Connectez-vous pour accéder depuis n\'importe quel appareil.' },
  de: { title: 'Portfolio-Tracker', desc: 'Verfolgen Sie Ihre Krypto-Investitionen mit Live-Preisen.', export: 'CSV exportieren', addAsset: 'Asset hinzufügen', addAssetTitle: 'Asset hinzufügen', coinName: 'Coin-Name', symbol: 'Symbol', quantity: 'Menge', buyPrice: 'Kaufpreis', addToPortfolio: 'Zum Portfolio hinzufügen', storageTitle: 'Datenspeicher', storageDesc: 'Ihr Portfolio wird im Browser localStorage gespeichert.', totalInvested: 'Gesamt investiert', currentValue: 'Aktueller Wert', updating: 'Preise werden aktualisiert...', totalPnl: 'Gesamt-PNL', assets: 'Vermögenswerte', bestPerformer: 'Bester', worstPerformer: 'Schlechtester', holdings: 'Bestände', allocation: 'Aufteilung', noAssets: 'Noch keine Assets', noAssetsDesc: 'Fügen Sie Ihr erstes Krypto-Asset hinzu.', trackInvestments: 'Investitionen verfolgen', trackInvestmentsDesc: 'Behalten Sie Ihre Krypto-Bestände an einem Ort im Blick.', livePrices: 'Live-Preise', livePricesDesc: 'Echtzeit-Preise aus lokaler Datenbank.', pnlAnalysis: 'PNL-Analyse', pnlAnalysisDesc: 'Sehen Sie Ihre Gewinne und Verluste auf einen Blick.', searchCoins: 'Coins suchen...', selectCoin: 'Coin auswählen', syncCloud: 'Cloud-Sync', syncDesc: 'Melden Sie sich an, um von jedem Gerät aus zuzugreifen.' },
  tr: { title: 'Portföy Takip', desc: 'Kripto yatırımlarınızı canlı fiyatlarla takip edin.', export: 'CSV Dışa Aktar', addAsset: 'Varlık Ekle', addAssetTitle: 'Varlık Ekle', coinName: 'Coin Adı', symbol: 'Sembol', quantity: 'Miktar', buyPrice: 'Alış Fiyatı', addToPortfolio: 'Portföye Ekle', storageTitle: 'Veri Depolama', storageDesc: 'Portföyünüz tarayıcı localStorage\'ında kaydedilir.', totalInvested: 'Toplam Yatırım', currentValue: 'Güncel Değer', updating: 'Fiyatlar güncelleniyor...', totalPnl: 'Toplam K/Z', assets: 'Varlıklar', bestPerformer: 'En İyi', worstPerformer: 'En Kötü', holdings: 'Tutulanlar', allocation: 'Dağılım', noAssets: 'Henüz varlık yok', noAssetsDesc: 'İlk kripto varlığınızı ekleyin.', trackInvestments: 'Yatırımları Takip Et', trackInvestmentsDesc: 'Kripto varlıklarınızı tek yerden izleyin.', livePrices: 'Canlı Fiyatlar', livePricesDesc: 'Yerel veritabanından gerçek zamanlı fiyatlar.', pnlAnalysis: 'K/Z Analizi', pnlAnalysisDesc: 'Kâr ve zararlarınızı bir bakışta görün.', searchCoins: 'Coin ara...', selectCoin: 'Coin Seç', syncCloud: 'Bulut Senk.', syncDesc: 'Her cihazdan erişmek için giriş yapın.' },
  ru: { title: 'Трекер портфеля', desc: 'Отслеживайте свои криптоинвестиции с живыми ценами.', export: 'Экспорт CSV', addAsset: 'Добавить актив', addAssetTitle: 'Добавить актив', coinName: 'Название монеты', symbol: 'Символ', quantity: 'Количество', buyPrice: 'Цена покупки', addToPortfolio: 'Добавить в портфель', storageTitle: 'Хранение данных', storageDesc: 'Ваш портфель сохраняется в localStorage браузера.', totalInvested: 'Всего инвестировано', currentValue: 'Текущая стоимость', updating: 'Обновление цен...', totalPnl: 'Общая PNL', assets: 'Активы', bestPerformer: 'Лучший', worstPerformer: 'Худший', holdings: 'Позиции', allocation: 'Распределение', noAssets: 'Нет активов', noAssetsDesc: 'Добавьте свой первый криптоактив.', trackInvestments: 'Отслеживание инвестиций', trackInvestmentsDesc: 'Следите за криптоактивами в одном месте.', livePrices: 'Живые цены', livePricesDesc: 'Цены в реальном времени из локальной базы данных.', pnlAnalysis: 'Анализ PNL', pnlAnalysisDesc: 'Просматривайте прибыль и убытки одним взглядом.', searchCoins: 'Поиск монет...', selectCoin: 'Выбрать монету', syncCloud: 'Облачная синх.', syncDesc: 'Войдите для доступа с любого устройства.' },
  zh: { title: '投资组合追踪器', desc: '使用实时价格追踪您的加密货币投资。', export: '导出 CSV', addAsset: '添加资产', addAssetTitle: '添加资产', coinName: '币种名称', symbol: '符号', quantity: '数量', buyPrice: '买入价格', addToPortfolio: '添加到投资组合', storageTitle: '数据存储', storageDesc: '您的投资组合保存在浏览器 localStorage 中。', totalInvested: '总投资', currentValue: '当前价值', updating: '价格更新中...', totalPnl: '总盈亏', assets: '资产', bestPerformer: '最佳表现', worstPerformer: '最差表现', holdings: '持有', allocation: '分配', noAssets: '暂无资产', noAssetsDesc: '添加您的第一个加密资产以开始追踪。', trackInvestments: '追踪投资', trackInvestmentsDesc: '在一个地方监控您的加密资产。', livePrices: '实时价格', livePricesDesc: '来自本地数据库的实时价格（15,984 种币）。', pnlAnalysis: '盈亏分析', pnlAnalysisDesc: '一目了然地查看您的利润和亏损。', searchCoins: '搜索币种...', selectCoin: '选择币种', syncCloud: '云同步', syncDesc: '登录以从任何设备访问投资组合。' },
  ja: { title: 'ポートフォリオトラッカー', desc: 'ライブ価格で暗号資産の投資を追跡します。', export: 'CSVエクスポート', addAsset: '資産を追加', addAssetTitle: '資産を追加', coinName: 'コイン名', symbol: 'シンボル', quantity: '数量', buyPrice: '購入価格', addToPortfolio: 'ポートフォリオに追加', storageTitle: 'データストレージ', storageDesc: 'ポートフォリオはブラウザのlocalStorageに保存されます。', totalInvested: '総投資額', currentValue: '現在の価値', updating: '価格を更新中...', totalPnl: '総損益', assets: '資産', bestPerformer: '最高', worstPerformer: '最低', holdings: '保有', allocation: '配分', noAssets: 'まだ資産がありません', noAssetsDesc: '最初の暗号資産を追加して追跡を開始しましょう。', trackInvestments: '投資を追跡', trackInvestmentsDesc: '暗号資産の保有を一箇所で監視。', livePrices: 'ライブ価格', livePricesDesc: 'ローカルデータベースからのリアルタイム価格。', pnlAnalysis: '損益分析', pnlAnalysisDesc: '利益と損失を一目で確認。', searchCoins: 'コインを検索...', selectCoin: 'コインを選択', syncCloud: 'クラウド同期', syncDesc: 'ログインして任意のデバイスからアクセス。' },
};

export function PortfolioPage() {
  const { portfolio, addPortfolioAsset, removePortfolioAsset, setPortfolio, currency, language, user, watchlist, toggleWatchlist } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', symbol: '', quantity: '', buyPrice: '', coinGeckoId: '' });
  const [livePrices, setLivePrices] = useState<Record<string, { current_price: number; price_change_percentage_24h?: number }>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [coinSearch, setCoinSearch] = useState('');
  const [coinResults, setCoinResults] = useState<{ id: string; name: string; symbol: string; thumb?: string }[]>([]);
  const [searchingCoins, setSearchingCoins] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const t = texts[language] || texts.en;

  useEffect(() => {
    const local = loadLocalPortfolio();
    if (local.assets.length > 0 && portfolio.length === 0) {
      setPortfolio(local.assets);
    }
  }, []);

  useEffect(() => {
    if (portfolio.length === 0) return;
    setLoadingPrices(true);
    fetch('/data/coins-market.json')
      .then((r) => r.json())
      .then((data) => {
        const priceMap: Record<string, { current_price: number; price_change_percentage_24h?: number }> = {};
        for (const page of data.pages || []) {
          for (const coin of page.coins || []) {
            priceMap[coin.id] = {
              current_price: coin.current_price,
              price_change_percentage_24h: coin.price_change_percentage_24h,
            };
          }
        }
        setLivePrices(priceMap);
        setLoadingPrices(false);
      })
      .catch(() => setLoadingPrices(false));
  }, [portfolio.length]);

  useEffect(() => {
    if (portfolio.length > 0) {
      const local = loadLocalPortfolio();
      if (JSON.stringify(local.assets) !== JSON.stringify(portfolio)) {
        // Keep local in sync with store
      }
    }
  }, [portfolio]);

  useEffect(() => {
    if (!coinSearch || coinSearch.length < 2) {
      setCoinResults([]);
      return;
    }
    setSearchingCoins(true);
    fetch('/data/coins-market.json')
      .then((r) => r.json())
      .then((data) => {
        const q = coinSearch.toLowerCase();
        const results: typeof coinResults = [];
        const seen = new Set<string>();
        for (const page of data.pages || []) {
          for (const coin of page.coins || []) {
            if (seen.has(coin.id)) continue;
            if (coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q) || coin.id.includes(q)) {
              results.push({ id: coin.id, name: coin.name, symbol: coin.symbol, thumb: coin.image });
              seen.add(coin.id);
              if (results.length >= 10) break;
            }
          }
          if (results.length >= 10) break;
        }
        setCoinResults(results);
        setSearchingCoins(false);
      })
      .catch(() => setSearchingCoins(false));
  }, [coinSearch]);

  const pnlData = calculatePortfolioPNL(portfolio, livePrices);

  const bestPerformer = pnlData.assets.length > 0
    ? pnlData.assets.reduce((best, a) => (!best || a.pnlPercent > best.pnlPercent ? a : best), null as typeof pnlData.assets[0] | null)
    : null;

  const worstPerformer = pnlData.assets.length > 0
    ? pnlData.assets.reduce((worst, a) => (!worst || a.pnlPercent < worst.pnlPercent ? a : worst), null as typeof pnlData.assets[0] | null)
    : null;

  const handleSelectCoin = (coin: typeof coinResults[0]) => {
    setFormData({
      ...formData,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      coinGeckoId: coin.id,
    });
    setCoinSearch('');
    setCoinResults([]);
  };

  const handleAdd = () => {
    if (!formData.name || !formData.quantity || !formData.buyPrice) return;

    const quantity = parseFloat(formData.quantity);
    const buyPrice = parseFloat(formData.buyPrice);

    const newAsset = {
      id: generateId(),
      coin_id: formData.coinGeckoId || formData.symbol.toLowerCase(),
      name: formData.name,
      symbol: formData.symbol.toUpperCase(),
      quantity,
      buy_price: buyPrice,
      current_price: buyPrice,
      total_invested: buyPrice * quantity,
      current_value: buyPrice * quantity,
      pnl: 0,
      pnl_percent: 0,
      added_at: new Date().toISOString(),
    };

    addPortfolioAsset(newAsset);
    addLocalAsset(newAsset);

    setFormData({ name: '', symbol: '', quantity: '', buyPrice: '', coinGeckoId: '' });
    setDialogOpen(false);
  };

  const handleRemove = (assetId: string) => {
    removePortfolioAsset(assetId);
    removeLocalAsset(assetId);
  };

  const handleExport = () => {
    const data = pnlData.assets.map((a) => ({
      Name: a.name,
      Symbol: a.symbol,
      Quantity: a.quantity,
      'Buy Price': a.buy_price,
      'Current Price': a.currentPrice,
      'Total Invested': a.total_invested,
      'Current Value': a.currentValue,
      'PNL': a.pnl,
      'PNL %': a.pnlPercent,
    }));
    downloadCSV(data, 'bitcoinurdu-portfolio');
  };

  const handleCloudSync = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    setSyncStatus('syncing');
    try {
      const token = localStorage.getItem('bu_auth_token');
      if (!token) { setSyncStatus('error'); return; }

      const userId = token.split(':')[0];
      const cloudData = await loadPortfolioFromCloud(userId);
      const merged = await syncLocalToCloud(
        userId,
        portfolio,
        watchlist,
        (cloudData?.portfolio as typeof portfolio) || [],
        cloudData?.watchlist || []
      );

      await savePortfolioToCloud(userId, merged.mergedAssets, merged.mergedWatchlist);
      setPortfolio(merged.mergedAssets);
      merged.mergedWatchlist.forEach((id) => {
        if (!watchlist.includes(id)) toggleWatchlist(id);
      });
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  };

  const chartData = pnlData.assets.map((a) => ({
    name: a.symbol,
    value: a.currentValue,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="h-8 w-8 text-bitcoin" />
            {t.title}
          </h1>
          <p className="text-muted-foreground mt-1">{t.desc}</p>
        </div>
        <div className="flex gap-2">
          {user && (
            <Button variant="outline" onClick={handleCloudSync} disabled={syncStatus === 'syncing'}>
              <Cloud className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Synced' : t.syncCloud}
            </Button>
          )}
          {!user && (
            <Button variant="outline" onClick={() => (window.location.href = '/auth')}>
              <Cloud className="h-4 w-4 mr-2" />
              Login to Sync
            </Button>
          )}
          <Button variant="outline" onClick={handleExport} disabled={!portfolio.length}>
            <Download className="h-4 w-4 mr-2" />
            {t.export}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="bitcoin">
                <Plus className="h-4 w-4 mr-2" />
                {t.addAsset}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.addAssetTitle}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={coinSearch}
                    onChange={(e) => setCoinSearch(e.target.value)}
                    placeholder={t.searchCoins}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
                  />
                  {coinResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {coinResults.map((coin) => (
                        <button
                          key={coin.id}
                          onClick={() => handleSelectCoin(coin)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left"
                        >
                          <img src={coin.thumb || ''} alt="" className="w-5 h-5 rounded-full" />
                          <span className="text-sm font-medium">{coin.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{coin.symbol.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchingCoins && (
                    <div className="absolute z-10 w-full mt-1 bg-card border rounded-lg shadow-lg p-3 text-center text-sm text-muted-foreground">
                      Searching 15,984 coins...
                    </div>
                  )}
                </div>
                <Input placeholder={t.coinName} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Input placeholder={t.symbol} value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} />
                <Input type="number" placeholder={t.quantity} value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                <Input type="number" placeholder={t.buyPrice} value={formData.buyPrice} onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })} />
                <Button onClick={handleAdd} className="w-full" variant="bitcoin">
                  {t.addToPortfolio}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-bitcoin/20 bg-bitcoin/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-bitcoin shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">{t.storageTitle}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.storageDesc}</p>
              {user && (
                <div className="flex items-center gap-1 mt-1 text-xs text-crypto-green">
                  <CheckCircle className="h-3 w-3" /> Logged in as {user.name}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t.totalInvested}</p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(pnlData.totalInvested, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t.currentValue}</p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(pnlData.totalValue, currency)}</p>
            {loadingPrices && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {t.updating}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t.totalPnl}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${pnlData.totalPnl >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {pnlData.totalPnl >= 0 ? '+' : ''}{formatCurrency(pnlData.totalPnl, currency)}
              </p>
              <Badge variant={pnlData.totalPnl >= 0 ? 'green' : 'red'}>
                {formatPercent(Math.abs(pnlData.totalPnlPercent))}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t.assets}</p>
            </div>
            <p className="text-2xl font-bold">{portfolio.length}</p>
          </CardContent>
        </Card>
      </div>

      {portfolio.length > 0 && bestPerformer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-crypto-green/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-4 w-4 text-crypto-green" />
                <p className="text-sm text-muted-foreground">{t.bestPerformer}</p>
              </div>
              <p className="text-xl font-bold">{bestPerformer.name}</p>
              <Badge variant="green" className="mt-1">+{formatPercent(Math.abs(bestPerformer.pnlPercent))}</Badge>
            </CardContent>
          </Card>
          {worstPerformer && (
            <Card className="border-crypto-red/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownRight className="h-4 w-4 text-crypto-red" />
                  <p className="text-sm text-muted-foreground">{t.worstPerformer}</p>
                </div>
                <p className="text-xl font-bold">{worstPerformer.name}</p>
                <Badge variant="red" className="mt-1">{formatPercent(Math.abs(worstPerformer.pnlPercent))}</Badge>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {portfolio.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t.holdings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pnlData.assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">{asset.quantity} {asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(asset.currentPrice, currency)}
                        {asset.priceChange24h !== undefined && (
                          <span className={`ml-2 ${asset.priceChange24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                            {asset.priceChange24h >= 0 ? '↑' : '↓'} {formatPercent(Math.abs(asset.priceChange24h))}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(asset.currentValue, currency)}</p>
                      <Badge variant={asset.pnl >= 0 ? 'green' : 'red'}>
                        {formatPercent(Math.abs(asset.pnlPercent))}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(asset.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.allocation}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                    {chartData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {chartData.map((item, i) => {
                  const total = chartData.reduce((sum, d) => sum + d.value, 0);
                  const percent = total > 0 ? (item.value / total) * 100 : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-muted-foreground">{formatPercent(percent)}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {portfolio.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t.noAssets}</h3>
            <p className="text-muted-foreground mb-4">{t.noAssetsDesc}</p>
            <Button variant="bitcoin" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t.addAsset}
            </Button>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-lg border">
                <p className="font-medium mb-1">{t.trackInvestments}</p>
                <p className="text-sm text-muted-foreground">{t.trackInvestmentsDesc}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="font-medium mb-1">{t.livePrices}</p>
                <p className="text-sm text-muted-foreground">{t.livePricesDesc}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="font-medium mb-1">{t.pnlAnalysis}</p>
                <p className="text-sm text-muted-foreground">{t.pnlAnalysisDesc}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
