'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Cloud, CheckCircle } from 'lucide-react';

export function PrivySection() {
  const { ready, authenticated, user, login } = usePrivy();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (ready && authenticated && user && !done) {
      setDone(true);
      const id = user.id;
      const email = user.email?.address || '';
      const name = user.email?.address?.split('@')[0] || 'User';
      localStorage.setItem('bu_auth_token', `privy_${id}`);
      localStorage.setItem('bu_user', JSON.stringify({ id, email, name }));
      try {
        import('@/stores').then(m => m.useAppStore.getState().setUser({ id, email, name }));
      } catch {}
      window.location.href = '/portfolio';
    }
  }, [ready, authenticated, user, done]);

  if (ready && authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-bitcoin border-t-transparent rounded-full" />
        <p className="ml-3 text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center">
              <LogIn className="h-8 w-8 text-bitcoin" />
            </div>
          </div>
          <CardTitle>Login / لاگ ان</CardTitle>
          <p className="text-sm text-muted-foreground">Login karein aur portfolio sync karein / Login and sync your portfolio</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-2 text-xs text-muted-foreground">
            <Cloud className="h-4 w-4 shrink-0 mt-0.5 text-bitcoin" />
            <div>
              <strong>Cloud Sync / کلاؤڈ سنک:</strong> Login karne ke baad aapka portfolio cloud mein save hoga. Aap kisi bhi browser ya device se apna portfolio dekh sakte hain. / After login, your portfolio is saved to the cloud. Access it from any browser or device.
            </div>
          </div>
          <button type="button" onClick={() => login({ loginMethods: ['email', 'wallet'] })}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2"/></svg>
            Login / Sign up with Privy
          </button>
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Account Benefits / اکاؤنٹ کے فوائد
            </h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Portfolio kisi bhi device se access karein / Access your portfolio from any device</li>
              <li>• Data cloud mein safe rahega / Data stays safe in the cloud</li>
              <li>• Browser change karne par bhi data milega / Data persists across browsers</li>
              <li>• Watchlist bhi sync hogi / Watchlist stays in sync</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
