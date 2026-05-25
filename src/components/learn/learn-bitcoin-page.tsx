'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, GraduationCap, TrendingUp, Shield, Cpu, Wallet, BarChart3, Lightbulb, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/stores';
import { LearnAd } from '@/components/ads/ad-slots';

const LESSONS: Record<string, Record<string, { id: string; title: string; description: string; icon: React.ComponentType<{ className?: string }>; duration: string }[]>> = {
  roman: {
    beginner: [
      { id: 'what-is-bitcoin', title: 'What is Bitcoin?', description: 'Bitcoin kya hai, pehli cryptocurrency ki basics seekhen.', icon: BookOpen, duration: '10 min' },
      { id: 'what-is-blockchain', title: 'What is Blockchain?', description: 'Blockchain technology kaise kaam karti hai samjhen.', icon: Cpu, duration: '15 min' },
      { id: 'crypto-wallets', title: 'Crypto Wallets Explained', description: 'Hot wallets, cold wallets, aur crypto secure karna seekhen.', icon: Wallet, duration: '12 min' },
      { id: 'how-to-buy', title: 'How to Buy Bitcoin', description: 'Pehla Bitcoin kharidne ki step-by-step guide.', icon: TrendingUp, duration: '8 min' },
    ],
    intermediate: [
      { id: 'trading-basics', title: 'Trading Basics', description: 'Market orders, limit orders, aur trading strategies seekhen.', icon: BarChart3, duration: '20 min' },
      { id: 'defi-explained', title: 'DeFi Explained', description: 'Decentralized finance, yield farming, aur liquidity pools samjhen.', icon: Lightbulb, duration: '25 min' },
      { id: 'nft-guide', title: 'NFT Guide', description: 'NFTs kya hain aur kaise kaam karte hain?', icon: BookOpen, duration: '15 min' },
      { id: 'security', title: 'Crypto Security', description: 'Crypto ko hacks aur scams se bachane ki best practices.', icon: Shield, duration: '18 min' },
    ],
    advanced: [
      { id: 'bitcoin-etf', title: 'Bitcoin ETFs Explained', description: 'Bitcoin ETFs aur market par unka asar samjhen.', icon: TrendingUp, duration: '20 min' },
      { id: 'mining', title: 'Bitcoin Mining', description: 'Bitcoin mining, proof of work, aur mining profitability.', icon: Cpu, duration: '30 min' },
      { id: 'technical-analysis', title: 'Technical Analysis', description: 'Advanced chart reading, indicators, aur trading patterns.', icon: BarChart3, duration: '45 min' },
      { id: 'risks-opportunities', title: 'Risks & Opportunities', description: 'Market cycles, risk management, aur investment strategies.', icon: Shield, duration: '25 min' },
    ],
  },
  ur: {
    beginner: [
      { id: 'what-is-bitcoin', title: 'بٹ کوائن کیا ہے؟', description: 'بٹ کوائن کی بنیادی باتیں، پہلی کرپٹو کرنسی۔', icon: BookOpen, duration: '10 منٹ' },
      { id: 'what-is-blockchain', title: 'بلاک چین کیا ہے؟', description: 'بلاک چین ٹیکنالوجی کیسے کام کرتی ہے۔', icon: Cpu, duration: '15 منٹ' },
      { id: 'crypto-wallets', title: 'کرپٹو والیٹس', description: 'ہاٹ والیٹس، کولڈ والیٹس اور کرپٹو سیکیورٹی۔', icon: Wallet, duration: '12 منٹ' },
      { id: 'how-to-buy', title: 'بٹ کوائن کیسے خریدیں', description: 'پہلا بٹ کوائن خریدنے کی مرحلہ وار گائیڈ۔', icon: TrendingUp, duration: '8 منٹ' },
    ],
    intermediate: [
      { id: 'trading-basics', title: 'ٹریڈنگ کی بنیادیں', description: 'مارکیٹ آرڈرز، لمٹ آرڈرز اور ٹریڈنگ حکمت عملی۔', icon: BarChart3, duration: '20 منٹ' },
      { id: 'defi-explained', title: 'ڈی فائی کی وضاحت', description: 'ڈی سینٹرلائزڈ فنانس، ییلڈ فارمنگ اور لیکویڈیٹی پولز۔', icon: Lightbulb, duration: '25 منٹ' },
      { id: 'nft-guide', title: 'این ایف ٹی گائیڈ', description: 'این ایف ٹی کیا ہیں اور کیسے کام کرتی ہیں؟', icon: BookOpen, duration: '15 منٹ' },
      { id: 'security', title: 'کرپٹو سیکیورٹی', description: 'ہیکنگ اور اسکامز سے بچاؤ کی بہترین مشقیں۔', icon: Shield, duration: '18 منٹ' },
    ],
    advanced: [
      { id: 'bitcoin-etf', title: 'بٹ کوائن ETFs', description: 'بٹ کوائن ETFs اور مارکیٹ پر اثر۔', icon: TrendingUp, duration: '20 منٹ' },
      { id: 'mining', title: 'بٹ کوائن مائننگ', description: 'بٹ کوائن مائننگ، پروف آف ورک اور منافع۔', icon: Cpu, duration: '30 منٹ' },
      { id: 'technical-analysis', title: 'تکنیکی تجزیہ', description: 'ایڈوانسڈ چارٹ ریڈنگ اور ٹریڈنگ پیٹرن۔', icon: BarChart3, duration: '45 منٹ' },
      { id: 'risks-opportunities', title: 'رسک اور مواقع', description: 'مارکیٹ سائیکلز، رسک مینجمنٹ اور انویسٹمنٹ۔', icon: Shield, duration: '25 منٹ' },
    ],
  },
  ps: {
    beginner: [
      { id: 'what-is-bitcoin', title: 'بټ کوائن څه شی دی؟', description: 'د بټ کوائن اساسات، لومړۍ کریپټو کرنسي.', icon: BookOpen, duration: '10 دقیقې' },
      { id: 'what-is-blockchain', title: 'بلاک چین څه شی دی؟', description: 'د بلاک چین ټیکنالوژي څنګه کار کوي.', icon: Cpu, duration: '15 دقیقې' },
      { id: 'crypto-wallets', title: 'کرپټو پرسونه', description: 'ګرم پرسونه، سړه پرسونه، او کریپټو خوندیتوب.', icon: Wallet, duration: '12 دقیقې' },
      { id: 'how-to-buy', title: 'بټ کوائن څنګه واخلئ', description: 'خپل لومړی بټ کوائن اخیستلو ګام په ګام لارښود.', icon: TrendingUp, duration: '8 دقیقې' },
    ],
    intermediate: [
      { id: 'trading-basics', title: 'سوداګرۍ اساسات', description: 'د مارکیټ آرډرونه، حد آرډرونه، او سوداګریزې ستراتیژۍ.', icon: BarChart3, duration: '20 دقیقې' },
      { id: 'defi-explained', title: 'ډیفای تشریح', description: 'غیر مرکزي فنانس، ییلډ فارمنګ، او لیکویډیټي پولونه.', icon: Lightbulb, duration: '25 دقیقې' },
      { id: 'nft-guide', title: 'NFT لارښود', description: 'NFTs څه دي او څنګه کار کوي؟', icon: BookOpen, duration: '15 دقیقې' },
      { id: 'security', title: 'کرپټو خوندیتوب', description: 'له هیکونو او سکمونو څخه د ساتنې غوره عمل.', icon: Shield, duration: '18 دقیقې' },
    ],
    advanced: [
      { id: 'bitcoin-etf', title: 'بټ کوائن ETFs', description: 'بټ کوائن ETFs او په مارکیټ اغیزه.', icon: TrendingUp, duration: '20 دقیقې' },
      { id: 'mining', title: 'بټ کوائن مایننګ', description: 'بټ کوائن مایننګ، پروف آف ورک، او ګټه.', icon: Cpu, duration: '30 دقیقې' },
      { id: 'technical-analysis', title: 'تکنیکي تحلیل', description: 'پرمختللی چارټ لوستنه او سوداګریز نمونې.', icon: BarChart3, duration: '45 دقیقې' },
      { id: 'risks-opportunities', title: 'رسک او فرصتونه', description: 'د مارکیټ سایکلونه، رسک مدیریت، او پانګونه.', icon: Shield, duration: '25 دقیقې' },
    ],
  },
  sd: {
    beginner: [
      { id: 'what-is-bitcoin', title: 'بٽ ڪوائن ڇا آهي؟', description: 'بٽ ڪوائن جا بنياد، پهريون ڪرپٽو ڪرنسي.', icon: BookOpen, duration: '10 منٽ' },
      { id: 'what-is-blockchain', title: 'بلاڪ چين ڇا آهي؟', description: 'بلاڪ چين ٽيڪنالاجي ڪيئن ڪم ڪري ٿي.', icon: Cpu, duration: '15 منٽ' },
      { id: 'crypto-wallets', title: 'ڪرپٽو واليٽس', description: 'گرم واليٽس، ٿڌي واليٽس، ۽ ڪرپٽو سيڪيورٽي.', icon: Wallet, duration: '12 منٽ' },
      { id: 'how-to-buy', title: 'بٽ ڪوائن ڪيئن خريد ڪريو', description: 'پهريون بٽ ڪوائن خريد ڪرڻ جو قدم قدم گائيڊ.', icon: TrendingUp, duration: '8 منٽ' },
    ],
    intermediate: [
      { id: 'trading-basics', title: 'وڪري جا بنياد', description: 'مارڪيٽ آرڊر، لميٽ آرڊر، ۽ واپاري حڪمت عمليون.', icon: BarChart3, duration: '20 منٽ' },
      { id: 'defi-explained', title: 'ڊيفي وضاحت', description: 'غير مرڪزي فنانس، ييلڊ فارمنگ، ۽ لڪوڊيٽي پول.', icon: Lightbulb, duration: '25 منٽ' },
      { id: 'nft-guide', title: 'NFT گائيڊ', description: 'NFTs ڇا آهن ۽ ڪيئن ڪم ڪن ٿا؟', icon: BookOpen, duration: '15 منٽ' },
      { id: 'security', title: 'ڪرپٽو سيڪيورٽي', description: 'هيڪنگ ۽ اسڪيمز کان بچاءُ جا بهترين طريقا.', icon: Shield, duration: '18 منٽ' },
    ],
    advanced: [
      { id: 'bitcoin-etf', title: 'بٽ ڪوائن ETFs', description: 'بٽ ڪوائن ETFs ۽ مارڪيٽ تي اثر.', icon: TrendingUp, duration: '20 منٽ' },
      { id: 'mining', title: 'بٽ ڪوائن مائننگ', description: 'بٽ ڪوائن مائننگ، پروف آف ورڪ، ۽ منافعو.', icon: Cpu, duration: '30 منٽ' },
      { id: 'technical-analysis', title: 'ٽيڪنيڪي تجزيو', description: 'ايڊوانسڊ چارٽ ريڊنگ ۽ واپاري نمونا.', icon: BarChart3, duration: '45 منٽ' },
      { id: 'risks-opportunities', title: 'رسڪ ۽ موقع', description: 'مارڪيٽ سائيڪل، رسڪ مينجمينٽ، ۽ سيڙپڪاري.', icon: Shield, duration: '25 منٽ' },
    ],
  },
  en: {
    beginner: [
      { id: 'what-is-bitcoin', title: 'What is Bitcoin?', description: 'Learn the basics of Bitcoin, the first cryptocurrency.', icon: BookOpen, duration: '10 min' },
      { id: 'what-is-blockchain', title: 'What is Blockchain?', description: 'Understand how blockchain technology works.', icon: Cpu, duration: '15 min' },
      { id: 'crypto-wallets', title: 'Crypto Wallets Explained', description: 'Learn about hot wallets, cold wallets, and how to secure your crypto.', icon: Wallet, duration: '12 min' },
      { id: 'how-to-buy', title: 'How to Buy Bitcoin', description: 'Step-by-step guide to buying your first Bitcoin.', icon: TrendingUp, duration: '8 min' },
    ],
    intermediate: [
      { id: 'trading-basics', title: 'Trading Basics', description: 'Learn about market orders, limit orders, and trading strategies.', icon: BarChart3, duration: '20 min' },
      { id: 'defi-explained', title: 'DeFi Explained', description: 'Understanding decentralized finance, yield farming, and liquidity pools.', icon: Lightbulb, duration: '25 min' },
      { id: 'nft-guide', title: 'NFT Guide', description: 'What are NFTs and how do they work?', icon: BookOpen, duration: '15 min' },
      { id: 'security', title: 'Crypto Security', description: 'Best practices for keeping your crypto safe from hacks and scams.', icon: Shield, duration: '18 min' },
    ],
    advanced: [
      { id: 'bitcoin-etf', title: 'Bitcoin ETFs Explained', description: 'Understanding Bitcoin ETFs and how they affect the market.', icon: TrendingUp, duration: '20 min' },
      { id: 'mining', title: 'Bitcoin Mining', description: 'How Bitcoin mining works, proof of work, and mining profitability.', icon: Cpu, duration: '30 min' },
      { id: 'technical-analysis', title: 'Technical Analysis', description: 'Advanced chart reading, indicators, and trading patterns.', icon: BarChart3, duration: '45 min' },
      { id: 'risks-opportunities', title: 'Risks & Opportunities', description: 'Understanding market cycles, risk management, and investment strategies.', icon: Shield, duration: '25 min' },
    ],
  },
};

const learnTexts: Record<string, Record<string, string>> = {
  roman: { title: 'Bitcoin Learning Center', desc: 'Complete guides from beginner to pro. Blockchain, wallets, trading sab seekhen.', beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', quickStart: 'Quick Start Guide', step1: 'Step 1: Bitcoin Samjhen', step1Desc: 'Bitcoin kya hai, kaise kaam karta hai, aur kyun zaroori hai.', step2: 'Step 2: Wallet Lein', step2Desc: 'Apna Bitcoin safe rakhne ke liye secure wallet chunein.', step3: 'Step 3: Chota Shuru Karein', step3Desc: 'Thoda sa khareeden aur transactions kaise kaam karte hain seekhen.' },
  ur: { title: 'بٹ کوائن لرننگ سینٹر', desc: 'مکمل گائیڈز - ابتدائی سے پرو تک۔ بلاک چین، والیٹس، ٹریڈنگ سب سیکھیں۔', beginner: 'ابتدائی', intermediate: 'درمیانہ', advanced: 'ایڈوانسڈ', quickStart: 'فوری شروعات', step1: 'پہلا قدم: بٹ کوائن سمجھیں', step1Desc: 'بٹ کوائن کیا ہے، کیسے کام کرتا ہے، اور کیوں ضروری ہے۔', step2: 'دوسرا قدم: والیٹ لیں', step2Desc: 'بٹ کوائن محفوظ رکھنے کے لیے محفوظ والیٹ منتخب کریں۔', step3: 'تیسرا قدم: چھوٹا شروع کریں', step3Desc: 'تھوڑا سا خریدیں اور ٹرانزیکشنز کیسے کام کرتی ہیں سیکھیں۔' },
  ps: { title: 'د بټ کوائن زده کړه مرکز', desc: 'بشپړ لارښودونه - پیل کونکی څخه تر پرو پورې. بلاک چین، پرسونه، سوداګري زده کړئ.', beginner: 'پیل کوونکی', intermediate: 'منځنی', advanced: 'پرمختللی', quickStart: 'چټک پیل', step1: 'لومړی ګام: بټ کوائن پوه شئ', step1Desc: 'بټ کوائن څه شی دی، څنګه کار کوي، او ولې مهم دی.', step2: 'دوهم ګام: پرس واخلئ', step2Desc: 'خپل بټ کوائن خوندي ساتلو لecure پرس وټاکئ.', step3: 'دریم ګام: لږ پیل وکړئ', step3Desc: 'لږ واخلئ او ټرانزیکشنونه څنګه کار کوي زده کړئ.' },
  sd: { title: 'بٽ ڪوائن سکيا مرڪز', desc: 'مڪمل گائيڊز - شروعاتي کان پرو تائين. بلاڪ چين، واليٽس، واپار سکو.', beginner: 'شروعاتي', intermediate: 'وچولو', advanced: 'ايڊوانسڊ', quickStart: 'فوري شروعات', step1: 'پهريون قدم: بٽ ڪوائن سمجهو', step1Desc: 'بٽ ڪوائن ڇا آهي، ڪيئن ڪم ڪري ٿو، ۽ ڇو ضروري آهي.', step2: 'ٻيو قدم: واليٽ وٺو', step2Desc: 'پنهنجو بٽ ڪوائن محفوظ رکڻ لاءِ محفوظ واليٽ چونڊيو.', step3: 'ٽيون قدم: ٿورو شروع ڪريو', step3Desc: 'ٿورو خريد ڪريو ۽ ٽرانزيڪشن ڪيئن ڪم ڪن ٿا سکو.' },
  en: { title: 'Bitcoin Learning Center', desc: 'Complete guides from beginner to pro. Learn blockchain, wallets, trading, and more.', beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', quickStart: 'Quick Start Guide', step1: 'Step 1: Understand Bitcoin', step1Desc: 'Learn what Bitcoin is, how it works, and why it matters.', step2: 'Step 2: Get a Wallet', step2Desc: 'Choose a secure wallet to store your Bitcoin safely.', step3: 'Step 3: Start Small', step3Desc: 'Buy a small amount and learn how transactions work.' },
  hi: { title: 'बिटकॉइन सीखना केंद्र', subtitle: 'शुरुआत से विशेषज्ञ तक पूर्ण गाइड। ब्लॉकचेन, वॉलेट, ट्रेडिंग सब सीखें।', beginner: 'शुरुआती', intermediate: 'मध्यवर्ती', advanced: 'उन्नत', comingSoon: 'जल्द आ रहा है' },
  fr: { title: "Centre d'apprentissage Bitcoin", subtitle: 'Des guides complets du débutant au pro. Blockchain, portefeuilles, trading, tout apprendre.', beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé', comingSoon: 'Bientôt disponible' },
  de: { title: 'Bitcoin Lernzentrum', subtitle: 'Vollständige Anleitungen vom Anfänger zum Profi. Blockchain, Wallets, Trading alles lernen.', beginner: 'Anfänger', intermediate: 'Fortgeschritten', advanced: 'Experte', comingSoon: 'Demnächst' },
  tr: { title: 'Bitcoin Öğrenme Merkezi', subtitle: 'Başlangıçtan profesyonele eksiksiz rehberler. Blockchain, cüzdanlar, ticaret hepsini öğrenin.', beginner: 'Başlangıç', intermediate: 'Orta', advanced: 'İleri', comingSoon: 'Çok Yakında' },
  ru: { title: 'Центр обучения Bitcoin', subtitle: 'Полные руководства от новичка до профи. Блокчейн, кошельки, трейдинг — всё изучите.', beginner: 'Новичок', intermediate: 'Средний', advanced: 'Продвинутый', comingSoon: 'Скоро' },
  zh: { title: '比特币学习中心', subtitle: '从入门到精通完整指南。学习区块链、钱包、交易等所有内容。', beginner: '入门', intermediate: '中级', advanced: '高级', comingSoon: '即将推出' },
  ja: { title: 'ビットコイン学習センター', subtitle: '初心者からプロまで完全ガイド。ブロックチェーン、ウォレット、トレーディングをすべて学ぶ。', beginner: '初心者', intermediate: '中級', advanced: '上級', comingSoon: '近日公開' },
};

export function LearnBitcoinPage() {
  const { language } = useAppStore();
  const lang = language || 'roman';
  const texts = learnTexts[lang] || learnTexts.roman;
  const lessons = LESSONS[lang] || LESSONS.roman;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-bitcoin" />
          {texts.title}
        </h1>
        <p className="text-muted-foreground mt-1">
          {texts.desc}
        </p>
      </div>

      <LearnAd className="my-4" />

      <Tabs defaultValue="beginner">
        <TabsList className="w-full">
          <TabsTrigger value="beginner" className="flex-1">{texts.beginner}</TabsTrigger>
          <TabsTrigger value="intermediate" className="flex-1">{texts.intermediate}</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">{texts.advanced}</TabsTrigger>
        </TabsList>

        {(Object.keys(lessons) as Array<keyof typeof lessons>).map((level) => (
          <TabsContent key={level} value={level} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons[level].map((lesson) => (
                <Link key={lesson.id} href={`/learn-bitcoin/${lesson.id}`}>
                  <Card className="card-hover h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-bitcoin/10 flex items-center justify-center">
                            <lesson.icon className="h-5 w-5 text-bitcoin" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{lesson.duration}</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{texts.quickStart}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">{texts.step1}</h3>
              <p className="text-sm text-muted-foreground">{texts.step1Desc}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">{texts.step2}</h3>
              <p className="text-sm text-muted-foreground">{texts.step2Desc}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">{texts.step3}</h3>
              <p className="text-sm text-muted-foreground">{texts.step3Desc}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
