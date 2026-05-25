import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Settings',
  description: 'Manage your account settings, notifications, preferences, and security options.',
});

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings, notifications, preferences, and security options.</p>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <p className="text-muted-foreground">Settings panel will be implemented here.</p>
      </div>
      <div>
        <Link href="/" className="text-bitcoin hover:underline">&larr; Back to Home</Link>
      </div>
    </div>
  );
}
