'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, ArrowRight, Clock, CheckCircle } from 'lucide-react';

const sampleAirdrops = [
  {
    id: 'layerzero',
    title: 'LayerZero',
    network: ['ETH', 'ARB', 'OP'],
    status: 'active',
    estimatedValue: '$500 - $5,000',
    riskScore: 25,
  },
  {
    id: 'zksync',
    title: 'zkSync',
    network: ['zkSync'],
    status: 'active',
    estimatedValue: '$200 - $2,000',
    riskScore: 20,
  },
  {
    id: 'scroll',
    title: 'Scroll',
    network: ['ETH'],
    status: 'upcoming',
    estimatedValue: '$100 - $1,000',
    riskScore: 35,
  },
  {
    id: 'linea',
    title: 'Linea',
    network: ['ETH'],
    status: 'active',
    estimatedValue: '$300 - $3,000',
    riskScore: 15,
  },
];

export function AirdropHighlights() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-3 w-3 text-crypto-green" />;
      case 'upcoming':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-3 w-3 text-crypto-blue" />;
      default:
        return null;
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-crypto-green';
    if (score <= 60) return 'text-yellow-500';
    return 'text-crypto-red';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-crypto-purple" />
          Hot Airdrops
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/airdrops">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleAirdrops.map((airdrop) => (
            <Link
              key={airdrop.id}
              href={`/airdrops/${airdrop.id}`}
              className="card card-hover p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{airdrop.title}</h3>
                <Badge variant={airdrop.status === 'active' ? 'green' : 'bitcoin'}>
                  {getStatusIcon(airdrop.status)}
                  <span className="ml-1 capitalize">{airdrop.status}</span>
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {airdrop.network.map((net) => (
                  <Badge key={net} variant="secondary" className="text-xs">
                    {net}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Est. Value</span>
                <span className="font-medium">{airdrop.estimatedValue}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Risk</span>
                <span className={getRiskColor(airdrop.riskScore)}>
                  {airdrop.riskScore <= 30 ? 'Low' : airdrop.riskScore <= 60 ? 'Medium' : 'High'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
