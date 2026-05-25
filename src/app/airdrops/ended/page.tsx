import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Ended Airdrops' });

export default function EndedAirdropsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ended Airdrops</h1>
        <p className="text-muted-foreground mt-1">Past airdrops for reference and research.</p>
      </div>
      <p className="text-muted-foreground">View ended airdrops on the main airdrops page.</p>
    </div>
  );
}
