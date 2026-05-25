import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Active Airdrops' });

export default function ActiveAirdropsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Airdrops</h1>
        <p className="text-muted-foreground mt-1">Currently active airdrops you can participate in.</p>
      </div>
      <p className="text-muted-foreground">View active airdrops on the main airdrops page with active filter.</p>
    </div>
  );
}
