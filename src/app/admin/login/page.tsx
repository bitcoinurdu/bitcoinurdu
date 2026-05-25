'use client';

import { useEffect } from 'react';

export default function AdminLoginRedirect() {
  useEffect(() => {
    window.location.href = '/admin';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting to admin login...</p>
    </div>
  );
}
