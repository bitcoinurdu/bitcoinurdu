'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isValidWalletAddress } from '@/lib/utils/helpers';
import { Search, Wallet, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

const NETWORKS = [
  { id: 'eth', name: 'Ethereum', prefix: '0x' },
  { id: 'bsc', name: 'BSC', prefix: '0x' },
  { id: 'sol', name: 'Solana', prefix: '' },
  { id: 'arb', name: 'Arbitrum', prefix: '0x' },
  { id: 'op', name: 'Optimism', prefix: '0x' },
  { id: 'base', name: 'Base', prefix: '0x' },
  { id: 'polygon', name: 'Polygon', prefix: '0x' },
  { id: 'zksync', name: 'zkSync', prefix: '0x' },
];

const ELIGIBLE_AIRDROPS = [
  { name: 'LayerZero', network: 'ETH', estimated: '$500 - $5,000', status: 'Eligible' },
  { name: 'zkSync', network: 'zkSync', estimated: '$200 - $2,000', status: 'Eligible' },
  { name: 'Arbitrum', network: 'ARB', estimated: '$100 - $1,000', status: 'Not Eligible' },
  { name: 'Optimism', network: 'OP', estimated: '$50 - $500', status: 'Eligible' },
];

export function AirdropCheckerPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<typeof ELIGIBLE_AIRDROPS | null>(null);
  const [error, setError] = useState('');

  const handleCheck = () => {
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }
    if (!isValidWalletAddress(walletAddress)) {
      setError('Invalid wallet address format');
      return;
    }
    setError('');
    setChecking(true);
    setTimeout(() => {
      setResults(ELIGIBLE_AIRDROPS);
      setChecking(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Airdrop Checker</h1>
        <p className="text-muted-foreground mt-1">
          Enter your wallet address to check eligible airdrops and unclaimed rewards.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Check Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter wallet address (0x...)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCheck} disabled={checking} variant="bitcoin">
              <Search className="h-4 w-4 mr-2" />
              {checking ? 'Checking...' : 'Check Airdrops'}
            </Button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-crypto-red">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {NETWORKS.map((net) => (
              <Badge key={net.id} variant="secondary">
                {net.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Eligible Airdrops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((airdrop) => (
                <div
                  key={airdrop.name}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {airdrop.status === 'Eligible' ? (
                      <CheckCircle className="h-5 w-5 text-crypto-green" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{airdrop.name}</p>
                      <p className="text-sm text-muted-foreground">{airdrop.network}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={airdrop.status === 'Eligible' ? 'green' : 'secondary'}
                    >
                      {airdrop.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">{airdrop.estimated}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Safety Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Never share your private key or seed phrase</li>
            <li>Only use official links from verified sources</li>
            <li>Be cautious of phishing websites and fake airdrops</li>
            <li>Use a separate wallet for airdrop interactions</li>
            <li>Verify contract addresses before interacting</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
