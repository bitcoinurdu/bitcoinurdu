'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Globe,
  Wallet,
  User,
  LogOut,
  Bitcoin,
  Bell,
  X as XIcon,
  Zap,
  Gift,
  Briefcase,
} from 'lucide-react';
import { useAppStore } from '@/stores';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { LANGUAGES } from '@/lib/i18n';
import { CURRENCIES } from '@/lib/currency';
import { cn } from '@/lib/utils/helpers';

const navTexts: Record<string, { mainNav: { label: string; href: string }[]; dropdowns: { label: string; href: string; items: { label: string; href: string }[] }[] }> = {
  roman: {
    mainNav: [
      { label: '⛏️ Mining', href: '/mining' },
      { label: '💼 Jobs', href: '/jobs' },
      { label: '🚰 Faucet', href: '/faucet' },
    ],
    dropdowns: [
      {
        label: '🪙 Coins',
        href: '/coins',
        items: [
          { label: '🪙 Tamam Coins', href: '/coins' },
          { label: '🔥 Trending', href: '/coins/trending' },
          { label: '📈 Top Gainers', href: '/coins/gainers' },
          { label: '📉 Top Losers', href: '/coins/losers' },
          { label: '🆕 New Listings', href: '/coins/new' },
          { label: '📁 Categories', href: '/coins/categories' },
        ],
      },
{
  label: '🎁 Airdrops',
  href: '/airdrops',
  items: [
    { label: '🎁 Tamam Airdrops', href: '/airdrops' },
    { label: '✅ Active', href: '/airdrops/active' },
    { label: '📅 Upcoming', href: '/airdrops/upcoming' },
    { label: '✔️ Confirmed', href: '/airdrops/confirmed' },
    { label: '🔍 Airdrop Checker', href: '/airdrop-checker' },
    { label: '🚰 Faucet', href: '/faucet' },
    { label: '💼 Portfolio Tracker', href: '/portfolio' },
  ],
},
      {
        label: '📊 Markets',
        href: '/markets',
        items: [
          { label: '📊 Overview', href: '/markets' },
          { label: '🔥 Market Heatmap', href: '/markets/heatmap' },
          { label: '📈 Stocks', href: '/markets/stocks' },
          { label: '💱 Forex', href: '/markets/forex' },
          { label: '🏗️ Commodities', href: '/markets/commodities' },
          { label: '📉 Indices', href: '/markets/indices' },
          { label: '📊 Global Stats', href: '/markets/global' },
          { label: '🪙 Crypto', href: '/coins' },
          { label: '🔄 Converter', href: '/converter' },
        ],
      },
      {
        label: '📚 Resources',
        href: '#',
        items: [
          { label: '📚 Academy & Learning', href: '/learn-bitcoin' },
          { label: '✍️ News & Blog', href: '/blog' },
        ],
      },
    ],
  },
   ur: {
     mainNav: [
       { label: '⛏️ Mining', href: '/mining' },
       { label: 'Jobs', href: '/jobs' },
       { label: '🚰 Faucet', href: '/faucet' },
     ],
    dropdowns: [
      {
        label: 'کوائنز',
        href: '/coins',
        items: [
          { label: 'تمام کوائنز', href: '/coins' },
          { label: 'ٹرینڈنگ', href: '/coins/trending' },
          { label: 'ٹاپ گینرز', href: '/coins/gainers' },
          { label: 'ٹاپ لوزرز', href: '/coins/losers' },
          { label: 'نئی لسٹنگز', href: '/coins/new' },
          { label: 'کیٹیگریز', href: '/coins/categories' },
        ],
      },
      {
        label: 'ایئرڈراپس',
        href: '/airdrops',
        items: [
          { label: 'تمام ایئرڈراپس', href: '/airdrops' },
          { label: 'ایکٹو', href: '/airdrops/active' },
          { label: 'آنے والے', href: '/airdrops/upcoming' },
          { label: 'کنفرمڈ', href: '/airdrops/confirmed' },
          { label: 'ایئرڈراپ چیکر', href: '/airdrop-checker' },
          { label: 'پورٹ فولیو ٹریکر', href: '/portfolio' },
        ],
      },
      {
        label: 'مارکیٹس',
        href: '/markets',
        items: [
          { label: 'گلوبل مارکیٹ', href: '/markets' },
          { label: 'مارکیٹ ہیٹ میپ', href: '/markets/heatmap' },
          { label: 'اسٹاکس', href: '/markets/stocks' },
          { label: 'فاریکس', href: '/markets/forex' },
          { label: 'کموڈٹیز', href: '/markets/commodities' },
          { label: 'گلوبل اسٹیٹس', href: '/markets/global' },
        ],
      },
      {
        label: 'وسائل',
        href: '#',
        items: [
          { label: '📚 اکادمی اور سیکھیں', href: '/learn-bitcoin' },
          { label: '✍️ خبریں اور بلاگ', href: '/blog' },
        ],
      },
    ],
  },
  ps: {
     mainNav: [
       { label: '⛏️ Mining', href: '/mining' },
       { label: 'Jobs', href: '/jobs' },
       { label: '🚰 Faucet', href: '/faucet' },
     ],
    dropdowns: [
      {
        label: 'سکي',
        href: '/coins',
        items: [
          { label: 'ټول سکي', href: '/coins' },
          { label: 'رواجه', href: '/coins/trending' },
          { label: 'لوړه ګټه', href: '/coins/gainers' },
          { label: 'لوړه زیان', href: '/coins/losers' },
          { label: 'نوي لیستونه', href: '/coins/new' },
          { label: 'کټګورۍ', href: '/coins/categories' },
        ],
      },
      {
        label: 'ایرډراپس',
        href: '/airdrops',
        items: [
          { label: 'ټول ایرډراپس', href: '/airdrops' },
          { label: 'فعال', href: '/airdrops/active' },
          { label: 'راتلونکی', href: '/airdrops/upcoming' },
          { label: 'تصدیق شوی', href: '/airdrops/confirmed' },
          { label: 'ایرډراپ چیکر', href: '/airdrop-checker' },
          { label: 'پورټ فولیو', href: '/portfolio' },
        ],
      },
      {
        label: 'مارکیټونه',
        href: '/markets',
        items: [
          { label: 'نړیوال مارکیټ', href: '/markets' },
          { label: 'مارکیټ هیټ میپ', href: '/markets/heatmap' },
          { label: 'سټاکونه', href: '/markets/stocks' },
          { label: 'فاریکس', href: '/markets/forex' },
          { label: 'توکی', href: '/markets/commodities' },
          { label: 'نړیوال احصائیې', href: '/markets/global' },
        ],
      },
      {
        label: 'سرچینې',
        href: '#',
        items: [
          { label: '📚 اکاډمي او زده کړه', href: '/learn-bitcoin' },
          { label: '✍️ خبرونه او بلاګ', href: '/blog' },
        ],
      },
    ],
  },
   sd: {
     mainNav: [
       { label: '⛏️ Mining', href: '/mining' },
       { label: 'ڪم', href: '/jobs' },
       { label: '🚰 Faucet', href: '/faucet' },
     ],
    dropdowns: [
      {
        label: 'سڪا',
        href: '/coins',
        items: [
          { label: 'سڀ سڪا', href: '/coins' },
          { label: 'ٽرینڊنگ', href: '/coins/trending' },
          { label: 'وڌ ۾ وڌ نفعو', href: '/coins/gainers' },
          { label: 'وڌ ۾ وڌ نقصان', href: '/coins/losers' },
          { label: 'نوان لسٽنگ', href: '/coins/new' },
          { label: 'زمرا', href: '/coins/categories' },
        ],
      },
      {
        label: 'ایئرڊراپس',
        href: '/airdrops',
        items: [
          { label: 'سڀ ایئرڊراپس', href: '/airdrops' },
          { label: 'فعال', href: '/airdrops/active' },
          { label: 'اینڙڙ', href: '/airdrops/upcoming' },
          { label: 'تصدیق ٿیل', href: '/airdrops/confirmed' },
          { label: 'ایئرڊراپ چیکر', href: '/airdrop-checker' },
          { label: 'پورٽ فولیو', href: '/portfolio' },
        ],
      },
      {
        label: 'مارڪیٽون',
        href: '/markets',
        items: [
          { label: 'عالمي مارڪیٽ', href: '/markets' },
          { label: 'مارڪیٽ ہیٽ میپ', href: '/markets/heatmap' },
          { label: 'اسٽاڪس', href: '/markets/stocks' },
          { label: 'فاریکس', href: '/markets/forex' },
          { label: 'ڪموڊٽیز', href: '/markets/commodities' },
          { label: 'عالمي انگ اکر', href: '/markets/global' },
        ],
      },
      {
        label: 'وسيلا',
        href: '#',
        items: [
          { label: '📚 اڪيڊمي ۽ سکيا', href: '/learn-bitcoin' },
          { label: '✍️ خبرون ۽ بلاگ', href: '/blog' },
        ],
      },
    ],
  },
   es: {
     mainNav: [
       { label: '⛏️ Minería', href: '/mining' },
       { label: 'Empleos', href: '/jobs' },
       { label: '🚰 Faucet', href: '/faucet' },
     ],
    dropdowns: [
      {
        label: 'Monedas',
        href: '/coins',
        items: [
          { label: 'Todas las Monedas', href: '/coins' },
          { label: 'Tendencias', href: '/coins/trending' },
          { label: 'Mayores Ganancias', href: '/coins/gainers' },
          { label: 'Mayores Pérdidas', href: '/coins/losers' },
          { label: 'Nuevos Listados', href: '/coins/new' },
          { label: 'Categorías', href: '/coins/categories' },
        ],
      },
      {
        label: 'Airdrops',
        href: '/airdrops',
        items: [
          { label: 'Todos los Airdrops', href: '/airdrops' },
          { label: 'Activos', href: '/airdrops/active' },
          { label: 'Próximos', href: '/airdrops/upcoming' },
          { label: 'Confirmados', href: '/airdrops/confirmed' },
          { label: 'Verificador', href: '/airdrop-checker' },
          { label: 'Portafolio', href: '/portfolio' },
        ],
      },
      {
        label: 'Mercados',
        href: '/markets',
        items: [
          { label: 'Mercado Global', href: '/markets' },
          { label: 'Mapa de Calor', href: '/markets/heatmap' },
          { label: 'Acciones', href: '/markets/stocks' },
          { label: 'Forex', href: '/markets/forex' },
          { label: 'Materias Primas', href: '/markets/commodities' },
          { label: 'Estadísticas Globales', href: '/markets/global' },
        ],
      },
      {
        label: 'Recursos',
        href: '#',
        items: [
          { label: '📚 Academia y Aprendizaje', href: '/learn-bitcoin' },
          { label: '✍️ Noticias y Blog', href: '/blog' },
        ],
      },
    ],
  },
   ar: {
     mainNav: [
       { label: '⛏️ تعدين', href: '/mining' },
       { label: 'الوظائف', href: '/jobs' },
       { label: '🚰 Faucet', href: '/faucet' },
     ],
    dropdowns: [
      {
        label: 'العملات',
        href: '/coins',
        items: [
          { label: 'جميع العملات', href: '/coins' },
          { label: 'رائجة', href: '/coins/trending' },
          { label: 'الأعلى ربحاً', href: '/coins/gainers' },
          { label: 'الأعلى خسارة', href: '/coins/losers' },
          { label: 'الإدراجات الجديدة', href: '/coins/new' },
          { label: 'الفئات', href: '/coins/categories' },
        ],
      },
      {
        label: 'الإسقاطات',
        href: '/airdrops',
        items: [
          { label: 'جميع الإسقاطات', href: '/airdrops' },
          { label: 'نشطة', href: '/airdrops/active' },
          { label: 'قادمة', href: '/airdrops/upcoming' },
          { label: 'مؤكدة', href: '/airdrops/confirmed' },
          { label: 'المدقق', href: '/airdrop-checker' },
          { label: 'المحفظة', href: '/portfolio' },
        ],
      },
      {
        label: 'الأسواق',
        href: '/markets',
        items: [
          { label: 'السوق العالمي', href: '/markets' },
          { label: 'خريطة حرارية', href: '/markets/heatmap' },
          { label: 'الأسهم', href: '/markets/stocks' },
          { label: 'الفوركس', href: '/markets/forex' },
          { label: 'السلع', href: '/markets/commodities' },
          { label: 'إحصائيات عالمية', href: '/markets/global' },
        ],
      },
      {
        label: 'الموارد',
        href: '#',
        items: [
          { label: '📚 الأكاديمية', href: '/learn-bitcoin' },
          { label: '✍️ الأخبار والمدونة', href: '/blog' },
        ],
      },
    ],
  },
   pt: {
     mainNav: [
       { label: '⛏️ Mineração', href: '/mining' },
       { label: 'Empregos', href: '/jobs' },
       { label: '🚰 Faucet', href: '/faucet' },
     ],
    dropdowns: [
      {
        label: 'Moedas',
        href: '/coins',
        items: [
          { label: 'Todas as Moedas', href: '/coins' },
          { label: 'Tendências', href: '/coins/trending' },
          { label: 'Maiores Ganhos', href: '/coins/gainers' },
          { label: 'Maiores Perdas', href: '/coins/losers' },
          { label: 'Novos Listados', href: '/coins/new' },
          { label: 'Categorias', href: '/coins/categories' },
        ],
      },
      {
        label: 'Airdrops',
        href: '/airdrops',
        items: [
          { label: 'Todos os Airdrops', href: '/airdrops' },
          { label: 'Ativos', href: '/airdrops/active' },
          { label: 'Próximos', href: '/airdrops/upcoming' },
          { label: 'Confirmados', href: '/airdrops/confirmed' },
          { label: 'Verificador', href: '/airdrop-checker' },
          { label: 'Portfólio', href: '/portfolio' },
        ],
      },
      {
        label: 'Mercados',
        href: '/markets',
        items: [
          { label: 'Mercado Global', href: '/markets' },
          { label: 'Mapa de Calor', href: '/markets/heatmap' },
          { label: 'Ações', href: '/markets/stocks' },
          { label: 'Forex', href: '/markets/forex' },
          { label: 'Commodities', href: '/markets/commodities' },
          { label: 'Estatísticas Globais', href: '/markets/global' },
        ],
      },
      {
        label: 'Recursos',
        href: '#',
        items: [
          { label: '📚 Academia e Aprendizado', href: '/learn-bitcoin' },
          { label: '✍️ Notícias e Blog', href: '/blog' },
        ],
      },
    ],
  },
   en: {
     mainNav: [
       { label: '⛏️ Mining', href: '/mining' },
       { label: 'Jobs', href: '/jobs' },
       { label: '🚰 Faucet', href: '/faucet' },
     ],
    dropdowns: [
      {
        label: 'Coins',
        href: '/coins',
        items: [
          { label: 'All Coins', href: '/coins' },
          { label: 'Trending', href: '/coins/trending' },
          { label: 'Top Gainers', href: '/coins/gainers' },
          { label: 'Top Losers', href: '/coins/losers' },
          { label: 'New Listings', href: '/coins/new' },
          { label: 'Categories', href: '/coins/categories' },
        ],
      },
      {
        label: 'Airdrops',
        href: '/airdrops',
        items: [
          { label: 'All Airdrops', href: '/airdrops' },
          { label: 'Active', href: '/airdrops/active' },
          { label: 'Upcoming', href: '/airdrops/upcoming' },
          { label: 'Confirmed', href: '/airdrops/confirmed' },
          { label: 'Airdrop Checker', href: '/airdrop-checker' },
          { label: 'Portfolio Tracker', href: '/portfolio' },
        ],
      },
      {
        label: '📊 Markets',
        href: '/markets',
        items: [
          { label: '📊 Global Market', href: '/markets' },
          { label: '🔥 Market Heatmap', href: '/markets/heatmap' },
          { label: '📈 Stocks', href: '/markets/stocks' },
          { label: '💱 Forex', href: '/markets/forex' },
          { label: '🏗️ Commodities', href: '/markets/commodities' },
          { label: '📉 Indices', href: '/markets/indices' },
          { label: '📊 Global Stats', href: '/markets/global' },
          { label: '🪙 Crypto', href: '/coins' },
          { label: '🔄 Converter', href: '/converter' },
        ],
      },
      {
        label: '📚 Resources',
        href: '#',
        items: [
          { label: '📚 Academy & Learning', href: '/learn-bitcoin' },
          { label: '✍️ News & Blog', href: '/blog' },
        ],
      },
    ],
  },
   hi: {
     mainNav: [
       { label: '⛏️ Mining', href: '/mining' },
       { label: 'Jobs', href: '/jobs' },
       { label: '🚰 Faucet', href: '/faucet' },
     ],
    dropdowns: [
      {
        label: 'सिक्के',
        href: '/coins',
        items: [
          { label: 'सभी सिक्के', href: '/coins' },
          { label: 'ट्रेंडिंग', href: '/coins/trending' },
          { label: 'टॉप गेनर्स', href: '/coins/gainers' },
          { label: 'टॉप लूज़र्स', href: '/coins/losers' },
          { label: 'नई लिस्टिंग', href: '/coins/new' },
          { label: 'श्रेणियाँ', href: '/coins/categories' },
        ],
      },
      {
        label: 'एयरड्रॉप',
        href: '/airdrops',
        items: [
          { label: 'सभी एयरड्रॉप', href: '/airdrops' },
          { label: 'सक्रिय', href: '/airdrops/active' },
          { label: 'आगामी', href: '/airdrops/upcoming' },
          { label: 'पुष्टि', href: '/airdrops/confirmed' },
          { label: 'एयरड्रॉप चेकर', href: '/airdrop-checker' },
          { label: 'पोर्टफोलियो ट्रैकर', href: '/portfolio' },
        ],
      },
      {
        label: 'बाज़ार',
        href: '/markets',
        items: [
          { label: 'ग्लोबल मार्केट', href: '/markets' },
          { label: 'मार्केट हीटमैप', href: '/markets/heatmap' },
          { label: 'स्टॉक्स', href: '/markets/stocks' },
          { label: 'फोरेक्स', href: '/markets/forex' },
          { label: 'कमोडिटीज़', href: '/markets/commodities' },
          { label: 'ग्लोबल स्टैट्स', href: '/markets/global' },
        ],
      },
      {
        label: 'संसाधन',
        href: '#',
        items: [
          { label: '📚 अकादमी और सीखना', href: '/learn-bitcoin' },
          { label: '✍️ समाचार और ब्लॉग', href: '/blog' },
        ],
      },
    ],
  },
   fr: {
     mainNav: [
       { label: '⛏️ Mining', href: '/mining' },
       { label: 'Jobs', href: '/jobs' },
       { label: '🚰 Faucet', href: '/faucet' },
     ],
    dropdowns: [
      {
        label: 'Monnaies',
        href: '/coins',
        items: [
          { label: 'Toutes les monnaies', href: '/coins' },
          { label: 'Tendances', href: '/coins/trending' },
          { label: 'Gagnants', href: '/coins/gainers' },
          { label: 'Perdants', href: '/coins/losers' },
          { label: 'Nouveautés', href: '/coins/new' },
          { label: 'Catégories', href: '/coins/categories' },
        ],
      },
      {
        label: 'Airdrops',
        href: '/airdrops',
        items: [
          { label: 'Tous les airdrops', href: '/airdrops' },
          { label: 'Actifs', href: '/airdrops/active' },
          { label: 'À venir', href: '/airdrops/upcoming' },
          { label: 'Confirmés', href: '/airdrops/confirmed' },
          { label: 'Vérificateur', href: '/airdrop-checker' },
          { label: 'Portefeuille', href: '/portfolio' },
        ],
      },
      {
        label: 'Marchés',
        href: '/markets',
        items: [
          { label: 'Marché global', href: '/markets' },
          { label: 'Heatmap', href: '/markets/heatmap' },
          { label: 'Actions', href: '/markets/stocks' },
          { label: 'Forex', href: '/markets/forex' },
          { label: 'Matières premières', href: '/markets/commodities' },
          { label: 'Stats globales', href: '/markets/global' },
        ],
      },
      {
        label: 'Ressources',
        href: '#',
        items: [
          { label: '📚 Académie', href: '/learn-bitcoin' },
          { label: '✍️ Actualités et Blog', href: '/blog' },
        ],
      },
    ],
  },
  de: {
    mainNav: [
      { label: '⛏️ Mining', href: '/mining' },
      { label: 'Jobs', href: '/jobs' },
    ],
    dropdowns: [
      {
        label: 'Coins',
        href: '/coins',
        items: [
          { label: 'Alle Coins', href: '/coins' },
          { label: 'Trends', href: '/coins/trending' },
          { label: 'Gewinner', href: '/coins/gainers' },
          { label: 'Verlierer', href: '/coins/losers' },
          { label: 'Neue Listings', href: '/coins/new' },
          { label: 'Kategorien', href: '/coins/categories' },
        ],
      },
      {
        label: 'Airdrops',
        href: '/airdrops',
        items: [
          { label: 'Alle Airdrops', href: '/airdrops' },
          { label: 'Aktiv', href: '/airdrops/active' },
          { label: 'Bevorstehend', href: '/airdrops/upcoming' },
          { label: 'Bestätigt', href: '/airdrops/confirmed' },
          { label: 'Airdrop-Prüfer', href: '/airdrop-checker' },
          { label: 'Portfolio', href: '/portfolio' },
        ],
      },
      {
        label: 'Märkte',
        href: '/markets',
        items: [
          { label: 'Globaler Markt', href: '/markets' },
          { label: 'Heatmap', href: '/markets/heatmap' },
          { label: 'Aktien', href: '/markets/stocks' },
          { label: 'Forex', href: '/markets/forex' },
          { label: 'Rohstoffe', href: '/markets/commodities' },
          { label: 'Globale Statistiken', href: '/markets/global' },
        ],
      },
      {
        label: 'Ressourcen',
        href: '#',
        items: [
          { label: '📚 Akademie', href: '/learn-bitcoin' },
          { label: '✍️ Nachrichten und Blog', href: '/blog' },
        ],
      },
    ],
  },
  tr: {
    mainNav: [
      { label: '⛏️ Mining', href: '/mining' },
      { label: 'Jobs', href: '/jobs' },
    ],
    dropdowns: [
      {
        label: 'Coinler',
        href: '/coins',
        items: [
          { label: 'Tüm Coinler', href: '/coins' },
          { label: 'Trend', href: '/coins/trending' },
          { label: 'Kazananlar', href: '/coins/gainers' },
          { label: 'Kaybedenler', href: '/coins/losers' },
          { label: 'Yeni Listelenenler', href: '/coins/new' },
          { label: 'Kategoriler', href: '/coins/categories' },
        ],
      },
      {
        label: 'Airdroplar',
        href: '/airdrops',
        items: [
          { label: 'Tüm Airdroplar', href: '/airdrops' },
          { label: 'Aktif', href: '/airdrops/active' },
          { label: 'Yakında', href: '/airdrops/upcoming' },
          { label: 'Onaylandı', href: '/airdrops/confirmed' },
          { label: 'Airdrop Denetleyici', href: '/airdrop-checker' },
          { label: 'Portföy', href: '/portfolio' },
        ],
      },
      {
        label: 'Piyasalar',
        href: '/markets',
        items: [
          { label: 'Küresel Piyasa', href: '/markets' },
          { label: 'Isı Haritası', href: '/markets/heatmap' },
          { label: 'Hisse Senetleri', href: '/markets/stocks' },
          { label: 'Forex', href: '/markets/forex' },
          { label: 'Emtialar', href: '/markets/commodities' },
          { label: 'Küresel İstatistikler', href: '/markets/global' },
        ],
      },
      {
        label: 'Kaynaklar',
        href: '#',
        items: [
          { label: '📚 Akademi', href: '/learn-bitcoin' },
          { label: '✍️ Haberler ve Blog', href: '/blog' },
        ],
      },
    ],
  },
  ru: {
    mainNav: [
      { label: '⛏️ Mining', href: '/mining' },
      { label: 'Jobs', href: '/jobs' },
    ],
    dropdowns: [
      {
        label: 'Монеты',
        href: '/coins',
        items: [
          { label: 'Все монеты', href: '/coins' },
          { label: 'В тренде', href: '/coins/trending' },
          { label: 'Лидеры роста', href: '/coins/gainers' },
          { label: 'Лидеры падения', href: '/coins/losers' },
          { label: 'Новые листинги', href: '/coins/new' },
          { label: 'Категории', href: '/coins/categories' },
        ],
      },
      {
        label: 'Аирдропы',
        href: '/airdrops',
        items: [
          { label: 'Все аирдропы', href: '/airdrops' },
          { label: 'Активные', href: '/airdrops/active' },
          { label: 'Предстоящие', href: '/airdrops/upcoming' },
          { label: 'Подтверждённые', href: '/airdrops/confirmed' },
          { label: 'Проверка', href: '/airdrop-checker' },
          { label: 'Портфель', href: '/portfolio' },
        ],
      },
      {
        label: 'Рынки',
        href: '/markets',
        items: [
          { label: 'Глобальный рынок', href: '/markets' },
          { label: 'Тепловая карта', href: '/markets/heatmap' },
          { label: 'Акции', href: '/markets/stocks' },
          { label: 'Форекс', href: '/markets/forex' },
          { label: 'Товары', href: '/markets/commodities' },
          { label: 'Глобальная статистика', href: '/markets/global' },
        ],
      },
      {
        label: 'Ресурсы',
        href: '#',
        items: [
          { label: '📚 Академия', href: '/learn-bitcoin' },
          { label: '✍️ Новости и Блог', href: '/blog' },
        ],
      },
    ],
  },
  zh: {
    mainNav: [
      { label: '⛏️ Mining', href: '/mining' },
      { label: 'Jobs', href: '/jobs' },
    ],
    dropdowns: [
      {
        label: '币种',
        href: '/coins',
        items: [
          { label: '所有币种', href: '/coins' },
          { label: '热门', href: '/coins/trending' },
          { label: '涨幅榜', href: '/coins/gainers' },
          { label: '跌幅榜', href: '/coins/losers' },
          { label: '新上市', href: '/coins/new' },
          { label: '分类', href: '/coins/categories' },
        ],
      },
      {
        label: '空投',
        href: '/airdrops',
        items: [
          { label: '所有空投', href: '/airdrops' },
          { label: '进行中', href: '/airdrops/active' },
          { label: '即将开始', href: '/airdrops/upcoming' },
          { label: '已确认', href: '/airdrops/confirmed' },
          { label: '空投检查器', href: '/airdrop-checker' },
          { label: '投资组合', href: '/portfolio' },
        ],
      },
      {
        label: '市场',
        href: '/markets',
        items: [
          { label: '全球市场', href: '/markets' },
          { label: '热力图', href: '/markets/heatmap' },
          { label: '股票', href: '/markets/stocks' },
          { label: '外汇', href: '/markets/forex' },
          { label: '商品', href: '/markets/commodities' },
          { label: '全球统计', href: '/markets/global' },
        ],
      },
      {
        label: '资源',
        href: '#',
        items: [
          { label: '📚 学院', href: '/learn-bitcoin' },
          { label: '✍️ 新闻和博客', href: '/blog' },
        ],
      },
    ],
  },
  ja: {
    mainNav: [
      { label: '⛏️ Mining', href: '/mining' },
      { label: 'Jobs', href: '/jobs' },
    ],
    dropdowns: [
      {
        label: 'コイン',
        href: '/coins',
        items: [
          { label: 'すべてのコイン', href: '/coins' },
          { label: 'トレンド', href: '/coins/trending' },
          { label: '上昇率トップ', href: '/coins/gainers' },
          { label: '下落率トップ', href: '/coins/losers' },
          { label: '新規上場', href: '/coins/new' },
          { label: 'カテゴリー', href: '/coins/categories' },
        ],
      },
      {
        label: 'エアドロップ',
        href: '/airdrops',
        items: [
          { label: 'すべてのエアドロップ', href: '/airdrops' },
          { label: '進行中', href: '/airdrops/active' },
          { label: '近日公開', href: '/airdrops/upcoming' },
          { label: '確認済み', href: '/airdrops/confirmed' },
          { label: 'エアドロップチェッカー', href: '/airdrop-checker' },
          { label: 'ポートフォリオ', href: '/portfolio' },
        ],
      },
      {
        label: '市場',
        href: '/markets',
        items: [
          { label: 'グローバル市場', href: '/markets' },
          { label: 'ヒートマップ', href: '/markets/heatmap' },
          { label: '株式', href: '/markets/stocks' },
          { label: '外国為替', href: '/markets/forex' },
          { label: '商品', href: '/markets/commodities' },
          { label: 'グローバル統計', href: '/markets/global' },
        ],
      },
      {
        label: 'リソース',
        href: '#',
        items: [
          { label: '📚 アカデミー', href: '/learn-bitcoin' },
          { label: '✍️ ニュースとブログ', href: '/blog' },
        ],
      },
    ],
  },
};

export function SiteHeader() {
  const pathname = usePathname();
  const { language, currency, setLanguage, setCurrency, user, setUser } = useAppStore();
  const { settings } = useSiteSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrDropdown, setShowCurrDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; symbol: string; image?: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lang, setLang] = useState(language || 'roman');
  const [announcement, setAnnouncement] = useState<{ text: string; type: 'airdrop' | 'job' | 'manual'; link?: string; useHtml?: boolean; htmlContent?: string } | null>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const siteName = settings.siteName || 'BitcoinUrdu';
  const siteNameParts = siteName.split(/(?=[A-Z])/);
  const siteNameFirst = siteNameParts[0] || 'Bitcoin';
  const siteNameSecond = siteNameParts.slice(1).join('') || 'Urdu';

  useEffect(() => {
    setLang(language || 'roman');
  }, [language]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      fetch('/data/coins-market.json')
        .then((r) => r.json())
        .then((data) => {
          const q = searchQuery.toLowerCase();
          const results: typeof searchResults = [];
          const seen = new Set<string>();
          for (const page of data.pages || []) {
            for (const coin of page.coins || []) {
              if (seen.has(coin.id)) continue;
              if (coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q) || coin.id.includes(q)) {
                results.push({ id: coin.id, name: coin.name, symbol: coin.symbol, image: coin.image });
                seen.add(coin.id);
                if (results.length >= 8) break;
              }
            }
            if (results.length >= 8) break;
          }
          setSearchResults(results);
          setSearching(false);
        })
        .catch(() => { setSearching(false); setSearchResults([]); });
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const localAnn = localStorage.getItem('bu_admin_announcements');
    if (localAnn) {
      try {
        const announcements = JSON.parse(localAnn) as { text?: string; title?: string; content?: string; type: string; link?: string; active?: boolean; useHtml?: boolean; htmlContent?: string }[];
        const active = announcements.filter((a) => a.active !== false);
        if (active.length > 0) {
          const latest = active[active.length - 1];
          setAnnouncement({ text: latest.title || latest.content || latest.text || '', type: latest.type as 'airdrop' | 'job' | 'manual', link: latest.link, useHtml: latest.useHtml, htmlContent: latest.htmlContent });
          setAnnouncementDismissed(false);
          return;
        }
      } catch {}
    }

    fetch('https://api.jsonbin.io/v3/b/6a0b09d4a92aa659e32f87bd/latest', {
      headers: { 'X-Master-Key': '$2a$10$JNXixSu1HicEzD5diMw1ZedAGQkmr4Iwze6Qc6g8L3s89vsrUpGAG' },
    })
      .then((r) => r.json())
      .then((_d) => {
        const settingsAnn = settings.announcements?.filter((a) => a.enabled);
        if (settingsAnn && settingsAnn.length > 0) {
          const latest = settingsAnn[settingsAnn.length - 1];
          setAnnouncement({ text: latest.message, type: latest.type as 'airdrop' | 'job' | 'manual', link: undefined });
          setAnnouncementDismissed(false);
        }
      })
      .catch(() => {});
  }, [settings.announcements]);

  const texts = navTexts[lang] || navTexts.roman;
  const mainNavItems = texts.mainNav.filter((i) => i.href !== '/mining' && i.href !== '/jobs');
    const dropdownItems = [
     {
       label: '⛏️ Mining',
       href: '/mining',
       items: [
         { label: 'Overview', href: '/mining' },
         { label: 'ASIC Mining', href: '/mining/asic' },
         { label: 'GPU Mining', href: '/mining/gpu' },
         { label: 'Calculator', href: '/mining/calculator' },
         { label: 'Profitability', href: '/mining/profitability' },
         { label: 'Pools', href: '/mining/pools' },
         { label: 'Guides', href: '/mining/guides' },
       ],
     },
    {
      label: '💼 Jobs',
      href: '/jobs',
      items: [
        { label: 'All Jobs', href: '/jobs' },
        { label: 'New Jobs', href: '/jobs/new' },
        { label: 'Ended', href: '/jobs/ended' },
        { label: 'Upcoming', href: '/jobs/upcoming' },
      ],
    },
     ...texts.dropdowns.map((d) => {
       if (d.label.includes('Airdrop') || d.href === '/airdrops') {
         return {
           ...d,
           items: [
             ...d.items,
             { label: '🟢 Onchain GM', href: '/airdrops/onchain-gm' },
              { label: '⏪ Retroactive', href: '/airdrops/retroactive' },
              { label: '🚰 Testnet Faucet', href: '/faucet' },
           ],
         };
       }
       return d;
     }),
  ];

  const handleLogout = () => {
    localStorage.removeItem('bu_auth_token');
    localStorage.removeItem('bu_user');
    localStorage.removeItem('bu_portfolio');
    localStorage.removeItem('bu_watchlist');
    setUser(null);
    setShowUserMenu(false);
    window.location.href = '/';
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const logoutTexts: Record<string, string> = { roman: 'Logout', ur: 'لاگ آؤٹ', ps: 'وځئ', sd: 'لاگ آؤٽ', en: 'Logout', es: 'Cerrar Sesión', ar: 'تسجيل الخروج', pt: 'Sair', hi: 'लॉगआउट', fr: 'Déconnexion', de: 'Abmelden', tr: 'Çıkış Yap', ru: 'Выйти', zh: '退出', ja: 'ログアウト' };
  const loginTexts: Record<string, string> = { roman: 'Login', ur: 'لاگ ان', ps: 'ننوتل', sd: 'لاگ ان', en: 'Login', es: 'Iniciar Sesión', ar: 'تسجيل الدخول', pt: 'Entrar', hi: 'लॉग इन', fr: 'Connexion', de: 'Anmelden', tr: 'Giriş Yap', ru: 'Войти', zh: '登录', ja: 'ログイン' };
  const searchPlaceholder: Record<string, string> = { roman: 'Search karein...', ur: 'تلاش کریں...', ps: 'لټون...', sd: 'ڳولا...', en: 'Search...', es: 'Buscar...', ar: 'بحث...', pt: 'Pesquisar...', hi: 'खोजें...', fr: 'Rechercher...', de: 'Suchen...', tr: 'Ara...', ru: 'Поиск...', zh: '搜索...', ja: '検索...' };
  const portfolioText: Record<string, string> = { roman: 'Portfolio', ur: 'پورٹ فولیو', ps: 'پورټفولیو', sd: 'پورٽفولیو', en: 'Portfolio', es: 'Portafolio', ar: 'المحفظة', pt: 'Portfólio', hi: 'पोर्टफोलियो', fr: 'Portefeuille', de: 'Portfolio', tr: 'Portföy', ru: 'Портфель', zh: '投资组合', ja: 'ポートフォリオ' };

  return (
    <>
      {/* Announcement Banner */}
      {announcement && !announcementDismissed && (
        <div className={`relative z-50 overflow-hidden ${
          announcement.type === 'airdrop' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
          announcement.type === 'job' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
          'bg-gradient-to-r from-bitcoin to-yellow-600'
        }`}>
          <div className="w-full max-w-full px-2 md:px-8 mx-auto py-2 flex items-center justify-center gap-2 text-white text-sm">
            {announcement.useHtml && announcement.htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: announcement.htmlContent }} className="font-medium" />
            ) : (
              <>
                {announcement.type === 'airdrop' && <Gift className="h-4 w-4 shrink-0 animate-pulse" />}
                {announcement.type === 'job' && <Briefcase className="h-4 w-4 shrink-0 animate-pulse" />}
                {announcement.type === 'manual' && <Bell className="h-4 w-4 shrink-0 animate-pulse" />}
                {announcement.link ? (
                  <Link href={announcement.link} className="font-medium hover:underline">
                    {announcement.text}
                  </Link>
                ) : (
                  <span className="font-medium">{announcement.text}</span>
                )}
              </>
            )}
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="ml-2 p-0.5 hover:bg-white/20 rounded transition-colors shrink-0"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-full items-center gap-4 px-2 md:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.svg" alt={siteName} className="h-10 w-auto object-contain hidden dark:block" />
          <img src="/logo-day.svg" alt={siteName} className="h-10 w-auto object-contain block dark:hidden" />
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5">
          {dropdownItems.map((dropdown) => (
            <div key={dropdown.label} className="relative group">
              <Link
                href={dropdown.href}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(dropdown.href) ? 'text-bitcoin bg-accent' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {dropdown.label}
                <ChevronDown className="h-3 w-3" />
              </Link>
              <div className="absolute top-full left-0 mt-1 w-44 rounded-lg border bg-popover p-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {dropdown.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent',
                isActive(item.href) ? 'text-bitcoin bg-accent' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1.5 ml-auto">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={'🔍 ' + (searchPlaceholder[lang] || 'Search...')}
              className="w-56 pl-9 pr-4 py-1.5 rounded-lg border bg-muted/50 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-bitcoin/50 focus:bg-background focus:text-foreground transition-all"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-72 rounded-lg border bg-popover shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.map((coin) => (
                  <Link
                    key={coin.id}
                    href={`/coins/${coin.id}`}
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-accent transition-colors"
                  >
                    <Image src={coin.image || ''} alt={coin.name} width={20} height={20} className="rounded-full" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate block">{coin.name}</span>
                      <span className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {searching && (
              <div className="absolute top-full mt-1 w-72 rounded-lg border bg-popover shadow-lg z-50 p-3 text-center text-sm text-muted-foreground">
                Searching 15,984 coins...
              </div>
            )}
            {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
              <div className="absolute top-full mt-1 w-72 rounded-lg border bg-popover shadow-lg z-50 p-3 text-center text-sm text-muted-foreground">
                No coins found for "{searchQuery}"
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline uppercase text-xs">{LANGUAGES.find(l => l.code === lang)?.nativeName || lang}</span>
            </button>
            {showLangDropdown && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border bg-popover p-1 shadow-lg z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangDropdown(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-accent',
                      lang === l.code && 'bg-accent'
                    )}
                  >
                    {l.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowCurrDropdown(!showCurrDropdown)}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{currency}</span>
            </button>
            {showCurrDropdown && (
              <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border bg-popover p-1 shadow-lg z-50">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code);
                      setShowCurrDropdown(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-accent',
                      currency === curr.code && 'bg-accent'
                    )}
                  >
                    {curr.symbol} {curr.code}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm bg-bitcoin/10 text-bitcoin hover:bg-bitcoin/20 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border bg-popover p-1 shadow-lg z-50">
                  <Link
                    href="/portfolio"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-3 py-1.5 text-sm rounded-md hover:bg-accent"
                  >
                    {'💼 ' + (portfolioText[lang] || 'Portfolio')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-accent text-red-500 flex items-center gap-2"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {logoutTexts[lang] || 'Logout'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm bg-bitcoin text-white hover:bg-bitcoin-dark transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              {loginTexts[lang] || 'Login'}
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden rounded-lg p-1.5 hover:bg-accent"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="xl:hidden border-t bg-background">
          <nav className="mx-auto w-full max-w-full px-2 py-3 space-y-1">
            {dropdownItems.map((dropdown) => {
              const isOpen = openMobileDropdown === dropdown.label;
              return (
                <div key={dropdown.label} className="py-1">
                  <div className="flex items-center">
                    <Link
                      href={dropdown.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-3 py-2 text-sm font-semibold text-foreground"
                    >
                      {dropdown.label}
                    </Link>
                    <button
                      onClick={() => setOpenMobileDropdown(isOpen ? null : dropdown.label)}
                      className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                    </button>
                  </div>
                  {isOpen && (
                    <div className="ml-4 space-y-0.5 animate-in slide-in-from-top-1">
                      {dropdown.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(item.href)
                    ? 'text-bitcoin bg-accent'
                    : 'text-muted-foreground hover:bg-accent'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t mt-2">
              {user ? (
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{user.name}</span>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {logoutTexts[lang] || 'Logout'}
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-bitcoin bg-accent rounded-md"
                >
                  {loginTexts[lang] || 'Login'}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
    </>
  );
}
