import { Metadata } from 'next';
import { BlogPage } from '@/components/blog/blog-page';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Crypto News', description: 'Latest cryptocurrency news and updates.' });

export default function NewsRoute() {
  return <BlogPage category="news" />;
}
