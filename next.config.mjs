/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.coingecko.com' },
      { protocol: 'https', hostname: 'coin-images.coingecko.com' },
      { protocol: 'https', hostname: 'cryptologos.cc' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'static.tradingview.com' },
      { protocol: 'https', hostname: 'api.dexscreener.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        '@solana/wallet-adapter-react': false,
        '@farcaster/miniapp-sdk': false,
        '@farcaster/mini-app-solana': false,
      },
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      '@solana/wallet-adapter-react': false,
      '@farcaster/miniapp-sdk': false,
      '@farcaster/mini-app-solana': false,
    };
    return config;
  },
};

export default nextConfig;
