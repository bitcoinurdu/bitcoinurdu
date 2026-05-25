import { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Manage Coins', robots: 'noindex, nofollow' });

export default function AdminCoinsPage() {
  return <AdminDashboard />;
}
