'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores';
import {
  Users, MapPin, Star, FileText, Send, CheckCircle, Copy,
  Wallet, Tag, Clock, Calendar, AlertCircle, ChevronDown,
  Globe, Zap, Shield, CreditCard, ExternalLink, Loader2,
  Package, AlertTriangle,
} from 'lucide-react';
import { fetchCmsData } from '@/lib/cms/unified';

const PACKAGES: Record<string, { id: string; name: string; nameUrdu: string; size: string; posKey: string; features: string[]; featuresUrdu: string[]; icon: string; popular?: boolean }> = {
  banner: {
    id: 'banner', name: 'Banner Ad', nameUrdu: 'بینر اشتہار', size: '728x90', posKey: 'header',
    features: ['Homepage banner placement', '50,000+ impressions/month', 'Click tracking included', 'Crypto-focused audience', 'Mobile responsive'],
    featuresUrdu: ['ہوم پیج بینر پلیسمنٹ', '50,000+ امپریشنز/ماہ', 'کلک ٹریکنگ شامل', 'کرپٹو آڈینس', 'موبائل ریسپانسو'],
    icon: '🖼️',
  },
  sidebar: {
    id: 'sidebar', name: 'Sidebar Ad', nameUrdu: 'سائیڈبار اشتہار', size: '300x250', posKey: 'sidebar',
    features: ['All pages visible', 'High engagement rate', 'Image or text ad', 'Sticky option available', 'Real-time stats'],
    featuresUrdu: ['تمام صفحات پر نظر', 'اعلیٰ انگیجمنٹ ریٹ', 'تصویر یا ٹیکسٹ اشتہار', 'سٹکی آپشن دستیاب', 'ریئل ٹائم اعداد و شمار'],
    icon: '📌', popular: true,
  },
  article: {
    id: 'article', name: 'Sponsored Article', nameUrdu: 'سپانسرڈ آرٹیکل', size: 'Full post', posKey: 'inline',
    features: ['Written in Urdu/Roman Urdu', 'Social media sharing', 'Permanent placement', 'SEO optimized', 'Backlink included'],
    featuresUrdu: ['اردو/رومن اردو میں لکھا', 'سوشل میڈیا شیئرنگ', 'مستقل پلیسمنٹ', 'SEO آپٹیمائزڈ', 'بیک لنک شامل'],
    icon: '📝',
  },
  rectangle: {
    id: 'rectangle', name: 'Rectangle Ad', nameUrdu: 'ریکٹینگل اشتہار', size: '336x280', posKey: 'inline',
    features: ['High engagement format', 'Inline placement', 'Image or HTML', 'Multiple pages', 'Performance tracking'],
    featuresUrdu: ['اعلیٰ انگیجمنٹ فارمیٹ', 'ان لائن پلیسمنٹ', 'تصویر یا HTML', 'متعدد صفحات', 'پرفارمنس ٹریکنگ'],
    icon: '📐',
  },
  sticky: {
    id: 'sticky', name: 'Sticky Bottom Ad', nameUrdu: 'سٹکی باٹم اشتہار', size: '320x50', posKey: 'sticky',
    features: ['Fixed bottom placement', 'Always visible', 'Mobile optimized', 'High CTR', 'All pages'],
    featuresUrdu: ['فکسڈ باٹم پلیسمنٹ', 'ہمیشہ نظر', 'موبائل آپٹیمائزڈ', 'اعلیٰ CTR', 'تمام صفحات'],
    icon: '📎',
  },
};

const HTML_TEMPLATES: Record<string, (name: string, url: string, image?: string) => string> = {
  banner: (name, url, image) => `<a href="${url}" target="_blank" style="display:block;width:728px;height:90px;background:#1a1a2e;border-radius:8px;overflow:hidden;text-decoration:none;">${image ? `<img src="${image}" alt="${name}" style="width:100%;height:100%;object-fit:cover;" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#4ade80;font-family:Arial;font-size:24px;font-weight:bold;">${name}</div>`}</a>`,
  sidebar: (name, url, image) => `<a href="${url}" target="_blank" style="display:block;width:300px;height:250px;background:#1a1a2e;border-radius:8px;overflow:hidden;text-decoration:none;">${image ? `<img src="${image}" alt="${name}" style="width:100%;height:100%;object-fit:cover;" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#4ade80;font-family:Arial;font-size:20px;font-weight:bold;text-align:center;padding:20px;">${name}</div>`}</a>`,
  article: (name, url) => `<div style="max-width:800px;margin:0 auto;padding:20px;"><h2 style="color:#4ade80;">${name}</h2><p>Sponsored content by <a href="${url}" target="_blank" style="color:#4ade80;">${name}</a></p></div>`,
  rectangle: (name, url, image) => `<a href="${url}" target="_blank" style="display:block;width:336px;height:280px;background:#1a1a2e;border-radius:8px;overflow:hidden;text-decoration:none;">${image ? `<img src="${image}" alt="${name}" style="width:100%;height:100%;object-fit:cover;" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#4ade80;font-family:Arial;font-size:20px;font-weight:bold;text-align:center;padding:20px;">${name}</div>`}</a>`,
  sticky: (name, url) => `<a href="${url}" target="_blank" style="display:block;width:100%;max-width:320px;height:50px;background:#1a1a2e;border-radius:4px;text-decoration:none;"><div style="display:flex;align-items:center;justify-content:center;height:100%;color:#4ade80;font-family:Arial;font-size:14px;font-weight:bold;">${name}</div></a>`,
};

const DURATIONS = [
  { value: 1, label: '1 Week', weeks: 1, discount: 0 },
  { value: 2, label: '2 Weeks', weeks: 2, discount: 0 },
  { value: 3, label: '1 Month', weeks: 4, discount: 0 },
  { value: 4, label: '3 Months', weeks: 12, discount: 10 },
  { value: 5, label: '6 Months', weeks: 24, discount: 15 },
  { value: 6, label: '12 Months', weeks: 48, discount: 20 },
];

export default function AdvertiseClient() {
  const { language } = useAppStore();
  const isUrdu = language === 'ur';

  const [adPrices, setAdPrices] = useState<Record<string, { price: number; period: string; size: string }>>({});
  const [slotAvailability, setSlotAvailability] = useState<Record<string, { available: boolean; availableFrom?: string; bookedUntil?: string }>>({});
  const [walletAddress, setWalletAddress] = useState('');
  const [easypaisaNumber, setEasypaisaNumber] = useState('0300-1234567');
  const [jazzcashNumber, setJazzcashNumber] = useState('0300-1234567');
  const [easypaisaTitle, setEasypaisaTitle] = useState('BitcoinUrdu');
  const [jazzcashTitle, setJazzcashTitle] = useState('BitcoinUrdu');
  const [discountCodes, setDiscountCodes] = useState<Record<string, { code: string; discount: number; active: boolean }>>({});

  const [selectedPackage, setSelectedPackage] = useState('banner');
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [formData, setFormData] = useState({ name: '', email: '', website: '', message: '' });
  const [adContent, setAdContent] = useState({ type: 'html' as 'html' | 'blog', htmlCode: '', blogTitle: '', blogContent: '' });
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [discountError, setDiscountError] = useState('');

  const [step, setStep] = useState(1);
  const [trxId, setTrxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCmsData().then((data) => {
      const prices = (data as unknown as Record<string, unknown>).adPrices as Record<string, { price: number; period: string; size: string }> | undefined;
      if (prices) setAdPrices(prices);
      const availability = (data as unknown as Record<string, unknown>).slotAvailability as Record<string, { available: boolean; availableFrom?: string; bookedUntil?: string }> | undefined;
      if (availability) setSlotAvailability(availability);
      const paymentInfo = (data as unknown as Record<string, unknown>).adPaymentInfo as { walletAddress?: string; easypaisaNumber?: string; jazzcashNumber?: string; easypaisaTitle?: string; jazzcashTitle?: string } | undefined;
      if (paymentInfo) {
        if (paymentInfo.walletAddress) setWalletAddress(paymentInfo.walletAddress);
        if (paymentInfo.easypaisaNumber) setEasypaisaNumber(paymentInfo.easypaisaNumber);
        if (paymentInfo.jazzcashNumber) setJazzcashNumber(paymentInfo.jazzcashNumber);
        if (paymentInfo.easypaisaTitle) setEasypaisaTitle(paymentInfo.easypaisaTitle);
        if (paymentInfo.jazzcashTitle) setJazzcashTitle(paymentInfo.jazzcashTitle);
      }
      const codes = (data as unknown as Record<string, unknown>).discountCodes as Record<string, { code: string; discount: number; active: boolean }> | undefined;
      if (codes) setDiscountCodes(codes);
    }).catch(() => {});
  }, []);

  const getPrice = (pkgId: string): number => {
    const pkg = adPrices[pkgId];
    if (pkg) return pkg.price;
    const defaults: Record<string, number> = { banner: 50, sidebar: 30, article: 100, rectangle: 40, sticky: 25 };
    return defaults[pkgId] || 50;
  };

  const getSlotInfo = (pkgId: string) => {
    const posKey = PACKAGES[pkgId]?.posKey || 'header';
    return slotAvailability[posKey] || { available: true };
  };

  const getAvailableSlots = () => {
    return Object.entries(slotAvailability)
      .filter(([_, v]) => v.available)
      .map(([key]) => key);
  };

  const calculateTotal = (): number => {
    const dur = DURATIONS[selectedDuration];
    const weeks = dur.weeks;
    const monthlyPrice = getPrice(selectedPackage);
    const weeklyPrice = monthlyPrice / 4;
    const base = weeklyPrice * weeks;
    const discount = appliedDiscount ? base * (appliedDiscount / 100) : 0;
    const durDiscount = dur.discount > 0 ? base * (dur.discount / 100) : 0;
    return base - discount - durDiscount;
  };

  const applyDiscount = () => {
    setDiscountError('');
    const code = discountCode.trim().toUpperCase();
    const found = Object.values(discountCodes).find((c) => c.code.toUpperCase() === code && c.active);
    if (found) {
      setAppliedDiscount(found.discount);
    } else {
      setDiscountError('Invalid or expired code');
      setAppliedDiscount(null);
    }
  };

  const copyWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) return;
    setLoading(true);
    const dur = DURATIONS[selectedDuration];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + dur.weeks * 7);
    try {
      const htmlCode = adContent.type === 'html' ? adContent.htmlCode : HTML_TEMPLATES[selectedPackage]?.(formData.name || 'Sponsored', formData.website || 'https://example.com');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ad-order',
          package: selectedPackage,
          duration: dur.label,
          durationWeeks: dur.weeks,
          total: calculateTotal(),
          discount: appliedDiscount,
          durationDiscount: dur.discount,
          trxId,
          walletAddress,
          htmlCode,
          adContentType: adContent.type,
          blogTitle: adContent.blogTitle,
          blogContent: adContent.blogContent,
          endDate: endDate.toISOString().split('T')[0],
          ...formData,
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
    setLoading(false);
  };

  const selectedPkg = PACKAGES[selectedPackage];
  const slotInfo = getSlotInfo(selectedPackage);
  const total = calculateTotal();
  const dur = DURATIONS[selectedDuration];
  const htmlCode = adContent.type === 'html' ? adContent.htmlCode : HTML_TEMPLATES[selectedPackage]?.(formData.name || 'Your Brand', formData.website || 'https://example.com');
  const availableSlots = getAvailableSlots();

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="text-center py-12 border-crypto-green/30">
          <CardContent>
            <CheckCircle className="h-16 w-16 text-crypto-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{isUrdu ? 'آرڈر جمع ہو گیا!' : 'Order Submitted!'}</h2>
            <p className="text-muted-foreground mb-4">
              {isUrdu ? 'ادائیگی کی تصدیق کے بعد اشتہار خودکار طور پر لگ جائے گا۔' : 'Your ad will go live automatically after payment verification.'}
            </p>
            <div className="bg-muted/50 rounded-lg p-4 max-w-sm mx-auto space-y-2">
              <p className="text-sm font-medium">{isUrdu ? 'ٹرانزیکشن آئی ڈی' : 'Transaction ID'}</p>
              <p className="text-bitcoin font-mono text-lg">{trxId}</p>
              <p className="text-sm text-muted-foreground">{isUrdu ? 'رقم' : 'Amount'}: <span className="font-bold text-foreground">${total.toFixed(2)}</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4 py-4">
        <h1 className="text-3xl md:text-5xl font-bold">
          {isUrdu ? 'بٹ کوائن اردو پر اشتہار' : 'BitcoinUrdu Par Ishtihar'}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {isUrdu
            ? 'پاکستان کے سب سے بڑے کرپٹو آڈینس تک اپنا برانڈ پہنچائیں۔'
            : "The world's premium high-authority cryptocurrency news, on-chain analytics, gold rates and recruitment gateway."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center border-bitcoin/20">
          <CardContent className="pt-6">
            <Users className="h-7 w-7 text-bitcoin mx-auto mb-2" />
            <div className="text-2xl font-bold">50,000+</div>
            <div className="text-sm text-muted-foreground">{isUrdu ? 'ماہانہ پیج ویوز' : 'Monthly Page Views'}</div>
          </CardContent>
        </Card>
        <Card className="text-center border-bitcoin/20">
          <CardContent className="pt-6">
            <Globe className="h-7 w-7 text-bitcoin mx-auto mb-2" />
            <div className="text-2xl font-bold">30,000+</div>
            <div className="text-sm text-muted-foreground">{isUrdu ? 'فعال صارفین' : 'Unique Active Users'}</div>
          </CardContent>
        </Card>
        <Card className="text-center border-bitcoin/20">
          <CardContent className="pt-6">
            <MapPin className="h-7 w-7 text-bitcoin mx-auto mb-2" />
            <div className="text-lg font-bold">PK, UAE, SA</div>
            <div className="text-sm text-muted-foreground">{isUrdu ? 'مین ٹریفک سورسز' : 'Main Traffic Sources'}</div>
          </CardContent>
        </Card>
        <Card className="text-center border-bitcoin/20">
          <CardContent className="pt-6">
            <Zap className="h-7 w-7 text-bitcoin mx-auto mb-2" />
            <div className="text-2xl font-bold">70%</div>
            <div className="text-sm text-muted-foreground">{isUrdu ? 'موبائل ٹریفک' : 'Mobile Traffic'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <div className="bg-gradient-to-r from-bitcoin/10 via-transparent to-bitcoin/10 rounded-xl p-6 text-center">
        <p className="text-lg font-medium">
          {isUrdu
            ? 'پاکستان کے سب سے بڑے کرپٹو آڈینس تک اپنا برانڈ پہنچائیں۔'
            : 'Target institutional, retail, and technology-focused demographics across global markets with high purchasing power.'}
        </p>
      </div>

      {/* Packages */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">
          {isUrdu ? 'اشتہاری پیکجز اور قیمتیں' : 'Ad Packages & Pricing'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(PACKAGES).map((pkg) => {
            const price = getPrice(pkg.id);
            const info = getSlotInfo(pkg.id);
            const isSelected = selectedPackage === pkg.id;

            return (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all ${isSelected ? 'border-bitcoin ring-2 ring-bitcoin/30' : 'hover:border-bitcoin/50'} ${pkg.popular ? 'relative' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-bitcoin text-white">
                    {isUrdu ? 'مقبول' : 'Popular'}
                  </Badge>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{pkg.icon}</span>
                    <CardTitle className="text-lg">{isUrdu ? pkg.nameUrdu : pkg.name}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-bitcoin">${price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{pkg.size}</span>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {(isUrdu ? pkg.featuresUrdu : pkg.features).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-crypto-green shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t mt-2">
                    {info.available ? (
                      <div className="flex items-center gap-1.5 text-xs text-crypto-green">
                        <Shield className="h-3.5 w-3.5" />
                        {isUrdu ? 'اسلوٹ دستیاب ہے' : 'Slot Available'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-500">
                        <Clock className="h-3.5 w-3.5" />
                        {isUrdu ? `دستیاب: ${info.availableFrom || 'N/A'}` : `Available: ${info.availableFrom || 'N/A'}`}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Slot unavailable warning + alternatives */}
      {!slotInfo.available && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-500">
                  {isUrdu ? 'یہ اسلوٹ ابھی بکڈ ہے' : 'This Slot is Currently Booked'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isUrdu ? `یہ اسلوٹ ${slotInfo.bookedUntil || 'N/A'} تک بکڈ ہے۔ ${slotInfo.availableFrom ? `اس تاریخ سے دستیاب: ${slotInfo.availableFrom}` : ''}` : `This slot is booked until ${slotInfo.bookedUntil || 'N/A'}. ${slotInfo.availableFrom ? `Available from: ${slotInfo.availableFrom}` : ''}`}
                </p>
              </div>
            </div>
            {availableSlots.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">{isUrdu ? 'دستیاب متبادل اسلوٹس:' : 'Available Alternative Slots:'}</p>
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map((slot) => (
                    <Badge key={slot} variant="green" className="capitalize cursor-pointer" onClick={() => {
                      const pkgKey = Object.entries(PACKAGES).find(([_, p]) => p.posKey === slot)?.[0];
                      if (pkgKey) setSelectedPackage(pkgKey);
                    }}>
                      {slot} ✓
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Order Flow */}
      <Card className="border-bitcoin/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-bitcoin" />
            {isUrdu ? 'آرڈر مکمل کریں' : 'Complete Your Order'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step indicator */}
          <div className="flex items-center gap-2 text-sm">
            {[
              { n: 1, label: isUrdu ? 'تفصیلات' : 'Details' },
              { n: 2, label: isUrdu ? 'ادائیگی' : 'Payment' },
              { n: 3, label: isUrdu ? 'تصدیق' : 'Confirm' },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.n ? 'bg-bitcoin text-white' : 'bg-muted text-muted-foreground'}`}>
                  {step > s.n ? <CheckCircle className="h-4 w-4" /> : s.n}
                </div>
                <span className={step >= s.n ? 'font-medium' : 'text-muted-foreground'}>{s.label}</span>
                {i < 2 && <div className={`w-8 h-0.5 ${step > s.n ? 'bg-bitcoin' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{isUrdu ? 'آپ کا نام / برانڈ' : 'Your Name / Brand'}</label>
                  <Input placeholder="Full name or brand" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{isUrdu ? 'ای میل' : 'Email'}</label>
                  <Input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{isUrdu ? 'ویب سائٹ / پروڈکٹ' : 'Website / Product URL'}</label>
                <Input placeholder="https://yourwebsite.com" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-medium mb-2 block">{isUrdu ? 'مدت چنیں' : 'Select Duration'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {DURATIONS.map((d, i) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDuration(i)}
                      className={`p-3 rounded-lg border text-center transition-all ${selectedDuration === i ? 'border-bitcoin bg-bitcoin/10 text-bitcoin' : 'hover:bg-accent'}`}
                    >
                      <div className="text-sm font-bold">{d.label}</div>
                      {d.discount > 0 && <div className="text-[10px] text-crypto-green font-bold">-{d.discount}%</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ad Content Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">{isUrdu ? 'اشتہار کی قسم' : 'Ad Content Type'}</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAdContent({ ...adContent, type: 'html' })}
                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${adContent.type === 'html' ? 'border-bitcoin bg-bitcoin/10' : 'hover:bg-accent'}`}
                  >
                    <FileText className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">HTML / Ad Code</div>
                  </button>
                  <button
                    onClick={() => setAdContent({ ...adContent, type: 'blog' })}
                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${adContent.type === 'blog' ? 'border-bitcoin bg-bitcoin/10' : 'hover:bg-accent'}`}
                  >
                    <Package className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">{isUrdu ? 'سپانسرڈ بلاگ' : 'Sponsored Blog'}</div>
                  </button>
                </div>
              </div>

              {/* HTML Code or Blog Content */}
              {adContent.type === 'html' ? (
                <div>
                  <label className="text-sm font-medium mb-1 block">{isUrdu ? 'HTML کوڈ یا AdSense کوڈ' : 'HTML Code or AdSense Code'}</label>
                  <textarea
                    placeholder="<a href='...'>Your ad HTML here...</a>"
                    value={adContent.htmlCode}
                    onChange={(e) => setAdContent({ ...adContent, htmlCode: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-bitcoin/50 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{isUrdu ? 'یا خالی چھوڑیں، خودکار HTML بن جائے گا' : 'Or leave empty, auto HTML will be generated'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">{isUrdu ? 'بلاگ کا عنوان' : 'Blog Post Title'}</label>
                    <Input placeholder="e.g., Best Crypto Exchange 2026" value={adContent.blogTitle} onChange={(e) => setAdContent({ ...adContent, blogTitle: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">{isUrdu ? 'بلاگ کا مواد' : 'Blog Post Content'}</label>
                    <textarea
                      placeholder="Write your sponsored article here..."
                      value={adContent.blogContent}
                      onChange={(e) => setAdContent({ ...adContent, blogContent: e.target.value })}
                      rows={8}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Discount Code */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-bitcoin" />
                  <span className="text-sm font-medium">{isUrdu ? 'ڈسکاؤنٹ کوڈ' : 'Discount Code'}</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(''); }}
                    className="max-w-[200px]"
                  />
                  <Button onClick={applyDiscount} variant="outline" size="sm">
                    {isUrdu ? 'لاگو کریں' : 'Apply'}
                  </Button>
                </div>
                {appliedDiscount !== null && appliedDiscount > 0 && (
                  <p className="text-sm text-crypto-green mt-2">✓ {appliedDiscount}% discount applied!</p>
                )}
                {discountError && <p className="text-sm text-crypto-red mt-2">✗ {discountError}</p>}
              </div>

              {/* Order Summary */}
              <div className="p-4 rounded-lg border bg-bitcoin/5">
                <h3 className="font-semibold mb-2">{isUrdu ? 'آرڈر خلاصہ' : 'Order Summary'}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{selectedPkg.name} ({selectedPkg.size})</span>
                    <span>${getPrice(selectedPackage)}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isUrdu ? 'مدت' : 'Duration'}</span>
                    <span>{dur.label} ({dur.weeks} weeks)</span>
                  </div>
                  {dur.discount > 0 && (
                    <div className="flex justify-between text-crypto-green">
                      <span>{isUrdu ? 'مدت ڈسکاؤنٹ' : 'Duration Discount'} ({dur.discount}%)</span>
                      <span>-${(getPrice(selectedPackage) / 4 * dur.weeks * dur.discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {appliedDiscount !== null && appliedDiscount > 0 && (
                    <div className="flex justify-between text-crypto-green">
                      <span>Discount Code ({appliedDiscount}%)</span>
                      <span>-${(getPrice(selectedPackage) / 4 * dur.weeks * appliedDiscount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>{isUrdu ? 'کل رقم' : 'Total Amount'}</span>
                    <span className="text-bitcoin">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button onClick={() => setStep(2)} variant="bitcoin" className="w-full">
                {isUrdu ? 'ادائیگی پر جائیں' : 'Proceed to Payment'}
                <ChevronDown className="h-4 w-4 ml-1 -rotate-90" />
              </Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-bitcoin" />
                  <span className="font-semibold">{isUrdu ? 'ادائیگی کا طریقہ منتخب کریں' : 'Select Payment Method'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {/* EasyPaisa */}
                  <button
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'easypaisa' ? 'border-green-500 bg-green-500/10' : 'border-muted hover:border-green-500/50'}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg viewBox="0 0 48 48" className="w-12 h-12">
                        <rect width="48" height="48" rx="24" fill="#00AA4F"/>
                        <text x="24" y="30" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="white">EP</text>
                      </svg>
                      <span className="font-semibold text-sm">EasyPaisa</span>
                      <span className="text-xs text-muted-foreground">{isUrdu ? 'موبائل والیٹ' : 'Mobile Wallet'}</span>
                    </div>
                  </button>

                  {/* JazzCash */}
                  <button
                    onClick={() => setPaymentMethod('jazzcash')}
                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'jazzcash' ? 'border-red-500 bg-red-500/10' : 'border-muted hover:border-red-500/50'}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg viewBox="0 0 48 48" className="w-12 h-12">
                        <rect width="48" height="48" rx="24" fill="#E31E25"/>
                        <text x="24" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="white">JC</text>
                      </svg>
                      <span className="font-semibold text-sm">JazzCash</span>
                      <span className="text-xs text-muted-foreground">{isUrdu ? 'موبائل والیٹ' : 'Mobile Wallet'}</span>
                    </div>
                  </button>

                  {/* Crypto */}
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'crypto' ? 'border-bitcoin bg-bitcoin/10' : 'border-muted hover:border-bitcoin/50'}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg viewBox="0 0 48 48" className="w-12 h-12">
                        <rect width="48" height="48" rx="24" fill="#F7931A"/>
                        <text x="24" y="32" text-anchor="middle" font-family="Arial" font-size="28" font-weight="bold" fill="white">₿</text>
                      </svg>
                      <span className="font-semibold text-sm">Crypto</span>
                      <span className="text-xs text-muted-foreground">USDT / BTC</span>
                    </div>
                  </button>
                </div>

                {/* Payment Details Based on Method */}
                {paymentMethod === 'easypaisa' && (
                  <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <p className="text-sm font-medium text-green-600 mb-2">{isUrdu ? 'ایزی پیسہ ادائیگی' : 'EasyPaisa Payment'}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isUrdu ? 'اکاؤنٹ ٹائٹل' : 'Account Title'}</span>
                        <span className="font-medium">{easypaisaTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isUrdu ? 'موبائل نمبر' : 'Mobile Number'}</span>
                        <span className="font-mono font-medium">{easypaisaNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isUrdu ? 'رقم' : 'Amount'}</span>
                        <span className="font-bold text-green-600">PKR {(total * 278).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'jazzcash' && (
                  <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                    <p className="text-sm font-medium text-red-600 mb-2">{isUrdu ? 'جاز کیش ادائیگی' : 'JazzCash Payment'}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isUrdu ? 'اکاؤنٹ ٹائٹل' : 'Account Title'}</span>
                        <span className="font-medium">{jazzcashTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isUrdu ? 'موبائل نمبر' : 'Mobile Number'}</span>
                        <span className="font-mono font-medium">{jazzcashNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isUrdu ? 'رقم' : 'Amount'}</span>
                        <span className="font-bold text-red-600">PKR {(total * 278).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="p-4 rounded-lg bg-bitcoin/5 border border-bitcoin/20">
                    <p className="text-sm font-medium text-bitcoin mb-2">{isUrdu ? 'کرپٹو ادائیگی' : 'Crypto Payment'}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isUrdu ? 'نیٹ ورک' : 'Network'}</span>
                        <span className="font-medium">TRC20 (USDT)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isUrdu ? 'والیٹ ایڈریس' : 'Wallet Address'}</span>
                        <span className="font-mono text-xs break-all">{walletAddress || 'Not configured'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isUrdu ? 'رقم' : 'Amount'}</span>
                        <span className="font-bold text-bitcoin">${total.toFixed(2)} USDT</span>
                      </div>
                    </div>
                  </div>
                )}

                {!paymentMethod && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {isUrdu ? 'ادائیگی کا طریقہ منتخب کریں ↑' : 'Select a payment method above ↑'}
                  </p>
                )}
              </div>

              {/* Ad Preview */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-bitcoin" />
                  <span className="font-semibold">{isUrdu ? 'آپ کا اشتہار' : 'Your Ad Preview'}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {isUrdu ? 'یہ کوڈ ادائیگی کی تصدیق کے بعد خودکار طور پر لگ جائے گا:' : 'This will be auto-placed after payment confirmation:'}
                </p>
                {htmlCode ? (
                  <div className="relative">
                    <pre className="p-3 rounded-lg bg-background border text-xs font-mono overflow-x-auto max-h-[150px] overflow-y-auto whitespace-pre-wrap break-all">
                      {htmlCode}
                    </pre>
                    <Button
                      onClick={() => { navigator.clipboard.writeText(htmlCode); }}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-background border text-center">
                    <p className="text-sm text-muted-foreground">
                      {isUrdu ? 'ابھی تک کوئی اشتہار کوڈ شامل نہیں کیا گیا' : 'No ad code added yet'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isUrdu ? 'واپس جا کر HTML کوڈ یا بلاگ مواد شامل کریں' : 'Go back to add HTML code or blog content'}
                    </p>
                  </div>
                )}
              </div>

              {/* Transaction ID */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-crypto-green" />
                  <span className="font-semibold">{isUrdu ? 'ٹرانزیکشن آئی ڈی درج کریں' : 'Enter Transaction ID'}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {isUrdu ? 'ادائیگی بھیجنے کے بعد ٹرانزیکشن آئی ڈی (TXID) درج کریں:' : 'Enter the transaction ID / TXID after sending payment:'}
                </p>
                <Input
                  placeholder={paymentMethod === 'crypto' ? "e.g., TXN123456789abcdef..." : "e.g., 1234567890123456"}
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  {isUrdu ? 'واپس' : 'Back'}
                </Button>
                <Button onClick={handleSubmit} variant="bitcoin" className="flex-1" disabled={!trxId.trim() || loading || !paymentMethod}>
                  {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                  {isUrdu ? 'آرڈر جمع کروائیں' : 'Submit Order'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Direct Contact */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          <a href="mailto:ads@bitcoinurdu.com" className="text-bitcoin hover:underline">ads@bitcoinurdu.com</a>
          {' | '}
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="text-bitcoin hover:underline">
            +92 300 1234567
          </a>
        </p>
      </div>

      {/* Legal & Refund Policy */}
      <Card className="border-crypto-green/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-crypto-green" />
            {isUrdu ? 'قوانین اور ریفنڈ پالیسی' : 'Legal Rules & Refund Policy'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-muted/30 border">
            <h3 className="font-semibold mb-1">{isUrdu ? 'اشتہار کی منظوری' : 'Ad Approval Policy'}</h3>
            <p className="text-muted-foreground">
              {isUrdu
                ? 'BitcoinUrdu ہر اشتہار کو دیکھنے کے بعد منظور کرتا ہے۔ اگر آپ کا اشتہار ہماری پالیسی کے مطابق نہیں ہے تو ہم اسے مسترد کر سکتے ہیں۔'
                : 'BitcoinUrdu reviews and approves every ad. If your ad content does not comply with our policies, we reserve the right to reject it.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <h3 className="font-semibold mb-1">{isUrdu ? 'ریفنڈ پالیسی' : 'Refund Policy'}</h3>
            <p className="text-muted-foreground">
              {isUrdu
                ? 'اگر BitcoinUrdu کسی وجہ سے آپ کا اشتہار نہیں لگا سکتا تو آپ کی مکمل ادائیگی 7 (سات) دن کے اندر واپس کر دی جائے گی۔'
                : 'If BitcoinUrdu is unable to display your ad for any reason, your full payment will be refunded within 7 (seven) business days.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <h3 className="font-semibold mb-1">{isUrdu ? 'ریفنڈ کے لیے رابطہ' : 'Refund Contact'}</h3>
            <p className="text-muted-foreground">
              {isUrdu
                ? 'ریفنڈ کے لیے اپنا واپسی کا پتہ اور آرڈر کی تفصیل لکھ کر '
                : 'For refunds, please provide your return address and order details to '}
              <a href="mailto:help@bitcoinurdu.com" className="text-bitcoin hover:underline font-medium">help@bitcoinurdu.com</a>
              {isUrdu ? ' پر ای میل کریں یا واٹس ایپ پر رابطہ کریں۔' : ' or contact us via WhatsApp.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <h3 className="font-semibold mb-1">{isUrdu ? 'ممنوعہ مواد' : 'Prohibited Content'}</h3>
            <p className="text-muted-foreground">
              {isUrdu
                ? 'اسکام، جوا، غیر قانونی یا دھوکہ دہی والی ویب سائٹس کے اشتہارات قبول نہیں کیے جائیں گے۔ BitcoinUrdu کو مکمل حق حاصل ہے کہ وہ کسی بھی اشتہار کو بغیر وجہ بتائے مسترد کر دے۔'
                : 'Ads from scam, gambling, illegal, or fraudulent websites will not be accepted. BitcoinUrdu reserves the right to reject any ad without explanation.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <h3 className="font-semibold mb-1">{isUrdu ? 'ذمہ داری' : 'Liability'}</h3>
            <p className="text-muted-foreground">
              {isUrdu
                ? 'BitcoinUrdu صرف اشتہار کی جگہ فراہم کرتا ہے۔ اشتہار کے مواد کی ذمہ داری اشتہار دینے والے کی ہے۔ ہم کسی بھی نقصان یا دعوے کے ذمہ دار نہیں ہیں۔'
                : 'BitcoinUrdu only provides ad placement space. The advertiser is fully responsible for ad content. We are not liable for any claims or damages.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
