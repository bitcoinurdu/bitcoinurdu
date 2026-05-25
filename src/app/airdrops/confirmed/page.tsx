import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Confirmed Airdrops' });

export default function ConfirmedAirdropsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Confirmed Airdrops</h1>
        <p className="text-muted-foreground mt-1">Airdrops that have been officially confirmed.</p>
      </div>
      <p className="text-muted-foreground">View confirmed airdrops on the main airdrops page.</p>
    </div>
  );
}
