'use client';

import { useAppStore } from '@/stores';
import Link from 'next/link';
import { Mail, Twitter, Send } from 'lucide-react';

const aboutTexts: Record<string, Record<string, string>> = {
  roman: {
    title: 'BitcoinUrdu Ke Baare Mein',
    desc: "The world's leading cryptocurrency platform — real-time prices, airdrop tracking, portfolio management aur AI-powered insights.",
    missionTitle: 'Hamara Mission',
    missionDesc: 'BitcoinUrdu isliye banaya gaya taake cryptocurrency har kisi ke liye accessible ho. Hamara yaqeen hai ke financial education aur crypto tools local languages mein hone chahiye.',
    offerTitle: 'Hum Kya Offer Karte Hain',
    offer1: 'Live cryptocurrency prices multiple global exchanges se',
    offer2: 'Comprehensive airdrop tracking aur eligibility checker',
    offer3: 'Portfolio tracker with PNL calculations',
    offer4: 'AI-powered crypto chat assistant',
    offer5: 'Global markets data (stocks, forex, commodities)',
    offer6: 'Bitcoin learning center multiple languages mein',
    offer7: 'Price alerts aur notifications',
    teamTitle: 'Hamari Team',
    teamDesc: 'Hum crypto enthusiasts, developers aur educators ki team hain jo blockchain technology aur financial freedom ke liye passionate hain.',
    contactTitle: 'Rabta',
    contactEmail: 'Email: contact@bitcoinurdu.com',
    contactTwitter: 'Twitter: @bitcoin_urdu',
    contactTelegram: 'Telegram: t.me/bitcoinurdu',
  },
  ur: {
    title: 'بٹ کوائن اردو کے بارے میں',
    desc: 'پاکستان کا لیڈنگ کرپٹو کرنسی پلیٹ فارم — ریئل ٹائم قیمتیں، ایئرڈراپ ٹریکنگ، پورٹ فولیو مینجمنٹ اور اے آئی پاورڈ انسائٹس۔',
    missionTitle: 'ہمارا مشن',
    missionDesc: 'بٹ کوائن اردو اس لیے بنایا گیا تاکہ کرپٹو کرنسی ہر کسی کے لیے قابل رسائی ہو، خاص طور پر پاکستان اور اردو بولنے والوں کے لیے۔ ہمارا یقین ہے کہ مالیاتی تعلیم اور کرپٹو ٹولز مقامی زبانوں میں ہونے چاہئیں۔',
    offerTitle: 'ہم کیا پیش کرتے ہیں',
    offer1: 'کئی عالمی ایکسچینجز سے لائیو کرپٹو کرنسی قیمتیں',
    offer2: 'جامع ایئرڈراپ ٹریکنگ اور اہلیت چیکر',
    offer3: 'پی این ایل کیلکولیشن کے ساتھ پورٹ فولیو ٹریکر',
    offer4: 'اے آئی پاورڈ کرپٹو چیٹ اسسٹنٹ',
    offer5: 'عالمی مارکیٹس ڈیٹا (اسٹاکس، فاریکس، کموڈٹیز)',
    offer6: 'کئی زبانوں میں بٹ کوائن لرننگ سینٹر',
    offer7: 'قیمت الرٹس اور نوٹیفیکیشنز',
    teamTitle: 'ہماری ٹیم',
    teamDesc: 'ہم کرپٹو شوقین، ڈویلپرز اور ایجوکیٹرز کی ٹیم ہیں جو بلاک چین ٹیکنالوجی اور مالیاتی آزادی کے لیے پرجوش ہیں۔',
    contactTitle: 'رابطہ',
    contactEmail: 'ای میل: contact@bitcoinurdu.com',
    contactTwitter: 'ٹویٹر: @bitcoin_urdu',
    contactTelegram: 'ٹیلیگرام: t.me/bitcoinurdu',
  },
  ps: {
    title: 'د بټ کویین اردو په اړه',
    desc: 'د پاکستان مخکښ کریپټو کرنسی پلیټ فارم.',
    missionTitle: 'زموږ ماموریت',
    missionDesc: 'بټ کویین اردو د دې لپاره جوړ شوی و چې کریپټو ټولو ته لاسرسی ولري.',
    offerTitle: 'موږ څه وړاندې کوو',
    offer1: 'د نړیوالو ایکسچینجونو څخه ژوندۍ قیمتونه',
    offer2: 'بشپړ ایروډراپ ټریکنګ',
    offer3: 'پورټ فولیو ټریکر',
    offer4: 'AI پاورډ چیٹ اسسټنټ',
    offer5: 'نړیوال مارکیټ ډاټا',
    offer6: 'پو څو ژبو کې زده کړه',
    offer7: 'د قیمت خبرتیاوې',
    teamTitle: 'زموږ ټیم',
    teamDesc: 'موږ د کریپټو مینه والو، پراختیا کونکو او ښوونکو ټیم یو.',
    contactTitle: 'اړیکه',
    contactEmail: 'بریښنالیک: contact@bitcoinurdu.com',
    contactTwitter: 'ټویټر: @bitcoin_urdu',
    contactTelegram: 'ټیلیګرام: t.me/bitcoinurdu',
  },
  sd: {
    title: 'بٽ ڪوائن اردو بابت',
    desc: 'پاڪستان جو اڳواڻ ڪرپٽو ڪرنسي پليٽ فارم.',
    missionTitle: 'اسان جو مشن',
    missionDesc: 'بٽ ڪوائن اردو ان ڪري ٺاهيو ويو ته ڪرپٽو سڀني لاءِ دستياب هجي.',
    offerTitle: 'اسان ڇا پيش ڪريون ٿا',
    offer1: 'عالمي ايڪسچينجز تان لائيو قيمتون',
    offer2: 'مڪمل ايئرڊراپ ٽريڪنگ',
    offer3: 'پورٽ فوليو ٽريڪر',
    offer4: 'AI پاورڊ چيٽ اسسٽنٽ',
    offer5: 'عالمي مارڪيٽ ڊيٽا',
    offer6: 'ڪيترين ٻولين ۾ سکيا',
    offer7: 'قيمت الرٽس',
    teamTitle: 'اسان جي ٽيم',
    teamDesc: 'اسان ڪرپٽو شوقين، ڊولپرز ۽ تعليم ڏيندڙن جي ٽيم آهيون.',
    contactTitle: 'رابطو',
    contactEmail: 'اي ميل: contact@bitcoinurdu.com',
    contactTwitter: 'ٽويٽر: @bitcoin_urdu',
    contactTelegram: 'ٽيليگرام: t.me/bitcoinurdu',
  },
  en: {
    title: 'About BitcoinUrdu',
    desc: "The world's leading cryptocurrency platform — real-time prices, airdrop tracking, portfolio management, and AI-powered insights.",
    missionTitle: 'Our Mission',
    missionDesc: 'BitcoinUrdu was created to make cryptocurrency accessible to everyone worldwide. We believe that financial education and crypto tools should be available in local languages.',
    offerTitle: 'What We Offer',
    offer1: 'Live cryptocurrency prices from multiple global exchanges',
    offer2: 'Comprehensive airdrop tracking and eligibility checker',
    offer3: 'Portfolio tracker with PNL calculations',
    offer4: 'AI-powered crypto chat assistant',
    offer5: 'Global markets data (stocks, forex, commodities)',
    offer6: 'Bitcoin learning center in multiple languages',
    offer7: 'Price alerts and notifications',
    teamTitle: 'Our Team',
    teamDesc: 'We are a team of crypto enthusiasts, developers, and educators passionate about blockchain technology and financial freedom.',
    contactTitle: 'Contact',
    contactEmail: 'Email: contact@bitcoinurdu.com',
    contactTwitter: 'Twitter: @bitcoin_urdu',
    contactTelegram: 'Telegram: t.me/bitcoinurdu',
  },
  hi: {
    title: 'BitcoinUrdu के बारे में',
    desc: 'दुनिया का अग्रणी क्रिप्टोकरेंसी प्लेटफॉर्म — रीयल-टाइम कीमतें, एयरड्रॉप ट्रैकिंग, पोर्टफोलियो प्रबंधन और AI-संचालित जानकारी।',
    missionTitle: 'हमारा मिशन',
    missionDesc: 'BitcoinUrdu को क्रिप्टोकरेंसी को सभी के लिए सुलभ बनाने के लिए बनाया गया था। हमारा मानना है कि वित्तीय शिक्षा और क्रिप्टो उपकरण स्थानीय भाषाओं में उपलब्ध होने चाहिए।',
    offerTitle: 'हम क्या प्रदान करते हैं',
    offer1: 'कई वैश्विक एक्सचेंजों से लाइव क्रिप्टोकरेंसी की कीमतें',
    offer2: 'व्यापक एयरड्रॉप ट्रैकिंग और पात्रता जांच',
    offer3: 'PNL गणना के साथ पोर्टफोलियो ट्रैकर',
    offer4: 'AI-संचालित क्रिप्टो चैट सहायक',
    offer5: 'वैश्विक बाजार डेटा (स्टॉक, फोरेक्स, कमोडिटीज)',
    offer6: 'कई भाषाओं में बिटकॉइन लर्निंग सेंटर',
    offer7: 'मूल्य अलर्ट और सूचनाएं',
    teamTitle: 'हमारी टीम',
    teamDesc: 'हम क्रिप्टो उत्साही, डेवलपर्स और शिक्षकों की एक टीम हैं जो ब्लॉकचेन तकनीक और वित्तीय स्वतंत्रता के प्रति जुनूनी हैं।',
    contactTitle: 'संपर्क',
    contactEmail: 'ईमेल: contact@bitcoinurdu.com',
    contactTwitter: 'ट्विटर: @bitcoin_urdu',
    contactTelegram: 'टेलीग्राम: t.me/bitcoinurdu',
  },
  fr: {
    title: 'À propos de BitcoinUrdu',
    desc: 'La plateforme cryptographique leader au monde — prix en temps réel, suivi des airdrops, gestion de portefeuille et informations basées sur l\'IA.',
    missionTitle: 'Notre Mission',
    missionDesc: 'BitcoinUrdu a été créé pour rendre la cryptomonnaie accessible à tous. Nous croyons que l\'éducation financière et les outils crypto doivent être disponibles dans les langues locales.',
    offerTitle: 'Ce Que Nous Offrons',
    offer1: 'Prix de cryptomonnaies en direct depuis plusieurs échanges mondiaux',
    offer2: 'Suivi complet des airdrops et vérificateur d\'éligibilité',
    offer3: 'Gestionnaire de portefeuille avec calculs PNL',
    offer4: 'Assistant de chat crypto basé sur l\'IA',
    offer5: 'Données des marchés mondiaux (actions, forex, matières premières)',
    offer6: 'Centre d\'apprentissage Bitcoin en plusieurs langues',
    offer7: 'Alertes de prix et notifications',
    teamTitle: 'Notre Équipe',
    teamDesc: 'Nous sommes une équipe de passionnés de crypto, développeurs et éducateurs passionnés par la technologie blockchain et la liberté financière.',
    contactTitle: 'Contact',
    contactEmail: 'Email: contact@bitcoinurdu.com',
    contactTwitter: 'Twitter: @bitcoin_urdu',
    contactTelegram: 'Telegram: t.me/bitcoinurdu',
  },
  de: {
    title: 'Über BitcoinUrdu',
    desc: 'Die weltweit führende Kryptowährungsplattform — Echtzeit-Preise, Airdrop-Tracking, Portfolioverwaltung und KI-gestützte Einblicke.',
    missionTitle: 'Unsere Mission',
    missionDesc: 'BitcoinUrdu wurde entwickelt, um Kryptowährungen für alle zugänglich zu machen. Wir glauben, dass Finanzbildung und Krypto-Tools in lokalen Sprachen verfügbar sein sollten.',
    offerTitle: 'Was Wir Bieten',
    offer1: 'Live-Kryptopreise von mehreren globalen Börsen',
    offer2: 'Umfassendes Airdrop-Tracking und Berechtigungsprüfer',
    offer3: 'Portfolio-Tracker mit PNL-Berechnungen',
    offer4: 'KI-gestützter Krypto-Chat-Assistent',
    offer5: 'Globale Marktdaten (Aktien, Devisen, Rohstoffe)',
    offer6: 'Bitcoin Lernzentrum in mehreren Sprachen',
    offer7: 'Preisalarme und Benachrichtigungen',
    teamTitle: 'Unser Team',
    teamDesc: 'Wir sind ein Team von Krypto-Enthusiasten, Entwicklern und Pädagogen, die sich für Blockchain-Technologie und finanzielle Freiheit begeistern.',
    contactTitle: 'Kontakt',
    contactEmail: 'E-Mail: contact@bitcoinurdu.com',
    contactTwitter: 'Twitter: @bitcoin_urdu',
    contactTelegram: 'Telegram: t.me/bitcoinurdu',
  },
  tr: {
    title: 'BitcoinUrdu Hakkında',
    desc: 'Dünyanın lider kripto para platformu — gerçek zamanlı fiyatlar, airdrop takibi, portföy yönetimi ve AI destekli içgörüler.',
    missionTitle: 'Misyonumuz',
    missionDesc: 'BitcoinUrdu, kripto parayı herkes için erişilebilir kılmak amacıyla oluşturuldu. Finansal eğitim ve kripto araçlarının yerel dillerde sunulması gerektiğine inanıyoruz.',
    offerTitle: 'Sunduklarımız',
    offer1: 'Birden çok küresel borsadan canlı kripto para fiyatları',
    offer2: 'Kapsamlı airdrop takibi ve uygunluk denetleyicisi',
    offer3: 'PNL hesaplamalarıyla portföy takipçisi',
    offer4: 'AI destekli kripto sohbet asistanı',
    offer5: 'Küresel piyasa verileri (hisseler, forex, emtialar)',
    offer6: 'Birden çok dilde Bitcoin öğrenme merkezi',
    offer7: 'Fiyat uyarıları ve bildirimler',
    teamTitle: 'Ekibimiz',
    teamDesc: 'Blockchain teknolojisi ve finansal özgürlük konusunda tutkulu, kripto meraklıları, geliştiriciler ve eğitimcilerden oluşan bir ekibiz.',
    contactTitle: 'İletişim',
    contactEmail: 'E-posta: contact@bitcoinurdu.com',
    contactTwitter: 'Twitter: @bitcoin_urdu',
    contactTelegram: 'Telegram: t.me/bitcoinurdu',
  },
  ru: {
    title: 'О BitcoinUrdu',
    desc: 'Ведущая криптовалютная платформа в мире — цены в реальном времени, отслеживание эйрдропов, управление портфелем и аналитика на базе ИИ.',
    missionTitle: 'Наша Миссия',
    missionDesc: 'BitcoinUrdu был создан, чтобы сделать криптовалюту доступной для всех. Мы считаем, что финансовое образование и криптоинструменты должны быть доступны на местных языках.',
    offerTitle: 'Что Мы Предлагаем',
    offer1: 'Цены криптовалют в реальном времени с нескольких мировых бирж',
    offer2: 'Комплексное отслеживание эйрдропов и проверка eligibility',
    offer3: 'Трекер портфеля с расчетом PNL',
    offer4: 'Крипто-чат-ассистент на базе ИИ',
    offer5: 'Данные мировых рынков (акции, форекс, сырьевые товары)',
    offer6: 'Центр обучения Bitcoin на нескольких языках',
    offer7: 'Ценовые оповещения и уведомления',
    teamTitle: 'Наша Команда',
    teamDesc: 'Мы команда крипто-энтузиастов, разработчиков и педагогов, увлеченных технологией блокчейн и финансовой свободой.',
    contactTitle: 'Контакты',
    contactEmail: 'Email: contact@bitcoinurdu.com',
    contactTwitter: 'Twitter: @bitcoin_urdu',
    contactTelegram: 'Telegram: t.me/bitcoinurdu',
  },
  zh: {
    title: '关于 BitcoinUrdu',
    desc: '全球领先的加密货币平台 — 实时价格、空投追踪、投资组合管理和 AI 驱动洞察。',
    missionTitle: '我们的使命',
    missionDesc: 'BitcoinUrdu 旨在让加密货币对每个人都触手可及。我们相信金融教育和加密货币工具应该以本地语言提供。',
    offerTitle: '我们提供的服务',
    offer1: '来自多个全球交易所的实时加密货币价格',
    offer2: '全面的空投追踪和资格检查器',
    offer3: '带盈亏计算的投资组合追踪器',
    offer4: 'AI 驱动的加密货币聊天助手',
    offer5: '全球市场数据（股票、外汇、大宗商品）',
    offer6: '多种语言的比特币学习中心',
    offer7: '价格提醒和通知',
    teamTitle: '我们的团队',
    teamDesc: '我们是一群对区块链技术和金融自由充满热情的加密货币爱好者、开发者和教育者。',
    contactTitle: '联系方式',
    contactEmail: '邮箱: contact@bitcoinurdu.com',
    contactTwitter: '推特: @bitcoin_urdu',
    contactTelegram: 'Telegram: t.me/bitcoinurdu',
  },
  ja: {
    title: 'BitcoinUrduについて',
    desc: '世界をリードする暗号通貨プラットフォーム — リアルタイム価格、エアドロップ追跡、ポートフォリオ管理、AI搭載インサイト。',
    missionTitle: '私たちの使命',
    missionDesc: 'BitcoinUrduは、暗号通貨をすべての人にアクセス可能にするために作られました。金融教育と暗号ツールは現地の言語で提供されるべきだと考えています。',
    offerTitle: '提供サービス',
    offer1: '複数のグローバル取引所からのライブ暗号通貨価格',
    offer2: '包括的なエアドロップ追跡と資格チェッカー',
    offer3: '損益計算機能付きポートフォリオトラッカー',
    offer4: 'AI搭載暗号通貨チャットアシスタント',
    offer5: '世界市場データ（株式、FX、商品）',
    offer6: '複数言語対応のビットコイン学習センター',
    offer7: '価格アラートと通知',
    teamTitle: '私たちのチーム',
    teamDesc: '私たちは、ブロックチェーン技術と金融の自由に情熱を注ぐ暗号愛好家、開発者、教育者のチームです。',
    contactTitle: 'お問い合わせ',
    contactEmail: 'メール: contact@bitcoinurdu.com',
    contactTwitter: 'Twitter: @bitcoin_urdu',
    contactTelegram: 'Telegram: t.me/bitcoinurdu',
  },
};

export default function AboutPage() {
  const { language } = useAppStore();
  const t = aboutTexts[language] || aboutTexts.ur;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground mt-2">{t.desc}</p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">{t.missionTitle}</h2>
        <p className="text-muted-foreground">{t.missionDesc}</p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">{t.offerTitle}</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• {t.offer1}</li>
          <li>• {t.offer2}</li>
          <li>• {t.offer3}</li>
          <li>• {t.offer4}</li>
          <li>• {t.offer5}</li>
          <li>• {t.offer6}</li>
          <li>• {t.offer7}</li>
        </ul>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">{t.teamTitle}</h2>
        <p className="text-muted-foreground">{t.teamDesc}</p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">{t.contactTitle}</h2>
        <div className="space-y-3">
          <Link href="mailto:contact@bitcoinurdu.com" className="flex items-center gap-3 text-muted-foreground hover:text-bitcoin transition-colors">
            <Mail className="h-4 w-4" />
            <span>{t.contactEmail}</span>
          </Link>
          <Link href="https://x.com/bitcoin_urdu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-bitcoin transition-colors">
            <Twitter className="h-4 w-4" />
            <span>{t.contactTwitter}</span>
          </Link>
          <Link href="https://t.me/bitcoinurdu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-bitcoin transition-colors">
            <Send className="h-4 w-4" />
            <span>{t.contactTelegram}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
