import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { CoinDetailClient } from './coin-detail-client';
import fs from 'fs';
import path from 'path';

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const name = params.id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return generateSEO({
    title: `${name} Price`,
    description: `View ${name} price, market cap, and live trading data.`,
  });
}

export function generateStaticParams() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const coinsFile = path.join(dataDir, 'coins-market.json');
    if (fs.existsSync(coinsFile)) {
      const raw = fs.readFileSync(coinsFile, 'utf-8');
      const parsed = JSON.parse(raw);
      const ids: { id: string }[] = [];
      for (const page of parsed.pages || []) {
        for (const coin of page.coins || []) {
          if ((coin.market_cap_rank || 0) <= 500) {
            ids.push({ id: coin.id });
          }
        }
      }
      return ids;
    }
  } catch {}
  return [
    { id: 'bitcoin' }, { id: 'ethereum' }, { id: 'solana' }, { id: 'binancecoin' },
    { id: 'ripple' }, { id: 'cardano' }, { id: 'dogecoin' }, { id: 'polkadot' },
    { id: 'avalanche-2' }, { id: 'chainlink' }, { id: 'tether' }, { id: 'usd-coin' },
    { id: 'shiba-inu' }, { id: 'pepe' }, { id: 'tron' }, { id: 'litecoin' },
    { id: 'near' }, { id: 'aptos' }, { id: 'sui' }, { id: 'toncoin' },
    { id: 'kaspa' }, { id: 'injective' }, { id: 'sei-network' }, { id: 'arbitrum' },
    { id: 'optimism' }, { id: 'render-token' }, { id: 'fetch-ai' }, { id: 'bittensor' },
    { id: 'immutable-x' }, { id: 'aave' }, { id: 'uniswap' }, { id: 'maker' },
    { id: 'cosmos' }, { id: 'filecoin' }, { id: 'internet-computer' }, { id: 'hedera-hashgraph' },
    { id: 'fantom' }, { id: 'algorand' }, { id: 'the-sandbox' }, { id: 'decentraland' },
    { id: 'monero' }, { id: 'zcash' }, { id: 'stellar' }, { id: 'theta-token' },
    { id: 'vechain' }, { id: 'stacks' }, { id: 'thorchain' }, { id: 'bonk' },
    { id: 'dogwifcoin' }, { id: 'floki' }, { id: 'pendle' }, { id: 'worldcoin' },
  ];
}

export default function CoinDetailRoute({ params }: { params: { id: string } }) {
  return <CoinDetailClient coinId={params.id} />;
}
