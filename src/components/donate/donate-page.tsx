'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Wallet, Heart, Shield } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';
import { useAppStore } from '@/stores';
import { fetchCmsData } from '@/lib/cms/unified';

const donateTexts: Record<string, Record<string, string>> = {
  roman: { title: 'Like Our Work?', desc: 'Aapka donation humein platform behtar banane mein madad karta hai.', network: 'Network Select Karein', send: 'Bhejen', address: 'Wallet Address', verify: 'Bhejne se pehle address zaroor verify karein', thanks: 'Shukriya!', thanksDesc: 'Har donation BitcoinUrdu ko behtar banane mein jata hai.', loading: 'Load ho raha hai...' },
  ur: { title: 'ہمارا ساتھ دیں؟', desc: 'آپ کا عطیہ ہمیں پلیٹ فارم بہتر بنانے میں مدد کرتا ہے۔', network: 'نیٹ ورک منتخب کریں', send: 'بھیجیں', address: 'والیٹ ایڈریس', verify: 'بھیجنے سے پہلے ایڈریس ضرور تصدیق کریں', thanks: 'شکریہ!', thanksDesc: 'ہر عطیہ BitcoinUrdu کو بہتر بنانے میں جاتا ہے۔', loading: 'لوڈ ہو رہا ہے...' },
  ps: { title: 'زموږ ملاتړ وکړئ؟', desc: 'ستاسو مرسته موږ ته پلیټ فارم ښه کولو کې مرسته کوي.', network: 'شبکه وټاکئ', send: 'ولیږئ', address: 'د پرس پته', verify: 'لیږلو دمخه پته تایید کړئ', thanks: 'مننه!', thanksDesc: 'هره مرسته BitcoinUrdu ښه کولو ته ځي.', loading: 'لوډ کیږي...' },
  sd: { title: 'اسانجو ساٿ ڏيو؟', desc: 'توهان جي مدد اسان کي پليٽ فارم بهتر بڻائڻ ۾ مدد ڪري ٿي.', network: 'نيٽ ورڪ چونڊيو', send: 'موڪليو', address: 'واليٽ ايڊريس', verify: 'موڪلڻ کان اڳ ايڊريس تصديق ڪريو', thanks: 'شڪريو!', thanksDesc: 'هر مدد BitcoinUrdu بهتر بڻائڻ ۾ وڃي ٿي.', loading: 'لوڊ ٿي رهيو آهي...' },
  en: { title: 'Like Our Work?', desc: 'Your donation helps us keep the platform running and add new features.', network: 'Select Network', send: 'Send', address: 'Wallet Address', verify: 'Always verify the address before sending', thanks: 'Thank You!', thanksDesc: 'Every donation goes directly toward improving BitcoinUrdu.', loading: 'Loading...' },
  hi: { title: 'हमारा समर्थन करें', copy: 'पता कॉपी करें', copied: 'कॉपी हुआ!', subtitle: 'बिटकॉइन के साथ दान करें' },
  fr: { title: 'Soutenez notre travail', copy: "Copier l'adresse", copied: 'Copié !', subtitle: 'Faire un don avec Bitcoin' },
  de: { title: 'Unsere Arbeit unterstützen', copy: 'Adresse kopieren', copied: 'Kopiert!', subtitle: 'Mit Bitcoin spenden' },
  tr: { title: 'Çalışmalarımızı Destekleyin', copy: 'Adresi Kopyala', copied: 'Kopyalandı!', subtitle: 'Bitcoin ile Bağış Yapın' },
  ru: { title: 'Поддержите нашу работу', copy: 'Скопировать адрес', copied: 'Скопировано!', subtitle: 'Пожертвовать с Bitcoin' },
  zh: { title: '支持我们的工作', copy: '复制地址', copied: '已复制！', subtitle: '用比特币捐赠' },
  ja: { title: '私たちの活動を支援する', copy: 'アドレスをコピー', copied: 'コピーしました！', subtitle: 'ビットコインで寄付する' },
};

export function DonatePage() {
  const { language } = useAppStore();
  const [wallets, setWallets] = useState<Record<string, unknown>[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCmsData().then((data) => {
      const w = Object.entries(data.donationWallets || {}).map(([key, value]) => ({
        id: key,
        network: key,
        address: value,
        enabled: true,
      }));
      const active = w.filter((x) => x.enabled !== false);
      setWallets(active);
      if (active.length > 0) setSelectedWallet(active[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const lang = language || 'roman';
  const texts = donateTexts[lang] || donateTexts.roman;

  const evmNetworks = ['arbitrum', 'base', 'bsc', 'bnb', 'polygon', 'optimism', 'avalanche', 'fantom', 'ethereum', 'eth', 'evm'];
  const evmWallets = wallets.filter((w) => evmNetworks.includes(String(w.network).toLowerCase()));
  const nonEvmWallets = wallets.filter((w) => !evmNetworks.includes(String(w.network).toLowerCase()));

  const firstEvm = evmWallets.length > 0 ? evmWallets[0] : null;

  const displayWallets = [...nonEvmWallets, ...(firstEvm ? [firstEvm] : [])];

  if (loading) {
    return <div className="text-center py-12"><p className="text-muted-foreground">{texts.loading}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Heart className="h-12 w-12 text-crypto-red mx-auto" />
        <h1 className="text-3xl font-bold">{texts.title}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">{texts.desc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" />{texts.network}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {displayWallets.map((w) => {
                const isEvm = evmNetworks.includes(String(w.network).toLowerCase());
                return (
                  <Button key={String(w.id)} variant={selectedWallet?.id === w.id ? 'default' : 'outline'} className="h-auto py-3 flex flex-col items-center gap-1" onClick={() => setSelectedWallet(w)}>
                    <span className="font-medium text-sm">{isEvm ? 'All EVM' : String(w.token)}</span>
                    <span className="text-xs text-muted-foreground">{isEvm ? 'ETH, BSC, Arb, Base...' : String(w.network)}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedWallet && (
          <Card>
            <CardHeader>
              <CardTitle>
                {evmNetworks.includes(String(selectedWallet.network).toLowerCase()) ? `${texts.send} (All EVM)` : `${texts.send} ${String(selectedWallet.token)}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evmNetworks.includes(String(selectedWallet.network).toLowerCase()) ? (
                <>
                  <div className="space-y-3">
                    {evmWallets.map((w) => (
                      <div key={String(w.id)} className="p-3 rounded-lg border bg-muted/30">
                        <p className="text-sm font-medium mb-1">{String(w.token)} ({String(w.network)})</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-background px-3 py-1.5 rounded text-xs break-all">{String(w.address)}</code>
                          <CopyButton text={String(w.address)} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    {selectedWallet.qrImage ? (
                      <div className="bg-white p-4 rounded-lg">
                        <img src={String(selectedWallet.qrImage)} alt="QR Code" className="w-[180px] h-[180px] object-contain" />
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-lg"><QRCodeSVG value={String(selectedWallet.address)} size={180} /></div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    {selectedWallet.qrImage ? (
                      <div className="bg-white p-4 rounded-lg">
                        <img src={String(selectedWallet.qrImage)} alt="QR Code" className="w-[180px] h-[180px] object-contain" />
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-lg"><QRCodeSVG value={String(selectedWallet.address)} size={180} /></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{texts.address}</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted px-3 py-2 rounded-lg text-xs break-all">{String(selectedWallet.address)}</code>
                      <CopyButton text={String(selectedWallet.address)} />
                    </div>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Shield className="h-4 w-4 text-crypto-green" /><span>{texts.verify}</span></div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card><CardContent className="py-8 text-center space-y-4"><h3 className="text-xl font-semibold">{texts.thanks}</h3><p className="text-muted-foreground max-w-md mx-auto">{texts.thanksDesc}</p></CardContent></Card>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, copy] = useCopyToClipboard();
  return (<Button variant="outline" size="icon" onClick={() => copy(text)}>{copied ? <Check className="h-4 w-4 text-crypto-green" /> : <Copy className="h-4 w-4" />}</Button>);
}
