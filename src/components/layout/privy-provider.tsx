'use client';

import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { ReactNode } from 'react';

const PRIVY_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

export function PrivyProvider({ children }: { children: ReactNode }) {
  if (!PRIVY_ID) return <>{children}</>;
  return (
    <Privy appId={PRIVY_ID} config={{ loginMethods: ['email', 'wallet'], appearance: { theme: 'dark', accentColor: '#f97316' } }}>
      {children}
    </Privy>
  );
}
