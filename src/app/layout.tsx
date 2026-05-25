import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { SiteLayoutWrapper } from '@/components/layout/site-layout-wrapper';
import { Providers } from '@/components/layout/providers';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, generateWebsiteSchema } from '@/lib/seo';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - The World's Elite Multi-lingual Crypto Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'bitcoin',
    'bitcoin price today',
    'crypto',
    'cryptocurrency',
    'crypto price tracker',
    'crypto trading',
    'airdrops',
    'free crypto airdrops',
    'crypto airdrops 2026',
    'portfolio tracker',
    'crypto portfolio',
    'trading',
    'crypto trading',
    'pakistan',
    'urdu',
    'bitcoin urdu',
    'crypto urdu',
    'binance pakistan',
    'buy bitcoin pakistan',
    'buy crypto pakistan',
    'crypto news',
    'bitcoin news',
    'ethereum price',
    'crypto jobs',
    'web3 jobs',
    'blockchain jobs',
    'crypto market today',
    'live crypto prices',
    'crypto calculator',
    'pkr to crypto',
    'usdt price',
    'usdt to usd',
    'crypto investment',
    'learn crypto urdu',
    'crypto guide urdu',
    'bitcoin kya hai',
    'crypto kya hai',
    'blockchain kya hai',
    'crypto mining',
    'defi',
    'nft',
    'best crypto wallet',
    'binance p2p',
    'crypto exchange',
    'sada coin price',
    'pepe coin price',
    'dogecoin price',
    'solana price',
    'xrp price',
    'cardano price',
    'shiba inu price',
    'crypto alerts',
    'bitcoin halving 2026',
    'crypto prediction 2026',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@bitcoinurdu',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = generateWebsiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        {process.env.GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
