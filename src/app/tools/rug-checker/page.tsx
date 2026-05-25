'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { cn } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, AlertOctagon, Gauge } from 'lucide-react';

const checkItems = [
  { key: 'liquidity', label: 'Liquidity Locked', passed: true },
  { key: 'ownership', label: 'Ownership Renounced', passed: true },
  { key: 'honeypot', label: 'No Honeypot', passed: true },
  { key: 'mint', label: 'No Mint Function', passed: false },
  { key: 'tax', label: 'Tax ≤ 10%', passed: true },
];

function getScoreConfig(score: number) {
  if (score >= 80) return { label: 'Low Risk', variant: 'green' as const, color: 'text-crypto-green', bar: 'bg-crypto-green', bg: 'bg-crypto-green/10' };
  if (score >= 50) return { label: 'Medium Risk', variant: 'secondary' as const, color: 'text-yellow-500', bar: 'bg-yellow-500', bg: 'bg-yellow-500/10' };
  if (score >= 25) return { label: 'High Risk', variant: 'destructive' as const, color: 'text-orange-500', bar: 'bg-orange-500', bg: 'bg-orange-500/10' };
  return { label: 'Critical Risk', variant: 'destructive' as const, color: 'text-crypto-red', bar: 'bg-crypto-red', bg: 'bg-crypto-red/10' };
}

const rugMeta = generateSEO({ title: 'Rug Checker', description: 'Check if a token is a potential rug pull using advanced risk analysis.' });

export default function RugCheckerPage() {
  const [address, setAddress] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    document.title = rugMeta.title;
  }, []);

  const handleScan = () => {
    if (!address.trim()) return;
    setScanning(true);
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 40) + 40);
      setScanning(false);
    }, 1500);
  };

  const scoreConfig = score !== null ? getScoreConfig(score) : null;

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
        ← Back to Tools
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rug Checker</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Analyze token contracts for potential rug pull risks including honeypot detection, liquidity lock checks, and ownership renounce verification.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter token contract address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleScan} disabled={scanning || !address.trim()} className="gap-2">
              <ShieldAlert className="w-4 h-4" />
              {scanning ? 'Scanning...' : 'Scan Contract'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {score !== null && scoreConfig && (
        <>
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={cn('relative w-36 h-36 rounded-full flex items-center justify-center ring-4', scoreConfig.bg, {
                  'ring-crypto-green/30': score >= 80,
                  'ring-yellow-500/30': score >= 50 && score < 80,
                  'ring-orange-500/30': score >= 25 && score < 50,
                  'ring-crypto-red/30': score < 25,
                })}>
                  <Gauge className={cn('absolute top-3 right-3 w-5 h-5', scoreConfig.color)} />
                  <span className={cn('text-5xl font-black', scoreConfig.color)}>{score}</span>
                  <span className="absolute bottom-4 text-xs text-muted-foreground font-medium">/ 100</span>
                </div>

                <Badge variant={scoreConfig.variant} className="text-base px-5 py-1.5 font-semibold gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {scoreConfig.label}
                </Badge>

                <div className="w-full max-w-md">
                  <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-1000', scoreConfig.bar)}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-muted-foreground" />
                Safety Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.passed ? (
                    <Badge variant="green" className="gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                    </Badge>
                  ) : (
                    <Badge variant="red" className="gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Fail
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {score === null && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">Enter a contract address and click Scan Contract to begin analysis.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">This tool performs a simulated security audit. Always DYOR.</p>
          </CardContent>
        </Card>
      )}

      <AdPlaceholder />
    </div>
  );
}
