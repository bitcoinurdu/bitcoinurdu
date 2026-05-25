import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { ToolsHubContent } from './tools-hub-content';

export const metadata: Metadata = generateSEO({
  title: 'Crypto Tools',
  description: 'Free cryptocurrency tools and calculators including gas tracker, fear & greed index, DCA calculator, ROI calculator, crypto converter, rug checker, whale tracker, and more.',
});

export default function ToolsPage() {
  return <ToolsHubContent />;
}
