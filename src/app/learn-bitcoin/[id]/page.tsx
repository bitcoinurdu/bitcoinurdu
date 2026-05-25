import { LessonPageClient } from './lesson-page-client';

export function generateStaticParams() {
  return Object.keys(LESSONS).map((id) => ({ id }));
}

const LESSONS: Record<string, { title: string; titleUrdu: string; duration: string; level: string; content: string; contentUrdu?: string }> = {
  'what-is-bitcoin': {
    title: 'Bitcoin Kya Hai?',
    titleUrdu: 'بٹ کوائن کیا ہے؟',
    duration: '10 min',
    level: 'Beginner',
    content: `# Bitcoin Kya Hai?

Bitcoin duniya ki pehli aur sab se qeemati cryptocurrency hai, jo 2009 mein **Satoshi Nakamoto** naam ke shakhs ya group ne banayi.

## Ahem Maloomat

| Property | Detail |
|----------|--------|
| Symbol | BTC |
| Max Supply | 21,000,000 |
| Consensus | Proof of Work |
| Block Time | ~10 minute |
| Current Reward | 3.125 BTC (2026 halving ke baad) |

## Bitcoin Kyun Bani?

Bitcoin ek **peer-to-peer electronic cash system** ke tor par design kiya gaya jo bina kisi central authority ke kaam karta hai. 2008 financial crisis ne ye dikhaya ke hamein aise monetary system ki zaroorat hai jise governments ya banks control na kar sakein.

## Bitcoin Kaise Kaam Karta Hai?

### 1. Transactions
Jab aap Bitcoin bhejte hain to transaction network par broadcast hota hai aur miners verify karte hain.

### 2. Mining
Miners complex mathematical puzzles solve karne ke liye compete karte hain. Winner naya block blockchain mein add karta hai aur naye Bitcoin reward mein leta hai.

### 3. Blockchain
Sab confirmed transactions ek public ledger mein record hote hain jise blockchain kehte hain. Ye ledger hazaron computers par maintain hota hai.

### 4. Halving
Taqreeban har 4 saal baad mining reward aadha ho jata hai. Is se naye Bitcoin ki circulation kam hoti hai aur scarcity banti hai.

## Bitcoin Ki Ahmiyat

- **Decentralization**: Koi ek entity Bitcoin control nahi karta
- **Scarcity**: Sirf 21 million Bitcoin hi banenge
- **Censorship Resistance**: Koi Bitcoin transactions nahi rok sakta
- **Portability**: Duniya mein kahin bhi minutes mein bhejein
- **Divisibility**: 1 BTC = 100,000,000 satoshis

## Galat Fehmiyan

❌ "Bitcoin sirf illegal kaamon ke liye use hota hai" — Zyadatar transactions legitimate hain
❌ "Bitcoin ki koi value nahi" — Value scarcity, utility aur network effects se aati hai
❌ "Bitcoin bohat volatile hai" — Volatility saalon mein kam hui hai

## Shuruat Kaise Karein

1. **Seekhein**: Invest karne se pehle basics samjhein
2. **Wallet**: Secure wallet chunein (hardware recommended)
3. **Exchange**: Reputed exchange se khareedein
4. **Security**: 2FA enable karein, seed phrase kabhi share na karein

> ⚠️ Ye sirf taleemi content hai. Financial advice nahi hai. Hamesha apni research karein.`,
    contentUrdu: `# بٹ کوائن کیا ہے؟

بٹ کوائن دنیا کی پہلی اور سب سے قیمتی کرپٹو کرنسی ہے، جو ۲۰۰۹ میں **ساتوشی ناکاموٹو** نامی شخص یا گروپ نے بنائی۔

## اہم معلومات

| خصوصیت | تفصیل |
|----------|--------|
| سمبل | BTC |
| زیادہ سے زیادہ سپلائی | ۲۱,۰۰۰,۰۰۰ |
| اتفاق رائے | پروف آف ورک |
| بلاک ٹائم | ~۱۰ منٹ |
| موجودہ انعام | ۳.۱۲۵ BTC (۲۰۲۴ ہالونگ کے بعد) |

## بٹ کوائن کیوں بنی؟

بٹ کوائن ایک **پیئر ٹو پیئر الیکٹرانک کیش سسٹم** کے طور پر ڈیزائن کیا گیا جو بغیر کسی مرکزی اتھارٹی کے کام کرتا ہے۔ ۲۰۰۸ کے مالیاتی بحران نے یہ دکھایا کہ ہمیں ایسے مالیاتی نظام کی ضرورت ہے جسے حکومتیں یا بینک کنٹرول نہ کر سکیں۔

## بٹ کوائن کیسے کام کرتا ہے؟

### ۱. ٹرانزیکشنز
جب آپ بٹ کوائن بھیجتے ہیں تو ٹرانزیکشن نیٹ ورک پر براڈکاسٹ ہوتی ہے اور مائنرز تصدیق کرتے ہیں۔

### ۲. مائننگ
مائنرز پیچیدہ ریاضی کے پہیلیاں حل کرنے کے لیے مقابلہ کرتے ہیں۔ جیتنے والا نیا بلاک بلاک چین میں شامل کرتا ہے اور نئے بٹ کوائن انعام میں لیتا ہے۔

### ۳. بلاک چین
سب تصدیق شدہ ٹرانزیکشنز ایک عوامی لیجر میں ریکارڈ ہوتی ہیں جسے بلاک چین کہتے ہیں۔ یہ لیجر ہزاروں کمپیوٹرز پر برقرار رکھا جاتا ہے۔

### ۴. ہالونگ
تقریباً ہر ۴ سال بعد مائننگ انعام آدھا ہو جاتا ہے۔ اس سے نئے بٹ کوائن کی گردش کم ہوتی ہے اور قلت بنتی ہے۔

## بٹ کوائن کی اہمیت

- **غیر مرکزی**: کوئی ایک ادارہ بٹ کوائن کنٹرول نہیں کرتا
- **قلّت**: صرف ۲۱ ملین بٹ کوائن ہی بنیں گے
- **سنسرشپ مزاحمت**: کوئی بٹ کوائن ٹرانزیکشنز نہیں روک سکتا
- **پورٹیبلٹی**: دنیا میں کہیں بھی منٹوں میں بھیجیں
- **تقسیم پذیری**: 1 BTC = 100,000,000 ساتوشیز

## غلط فہمیاں

❌ "بٹ کوائن صرف غیر قانونی کاموں کے لیے استعمال ہوتا ہے" — زیادہ تر ٹرانزیکشنز جائز ہیں
❌ "بٹ کوائن کی کوئی ویلیو نہیں" — ویلیو قلت، افادیت اور نیٹ ورک اثرات سے آتی ہے
❌ "بٹ کوائن بہت وولیٹائل ہے" — وولیٹیلیٹی سالوں میں کم ہوئی ہے

## شروعات کیسے کریں

1. **سیکھیں**: انویسٹ کرنے سے پہلے بنیادی باتیں سمجھیں
2. **والیٹ**: محفوظ والیٹ چنیں (ہارڈویئر تجویز کردہ)
3. **ایکسچینج**: معروف ایکسچینج سے خریدیں
4. **سیکورٹی**: 2FA فعال کریں، سیڈ فریز کبھی شیئر نہ کریں

> ⚠️ یہ صرف تعلیمی مواد ہے۔ مالیاتی مشورہ نہیں ہے۔ ہمیشہ اپنی تحقیق کریں۔`,
  },
  'what-is-blockchain': {
    title: 'Blockchain Kya Hai?',
    titleUrdu: 'بلاک چین کیا ہے؟',
    duration: '8 min',
    level: 'Beginner',
    content: `# Blockchain Kya Hai?

Blockchain ek **distributed, immutable digital ledger** hai jo transactions ko computers ke network par record karta hai.

## Kaise Kaam Karta Hai?

### Blocks
Har block mein hota hai:
- Transaction data
- Timestamp
- Unique cryptographic hash
- Pichle block ka hash

### Chain
Blocks chronological order mein linked hote hain, ek chain banate hain. Kisi ek block ko change karne ke liye sab baad ke blocks change karne honge.

### Decentralization
Ek central server ke bajaye, blockchain hazaron nodes worldwide maintain karte hain. Har node ke paas blockchain ki complete copy hoti hai.

## Blockchain Ki Iqsaam

| Type | Description | Examples |
|------|-------------|----------|
| Public | Koi bhi hissa le sakta hai | Bitcoin, Ethereum |
| Private | Restricted access | Hyperledger |
| Consortium | Group ke control mein | R3 Corda |

## Consensus Mechanisms

### Proof of Work (PoW)
- Miners puzzles solve kar ke blocks validate karte hain
- Bitcoin use karta hai
- Energy intensive lekin bohat secure

### Proof of Stake (PoS)
- Validators unke stake ke hisaab se chune jate hain
- Ethereum 2022 se use kar raha hai
- Zyada energy efficient

> ⚠️ Taleemi content hai. Financial advice nahi hai.`,
    contentUrdu: `# بلاک چین کیا ہے؟

بلاک چین ایک **تقسیم شدہ، ناقابل تبدیل ڈیجیٹل لیجر** ہے جو ٹرانزیکشنز کو کمپیوٹرز کے نیٹ ورک پر ریکارڈ کرتی ہے۔

## کیسے کام کرتی ہے؟

### بلاکس
ہر بلاک میں ہوتا ہے:
- ٹرانزیکشن ڈیٹا
- ٹائم اسٹیمپ
- منفرد کرپٹوگرافک ہیش
- پچھلے بلاک کا ہیش

### چین
بلاکس ترتیب وار منسلک ہوتے ہیں، ایک زنجیر بناتے ہیں۔ کسی ایک بلاک کو تبدیل کرنے کے لیے سب بعد کے بلاکس تبدیل کرنے ہوں گے۔

### غیر مرکزی
ایک مرکزی سرور کے بجائے، بلاک چین ہزاروں نوڈز دنیا بھر میں برقرار رکھتے ہیں۔ ہر نوڈ کے پاس بلاک چین کی مکمل کاپی ہوتی ہے۔

## بلاک چین کی اقسام

| قسم | تفصیل | مثالیں |
|------|-------------|----------|
| پبلک | کوئی بھی حصہ لے سکتا ہے | بٹ کوائن، ایتھریم |
| پرائیویٹ | محدود رسائی | ہائپر لیجر |
| کنسورشیم | گروپ کے کنٹرول میں | R3 Corda |

## اتفاق رائے کے طریقے

### پروف آف ورک (PoW)
- مائنرز پہیلیاں حل کر کے بلاکس تصدیق کرتے ہیں
- بٹ کوائن استعمال کرتا ہے
- توانائی طلب لیکن بہت محفوظ

### پروف آف اسٹیک (PoS)
- ویلیڈیٹرز ان کے اسٹیک کے حساب سے چنے جاتے ہیں
- ایتھریم ۲۰۲۲ سے استعمال کر رہا ہے
- زیادہ توانائی موثر

> ⚠️ تعلیمی مواد ہے۔ مالیاتی مشورہ نہیں ہے۔`,
  },
  'crypto-wallets': {
    title: 'Crypto Wallets Ki Qisam',
    titleUrdu: 'کرپٹو والیٹس کی اقسام',
    duration: '7 min',
    level: 'Beginner',
    content: `# Crypto Wallets Ki Qisam

Crypto wallet aapke digital assets ko store aur manage karne ka zariya hai.

## Wallet Ki Iqsaam

### Hot Wallets (Internet Connected)
- **Mobile Wallets**: Trust Wallet, MetaMask
- **Web Wallets**: Browser extensions
- **Desktop Wallets**: Computer software
- **Exchange Wallets**: Binance, Coinbase

### Cold Wallets (Offline)
- **Hardware Wallets**: Ledger, Trezor
- **Paper Wallets**: Printed private keys

## Seed Phrase Kya Hai?

Seed phrase 12-24 words ka combination hai jo aapke wallet ki backup key hai. **Ise kabhi kisi ke sath share na karein.**

## Security Tips

✅ Hardware wallet use karein bari amounts ke liye
✅ 2FA enable karein
✅ Seed phrase offline store karein
❌ Seed phrase digital mein save na karein
❌ Unknown links par click na karein

> ⚠️ Apne assets ki hifazat khud karein.`,
    contentUrdu: `# کرپٹو والیٹس کی اقسام

کرپٹو والیٹ آپ کے ڈیجیٹل اثاثوں کو اسٹور اور منیج کرنے کا ذریعہ ہے۔

## والیٹ کی اقسام

### ہاٹ والیٹس (انٹرنیٹ سے منسلک)
- **موبائل والیٹس**: ٹرسٹ والیٹ، میٹاماسک
- **ویب والیٹس**: براؤزر ایکسٹینشنز
- **ڈیسک ٹاپ والیٹس**: کمپیوٹر سافٹ ویئر
- **ایکسچینج والیٹس**: بائننس، کوائن بیس

### کولڈ والیٹس (آف لائن)
- **ہارڈویئر والیٹس**: لیجر، ٹریزر
- **پیپر والیٹس**: پرنٹڈ پرائیویٹ کیز

## سیڈ فریز کیا ہے؟

سیڈ فریز ۱۲-۲۴ الفاظ کا مجموعہ ہے جو آپ کے والیٹ کی بیک اپ کی ہے۔ **اسے کبھی کسی کے ساتھ شیئر نہ کریں۔**

## سیکیورٹی ٹپس

✅ بڑی رقم کے لیے ہارڈویئر والیٹ استعمال کریں
✅ 2FA فعال کریں
✅ سیڈ فریز آف لائن اسٹور کریں
❌ سیڈ فریز ڈیجیٹل میں محفوظ نہ کریں
❌ نامعلوم لنکس پر کلک نہ کریں

> ⚠️ اپنے اثاثوں کی حفاظت خود کریں۔`,
  },
  'how-to-buy': {
    title: 'Bitcoin Kaise Khareedein?',
    titleUrdu: 'بٹ کوائن کیسے خریدیں؟',
    duration: '6 min',
    level: 'Beginner',
    content: `# Bitcoin Kaise Khareedein?

Global markets mein Bitcoin khareedna ab kafi aasan ho gaya hai.

## Steps

### 1. Exchange Chunein
- **Binance** - Sab se popular
- **OKX** - Global exchanges ke liye friendly
- **KuCoin** - Wide range of coins

### 2. Account Banayein
- Email se register karein
- KYC verification complete karein
- 2FA enable karein

### 3. Deposit Karein
- P2P trading se PKR deposit karein
- Bank transfer ya JazzCash/Easypaisa

### 4. Bitcoin Khareedein
- Spot market mein BTC/USDT select karein
- Amount likhein aur buy karein

### 5. Secure Karein
- Exchange se apne wallet mein transfer karein
- Hardware wallet best hai

> ⚠️ Sirf utna invest karein jitna khona afford kar sakte hain.`,
    contentUrdu: `# بٹ کوائن کیسے خریدیں؟

پاکستان میں بٹ کوائن خریدنا اب کافی آسان ہو گیا ہے۔

## مراحل

### ۱. ایکسچینج چنیں
- **بائننس** - سب سے مقبول
- **اوکے ایکس** - پاکستانی صارفین کے لیے دوستانہ
- **کو کوئن** - کوائنز کی وسیع رینج

### ۲. اکاؤنٹ بنائیں
- ای میل سے رجسٹر کریں
- کے وائی سی تصدیق مکمل کریں
- 2FA فعال کریں

### ۳. ڈپازٹ کریں
- P2P ٹریڈنگ سے PKR ڈپازٹ کریں
- بینک ٹرانسفر یا جز کیش/ایزی پیسہ

### ۴. بٹ کوائن خریدیں
- سپاٹ مارکیٹ میں BTC/USDT منتخب کریں
- رقم لکھیں اور خریدیں

### ۵. محفوظ کریں
- ایکسچینج سے اپنے والیٹ میں ٹرانسفر کریں
- ہارڈویئر والیٹ بہترین ہے

> ⚠️ صرف اتنا انویسٹ کریں جتنا کھونا برداشت کر سکتے ہیں۔`,
  },
  'trading-basics': {
    title: 'Trading Ki Bunyadein',
    titleUrdu: 'ٹریڈنگ کی بنیادیں',
    duration: '12 min',
    level: 'Intermediate',
    content: `# Trading Ki Bunyadein

Crypto trading mein profit kamane ke liye basic knowledge zaroori hai.

## Trading Ki Iqsaam

### Spot Trading
- Direct coins khareedna aur bechna
- Sab se safe tarika
- Long term ke liye behtar

### Futures Trading
- Leverage ke sath trade karna
- Zyada risk, zyada reward
- Beginners ke liye recommend nahi

## Basic Terms

- **Bull Market**: Prices barh rahi hain
- **Bear Market**: Prices gir rahi hain
- **Support**: Price level jahan se price upar jati hai
- **Resistance**: Price level jahan se price neeche aati hai
- **Volume**: Kitna trade ho raha hai

## Risk Management

✅ Stop loss use karein
✅ Portfolio diversify karein
✅ Emotions se trade na karein
❌ Zyada leverage use na karein
❌ FOMO mein trade na karein

> ⚠️ Trading risky hai. Apni research karein.`,
    contentUrdu: `# ٹریڈنگ کی بنیادیں

کرپٹو ٹریڈنگ میں منافع کمانے کے لیے بنیادی علم ضروری ہے۔

## ٹریڈنگ کی اقسام

### سپاٹ ٹریڈنگ
- براہ راست کوائنز خریدنا اور بیچنا
- سب سے محفوظ طریقہ
- طویل مدتی کے لیے بہتر

### فیوچرز ٹریڈنگ
- لیوریج کے ساتھ ٹریڈ کرنا
- زیادہ رسک، زیادہ انعام
- ابتدائیوں کے لیے تجویز نہیں

## بنیادی اصطلاحات

- **بل مارکیٹ**: قیمتیں بڑھ رہی ہیں
- **بیئر مارکیٹ**: قیمتیں گر رہی ہیں
- **سپورٹ**: قیمت کی سطح جہاں سے قیمت اوپر جاتی ہے
- **ریزسٹنس**: قیمت کی سطح جہاں سے قیمت نیچے آتی ہے
- **والیوم**: کتنا ٹریڈ ہو رہا ہے

## رسک مینجمنٹ

✅ اسٹاپ لاس استعمال کریں
✅ پورٹ فولیو متنوع کریں
✅ جذبات سے ٹریڈ نہ کریں
❌ زیادہ لیوریج استعمال نہ کریں
❌ FOMO میں ٹریڈ نہ کریں

> ⚠️ ٹریڈنگ رسکی ہے۔ اپنی تحقیق کریں۔`,
  },
  'defi-explained': {
    title: 'DeFi Kya Hai?',
    titleUrdu: 'ڈی فائی کیا ہے؟',
    duration: '10 min',
    level: 'Intermediate',
    content: `# DeFi Kya Hai?

DeFi (Decentralized Finance) traditional banking ka crypto version hai.

## DeFi Ke Faiday

- **Koi Beech Mein Nahi**: Direct peer-to-peer transactions
- **24/7 Access**: Kabhi bhi use karein
- **Transparent**: Sab kuch blockchain par visible hai
- **Global**: Koi bhi use kar sakta hai

## DeFi Platforms

### Uniswap
- Decentralized exchange (DEX)
- Tokens swap karein bina middleman ke

### Aave
- Lending aur borrowing platform
- Interest kamayein apne crypto par

### Compound
- Crypto lend karein aur interest kamayein

## Risks

- **Smart Contract Bugs**: Code mein errors
- **Impermanent Loss**: Liquidity providing mein nuksan
- **Rug Pulls**: Scam projects

> ⚠️ DeFi risky ho sakta hai. Hamesha DYOR (Do Your Own Research).`,
    contentUrdu: `# ڈی فائی کیا ہے؟

ڈی فائی (ڈی سینٹرلائزڈ فنانس) روایتی بینکنگ کا کرپٹو ورژن ہے۔

## ڈی فائی کے فوائد

- **کوئی بیچ میں نہیں**: براہ راست پیئر ٹو پیئر ٹرانزیکشنز
- **۲۴/۷ رسائی**: کبھی بھی استعمال کریں
- **شفاف**: سب کچھ بلاک چین پر دکھائی دیتا ہے
- **عالمی**: کوئی بھی استعمال کر سکتا ہے

## ڈی فائی پلیٹ فارمز

### یونی سواپ
- ڈی سینٹرلائزڈ ایکسچینج (DEX)
- درمیانی شخص کے بغیر ٹوکنز سواپ کریں

### ایو
- لینڈنگ اور بوروئنگ پلیٹ فارم
- اپنے کرپٹو پر سود کمائیں

### کمپاؤنڈ
- کرپٹو لینڈ کریں اور سود کمائیں

## رسکس

- **سمارٹ کنٹریکٹ بگز**: کوڈ میں غلطیاں
- **عارضی نقصان**: لیکویڈیٹی فراہمی میں نقصان
- **رگ پولز**: اسکیم پروجیکٹس

> ⚠️ ڈی فائی رسکی ہو سکتا ہے۔ ہمیشہ اپنی تحقیق کریں۔`,
  },
  'nft-guide': {
    title: 'NFT Guide: Complete Maloomat',
    titleUrdu: 'این ایف ٹی گائیڈ: مکمل معلومات',
    duration: '8 min',
    level: 'Intermediate',
    content: `# NFT Guide: Complete Maloomat

NFT (Non-Fungible Token) digital assets hain jo unique hote hain.

## NFT Kya Hai?

NFT ek digital certificate hai jo kisi cheez ki ownership prove karta hai - art, music, games, ya virtual land.

## NFT Kaise Kaam Karta Hai?

- Blockchain par store hota hai
- Har NFT unique hota hai
- Buy, sell, ya trade kiya ja sakta hai

## Popular NFT Marketplaces

- **OpenSea** - Sab se bara marketplace
- **Magic Eden** - Solana NFTs
- **Blur** - Pro traders ke liye

## NFT Khareedne Ke Steps

1. Crypto wallet setup karein (MetaMask)
2. Wallet mein ETH ya SOL add karein
3. Marketplace par jayein
4. NFT select karein aur buy karein

## Risks

- Zyadatar NFTs ki value zero ho sakti hai
- Scam projects bohat hain
- Liquidity kam hoti hai

> ⚠️ NFTs speculative hain. Sirf utna invest karein jitna khona afford karein.`,
    contentUrdu: `# این ایف ٹی گائیڈ: مکمل معلومات

این ایف ٹی (نان فنجیبل ٹوکن) ڈیجیٹل اثاثے ہیں جو منفرد ہوتے ہیں۔

## این ایف ٹی کیا ہے؟

این ایف ٹی ایک ڈیجیٹل سرٹیفکیٹ ہے جو کسی چیز کی ملکیت ثابت کرتا ہے - آرٹ، میوزک، گیمز، یا ورچوئل لینڈ۔

## این ایف ٹی کیسے کام کرتا ہے؟

- بلاک چین پر اسٹور ہوتا ہے
- ہر این ایف ٹی منفرد ہوتا ہے
- خرید، فروخت، یا ٹریڈ کیا جا سکتا ہے

## مقبول این ایف ٹی مارکیٹ پلیسز

- **اوپن سی** - سب سے بڑا مارکیٹ پلیس
- **میجک ایڈن** - سولانا این ایف ٹیز
- **بلر** - پرو ٹریڈرز کے لیے

## این ایف ٹی خریدنے کے مراحل

1. کرپٹو والیٹ سیٹ اپ کریں (میٹاماسک)
2. والیٹ میں ETH یا SOL شامل کریں
3. مارکیٹ پلیس پر جائیں
4. این ایف ٹی منتخب کریں اور خریدیں

## رسکس

- زیادہ تر این ایف ٹیز کی ویلیو صفر ہو سکتی ہے
- اسکیم پروجیکٹس بہت ہیں
- لیکویڈیٹی کم ہوتی ہے

> ⚠️ این ایف ٹیز قیاس آرائی ہیں۔ صرف اتنا انویسٹ کریں جتنا کھونا برداشت کریں۔`,
  },
  'security': {
    title: 'Crypto Security: Apne Assets Ki Hifazat',
    titleUrdu: 'کرپٹو سیکیورٹی: اپنے اثاثوں کی حفاظت',
    duration: '9 min',
    level: 'Intermediate',
    content: `# Crypto Security: Apne Assets Ki Hifazat

Crypto mein security sab se ahem cheez hai.

## Golden Rules

✅ **Seed Phrase Offline Rakhein**: Kabhi digital mein save na karein
✅ **2FA Enable Karein**: Har account par
✅ **Hardware Wallet Use Karein**: Bari amounts ke liye
✅ **Verify Karein**: Hamesha URLs check karein
✅ **Updates Karein**: Software updated rakhein

## Common Scams

❌ **Phishing**: Fake websites jo aapke credentials chura lein
❌ **Fake Airdrops**: Unsolicited tokens jo wallet drain karein
❌ **Pump & Dump**: Artificially price barha kar bech dena
❌ **Fake Exchanges**: Bogus platforms jo funds chura lein

## Best Practices

- Alag wallets use karein trading aur holding ke liye
- Regular backups lein
- Password manager use karein
- Public WiFi par transactions na karein

> ⚠️ Apni security khud ki zimmedari hai.`,
    contentUrdu: `# کرپٹو سیکیورٹی: اپنے اثاثوں کی حفاظت

کرپٹو میں سیکیورٹی سب سے اہم چیز ہے۔

## سنہری اصول

✅ **سیڈ فریز آف لائن رکھیں**: کبھی ڈیجیٹل میں محفوظ نہ کریں
✅ **2FA فعال کریں**: ہر اکاؤنٹ پر
✅ **ہارڈویئر والیٹ استعمال کریں**: بڑی رقم کے لیے
✅ **تصدیق کریں**: ہمیشہ URLs چیک کریں
✅ **اپڈیٹس کریں**: سافٹ ویئر اپڈیٹ رکھیں

## عام اسکیمز

❌ **فشنگ**: جعلی ویب سائٹس جو آپ کے کریڈینشلز چرا لیں
❌ **جعلی ایئرڈراپس**: غیر مطلوبہ ٹوکنز جو والیٹ خالی کر دیں
❌ **پمپ اینڈ ڈمپ**: مصنوعی طور پر قیمت بڑھا کر بیچ دینا
❌ **جعلی ایکسچینجز**: بوگس پلیٹ فارمز جو فنڈز چرا لیں

## بہترین طریقے

- ٹریڈنگ اور ہولڈنگ کے لیے الگ والیٹس استعمال کریں
- باقاعدہ بیک اپس لیں
- پاسورڈ مینیجر استعمال کریں
- پبلک وائی فائی پر ٹرانزیکشنز نہ کریں

> ⚠️ آپ کی سیکیورٹی خود آپ کی ذمہ داری ہے۔`,
  },
  'bitcoin-etf': {
    title: 'Bitcoin ETFs Explained',
    titleUrdu: 'بٹ کوائن ای ٹی ایف کی وضاحت',
    duration: '7 min',
    level: 'Intermediate',
    content: `# Bitcoin ETFs Explained

Bitcoin ETF ek investment fund hai jo Bitcoin ki price track karta hai.

## ETF Kya Hai?

ETF (Exchange Traded Fund) stock exchange par trade hota hai aur kisi asset ki price follow karta hai.

## Spot Bitcoin ETF

January 2026 mein SEC ne 11 spot Bitcoin ETFs approve kiye:

- BlackRock iShares Bitcoin Trust (IBIT)
- Fidelity Wise Origin Bitcoin Fund (FBTC)
- ARK 21Shares Bitcoin ETF (ARKB)
- Grayscale Bitcoin Trust (GBTC)

## Faiday

- Traditional brokerage account se invest karein
- Wallet ki zaroorat nahi
- Regulated aur secure

## Nuksan

- Management fees lagti hai
- Direct Bitcoin ownership nahi
- US investors ke liye available

> ⚠️ Ye taleemi content hai. Financial advice nahi hai.`,
    contentUrdu: `# بٹ کوائن ای ٹی ایف کی وضاحت

بٹ کوائن ای ٹی ایف ایک انویسٹمنٹ فنڈ ہے جو بٹ کوائن کی قیمت کو ٹریک کرتا ہے۔

## ای ٹی ایف کیا ہے؟

ای ٹی ایف (ایکسچینج ٹریڈڈ فنڈ) اسٹاک ایکسچینج پر ٹریڈ ہوتا ہے اور کسی اثاثے کی قیمت کی پیروی کرتا ہے۔

## سپاٹ بٹ کوائن ای ٹی ایف

جنوری ۲۰۲۴ میں SEC نے ۱۱ سپاٹ بٹ کوائن ای ٹی ایف منظور کیے:

- بلیک راک آئی شیئرز بٹ کوائن ٹرسٹ (IBIT)
- فیڈیلیٹی وائز اوریجن بٹ کوائن فنڈ (FBTC)
- ARK 21Shares بٹ کوائن ای ٹی ایف (ARKB)
- گرے اسکیل بٹ کوائن ٹرسٹ (GBTC)

## فوائد

- روایتی بروکریج اکاؤنٹ سے انویسٹ کریں
- والیٹ کی ضرورت نہیں
- ریگولیٹڈ اور محفوظ

## نقصانات

- مینجمنٹ فیس لگتی ہے
- براہ راست بٹ کوائن ملکیت نہیں
- امریکی سرمایہ کاروں کے لیے دستیاب

> ⚠️ یہ تعلیمی مواد ہے۔ مالیاتی مشورہ نہیں ہے۔`,
  },
  'mining': {
    title: 'Bitcoin Mining Kya Hai?',
    titleUrdu: 'بٹ کوائن مائننگ کیا ہے؟',
    duration: '10 min',
    level: 'Advanced',
    content: `# Bitcoin Mining Kya Hai?

Mining Bitcoin network ko secure karne aur naye Bitcoin banane ka process hai.

## Mining Kaise Kaam Karti Hai?

1. Miners transactions verify karte hain
2. Complex mathematical puzzles solve karte hain
3. Winner naya block banata hai
4. Reward milta hai (ab 3.125 BTC)

## Mining Equipment

- **ASIC Miners**: Specialized mining hardware
- **GPU Miners**: Graphics cards (ab profitable nahi)
- **Mining Pools**: Multiple miners milkar mine karte hain

## Mining Cost

- Electricity sab se bara kharcha hai
- Global regions mein electricity rates vary karti hain lekin mining ke liye stable supply zaroori hai
- Hardware ki cost bhi factor hai

## Kya Mining Ab Profitable Hai?

- Individual mining mushkil hai
- Mining pools join karna behtar hai
- Electricity cost sab se important factor hai

> ⚠️ Mining mein investment se pehle research karein.`,
    contentUrdu: `# بٹ کوائن مائننگ کیا ہے؟

مائننگ بٹ کوائن نیٹ ورک کو محفوظ کرنے اور نئے بٹ کوائن بنانے کا عمل ہے۔

## مائننگ کیسے کام کرتی ہے؟

1. مائنرز ٹرانزیکشنز تصدیق کرتے ہیں
2. پیچیدہ ریاضی کے پہیلیاں حل کرتے ہیں
3. جیتنے والا نیا بلاک بناتا ہے
4. انعام ملتا ہے (اب ۳.۱۲۵ BTC)

## مائننگ کا سامان

- **ASIC مائنرز**: مخصوص مائننگ ہارڈویئر
- **GPU مائنرز**: گرافکس کارڈز (اب منافع بخش نہیں)
- **مائننگ پولز**: متعدد مائنرز مل کر مائن کرتے ہیں

## مائننگ کی لاگت

- بجلی سب سے بڑا خرچہ ہے
- پاکستان میں بجلی سستی ہے لیکن مائننگ کے لیے مستحکم سپلائی ضروری ہے
- ہارڈویئر کی لاگت بھی ایک عنصر ہے

## کیا مائننگ اب منافع بخش ہے؟

- انفرادی مائننگ مشکل ہے
- مائننگ پولز میں شامل ہونا بہتر ہے
- بجلی کی لاگت سب سے اہم عنصر ہے

> ⚠️ مائننگ میں انویسٹمنٹ سے پہلے تحقیق کریں۔`,
  },
  'technical-analysis': {
    title: 'Technical Analysis Ki Bunyadein',
    titleUrdu: 'ٹیکنیکل اینالیسس کی بنیادیں',
    duration: '15 min',
    level: 'Advanced',
    content: `# Technical Analysis Ki Bunyadein

Technical analysis price charts aur patterns ka use kar ke future price predict karna hai.

## Basic Concepts

### Candlestick Charts
- **Green Candle**: Price upar gayi
- **Red Candle**: Price neeche aayi
- **Wick**: High aur low points

### Support aur Resistance
- **Support**: Price level jahan buying aati hai
- **Resistance**: Price level jahan selling aati hai

### Trend Lines
- **Uptrend**: Higher highs, higher lows
- **Downtrend**: Lower highs, lower lows

## Indicators

- **RSI**: Overbought/Oversold batata hai
- **MACD**: Trend direction aur momentum
- **Moving Averages**: Average price over time
- **Volume**: Trading activity

## Trading Patterns

- **Head & Shoulders**: Reversal pattern
- **Double Top/Bottom**: Reversal signals
- **Triangles**: Continuation patterns

> ⚠️ Technical analysis guarantee nahi hai. Hamesha stop loss use karein.`,
    contentUrdu: `# ٹیکنیکل اینالیسس کی بنیادیں

ٹیکنیکل اینالیسس قیمت کے چارٹس اور پیٹرنز کا استعمال کر کے مستقبل کی قیمت کی پیش گوئی کرنا ہے۔

## بنیادی تصورات

### کینڈل اسٹک چارٹس
- **سبز کینڈل**: قیمت اوپر گئی
- **سرخ کینڈل**: قیمت نیچے آئی
- **وک**: اونچی اور نیچی سطحیں

### سپورٹ اور ریزسٹنس
- **سپورٹ**: قیمت کی سطح جہاں خریداری آتی ہے
- **ریزسٹنس**: قیمت کی سطح جہاں فروخت آتی ہے

### ٹرینڈ لائنز
- **اپ ٹرینڈ**: اونچی اونچائیاں، اونچی نیچائیاں
- **ڈاؤن ٹرینڈ**: نچلی اونچائیاں، نچلی نیچائیاں

## انڈیکیٹرز

- **RSI**: اوور بوٹ/اوور سولڈ بتاتا ہے
- **MACD**: ٹرینڈ کی سمت اور مومینٹم
- **موونگ ایوریجز**: وقت کے ساتھ اوسط قیمت
- **والیوم**: ٹریڈنگ سرگرمی

## ٹریڈنگ پیٹرنز

- **ہیڈ اینڈ شولڈرز**: ریورسل پیٹرن
- **ڈبل ٹاپ/باٹم**: ریورسل سگنلز
- **ٹرائی اینگلز**: کنٹینیویشن پیٹرنز

> ⚠️ ٹیکنیکل اینالیسس گارنٹی نہیں ہے۔ ہمیشہ اسٹاپ لاس استعمال کریں۔`,
  },
  'risks-opportunities': {
    title: 'Crypto: Risks Aur Opportunities',
    titleUrdu: 'کرپٹو: رسکس اور مواقع',
    duration: '8 min',
    level: 'Beginner',
    content: `# Crypto: Risks Aur Opportunities

Cryptocurrency mein bohat opportunities hain lekin risks bhi hain.

## Opportunities

### High Returns
- Bitcoin ne 2009 se ab tak millions mein growth ki hai
- Early adoption ka faida

### Financial Freedom
- Bank ke bina transactions
- Global access
- Inflation se hifazat

### Innovation
- DeFi, NFTs, Web3
- Naye career opportunities
- Passive income sources

## Risks

### Volatility
- Prices tezi se upar neeche hoti hain
- Nuksan ka khatra

### Scams
- Fake projects
- Rug pulls
- Phishing attacks

### Regulatory Risk
- Governments ban kar sakti hain
- Tax laws change ho sakte hain

## Safe Rehne Ke Tips

✅ Sirf reputed exchanges use karein
✅ Apni research karein (DYOR)
✅ Diversify karein
✅ Sirf utna invest karein jitna khona afford karein
✅ Long term sochein

> ⚠️ Crypto risky hai. Financial advice ke liye advisor se consult karein.`,
    contentUrdu: `# کرپٹو: رسکس اور مواقع

کرپٹو کرنسی میں بہت مواقع ہیں لیکن رسکس بھی ہیں۔

## مواقع

### زیادہ منافع
- بٹ کوائن نے ۲۰۰۹ سے اب تک ملینز میں گروتھ کی ہے
- ابتدائی اپنانے کا فائدہ

### مالیاتی آزادی
- بینک کے بغیر ٹرانزیکشنز
- عالمی رسائی
- مہنگائی سے حفاظت

### جدت
- ڈی فائی، این ایف ٹی، ویب ۳
- نئے کیریئر کے مواقع
- پیسو انکم ذرائع

## رسکس

### اتار چڑھاؤ
- قیمتیں تیزی سے اوپر نیچے ہوتی ہیں
- نقصان کا خطرہ

### اسکیمز
- جعلی پروجیکٹس
- رگ پولز
- فشنگ حملے

### ریگولیٹری رسک
- حکومتیں پابندی لگا سکتی ہیں
- ٹیکس قوانین تبدیل ہو سکتے ہیں

## محفوظ رہنے کے ٹپس

✅ صرف معروف ایکسچینجز استعمال کریں
✅ اپنی تحقیق کریں (DYOR)
✅ متنوع بنائیں
✅ صرف اتنا انویسٹ کریں جتنا کھونا برداشت کریں
✅ طویل مدتی سوچیں

> ⚠️ کرپٹو رسکی ہے۔ مالیاتی مشورے کے لیے ایڈوائزر سے مشورہ کریں۔`,
  },
  'bitcoin-supply': {
    title: 'Bitcoin Supply Kya Hai?',
    titleUrdu: 'بٹ کوائن سپلائی کیا ہے؟',
    duration: '8 min',
    level: 'Beginner',
    content: `# Bitcoin Supply Kya Hai?

Bitcoin ki supply ek fixed mathematical formula par based hai jo ise unique banati hai.

## Max Supply: 21 Million

Bitcoin ka code hard-coded hai ke sirf **21 million BTC** hi banenge. Ye limit kabhi change nahi ho sakti.

## Circulating Supply

Ab taqreeban **19.6 million BTC** already mine ho chuke hain. Baqi 1.4 million BTC agle 120 saalon mein mine honge.

## Supply Schedule

| Year | Event | New Supply |
|------|-------|------------|
| 2009 | Genesis Block | 50 BTC per block |
| 2012 | First Halving | 25 BTC per block |
| 2016 | Second Halving | 12.5 BTC per block |
| 2020 | Third Halving | 6.25 BTC per block |
| 2026 | Fourth Halving | 3.125 BTC per block |
| 2028 | Fifth Halving | 1.5625 BTC per block |
| 2140 | Last Bitcoin | ~0 BTC per block |

## Supply vs Demand

Bitcoin ki fixed supply ka matlab hai ke agar demand barhti hai to price barhegi. Isay **deflationary asset** kehte hain.

## Lost Bitcoins

Taqreeban **3-4 million BTC** permanently lost ho chuke hain:
- Log apne private keys bhool gaye
- Hard drives discard ho gaye
- Wallets ka access kho gaya

Is se effective supply aur kam ho jati hai.

## Stock-to-Flow Model

Stock-to-Flow model Bitcoin ki scarcity ko measure karta hai:
- **Stock**: Existing supply
- **Flow**: Annual new supply
- Higher ratio = zyada scarce

Bitcoin ka S2F ratio gold se bhi zyada hai.

> ⚠️ Taleemi content hai. Financial advice nahi hai.`,
    contentUrdu: `# بٹ کوائن سپلائی کیا ہے؟

بٹ کوائن کی سپلائی ایک مقررہ ریاضیاتی فارمولے پر مبنی ہے جو اسے منفرد بناتی ہے۔

## زیادہ سے زیادہ سپلائی: ۲۱ ملین

بٹ کوائن کا کوڈ ہارڈ کوڈڈ ہے کہ صرف **۲۱ ملین BTC** ہی بنیں گے۔ یہ حد کبھی تبدیل نہیں ہو سکتی۔

## گردش میں سپلائی

اب تقریباً **۱۹.۶ ملین BTC** پہلے ہی مائن ہو چکے ہیں۔ باقی ۱.۴ ملین BTC اگلے ۱۲۰ سالوں میں مائن ہوں گے۔

## سپلائی شیڈول

| سال | واقعہ | نئی سپلائی |
|------|-------|------------|
| ۲۰۰۹ | جینیسس بلاک | ۵۰ BTC فی بلاک |
| ۲۰۱۲ | پہلی ہالونگ | ۲۵ BTC فی بلاک |
| ۲۰۱۶ | دوسری ہالونگ | ۱۲.۵ BTC فی بلاک |
| ۲۰۲۰ | تیسری ہالونگ | ۶.۲۵ BTC فی بلاک |
| ۲۰۲۴ | چوتھی ہالونگ | ۳.۱۲۵ BTC فی بلاک |
| ۲۰۲۸ | پانچویں ہالونگ | ۱.۵۶۲۵ BTC فی بلاک |
| ۲۱۴۰ | آخری بٹ کوائن | ~۰ BTC فی بلاک |

## سپلائی بمقابلہ طلب

بٹ کوائن کی مقررہ سپلائی کا مطلب ہے کہ اگر طلب بڑھتی ہے تو قیمت بڑھے گی۔ اسے **ڈیفلیشنری اثاثہ** کہتے ہیں۔

## گمشدہ بٹ کوائنز

تقریباً **۳-۴ ملین BTC** مستقل طور پر گم ہو چکے ہیں:
- لوگ اپنے پرائیویٹ کیز بھول گئے
- ہارڈ ڈرائیوز ضائع ہو گئیں
- والیٹس کا رسائی کھو گیا

اس سے مؤثر سپلائی اور کم ہو جاتی ہے۔

## اسٹاک ٹو فلو ماڈل

اسٹاک ٹو فلو ماڈل بٹ کوائن کی قلت کو ماپتا ہے:
- **اسٹاک**: موجودہ سپلائی
- **فلو**: سالانہ نئی سپلائی
- زیادہ تناسب = زیادہ نایاب

بٹ کوائن کا S2F تناسب سونے سے بھی زیادہ ہے۔

> ⚠️ تعلیمی مواد ہے۔ مالیاتی مشورہ نہیں ہے۔`,
  },
  'how-to-read-charts': {
    title: 'Charts Kaise Parhein?',
    titleUrdu: 'چارٹس کیسے پڑھیں؟',
    duration: '12 min',
    level: 'Intermediate',
    content: `# Charts Kaise Parhein?

Crypto charts parhna seekhna trading ke liye zaroori hai.

## Candlestick Chart

Har candlestick 4 data points show karti hai:
- **Open**: Period ki shuruati price
- **High**: Period ki sab se zyada price
- **Low**: Period ki sab se kam price
- **Close**: Period ki aakhri price

### Candlestick Colors
- 🟢 **Green**: Close > Open (price barhi)
- 🔴 **Red**: Close < Open (price giri)

### Candlestick Parts
- **Body**: Open aur Close ke beech
- **Upper Wick**: High tak
- **Lower Wick**: Low tak

## Timeframes

| Timeframe | Best For |
|-----------|----------|
| 1m - 15m | Scalping |
| 1H - 4H | Day Trading |
| 1D | Swing Trading |
| 1W | Long Term |

## Chart Patterns

### Bullish Patterns
- **Hammer**: Reversal signal
- **Bullish Engulfing**: Uptrend confirmation
- **Morning Star**: Bottom reversal

### Bearish Patterns
- **Shooting Star**: Reversal signal
- **Bearish Engulfing**: Downtrend confirmation
- **Evening Star**: Top reversal

## Volume

Volume confirm karta hai ke trend strong hai ya nahi:
- **High Volume + Price Up**: Strong uptrend
- **Low Volume + Price Up**: Weak uptrend
- **High Volume + Price Down**: Strong downtrend

> ⚠️ Charts sirf ek tool hain. Hamesha risk management use karein.`,
    contentUrdu: `# چارٹس کیسے پڑھیں؟

کرپٹو چارٹس پڑھنا سیکھنا ٹریڈنگ کے لیے ضروری ہے۔

## کینڈل اسٹک چارٹ

ہر کینڈل اسٹک ۴ ڈیٹا پوائنٹس دکھاتی ہے:
- **اوپن**: مدت کی شروعاتی قیمت
- **ہائی**: مدت کی سب سے زیادہ قیمت
- **لو**: مدت کی سب سے کم قیمت
- **کلوز**: مدت کی آخری قیمت

### کینڈل اسٹک رنگ
- 🟢 **سبز**: کلوز > اوپن (قیمت بڑھی)
- 🔴 **سرخ**: کلوز < اوپن (قیمت گری)

### کینڈل اسٹک کے حصے
- **باڈی**: اوپن اور کلوز کے بیچ
- **اوپر وک**: ہائی تک
- **نیچے وک**: لو تک

## ٹائم فریمز

| ٹائم فریم | بہترین برائے |
|-----------|----------|
| 1m - 15m | اسکالپنگ |
| 1H - 4H | ڈے ٹریڈنگ |
| 1D | سوئنگ ٹریڈنگ |
| 1W | طویل مدتی |

## چارٹ پیٹرنز

### بلش پیٹرنز
- **ہیمر**: ریورسل سگنل
- **بلش انگلفنگ**: اپ ٹرینڈ تصدیق
- **مارننگ اسٹار**: باٹم ریورسل

### بیرش پیٹرنز
- **شوٹنگ اسٹار**: ریورسل سگنل
- **بیرش انگلفنگ**: ڈاؤن ٹرینڈ تصدیق
- **ایوننگ اسٹار**: ٹاپ ریورسل

## والیوم

والیوم تصدیق کرتا ہے کہ ٹرینڈ مضبوط ہے یا نہیں:
- **زیادہ والیوم + قیمت اوپر**: مضبوط اپ ٹرینڈ
- **کم والیوم + قیمت اوپر**: کمزور اپ ٹرینڈ
- **زیادہ والیوم + قیمت نیچے**: مضبوط ڈاؤن ٹرینڈ

> ⚠️ چارٹس صرف ایک ٹول ہیں۔ ہمیشہ رسک مینجمنٹ استعمال کریں۔`,
  },
  'what-is-airdrop': {
    title: 'Airdrops Kya Hain? Complete Guide',
    titleUrdu: 'ایئرڈراپس کیا ہیں؟ مکمل گائیڈ',
    duration: '10 min',
    level: 'Beginner',
    content: `# Airdrops Kya Hain?

Airdrops free tokens hain jo blockchain projects community ko distribute karte hain.

## Airdrops Kyun Hote Hain?

- **Community Building**: Log project ke sath judte hain
- **Marketing**: Word of mouth promotion
- **Decentralization**: Tokens zyada logon mein distribute hote hain
- **Reward**: Early users ko reward milta hai

## Airdrops Ki Iqsaam

### 1. Holder Airdrops
Kisi coin ke holders ko free tokens milte hain.
- Example: Starknet (STRK) ETH holders ko mila

### 2. Task-Based Airdrops
Tasks complete karne par tokens milte hain:
- Bridge assets to new chain
- Use dApps regularly
- Provide liquidity
- Join community channels

### 3. Exclusive Airdrops
Specific users ke liye:
- Early adopters
- High volume traders
- Long-term holders
- Testnet participants

## Famous Airdrops

| Project | Token | Value Per User |
|---------|-------|----------------|
| Uniswap | UNI | $1,200 - $10,000+ |
| Arbitrum | ARB | $1,000 - $15,000+ |
| Optimism | OP | $1,000 - $10,000+ |
| ENS | ENS | $5,000 - $10,000+ |
| dYdX | DYDX | $1,000 - $20,000+ |

## Airdrops Kaise Join Karein?

1. **Wallet Setup**: MetaMask ya Phantom install karein
2. **Stay Active**: Naye protocols use karein
3. **Bridge Assets**: Funds ko new chains par move karein
4. **Provide Liquidity**: DEX pools mein add karein
5. **Complete Quests**: Galxe, Layer3, Zealy use karein
6. **Join Communities**: Discord, Telegram join karein
7. **Testnet Participation**: Free testing mein hissa lein

## Safety Tips

⚠️ **Never share private key**
⚠️ **Only use official links**
⚠️ **Beware of phishing scams**
⚠️ **Use separate wallet for airdrops**
⚠️ **Never pay to claim airdrop**

> ⚠️ Airdrops guaranteed nahi hain. Apni research karein.`,
    contentUrdu: `# ایئرڈراپس کیا ہیں؟

ایئرڈراپس مفت ٹوکنز ہیں جو بلاک چین پروجیکٹس کمیونٹی کو تقسیم کرتے ہیں۔

## ایئرڈراپس کیوں ہوتے ہیں؟

- **کمیونٹی بلڈنگ**: لوگ پروجیکٹ کے ساتھ جڑتے ہیں
- **مارکیٹنگ**: ورڈ آف ماؤتھ پروموشن
- **غیر مرکزی**: ٹوکنز زیادہ لوگوں میں تقسیم ہوتے ہیں
- **انعام**: ابتدائی صارفین کو انعام ملتا ہے

## ایئرڈراپس کی اقسام

### ۱. ہولڈر ایئرڈراپس
کسی کوائن کے ہولڈرز کو مفت ٹوکنز ملتے ہیں۔
- مثال: اسٹارک نیٹ (STRK) ETH ہولڈرز کو ملا

### ۲. ٹاسک بیسڈ ایئرڈراپس
ٹاسکس مکمل کرنے پر ٹوکنز ملتے ہیں:
- نئی چین پر اثاثے منتقل کریں
- dApps کا باقاعدہ استعمال کریں
- لیکویڈیٹی فراہم کریں
- کمیونٹی چینلز میں شامل ہوں

### ۳. خصوصی ایئرڈراپس
مخصوص صارفین کے لیے:
- ابتدائی اپنانے والے
- زیادہ والیوم ٹریڈرز
- طویل مدتی ہولڈرز
- ٹیسٹ نیٹ شرکاء

## مشہور ایئرڈراپس

| پروجیکٹ | ٹوکن | فی صارف ویلیو |
|---------|-------|----------------|
| یونی سواپ | UNI | $۱,۲۰۰ - $۱۰,۰۰۰+ |
| آربیٹرم | ARB | $۱,۰۰۰ - $۱۵,۰۰۰+ |
| آپٹزم | OP | $۱,۰۰۰ - $۱۰,۰۰۰+ |
| ENS | ENS | $۵,۰۰۰ - $۱۰,۰۰۰+ |
| dYdX | DYDX | $۱,۰۰۰ - $۲۰,۰۰۰+ |

## ایئرڈراپس کیسے جوائن کریں؟

1. **والیٹ سیٹ اپ**: میٹاماسک یا فینٹم انسٹال کریں
2. **فعال رہیں**: نئے پروٹوکولز استعمال کریں
3. **اثاثے منتقل کریں**: فنڈز کو نئی چینز پر منتقل کریں
4. **لیکویڈیٹی فراہم کریں**: DEX پولز میں شامل کریں
5. **کویسٹس مکمل کریں**: Galxe, Layer3, Zealy استعمال کریں
6. **کمیونٹیز میں شامل ہوں**: ڈسکارڈ، ٹیلیگرام جوائن کریں
7. **ٹیسٹ نیٹ میں حصہ لیں**: مفت ٹیسٹنگ میں حصہ لیں

## حفاظتی ٹپس

⚠️ **کبھی پرائیویٹ کی شیئر نہ کریں**
⚠️ **صرف سرکاری لنکس استعمال کریں**
⚠️ **فشنگ اسکیمز سے بچیں**
⚠️ **ایئرڈراپس کے لیے الگ والیٹ استعمال کریں**
⚠️ **ایئرڈراپ کلیم کرنے کے لیے کبھی پیسے نہ دیں**

> ⚠️ ایئرڈراپس گارنٹیڈ نہیں ہیں۔ اپنی تحقیق کریں۔`,
  },
  'how-to-mine-bitcoin': {
    title: 'Bitcoin Mining: Complete Guide',
    titleUrdu: 'بٹ کوائن مائننگ: مکمل گائیڈ',
    duration: '15 min',
    level: 'Advanced',
    content: `# Bitcoin Mining: Complete Guide

Bitcoin mining network ko secure karne aur naye BTC banane ka process hai.

## Mining Kya Hai?

Mining ek computational process hai jisme miners:
1. Transactions verify karte hain
2. Mathematical puzzles solve karte hain
3. Naye blocks banate hain
4. Reward mein BTC lete hain

## Mining Equipment

### ASIC Miners
- **Antminer S21**: 200 TH/s, ~3500W
- **Whatsminer M60**: 170 TH/s, ~3200W
- **Avalon A1466**: 150 TH/s, ~3100W

### Mining Pools
- **Foundry USA**: Sab se bara pool
- **Antpool**: Bitmain ka pool
- **F2Pool**: China based
- **Binance Pool**: Easy setup

## Mining Profitability

Profitability depend karti hai:
- **Electricity Cost**: $0.05/kWh se kam hona chahiye
- **Hardware Cost**: ASIC miner $2,000-$10,000
- **Bitcoin Price**: Zyada price = zyada profit
- **Network Difficulty**: Barhta ja raha hai

## Mining Setup Steps

1. **Research**: Profitability calculator use karein
2. **Buy Equipment**: Reputed seller se ASIC miner khareedein
3. **Setup Location**: Cool, ventilated jagah chunein
4. **Join Pool**: Mining pool join karein
5. **Configure**: Miner ko setup karein
6. **Monitor**: Regular monitoring zaroori hai

## Cloud Mining

Cloud mining bina hardware ke mining hai:
- **Pros**: No hardware, easy setup
- **Cons**: Zyadatar scams hain, low returns
- **Warning**: 95% cloud mining sites scam hain

## Kya Mining Possible Hai?

- Electricity rates important hain
- Load shedding issue hai
- Import restrictions hain
- Legal status unclear hai

> ⚠️ Mining mein bari investment lagti hai. Research ke bina start na karein.`,
    contentUrdu: `# بٹ کوائن مائننگ: مکمل گائیڈ

بٹ کوائن مائننگ نیٹ ورک کو محفوظ کرنے اور نئے BTC بنانے کا عمل ہے۔

## مائننگ کیا ہے؟

مائننگ ایک کمپیوٹیشنل عمل ہے جس میں مائنرز:
1. ٹرانزیکشنز تصدیق کرتے ہیں
2. ریاضی کے پہیلیاں حل کرتے ہیں
3. نئے بلاکس بناتے ہیں
4. انعام میں BTC لیتے ہیں

## مائننگ کا سامان

### ASIC مائنرز
- **Antminer S21**: 200 TH/s, ~3500W
- **Whatsminer M60**: 170 TH/s, ~3200W
- **Avalon A1466**: 150 TH/s, ~3100W

### مائننگ پولز
- **Foundry USA**: سب سے بڑا پول
- **Antpool**: بٹ مین کا پول
- **F2Pool**: چین بیسڈ
- **Binance Pool**: آسان سیٹ اپ

## مائننگ منافع بخشیت

منافع بخشیت انحصار کرتی ہے:
- **بجلی کی لاگت**: $0.05/kWh سے کم ہونی چاہیے
- **ہارڈویئر لاگت**: ASIC مائنر $2,000-$10,000
- **بٹ کوائن قیمت**: زیادہ قیمت = زیادہ منافع
- **نیٹ ورک ڈیفیکلٹی**: بڑھتا جا رہا ہے

## مائننگ سیٹ اپ کے مراحل

1. **تحقیق**: منافع بخشیت کیلکولیٹر استعمال کریں
2. **سامان خریدیں**: معروف سیلر سے ASIC مائنر خریدیں
3. **مقام سیٹ اپ**: ٹھنڈی، ہوا دار جگہ چنیں
4. **پول میں شامل ہوں**: مائننگ پول جوائن کریں
5. **کنفیگر**: مائنر کو سیٹ اپ کریں
6. **مانیٹر**: باقاعدہ مانیٹرنگ ضروری ہے

## کلاؤڈ مائننگ

کلاؤڈ مائننگ بغیر ہارڈویئر کے مائننگ ہے:
- **فوائد**: کوئی ہارڈویئر نہیں، آسان سیٹ اپ
- **نقصانات**: زیادہ تر اسکیمز ہیں، کم منافع
- **انتباہ**: 95% کلاؤڈ مائننگ سائٹس اسکیم ہیں

## کیا مائننگ پاکستان میں ممکن ہے؟

- بجلی کی شرحیں اہم ہیں
- لوڈ شیڈنگ مسئلہ ہے
- درآمدی پابندیاں ہیں
- قانونی حیثیت غیر واضح ہے

> ⚠️ مائننگ میں بڑی انویسٹمنٹ لگتی ہے۔ تحقیق کے بغیر شروع نہ کریں۔`,
  },
  'bitcoin-heatmap': {
    title: 'Bitcoin Heatmap Kaise Dekhein?',
    titleUrdu: 'بٹ کوائن ہیٹ میپ کیسے دیکھیں؟',
    duration: '8 min',
    level: 'Intermediate',
    content: `# Bitcoin Heatmap Kaise Dekhein?

Heatmap ek visual tool hai jo market data ko colors ke zariye dikhata hai.

## Heatmap Kya Hai?

Heatmap different cryptocurrencies ko unke market cap aur price change ke hisaab se colors mein show karta hai.

- 🟢 **Green**: Price upar gayi
- 🔴 **Red**: Price neeche aayi
- **Size**: Market cap jitna bara, box utna bara

## Popular Heatmap Tools

### 1. CoinMarketCap Heatmap
- Free access
- All coins visible
- Real-time data

### 2. CoinGecko Heatmap
- Clean interface
- Multiple timeframes
- Category filters

### 3. TradingView Crypto Heatmap
- Professional charts
- Custom indicators
- Multiple timeframes

## Heatmap Kaise Parhein?

### Market Cap Size
- Bara box = Bara market cap
- Chota box = Chota market cap

### Color Intensity
- Gehra green = Zyada upar
- Gehra red = Zyada neeche
- Halka color = Kam change

### Categories
Heatmap mein sectors hote hain:
- Layer 1
- Layer 2
- DeFi
- NFT
- Gaming
- Meme

## Heatmap Se Kya Seekhein?

1. **Market Direction**: Overall market upar hai ya neeche
2. **Sector Performance**: Kaunsa sector strong hai
3. **Outliers**: Kaunsa coin alag perform kar raha hai
4. **Trends**: Consistent patterns dekhna

## Best Timeframes

- **24H**: Short term trading
- **7D**: Weekly trends
- **30D**: Monthly overview
- **1Y**: Long term analysis

> ⚠️ Heatmap sirf ek visual tool hai. Hamesha aur analysis karein.`,
    contentUrdu: `# بٹ کوائن ہیٹ میپ کیسے دیکھیں؟

ہیٹ میپ ایک بصری ٹول ہے جو مارکیٹ ڈیٹا کو رنگوں کے ذریعے دکھاتا ہے۔

## ہیٹ میپ کیا ہے؟

ہیٹ میپ مختلف کرپٹو کرنسیوں کو ان کے مارکیٹ کیپ اور قیمت میں تبدیلی کے حساب سے رنگوں میں دکھاتا ہے۔

- 🟢 **سبز**: قیمت اوپر گئی
- 🔴 **سرخ**: قیمت نیچے آئی
- **سائز**: مارکیٹ کیپ جتنا بڑا، باکس اتنا بڑا

## مقبول ہیٹ میپ ٹولز

### 1. کائن مارکیٹ کیپ ہیٹ میپ
- مفت رسائی
- تمام کوائنز دکھائی دیتے ہیں
- ریئل ٹائم ڈیٹا

### 2. کائن گیکو ہیٹ میپ
- صاف انٹرفیس
- متعدد ٹائم فریمز
- کیٹیگری فلٹرز

### 3. ٹریڈنگ ویو کرپٹو ہیٹ میپ
- پروفیشنل چارٹس
- کسٹم انڈیکیٹرز
- متعدد ٹائم فریمز

## ہیٹ میپ کیسے پڑھیں؟

### مارکیٹ کیپ سائز
- بڑا باکس = بڑا مارکیٹ کیپ
- چھوٹا باکس = چھوٹا مارکیٹ کیپ

### رنگ کی شدت
- گہرا سبز = زیادہ اوپر
- گہرا سرخ = زیادہ نیچے
- ہلکا رنگ = کم تبدیلی

### کیٹیگریز
ہیٹ میپ میں سیکٹرز ہوتے ہیں:
- لیئر ۱
- لیئر ۲
- ڈی فائی
- این ایف ٹی
- گیمنگ
- میم

## ہیٹ میپ سے کیا سیکھیں؟

1. **مارکیٹ کی سمت**: مجموعی مارکیٹ اوپر ہے یا نیچے
2. **سیکٹر پرفارمنس**: کونسا سیکٹر مضبوط ہے
3. **آؤٹ لائیرز**: کونسا کوائن الگ پرفارم کر رہا ہے
4. **ٹرینڈز**: مسلسل پیٹرنز دیکھنا

## بہترین ٹائم فریمز

- **24H**: شارٹ ٹرم ٹریڈنگ
- **7D**: ہفتہ وار ٹرینڈز
- **30D**: ماہانہ جائزہ
- **1Y**: طویل مدتی تجزیہ

> ⚠️ ہیٹ میپ صرف ایک بصری ٹول ہے۔ ہمیشہ مزید تجزیہ کریں۔`,
  },
};

export default function LearnLessonPage({ params }: { params: { id: string } }) {
  const lesson = LESSONS[params.id];
  if (!lesson) return <div className="text-center py-12">Lesson nahi mila</div>;

  return <LessonPageClient lesson={lesson} />;
}
