import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Upcoming Airdrops' });

export default function UpcomingAirdropsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upcoming Airdrops</h1>
        <p className="text-muted-foreground mt-1">Airdrops that haven't launched yet but are worth watching.</p>
      </div>
      <p className="text-muted-foreground">View upcoming airdrops on the main airdrops page.</p>
    </div>
  );
}
