'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';
import { cn } from '@/lib/utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { Shield, ShieldOff, ExternalLink, Trash2, AlertTriangle, Info, CheckCircle2, XCircle, KeyRound } from 'lucide-react';

const mockApprovals = [
  { dapp: 'Uniswap V3', token: 'ETH', amount: 'Unlimited', status: 'Active' },
  { dapp: 'OpenSea', token: 'WETH', amount: 'Unlimited', status: 'Active' },
  { dapp: 'PancakeSwap', token: 'CAKE', amount: '1,500', status: 'Active' },
  { dapp: 'Aave', token: 'USDC', amount: '50,000', status: 'Active' },
  { dapp: '1inch', token: 'ETH', amount: '100', status: 'Revoked' },
  { dapp: 'SushiSwap', token: 'MATIC', amount: '10,000', status: 'Active' },
  { dapp: 'Compound', token: 'DAI', amount: '25,000', status: 'Revoked' },
  { dapp: 'Curve', token: 'USDT', amount: 'Unlimited', status: 'Active' },
];

const tips = [
  { icon: AlertTriangle, text: 'Regularly review and revoke approvals you no longer use.', color: 'text-yellow-500' },
  { icon: Shield, text: 'Use hardware wallets or multi-sig for high-value approvals.', color: 'text-crypto-green' },
  { icon: Info, text: 'Unlimited approvals grant dApps permission to spend all your tokens.', color: 'text-crypto-blue' },
  { icon: KeyRound, text: 'Consider using dedicated burner wallets for interacting with new dApps.', color: 'text-crypto-purple' },
];

const taMeta = generateSEO({ title: 'Token Approvals', description: 'Manage and revoke your token approvals across multiple chains.' });

export default function TokenApprovalsPage() {
  const [approvals, setApprovals] = useState(mockApprovals);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    document.title = taMeta.title;
  }, []);

  const handleRevoke = (dapp: string) => {
    setRevoking(dapp);
    setTimeout(() => {
      setApprovals((prev) =>
        prev.map((a) => (a.dapp === dapp ? { ...a, status: 'Revoked' } : a))
      );
      setRevoking(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
        ← Back to Tools
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Token Approvals</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          View and revoke token approvals granted to dApps across Ethereum, BSC, Polygon and more to protect your wallet from unauthorized access.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            Approved Contracts
            <Badge variant="secondary" className="ml-auto">
              {approvals.filter((a) => a.status === 'Active').length} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">DApp Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Token</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((a, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-medium">{a.dapp}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{a.token}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={cn(a.amount === 'Unlimited' && 'text-yellow-500 font-semibold')}>
                        {a.amount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={a.status === 'Active' ? 'secondary' : 'outline'} className="gap-1">
                        {a.status === 'Active' ? (
                          <><CheckCircle2 className="w-3 h-3" /> Active</>
                        ) : (
                          <><XCircle className="w-3 h-3 text-muted-foreground" /> Revoked</>
                        )}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {a.status === 'Active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-crypto-red border-crypto-red/30 hover:bg-crypto-red/10"
                          onClick={() => handleRevoke(a.dapp)}
                          disabled={revoking === a.dapp}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {revoking === a.dapp ? 'Revoking...' : 'Revoke'}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldOff className="w-5 h-5 text-muted-foreground" />
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg border bg-card">
              <tip.icon className={cn('w-5 h-5 mt-0.5 shrink-0', tip.color)} />
              <p className="text-sm text-muted-foreground">{tip.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <AdPlaceholder />
    </div>
  );
}
