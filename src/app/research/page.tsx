import { Metadata } from 'next';
import { BlogPage } from '@/components/blog/blog-page';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Research', description: 'In-depth crypto research and analysis.' });

export default function ResearchRoute() {
  return <BlogPage category="research" />;
}
