'use client';

import { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify?: (token: string) => void;
  onError?: () => void;
}

export function CloudflareTurnstile({ siteKey, onVerify, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setLoading(false);
      const ts = (window as any).turnstile;
      if (ts && containerRef.current) {
        ts.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          size: 'invisible',
          callback: (token: string) => {
            setVerified(true);
            onVerify?.(token);
          },
          'error-callback': () => {
            onError?.();
          },
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [siteKey, onVerify, onError]);

  if (verified) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center mx-auto">
          <div className={`w-8 h-8 border-2 border-bitcoin rounded-full ${loading ? 'animate-spin border-t-transparent' : 'border-bitcoin'}`} />
        </div>
        <div>
          <p className="text-lg font-semibold">Verifying you are human</p>
          <p className="text-sm text-muted-foreground mt-1">Please wait a moment...</p>
        </div>
        <div ref={containerRef} className="flex justify-center" />
      </div>
    </div>
  );
}


