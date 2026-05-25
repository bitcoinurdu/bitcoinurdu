import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Mining Firmware',
  description: 'Custom mining firmware like Braiins OS, VNish, and Hiveon for improved ASIC performance.',
});

export default function MiningFirmwarePage() {
  return (
    <div className="space-y-6">
      <Link href="/mining" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Mining</Link>
      <div>
        <h1 className="text-3xl font-bold">Mining Firmware</h1>
        <p className="text-muted-foreground mt-1">Custom mining firmware like Braiins OS, VNish, and Hiveon for improved ASIC performance.</p>
      </div>
    </div>
  );
}
