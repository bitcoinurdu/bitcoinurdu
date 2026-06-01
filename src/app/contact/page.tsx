'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Mail, Twitter, Send, CheckCircle, Shield, Briefcase, Megaphone, MessageSquare, Loader2 } from 'lucide-react';

const socialLinks = [
  {
    href: 'https://x.com/@bitcoin_urdu',
    label: 'ایکس (ٹویٹر)',
    username: '@bitcoin_urdu',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    href: 'https://t.me/@bitcoinurdu',
    label: 'ٹیلیگرام',
    username: '@bitcoinurdu',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    href: 'https://facebook.com/@bitcoinurdu',
    label: 'فیس بک',
    username: '@bitcoinurdu',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

const emailContacts = [
  { email: 'contact@bitcoinurdu.com', label: 'General Contact', icon: Mail, desc: 'عام رابطے کے لیے' },
  { email: 'info@bitcoinurdu.com', label: 'Information', icon: MessageSquare, desc: 'معلومات کے لیے' },
  { email: 'ads@bitcoinurdu.com', label: 'Advertising', icon: Megaphone, desc: 'اشتہارات کے لیے' },
  { email: 'legal@bitcoinurdu.com', label: 'Legal', icon: Shield, desc: 'قانونی معاملات' },
  { email: 'support@bitcoinurdu.com', label: 'Support', icon: Mail, desc: 'مدد اور سپورٹ' },
  { email: 'jobs@bitcoinurdu.com', label: 'Careers', icon: Briefcase, desc: 'ملازمت کے لیے' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', type: 'contact' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);

  const getTurnstileToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const tw = (window as any).turnstile;
      if (!tw || !turnstileRef.current) {
        resolve('');
        return;
      }
      tw.render(turnstileRef.current, {
        sitekey: '0x4AAAAAADWLcvUInQN9cs5E',
        callback: (token: string) => {
          resolve(token);
          tw.reset(turnstileRef.current);
        },
        'error-callback': () => {
          reject(new Error('Turnstile verification failed'));
        },
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let turnstileToken = '';
      try {
        turnstileToken = await getTurnstileToken();
      } catch {
        setError('Human verification failed. Please try again.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });
      if (res.ok) setSubmitted(true);
      else {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ہم سے رابطہ کریں</h1>
          <p className="text-muted-foreground mt-2">کوئی سوال، تجویز یا پارٹنرشپ کا معاملہ؟ ہم آپ کی بات سننا چاہیں گے۔</p>
        </div>
        <div className="rounded-xl border bg-card p-12 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-crypto-green mx-auto" />
          <h2 className="text-2xl font-bold">پیغام بھیج دیا گیا!</h2>
          <p className="text-muted-foreground">ہم جلدی آپ سے رابطہ کریں گے۔</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">ہم سے رابطہ کریں</h1>
        <p className="text-muted-foreground mt-2">کوئی سوال، تجویز یا پارٹنرشپ کا معاملہ؟ ہم آپ کی بات سننا چاہیں گے۔</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {emailContacts.map((c) => (
          <Link
            key={c.email}
            href={`mailto:${c.email}`}
            className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:border-bitcoin/30 hover:bg-bitcoin/5 transition-all"
          >
            <c.icon className="h-5 w-5 text-bitcoin shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{c.label}</p>
              <p className="text-xs text-muted-foreground truncate">{c.email}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">سوشل میڈیا</h2>
          <div className="space-y-3">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-bitcoin/30 hover:bg-bitcoin/5 transition-all duration-200 group"
              >
                <div className="rounded-xl p-3 bg-gradient-to-br from-bitcoin/20 to-bitcoin/5 text-bitcoin group-hover:from-bitcoin/30 group-hover:to-bitcoin/10 transition-all duration-200">
                  {social.svg}
                </div>
                <div>
                  <p className="font-semibold text-sm">{social.label}</p>
                  <p className="text-sm text-muted-foreground group-hover:text-bitcoin transition-colors">{social.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">پیغام بھیجیں</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
            >
              <option value="contact">General Contact</option>
              <option value="info">Information</option>
              <option value="ads">Advertising</option>
              <option value="legal">Legal</option>
              <option value="support">Support</option>
              <option value="jobs">Careers</option>
              <option value="feedback">Feedback</option>
              <option value="partnerships">Partnerships</option>
            </select>
            <input
              type="text"
              placeholder="آپ کا نام"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
            />
            <input
              type="email"
              placeholder="آپ کا ای میل"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
            />
            <input
              type="text"
              placeholder="موضوع"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
            />
            <textarea
              placeholder="آپ کا پیغام"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50 resize-none"
            />
            <div ref={turnstileRef} className="hidden" />
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-bitcoin to-bitcoin/80 text-black font-semibold hover:opacity-90 transition-all duration-200 shadow-lg shadow-bitcoin/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> بھیج رہے ہیں...</> : 'پیغام بھیجیں'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
