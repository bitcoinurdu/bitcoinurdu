import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import AuthClient from './auth-client';

export const metadata: Metadata = generateSEO({
  title: 'Login / Sign Up',
  description: 'Login to BitcoinUrdu to sync your portfolio across all devices.',
});

export default function AuthPage() {
  return <AuthClient />;
}
