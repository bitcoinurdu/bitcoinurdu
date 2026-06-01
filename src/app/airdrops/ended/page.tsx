'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XCircle } from 'lucide-react';
import { fetchCmsData } from '@/lib/cms/unified';

export default function EndedAirdropsPage() {
  const [airdrops, setAirdrops] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCmsData().then((data) => {
      const all = (data.airdrops as Record<string, unknown>[]) || [];
      setAirdrops(all.filter((a) => a.status === 'ended'));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Ended Airdrops</h1>
          <p className="text-gray-400">Past airdrops for reference and research.</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2,3].map(i => <div key={i} className="h-48 rounded-xl bg-[#12121a] border border-[#1e1e2e] animate-pulse" />)}</div>
        ) : airdrops.length === 0 ? (
          <Card className="border-[#1e1e2e] bg-[#12121a]"><CardContent className="p-8 text-center text-gray-400">No ended airdrops found.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {airdrops.map((a) => (
              <Link key={String(a.id)} href={`/airdrops/${a.id}`}>
                <Card className="border-[#1e1e2e] bg-[#12121a] hover:border-red-500/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">{String(a.title)}</h3>
                      <Badge variant="outline" className="text-red-400 border-red-500/30 text-[10px]"><XCircle className="h-2 w-2 mr-1" /> ENDED</Badge>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-2">{String(a.description)}</p>
                    {Array.isArray(a.networks) && (
                      <div className="flex gap-1 flex-wrap">{(a.networks as string[]).map((n) => <Badge key={n} variant="outline" className="text-[10px] border-[#1e1e2e] text-gray-400">{n}</Badge>)}</div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
