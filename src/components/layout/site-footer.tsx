'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bitcoin, Twitter, Send, Youtube, Facebook, Globe } from 'lucide-react';
import { useAppStore } from '@/stores';
import { useSiteSettings } from '@/hooks/use-site-settings';

interface SocialLinks {
  twitter: string;
  telegram: string;
  youtube: string;
  facebook: string;
  website: string;
}

function useSocialLinks(): SocialLinks {
  const [links, setLinks] = useState<SocialLinks>({
    twitter: 'https://x.com/bitcoinurdu',
    telegram: 'https://t.me/bitcoinurdu',
    youtube: 'https://youtube.com/@bitcoinurdu',
    facebook: 'https://facebook.com/bitcoinurdu',
    website: 'https://bitcoinurdu.com',
  });

  useEffect(() => {
    const raw = localStorage.getItem('bu_admin_social_links');
    if (raw) {
      try {
        setLinks(JSON.parse(raw));
      } catch {}
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bu_admin_social_links' && e.newValue) {
        try {
          setLinks(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return links;
}

const footerTexts: Record<string, Record<string, string>> = {
  roman: {
    desc: "The World's Elite Crypto Platform. Live prices, airdrops, portfolio tracking, aur AI insights.",
    products: '🚀 Products',
    learn: '📚 Seekhen',
    company: '🏢 Company',
    legal: '📋 Legal',
    rights: 'Tamam rights reserved hain.',
    disclaimer: 'Financial advice nahi hai. Apni research khud karein.',
  },
  ur: {
    desc: 'دنیا کا اشرافیہ کثیر لسانی کرپٹو پلیٹ فارم۔ لائیو قیمتیں، ایئرڈراپس، پورٹ فولیو ٹریکنگ، اور AI بصیرت۔',
    products: '🚀 پروڈکٹس',
    learn: '📚 سیکھیں',
    company: '🏢 کمپنی',
    legal: '📋 قانونی',
    rights: 'جملہ حقوق محفوظ ہیں۔',
    disclaimer: 'مالیاتی مشورہ نہیں۔ اپنی تحقیق خود کریں۔',
  },
  ps: {
    desc: 'د نړۍ د کریپټو مخکښ پلیټ فارم. ژوندی بیې، ایرډراپس، پورټفولیو تعقیب، او AI بصیرت.',
    products: '🚀 محصولات',
    learn: '📚 زده کړه',
    company: '🏢 شرکت',
    legal: '📋 قانوني',
    rights: 'ټول حقوق خوندي دي.',
    disclaimer: 'د مالي مشورې ندي. خپله څیړنه وکړئ.',
  },
  sd: {
    desc: 'دنيا جو اشرافيہ گھڻ-ٻولي ڪرپٽو پلیٽ فارم. لائیو قیمتون، ایئرڊراپس، پورٽفولیو ٽریڪنگ، ۽ AI بصیرت.',
    products: '🚀 پراڊڪٽس',
    learn: '📚 سکيا',
    company: '🏢 ڪمپني',
    legal: '📋 قانوني',
    rights: 'سڀ حق محفوظ آهن.',
    disclaimer: 'مالي مشورو ناهي. پنهنجي تحقيق پاڻ ڪريو.',
  },
  es: {
    desc: 'La Plataforma Crypto Multilingüe Elite del Mundo. Precios en vivo, airdrops, seguimiento de cartera e insights de IA.',
    products: '🚀 Productos',
    learn: '📚 Aprender',
    company: '🏢 Empresa',
    legal: '📋 Legal',
    rights: 'Todos los derechos reservados.',
    disclaimer: 'No es asesoramiento financiero. Investigue por su cuenta.',
  },
  ar: {
    desc: 'منصة الكريبتو المتعددة اللغات الرائدة عالمياً. أسعار حية، إسقاطات جوية، تتبع المحفظة، ورؤى الذكاء الاصطناعي.',
    products: '🚀 المنتجات',
    learn: '📚 تعلم',
    company: '🏢 الشركة',
    legal: '📋 قانوني',
    rights: 'جميع الحقوق محفوظة.',
    disclaimer: 'ليست نصيحة مالية. قم ببحثك الخاص.',
  },
  pt: {
    desc: 'A Plataforma Crypto Multilíngue Elite do Mundo. Preços ao vivo, airdrops, rastreamento de portfólio e insights de IA.',
    products: '🚀 Produtos',
    learn: '📚 Aprender',
    company: '🏢 Empresa',
    legal: '📋 Legal',
    rights: 'Todos os direitos reservados.',
    disclaimer: 'Não é aconselhamento financeiro. Faça sua própria pesquisa.',
  },
  en: {
    desc: "The World's Elite Crypto Platform. Live prices, airdrops, portfolio tracking, and AI insights.",
    products: '🚀 Products',
    learn: '📚 Learn',
    company: '🏢 Company',
    legal: '📋 Legal',
    rights: 'All rights reserved.',
    disclaimer: 'Not financial advice. Do your own research.',
  },
  hi: {
    desc: 'दुनिया का अग्रणी बहु-भाषी क्रिप्टो प्लेटफॉर्म। लाइव मूल्य, एयरड्रॉप, पोर्टफोलियो ट्रैकिंग, और AI अंतर्दृष्टि।',
    products: '🚀 उत्पाद',
    learn: '📚 सीखें',
    company: '🏢 कंपनी',
    legal: '📋 कानूनी',
    rights: 'सर्वाधिकार सुरक्षित।',
    disclaimer: 'वित्तीय सलाह नहीं है। अपना शोध स्वयं करें।',
  },
  fr: {
    desc: "La plateforme crypto multilingue de r\u00e9f\u00e9rence mondiale. Prix en direct, airdrops, suivi de portefeuille et analyses IA.",
    products: '🚀 Produits',
    learn: '📚 Apprendre',
    company: '🏢 Entreprise',
    legal: '📋 L\u00e9gal',
    rights: 'Tous droits r\u00e9serv\u00e9s.',
    disclaimer: "Ce n'est pas un conseil financier. Faites vos propres recherches.",
  },
  de: {
    desc: 'Die f\u00fchrende mehrsprachige Crypto-Plattform der Welt. Live-Preise, Airdrops, Portfolio-Tracking und KI-Analysen.',
    products: '🚀 Produkte',
    learn: '📚 Lernen',
    company: '🏢 Unternehmen',
    legal: '📋 Rechtliches',
    rights: 'Alle Rechte vorbehalten.',
    disclaimer: 'Keine Finanzberatung. Recherchieren Sie selbst.',
  },
  tr: {
    desc: "D\u00fcnyan\u0131n lider \u00e7ok dilli kripto platformu. Canl\u0131 fiyatlar, airdroplar, portf\u00f6y takibi ve AI analizleri.",
    products: '🚀 \u00dcr\u00fcnler',
    learn: '📚 \u00d6\u011fren',
    company: '🏢 \u015eirket',
    legal: '📋 Yasal',
    rights: 'T\u00fcm haklar\u0131 sakl\u0131d\u0131r.',
    disclaimer: 'Finansal tavsiye de\u011fildir. Kendi ara\u015ft\u0131rman\u0131z\u0131 yap\u0131n.',
  },
  ru: {
    desc: '\u0412\u0435\u0434\u0443\u0449\u0430\u044f \u043c\u0443\u043b\u044c\u0442\u0438\u044f\u0437\u044b\u0447\u043d\u0430\u044f \u043a\u0440\u0438\u043f\u0442\u043e\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430 \u043c\u0438\u0440\u0430. \u0426\u0435\u043d\u044b \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438, \u0430\u0438\u0440\u0434\u0440\u043e\u043f\u044b, \u043e\u0442\u0441\u043b\u0435\u0436\u0438\u0432\u0430\u043d\u0438\u0435 \u043f\u043e\u0440\u0442\u0444\u0435\u043b\u044f \u0438 AI \u0430\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430.',
    products: '🚀 \u041f\u0440\u043e\u0434\u0443\u043a\u0442\u044b',
    learn: '📚 \u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435',
    company: '🏢 \u041a\u043e\u043c\u043f\u0430\u043d\u0438\u044f',
    legal: '📋 \u042e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u043e\u0435',
    rights: '\u0412\u0441\u0435 \u043f\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u044b.',
    disclaimer: '\u041d\u0435 \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u0444\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u043e\u0439 \u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0438\u0435\u0439. \u041f\u0440\u043e\u0432\u043e\u0434\u0438\u0442\u0435 \u0441\u043e\u0431\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0435 \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0435.',
  },
  zh: {
    desc: '\u4e16\u754c\u9886\u5148\u7684\u591a\u8bed\u8a00\u52a0\u5bc6\u5e73\u53f0\u3002\u5b9e\u65f6\u4ef7\u683c\u3001\u7a7a\u6295\u3001\u6295\u8d44\u7ec4\u5408\u8ffd\u8e2a\u548cAI\u5206\u6790\u3002',
    products: '🚀 \u4ea7\u54c1',
    learn: '📚 \u5b66\u4e60',
    company: '🏢 \u516c\u53f8',
    legal: '📋 \u6cd5\u5f8b',
    rights: '\u7248\u6743\u6240\u6709\u3002',
    disclaimer: '\u975e\u8d22\u52a1\u5efa\u8bae\u3002\u8bf7\u81ea\u884c\u7814\u7a76\u3002',
  },
  ja: {
    desc: '\u4e16\u754c\u6709\u6570\u306e\u591a\u8a00\u8a9e\u6697\u53f7\u901a\u8ca8\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3002\u30e9\u30a4\u30d6\u4fa1\u683c\u3001\u30a8\u30a2\u30c9\u30ed\u30c3\u30d7\u3001\u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa\u8ffd\u8de1\u3001AI\u5206\u6790\u3002',
    products: '🚀 \u88fd\u54c1',
    learn: '📚 \u5b66\u3076',
    company: '🏢 \u4f1a\u793e',
    legal: '📋 \u6cd5\u7684',
    rights: '\u5168\u8457\u4f5c\u6a29\u6240\u6709\u3002',
    disclaimer: '\u8ca1\u52d9\u30a2\u30c9\u30d0\u30a4\u30b9\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u3054\u81ea\u8eab\u3067\u8abf\u67fb\u3057\u3066\u304f\u3060\u3055\u3044\u3002',
  },
};

const footerLinks: Record<string, Record<string, { label: string; href: string }[]>> = {
    roman: {
      products: [
        { label: '🪙 Coins & Prices', href: '/coins' },
        { label: '🎁 Free Airdrops', href: '/airdrops' },
        { label: '⛏️ Mining', href: '/mining' },
        { label: '📊 Global Markets', href: '/markets' },
        { label: '💼 Portfolio Tracker', href: '/portfolio' },
        { label: '🔔 Price Alerts', href: '/alerts' },
        { label: '🚰 Faucet', href: '/faucet' },
        { label: '🟢 Onchain GM', href: '/onchain-gm' },
      ],
    learn: [
      { label: '📖 Bitcoin Seekhen', href: '/learn-bitcoin' },
      { label: '✍️ Blog & Guides', href: '/blog' },
      { label: '📰 Khabrain', href: '/news' },
      { label: '🔬 Tahqeeq', href: '/research' },
    ],
    company: [
      { label: '👥 Hamare Baare Mein', href: '/about' },
      { label: '💬 Rabta Karein', href: '/contact' },
      { label: '📢 Ishtihar Dein', href: '/advertise' },
      { label: '🤝 Hamara Sath Dein', href: '/support-us' },
      { label: '❤️ Like Our Work', href: '/donate' },
    ],
    legal: [
      { label: '🔒 Privacy Policy', href: '/privacy-policy' },
      { label: '📄 Terms of Service', href: '/terms' },
      { label: '⚠️ Disclaimer', href: '/disclaimer' },
    ],
  },
    ur: {
      products: [
        { label: '🪙 کوائنز اور قیمتیں', href: '/coins' },
        { label: '🎁 مفت ایئرڈراپس', href: '/airdrops' },
        { label: '⛏️ مائننگ', href: '/mining' },
        { label: '📊 عالمی منڈیاں', href: '/markets' },
        { label: '💼 پورٹ فولیو', href: '/portfolio' },
        { label: '🔔 قیمت الرٹس', href: '/alerts' },
        { label: '🚰 Faucet', href: '/faucet' },
        { label: '🟢 Onchain GM', href: '/onchain-gm' },
      ],
    learn: [
      { label: '📖 بٹ کوائن سیکھیں', href: '/learn-bitcoin' },
      { label: '✍️ بلاگ اور گائیڈز', href: '/blog' },
      { label: '📰 خبریں', href: '/news' },
      { label: '🔬 تحقیق', href: '/research' },
    ],
    company: [
      { label: '👥 ہمارے بارے میں', href: '/about' },
      { label: '💬 رابطہ کریں', href: '/contact' },
      { label: '📢 اشتہار دیں', href: '/advertise' },
      { label: '🤝 ہمارا ساتھ دیں', href: '/support-us' },
      { label: '❤️ ہمارا کام پسند کریں', href: '/donate' },
    ],
    legal: [
      { label: '🔒 رازداری کی پالیسی', href: '/privacy-policy' },
      { label: '📄 سروس کی شرائط', href: '/terms' },
      { label: '⚠️ دستبرداری', href: '/disclaimer' },
    ],
  },
  ps: {
    products: [
      { label: '🪙 سکي او بیې', href: '/coins' },
      { label: '🎁 وړیا ایروډراپس', href: '/airdrops' },
      { label: '⛏️ مایننګ', href: '/mining' },
      { label: '📊 نړیوال مارکیټونه', href: '/markets' },
      { label: '💼 پورټفولیو', href: '/portfolio' },
      { label: '🔔 د بیو الرتونه', href: '/alerts' },
    ],
    learn: [
      { label: '📖 بټ کوائن زده کړه', href: '/learn-bitcoin' },
      { label: '✍️ بلاګ او لارښودونه', href: '/blog' },
      { label: '📰 خبرونه', href: '/news' },
      { label: '🔬 څیړنه', href: '/research' },
    ],
    company: [
      { label: '👥 زموږ په اړه', href: '/about' },
      { label: '💬 اړیکه ونیسئ', href: '/contact' },
      { label: '📢 اشتہار ورکړئ', href: '/advertise' },
      { label: '🤝 زموږ ملاتړ وکړئ', href: '/support-us' },
      { label: '❤️ زموږ کار خوښ کړئ', href: '/donate' },
    ],
    legal: [
      { label: '🔒 د محرمیت پالیسي', href: '/privacy-policy' },
      { label: '📄 د خدمت شرایط', href: '/terms' },
      { label: '⚠️ ډس کلیمر', href: '/disclaimer' },
    ],
  },
  sd: {
    products: [
      { label: '🪙 سڪا ۽ قيمتون', href: '/coins' },
      { label: '🎁 مفت ايئرڊراپس', href: '/airdrops' },
      { label: '⛏️ مائيننگ', href: '/mining' },
      { label: '📊 عالمي مارڪيٽون', href: '/markets' },
      { label: '💼 پورٽفوليو', href: '/portfolio' },
      { label: '🔔 قيمت الرٽس', href: '/alerts' },
    ],
    learn: [
      { label: '📖 بٽ ڪوائن سکيا', href: '/learn-bitcoin' },
      { label: '✍️ بلاگ ۽ گائيڊز', href: '/blog' },
      { label: '📰 خبرون', href: '/news' },
      { label: '🔬 تحقیق', href: '/research' },
    ],
    company: [
      { label: '👥 اسانجي باري ۾', href: '/about' },
      { label: '💬 رابطو ڪريو', href: '/contact' },
      { label: '📢 اشتہار ڏيو', href: '/advertise' },
      { label: '🤝 اسانجو ساٿ ڏيو', href: '/support-us' },
      { label: '❤️ اسانجو ڪم پسند ڪريو', href: '/donate' },
    ],
    legal: [
      { label: '🔒 پرائیویسي پالیسي', href: '/privacy-policy' },
      { label: '📄 سروس جا شرط', href: '/terms' },
      { label: '⚠️ ڊس کلیمر', href: '/disclaimer' },
    ],
  },
  es: {
    products: [
      { label: '🪙 Monedas y Precios', href: '/coins' },
      { label: '🎁 Airdrops Gratis', href: '/airdrops' },
      { label: '⛏️ Minería', href: '/mining' },
      { label: '📊 Mercados Globales', href: '/markets' },
      { label: '💼 Portafolio', href: '/portfolio' },
      { label: '🔔 Alertas', href: '/alerts' },
    ],
    learn: [
      { label: '📖 Aprende Bitcoin', href: '/learn-bitcoin' },
      { label: '✍️ Blog y Guías', href: '/blog' },
      { label: '📰 Noticias', href: '/news' },
      { label: '🔬 Investigación', href: '/research' },
    ],
    company: [
      { label: '👥 Sobre Nosotros', href: '/about' },
      { label: '💬 Contacto', href: '/contact' },
      { label: '📢 Publicidad', href: '/advertise' },
      { label: '🤝 Apóyanos', href: '/support-us' },
      { label: '❤️ Donar', href: '/donate' },
    ],
    legal: [
      { label: '🔒 Privacidad', href: '/privacy-policy' },
      { label: '📄 Términos', href: '/terms' },
      { label: '⚠️ Aviso Legal', href: '/disclaimer' },
    ],
  },
  ar: {
    products: [
      { label: '🪙 العملات والأسعار', href: '/coins' },
      { label: '🎁 الإسقاطات الجوية', href: '/airdrops' },
      { label: '⛏️ التعدين', href: '/mining' },
      { label: '📊 الأسواق العالمية', href: '/markets' },
      { label: '💼 المحفظة', href: '/portfolio' },
      { label: '🔔 التنبيهات', href: '/alerts' },
    ],
    learn: [
      { label: '📖 تعلم البيتكوين', href: '/learn-bitcoin' },
      { label: '✍️ المدونة', href: '/blog' },
      { label: '📰 الأخبار', href: '/news' },
      { label: '🔬 البحث', href: '/research' },
    ],
    company: [
      { label: '👥 معلومات عنا', href: '/about' },
      { label: '💬 اتصل بنا', href: '/contact' },
      { label: '📢 إعلن معنا', href: '/advertise' },
      { label: '🤝 ادعمنا', href: '/support-us' },
      { label: '❤️ تبرع', href: '/donate' },
    ],
    legal: [
      { label: '🔒 الخصوصية', href: '/privacy-policy' },
      { label: '📄 الشروط', href: '/terms' },
      { label: '⚠️ إخلاء مسؤولية', href: '/disclaimer' },
    ],
  },
  pt: {
    products: [
      { label: '🪙 Moedas e Preços', href: '/coins' },
      { label: '🎁 Airdrops Grátis', href: '/airdrops' },
      { label: '⛏️ Mineração', href: '/mining' },
      { label: '📊 Mercados Globais', href: '/markets' },
      { label: '💼 Portfólio', href: '/portfolio' },
      { label: '🔔 Alertas', href: '/alerts' },
    ],
    learn: [
      { label: '📖 Aprenda Bitcoin', href: '/learn-bitcoin' },
      { label: '✍️ Blog e Guias', href: '/blog' },
      { label: '📰 Notícias', href: '/news' },
      { label: '🔬 Pesquisa', href: '/research' },
    ],
    company: [
      { label: '👥 Sobre Nós', href: '/about' },
      { label: '💬 Contato', href: '/contact' },
      { label: '📢 Anuncie', href: '/advertise' },
      { label: '🤝 Apoie-nos', href: '/support-us' },
      { label: '❤️ Doar', href: '/donate' },
    ],
    legal: [
      { label: '🔒 Privacidade', href: '/privacy-policy' },
      { label: '📄 Termos', href: '/terms' },
      { label: '⚠️ Aviso Legal', href: '/disclaimer' },
    ],
  },
    en: {
      products: [
        { label: '🪙 Coins & Prices', href: '/coins' },
        { label: '🎁 Free Airdrops', href: '/airdrops' },
        { label: '⛏️ Mining', href: '/mining' },
        { label: '📊 Global Markets', href: '/markets' },
        { label: '💼 Portfolio Tracker', href: '/portfolio' },
        { label: '🔔 Price Alerts', href: '/alerts' },
        { label: '🚰 Faucet', href: '/faucet' },
        { label: '🟢 Onchain GM', href: '/onchain-gm' },
      ],
    learn: [
      { label: '📖 Learn Bitcoin', href: '/learn-bitcoin' },
      { label: '✍️ Blog & Guides', href: '/blog' },
      { label: '📰 Crypto News', href: '/news' },
      { label: '🔬 Research', href: '/research' },
    ],
    company: [
      { label: '👥 About Us', href: '/about' },
      { label: '💬 Contact Us', href: '/contact' },
      { label: '📢 Advertise', href: '/advertise' },
      { label: '🤝 Support Us', href: '/support-us' },
      { label: '❤️ Like Our Work', href: '/donate' },
    ],
    legal: [
      { label: '🔒 Privacy Policy', href: '/privacy-policy' },
      { label: '📄 Terms of Service', href: '/terms' },
      { label: '⚠️ Disclaimer', href: '/disclaimer' },
    ],
  },
  hi: {
    products: [
      { label: '🪙 सिक्के और कीमतें', href: '/coins' },
      { label: '🎁 मुफ्त एयरड्रॉप', href: '/airdrops' },
      { label: '⛏️ माइनिंग', href: '/mining' },
      { label: '📊 वैश्विक बाजार', href: '/markets' },
      { label: '💼 पोर्टफोलियो', href: '/portfolio' },
      { label: '🔔 मूल्य अलर्ट', href: '/alerts' },
      { label: '🤖 AI चैट', href: '/ai' },
    ],
    learn: [
      { label: '📖 बिटकॉइन सीखें', href: '/learn-bitcoin' },
      { label: '✍️ ब्लॉग और गाइड', href: '/blog' },
      { label: '📰 समाचार', href: '/news' },
      { label: '🔬 शोध', href: '/research' },
    ],
    company: [
      { label: '👥 हमारे बारे में', href: '/about' },
      { label: '💬 संपर्क करें', href: '/contact' },
      { label: '📢 विज्ञापन दें', href: '/advertise' },
      { label: '🤝 हमें समर्थन दें', href: '/support-us' },
      { label: '❤️ हमारा काम पसंद करें', href: '/donate' },
    ],
    legal: [
      { label: '🔒 गोपनीयता नीति', href: '/privacy-policy' },
      { label: '📄 सेवा की शर्तें', href: '/terms' },
      { label: '⚠️ अस्वीकरण', href: '/disclaimer' },
    ],
  },
  fr: {
    products: [
      { label: '🪙 Pi\u00e8ces et Prix', href: '/coins' },
      { label: '🎁 Airdrops Gratuits', href: '/airdrops' },
      { label: '⛏️ Minage', href: '/mining' },
      { label: '📊 March\u00e9s Mondiaux', href: '/markets' },
      { label: '💼 Portefeuille', href: '/portfolio' },
      { label: '🔔 Alertes de Prix', href: '/alerts' },
      { label: '🤖 Chat IA', href: '/ai' },
    ],
    learn: [
      { label: '📖 Apprendre Bitcoin', href: '/learn-bitcoin' },
      { label: '✍️ Blog et Guides', href: '/blog' },
      { label: '📰 Actualit\u00e9s', href: '/news' },
      { label: '🔬 Recherche', href: '/research' },
    ],
    company: [
      { label: '👥 \u00c0 Propos', href: '/about' },
      { label: '💬 Contact', href: '/contact' },
      { label: '📢 Publicit\u00e9', href: '/advertise' },
      { label: '🤝 Soutenir', href: '/support-us' },
      { label: '❤️ Faire un Don', href: '/donate' },
    ],
    legal: [
      { label: '🔒 Confidentialit\u00e9', href: '/privacy-policy' },
      { label: '📄 Conditions', href: '/terms' },
      { label: '⚠️ Avis de non-responsabilit\u00e9', href: '/disclaimer' },
    ],
  },
  de: {
    products: [
      { label: '🪙 M\u00fcnzen & Preise', href: '/coins' },
      { label: '🎁 Kostenlose Airdrops', href: '/airdrops' },
      { label: '⛏️ Mining', href: '/mining' },
      { label: '📊 Globale M\u00e4rkte', href: '/markets' },
      { label: '💼 Portfolio', href: '/portfolio' },
      { label: '🔔 Preisalarme', href: '/alerts' },
      { label: '🤖 KI Chat', href: '/ai' },
    ],
    learn: [
      { label: '📖 Bitcoin Lernen', href: '/learn-bitcoin' },
      { label: '✍️ Blog & Leitf\u00e4den', href: '/blog' },
      { label: '📰 Nachrichten', href: '/news' },
      { label: '🔬 Forschung', href: '/research' },
    ],
    company: [
      { label: '👥 \u00dcber Uns', href: '/about' },
      { label: '💬 Kontakt', href: '/contact' },
      { label: '📢 Werben', href: '/advertise' },
      { label: '🤝 Unterst\u00fctzen', href: '/support-us' },
      { label: '❤️ Spenden', href: '/donate' },
    ],
    legal: [
      { label: '🔒 Datenschutz', href: '/privacy-policy' },
      { label: '📄 AGB', href: '/terms' },
      { label: '⚠️ Haftungsausschluss', href: '/disclaimer' },
    ],
  },
  tr: {
    products: [
      { label: '🪙 Coinler ve Fiyatlar', href: '/coins' },
      { label: '🎁 \u00dccretsiz Airdroplar', href: '/airdrops' },
      { label: '⛏️ Madencilik', href: '/mining' },
      { label: '📊 K\u00fcresel Piyasalar', href: '/markets' },
      { label: '💼 Portf\u00f6y', href: '/portfolio' },
      { label: '🔔 Fiyat Uyar\u0131lar\u0131', href: '/alerts' },
      { label: '🤖 AI Sohbet', href: '/ai' },
    ],
    learn: [
      { label: '📖 Bitcoin \u00d6\u011fren', href: '/learn-bitcoin' },
      { label: '✍️ Blog ve Rehberler', href: '/blog' },
      { label: '📰 Haberler', href: '/news' },
      { label: '🔬 Ara\u015ft\u0131rma', href: '/research' },
    ],
    company: [
      { label: '👥 Hakk\u0131m\u0131zda', href: '/about' },
      { label: '💬 \u0130leti\u015fim', href: '/contact' },
      { label: '📢 Reklam Ver', href: '/advertise' },
      { label: '🤝 Destek Ol', href: '/support-us' },
      { label: '❤️ Ba\u011f\u0131\u015f Yap', href: '/donate' },
    ],
    legal: [
      { label: '🔒 Gizlilik Politikas\u0131', href: '/privacy-policy' },
      { label: '📄 Hizmet \u015eartlar\u0131', href: '/terms' },
      { label: '⚠️ Sorumluluk Reddi', href: '/disclaimer' },
    ],
  },
  ru: {
    products: [
      { label: '🪙 \u041c\u043e\u043d\u0435\u0442\u044b \u0438 \u0426\u0435\u043d\u044b', href: '/coins' },
      { label: '🎁 \u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0435 \u0410\u0438\u0440\u0434\u0440\u043e\u043f\u044b', href: '/airdrops' },
      { label: '⛏️ \u041c\u0430\u0439\u043d\u0438\u043d\u0433', href: '/mining' },
      { label: '📊 \u041c\u0438\u0440\u043e\u0432\u044b\u0435 \u0420\u044b\u043d\u043a\u0438', href: '/markets' },
      { label: '💼 \u041f\u043e\u0440\u0442\u0444\u0435\u043b\u044c', href: '/portfolio' },
      { label: '🔔 \u0426\u0435\u043d\u043e\u0432\u044b\u0435 \u041e\u043f\u043e\u0432\u0435\u0449\u0435\u043d\u0438\u044f', href: '/alerts' },
      { label: '🤖 AI \u0427\u0430\u0442', href: '/ai' },
    ],
    learn: [
      { label: '📖 \u0418\u0437\u0443\u0447\u0438\u0442\u044c Bitcoin', href: '/learn-bitcoin' },
      { label: '✍️ \u0411\u043b\u043e\u0433 \u0438 \u0413\u0430\u0439\u0434\u044b', href: '/blog' },
      { label: '📰 \u041d\u043e\u0432\u043e\u0441\u0442\u0438', href: '/news' },
      { label: '🔬 \u0418\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f', href: '/research' },
    ],
    company: [
      { label: '👥 \u041e \u041d\u0430\u0441', href: '/about' },
      { label: '💬 \u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b', href: '/contact' },
      { label: '📢 \u0420\u0435\u043a\u043b\u0430\u043c\u0430', href: '/advertise' },
      { label: '🤝 \u041f\u043e\u0434\u0434\u0435\u0440\u0436\u0430\u0442\u044c', href: '/support-us' },
      { label: '❤️ \u041f\u043e\u0436\u0435\u0440\u0442\u0432\u043e\u0432\u0430\u0442\u044c', href: '/donate' },
    ],
    legal: [
      { label: '🔒 \u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c', href: '/privacy-policy' },
      { label: '📄 \u0423\u0441\u043b\u043e\u0432\u0438\u044f', href: '/terms' },
      { label: '⚠️ \u041e\u0442\u043a\u0430\u0437 \u043e\u0442 \u041e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0441\u0442\u0438', href: '/disclaimer' },
    ],
  },
  zh: {
    products: [
      { label: '🪙 \u5e01\u79cd\u4e0e\u4ef7\u683c', href: '/coins' },
      { label: '🎁 \u514d\u8d39\u7a7a\u6295', href: '/airdrops' },
      { label: '⛏️ \u77ff\u5de5', href: '/mining' },
      { label: '📊 \u5168\u7403\u5e02\u573a', href: '/markets' },
      { label: '💼 \u6295\u8d44\u7ec4\u5408', href: '/portfolio' },
      { label: '🔔 \u4ef7\u683c\u63d0\u9192', href: '/alerts' },
      { label: '🤖 AI \u804a\u5929', href: '/ai' },
    ],
    learn: [
      { label: '📖 \u5b66\u4e60\u6bd4\u7279\u5e01', href: '/learn-bitcoin' },
      { label: '✍️ \u535a\u5ba2\u4e0e\u6307\u5357', href: '/blog' },
      { label: '📰 \u65b0\u95fb', href: '/news' },
      { label: '🔬 \u7814\u7a76', href: '/research' },
    ],
    company: [
      { label: '👥 \u5173\u4e8e\u6211\u4eec', href: '/about' },
      { label: '💬 \u8054\u7cfb\u6211\u4eec', href: '/contact' },
      { label: '📢 \u6295\u653e\u5e7f\u544a', href: '/advertise' },
      { label: '🤝 \u652f\u6301\u6211\u4eec', href: '/support-us' },
      { label: '❤️ \u8d5e\u8d4f', href: '/donate' },
    ],
    legal: [
      { label: '🔒 \u9690\u79c1\u653f\u7b56', href: '/privacy-policy' },
      { label: '📄 \u670d\u52a1\u6761\u6b3e', href: '/terms' },
      { label: '⚠️ \u514d\u8d23\u58f0\u660e', href: '/disclaimer' },
    ],
  },
  ja: {
    products: [
      { label: '🪙 \u30b3\u30a4\u30f3\u3068\u4fa1\u683c', href: '/coins' },
      { label: '🎁 \u30a8\u30a2\u30c9\u30ed\u30c3\u30d7', href: '/airdrops' },
      { label: '⛏️ \u30de\u30a4\u30cb\u30f3\u30b0', href: '/mining' },
      { label: '📊 \u30b0\u30ed\u30fc\u30d0\u30eb\u5e02\u5834', href: '/markets' },
      { label: '💼 \u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa', href: '/portfolio' },
      { label: '🔔 \u4fa1\u683c\u30a2\u30e9\u30fc\u30c8', href: '/alerts' },
      { label: '🤖 AI \u30c1\u30e3\u30c3\u30c8', href: '/ai' },
    ],
    learn: [
      { label: '📖 \u30d3\u30c3\u30c8\u30b3\u30a4\u30f3\u3092\u5b66\u3076', href: '/learn-bitcoin' },
      { label: '✍️ \u30d6\u30ed\u30b0\u3068\u30ac\u30a4\u30c9', href: '/blog' },
      { label: '📰 \u30cb\u30e5\u30fc\u30b9', href: '/news' },
      { label: '🔬 \u7814\u7a76', href: '/research' },
    ],
    company: [
      { label: '👥 \u4f1a\u793e\u60c5\u5831', href: '/about' },
      { label: '💬 \u304a\u554f\u3044\u5408\u308f\u305b', href: '/contact' },
      { label: '📢 \u5e83\u544a\u63b2\u8f09', href: '/advertise' },
      { label: '🤝 \u30b5\u30dd\u30fc\u30c8', href: '/support-us' },
      { label: '❤️ \u5bc4\u4ed8', href: '/donate' },
    ],
    legal: [
      { label: '🔒 \u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u30dd\u30ea\u30b7\u30fc', href: '/privacy-policy' },
      { label: '📄 \u5229\u7528\u898f\u7d04', href: '/terms' },
      { label: '⚠️ \u514d\u8cac\u4e8b\u9805', href: '/disclaimer' },
    ],
  },
};

export function SiteFooter() {
  const { language } = useAppStore();
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();
  const lang = language || 'roman';
  const texts = footerTexts[lang] || footerTexts.roman;
  const links = footerLinks[lang] || footerLinks.roman;
  const socialLinks = useSocialLinks();

  const siteName = settings.siteName || 'BitcoinUrdu';
  const siteNameParts = siteName.split(/(?=[A-Z])/);
  const siteNameFirst = siteNameParts[0] || 'Bitcoin';
  const siteNameSecond = siteNameParts.slice(1).join('') || 'Urdu';

  const socialIcons = [
    { key: 'twitter' as const, label: 'X', icon: <Twitter className="h-5 w-5" />, href: socialLinks.twitter },
    { key: 'telegram' as const, label: 'Telegram', icon: <Send className="h-5 w-5" />, href: socialLinks.telegram },
    { key: 'youtube' as const, label: 'YouTube', icon: <Youtube className="h-5 w-5" />, href: socialLinks.youtube },
    { key: 'facebook' as const, label: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: socialLinks.facebook },
  ].filter((s) => s.href);

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-full px-2 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt={siteName} className="h-10 w-auto object-contain hidden dark:block" />
              <img src="/logo-day.svg" alt={siteName} className="h-10 w-auto object-contain block dark:hidden" />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {texts.desc}
            </p>
            <div className="flex gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2.5 text-muted-foreground hover:bg-bitcoin/10 hover:text-bitcoin transition-all duration-200 hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">{texts.products}</h3>
            <ul className="space-y-2">
              {links.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">{texts.learn}</h3>
            <ul className="space-y-2">
              {links.learn.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">{texts.company}</h3>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">{texts.legal}</h3>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {year} {siteName}. {texts.rights}
          </p>
          <p className="text-xs text-muted-foreground">
            {texts.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
