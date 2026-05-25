'use client';

import { useEffect, useState } from 'react';

function w(): Record<string, unknown> {
  return window as unknown as Record<string, unknown>;
}

export function CloudflareShield() {
  const [verified, setVerified] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('cf_turnstile_verified') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (verified || typeof window === 'undefined') return;

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

    if (!document.querySelector('#cf-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    w().onloadTurnstileCallback = () => {
      const ts = w().turnstile as { render: (c: string, o: Record<string, string>) => string } | undefined;
      if (!ts || verified) return;
      ts.render('cf-turnstile-container', { sitekey: siteKey, callback: 'cfTurnstileCallback' });
    };

    w().cfTurnstileCallback = () => {
      sessionStorage.setItem('cf_turnstile_verified', 'true');
      setVerified(true);
    };

    const ts = w().turnstile as { render: (c: string, o: Record<string, string>) => string } | undefined;
    if (ts && !verified) {
      (w().onloadTurnstileCallback as () => void)();
    }
  }, [verified]);

  if (verified) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="max-w-sm w-full mx-4 p-6 rounded-2xl border bg-card shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-bitcoin/10 flex items-center justify-center mx-auto mb-4">
          <svg className="h-6 w-6 text-bitcoin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold mb-2">Verify You&apos;re Human</h2>
        <p className="text-sm text-muted-foreground mb-6">Complete the verification to access the platform.</p>
        <div id="cf-turnstile-container" className="flex justify-center" />
      </div>
    </div>
  );
}
