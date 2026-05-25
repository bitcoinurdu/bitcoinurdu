import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export function generateStaticParams() {
  return [
    'airdrops',
    'users',
    'blog',
    'pages',
    'ads',
    'donations',
    'seo',
    'legal',
    'notifications',
    'logs',
    'backups',
    'security',
    'settings',
    'coins',
    'categories',
    'markets',
  ].map((section) => ({ section }));
}

export function generateMetadata({ params }: { params: { section: string } }): Metadata {
  return generateSEO({ title: `Admin - ${params.section}`, robots: 'noindex, nofollow' });
}

export default function AdminSectionPage() {
  return <AdminDashboard />;
}
