# BitcoinUrdu.com - Production-Ready Industrial Crypto Platform

Pakistan's #1 Cryptocurrency Platform - Live Prices, Airdrops, Portfolio Tracker, AI Chat

## Features

- **Live Crypto Prices** - Real-time data from CoinGecko, Binance, DexScreener, DefiLlama
- **Airdrop Tracking** - Active, upcoming, confirmed airdrops with eligibility checker
- **Portfolio Management** - Manual asset tracking with PNL calculations and charts
- **AI Chat Hub** - Multi-model AI (GPT, Gemini, DeepSeek, Perplexity)
- **Global Markets** - Stocks, Forex, Commodities, Indices
- **Price Alerts** - Custom price alerts with notifications
- **Bitcoin Learning Center** - Beginner to pro guides
- **Blog/News/Research** - CMS-controlled content
- **Donation System** - Multi-chain crypto donations with QR codes
- **AdSense Ready** - Header, sidebar, inline, footer, sticky ad slots
- **Multi-Language** - 10 languages (EN, UR, AR, HI, FR, DE, ZH, JA, RU, TR)
- **Multi-Currency** - USD, PKR, EUR, GBP, AED, SAR, INR
- **Full Admin Panel** - Dashboard, users, coins, airdrops, blog, ads, SEO, legal, settings
- **SEO Optimized** - Schema markup, Open Graph, Twitter cards, sitemaps
- **Mobile-First** - Responsive design for all screen sizes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + ShadCN UI
- **State Management**: Zustand
- **Charts**: Recharts
- **Database**: JSONBin CMS + Cloudflare D1/Supabase
- **Caching**: In-memory cache with TTL
- **Deployment**: Cloudflare Pages + Workers

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd bitcoinurdu

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your API keys
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Environment Variables

```env
# API Keys
COINGECKO_API_KEY=your_api_key
BINANCE_API_KEY=your_api_key

# JSONBin CMS
JSONBIN_BIN_ID=6a070d82250b1311c3543a9d
JSONBIN_API_KEY=your_api_key

# AI APIs (optional)
OPENAI_API_KEY=your_api_key
GOOGLE_AI_API_KEY=your_api_key
DEEPSEEK_API_KEY=your_api_key
PERPLEXITY_API_KEY=your_api_key

# Analytics
GA_MEASUREMENT_ID=your_ga_id

# AdSense
ADSENSE_CLIENT_ID=your_adsense_id

# Site
NEXT_PUBLIC_SITE_URL=https://bitcoinurdu.com
NEXT_PUBLIC_SITE_NAME=BitcoinUrdu

# Security
ADMIN_SECRET=your_admin_secret
JWT_SECRET=your_jwt_secret
```

## Project Structure

```
bitcoinurdu/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout
│   │   ├── coins/              # Crypto module
│   │   ├── airdrops/           # Airdrops module
│   │   ├── markets/            # Global markets
│   │   ├── portfolio/          # Portfolio tracker
│   │   ├── alerts/             # Price alerts
│   │   ├── ai/                 # AI Chat Hub
│   │   ├── learn-bitcoin/      # Learning center
│   │   ├── blog/               # Blog CMS
│   │   ├── news/               # News
│   │   ├── research/           # Research
│   │   ├── donate/             # Donations
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── privacy-policy/     # Privacy policy
│   │   ├── terms/              # Terms of service
│   │   ├── disclaimer/         # Disclaimer
│   │   ├── advertise/          # Advertise page
│   │   ├── support-us/         # Support us
│   │   ├── admin/              # Admin panel
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── layout/             # Header, footer, providers
│   │   ├── ui/                 # UI primitives
│   │   ├── crypto/             # Crypto components
│   │   ├── airdrops/           # Airdrop components
│   │   ├── markets/            # Market components
│   │   ├── portfolio/          # Portfolio components
│   │   ├── alerts/             # Alert components
│   │   ├── ai/                 # AI chat components
│   │   ├── learn/              # Learning components
│   │   ├── blog/               # Blog components
│   │   ├── donate/             # Donation components
│   │   ├── admin/              # Admin components
│   │   ├── ads/                # Ad slot components
│   │   ├── charts/             # Chart components
│   │   └── forms/              # Form components
│   ├── lib/                    # Utilities
│   │   ├── api/                # API clients
│   │   ├── cache/              # Caching system
│   │   ├── auth/               # Authentication
│   │   ├── i18n/               # Internationalization
│   │   ├── currency/           # Currency conversion
│   │   ├── seo/                # SEO utilities
│   │   ├── ads/                # Ad management
│   │   ├── ai/                 # AI integration
│   │   ├── cms/                # CMS integration
│   │   └── utils/              # Helper functions
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.js
└── .env.example
```

## Routes

### Public Routes
- `/` - Home
- `/coins` - All coins with filters
- `/coins/[id]` - Coin detail page
- `/coins/trending` - Trending coins
- `/coins/gainers` - Top gainers
- `/coins/losers` - Top losers
- `/coins/new` - New listings
- `/coins/categories` - Coin categories
- `/airdrops` - All airdrops
- `/airdrops/active` - Active airdrops
- `/airdrops/upcoming` - Upcoming airdrops
- `/airdrops/confirmed` - Confirmed airdrops
- `/airdrops/ended` - Ended airdrops
- `/airdrops/[id]` - Airdrop detail
- `/airdrop-checker` - Wallet airdrop checker
- `/markets` - Global markets overview
- `/markets/stocks` - Stock markets
- `/markets/forex` - Forex rates
- `/markets/crypto` - Crypto markets
- `/markets/commodities` - Commodities
- `/markets/global` - Global overview
- `/portfolio` - Portfolio tracker
- `/alerts` - Price alerts
- `/ai` - AI Chat Hub
- `/learn-bitcoin` - Bitcoin learning center
- `/blog` - Blog posts
- `/news` - Crypto news
- `/research` - Research articles
- `/donate` - Crypto donations
- `/about` - About us
- `/contact` - Contact us
- `/privacy-policy` - Privacy policy
- `/terms` - Terms of service
- `/disclaimer` - Disclaimer
- `/advertise` - Advertise with us
- `/support-us` - Support us

### Admin Routes
- `/admin` - Dashboard
- `/admin/coins` - Manage coins
- `/admin/airdrops` - Manage airdrops
- `/admin/users` - Manage users
- `/admin/blog` - Blog CMS
- `/admin/pages` - Pages CMS
- `/admin/ads` - Ads manager
- `/admin/donations` - Donations manager
- `/admin/seo` - SEO settings
- `/admin/legal` - Legal pages
- `/admin/notifications` - Notifications
- `/admin/logs` - Activity logs
- `/admin/backups` - Backups
- `/admin/security` - Security logs
- `/admin/settings` - Site settings

## Deployment

### Cloudflare Pages

1. Push code to GitHub
2. Go to Cloudflare Pages
3. Connect repository
4. Build command: `npm run build`
5. Output directory: `.next`
6. Set environment variables
7. Deploy

### Cloudflare Workers (API)

1. Install Wrangler: `npm install -g wrangler`
2. Create `wrangler.toml`
3. Deploy: `wrangler deploy`

## API Integration

### CoinGecko
- Free tier: 10-30 calls/min
- Pro tier: Higher limits
- Used for: Coin prices, market data, trending

### Binance
- Free API for public data
- Used for: Real-time prices, trading pairs

### DexScreener
- Free API for DEX data
- Used for: Token pairs, liquidity

### DefiLlama
- Free API for DeFi data
- Used for: TVL, chain data

## Caching Strategy

- In-memory cache with configurable TTL
- Coin data: 30s
- Coin detail: 60s
- Trending: 2min
- Categories: 5min
- Global data: 60s

## Security

- No API keys exposed in frontend
- Admin authentication required
- Rate limiting on API routes
- Input validation
- CORS headers
- Security headers (X-Frame-Options, etc.)

## SEO

- Dynamic meta tags per page
- Open Graph tags
- Twitter Card tags
- Schema.org structured data
- Sitemap generation
- robots.txt
- Canonical URLs

## License

MIT

## Contact

- Email: contact@bitcoinurdu.com
- Twitter: @bitcoinurdu
- Telegram: t.me/bitcoinurdu
