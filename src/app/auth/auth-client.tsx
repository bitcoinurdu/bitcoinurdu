'use client';

import { Suspense } from 'react';
import { PrivySection } from './privy-section';

export default function AuthClient() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading...</div>}>
      <PrivySection />
    </Suspense>
  );
}
