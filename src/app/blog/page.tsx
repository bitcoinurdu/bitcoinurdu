import { Metadata } from 'next';
import { BlogPage } from '@/components/blog/blog-page';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Blog', description: 'Latest crypto blog posts and guides.' });

export default function BlogRoute() {
  return <BlogPage category="blog" />;
}
