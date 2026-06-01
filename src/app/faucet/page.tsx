import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'Crypto Faucets - Free Testnet Tokens',
  description: 'Get free testnet tokens for development and testing. Bitcoin, Ethereum, Solana, and more testnet faucets.',
});

const testnetFaucets = [
  { name: 'Bitcoin Testnet Faucet', url: 'https://bitcoinfaucet.uo1.net/', coin: 'BTC', network: 'Testnet' },
  { name: 'Ethereum Goerli Faucet', url: 'https://goerlifaucet.com/', coin: 'ETH', network: 'Goerli' },
  { name: 'Ethereum Sepolia Faucet', url: 'https://sepoliafaucet.com/', coin: 'ETH', network: 'Sepolia' },
  { name: 'Solana Devnet Faucet', url: 'https://solfaucet.com/', coin: 'SOL', network: 'Devnet' },
  { name: 'Polygon Mumbai Faucet', url: 'https://mumbaifaucet.com/', coin: 'MATIC', network: 'Mumbai' },
  { name: 'Avalanche Fuji Faucet', url: 'https://faucet.avax-test.network/', coin: 'AVAX', network: 'Fuji' },
  { name: 'BNB Testnet Faucet', url: 'https://testnet.binance.org/faucet-smart/', coin: 'BNB', network: 'Testnet' },
  { name: 'Arbitrum Goerli Faucet', url: 'https://faucet.quicknode.com/arbitrum', coin: 'ARB', network: 'Goerli' },
  { name: 'Optimism Goerli Faucet', url: 'https://faucet.quicknode.com/optimism', coin: 'OP', network: 'Goerli' },
  { name: 'zkSync Era Faucet', url: 'https://portal.zksync.io/faucet', coin: 'ETH', network: 'zkSync Era' },
];

const mainnetFaucets = [
  { name: 'Bitcoin Mainnet Faucet', url: 'https://www.bitcoin.com/', coin: 'BTC', network: 'Mainnet' },
  { name: 'Ethereum Mainnet Faucet', url: 'https://faucet.ethereum.org/', coin: 'ETH', network: 'Mainnet' },
  { name: 'Solana Mainnet Faucet', url: 'https://solfaucet.com/mainnet', coin: 'SOL', network: 'Mainnet' },
  { name: 'Polygon Mainnet Faucet', url: 'https://faucet.polygon.technology/', coin: 'MATIC', network: 'Mainnet' },
  { name: 'Binance Smart Chain Faucet', url: 'https://faucet.binance.org/', coin: 'BNB', network: 'Mainnet' },
];

export default function FaucetPage() {
  return (
    <div className="space-y-8 px-2 md:px-8 py-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Crypto Faucets</h1>
        <p className="text-muted-foreground mt-1">Get free cryptocurrency from testnet and mainnet faucets for development and testing.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold">Testnet Faucets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testnetFaucets.map((f) => (
              <a key={f.name} href={f.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border bg-background/60 p-4 hover:border-bitcoin/40 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{f.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{f.coin} &middot; {f.network}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Mainnet Faucets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainnetFaucets.map((f) => (
              <a key={f.name} href={f.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border bg-background/60 p-4 hover:border-bitcoin/40 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{f.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{f.coin} &middot; {f.network}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/30 p-6">
        <h2 className="font-semibold mb-2">What are Crypto Faucets?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Crypto faucets provide free tokens for development and testing. Testnet faucets give valueless tokens for safe experimentation, while some mainnet faucets offer tiny amounts of real cryptocurrency. Most faucets require a wallet address and may need social authentication or CAPTCHA verification to prevent abuse.
        </p>
      </div>
    </div>
  );
}
