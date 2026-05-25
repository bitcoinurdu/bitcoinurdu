// Cloud sync module - Firebase Firestore-backed via /api/auth Pages Function

const AUTH_API = '/api/auth';

export interface CloudPortfolio {
  userId: string;
  email: string;
  portfolio: unknown[];
  watchlist: string[];
  updatedAt: string;
}

export async function signupUser(email: string, password: string, name: string): Promise<{ token: string; user: { id: string; email: string; name: string } }> {
  const res = await fetch(AUTH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'register', email, password, name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Registration failed');
  }
  const data = await res.json();
  return { token: data.token, user: data.user };
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: { id: string; email: string; name: string } } | null> {
  try {
    const res = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { token: data.token, user: data.user };
  } catch {
    return null;
  }
}

export async function forgotPassword(email: string): Promise<{ code: string }> {
  const res = await fetch(AUTH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'forgot-password', email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export async function verifyResetCode(email: string, code: string): Promise<void> {
  const res = await fetch(AUTH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'verify-reset-code', email, code }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Verification failed');
  }
}

export async function resetPassword(email: string, code: string, password: string): Promise<void> {
  const res = await fetch(AUTH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'reset-password', email, code, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Reset failed');
  }
}

export async function updatePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch(AUTH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update-password', email, code: currentPassword, password: newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Update failed');
  }
}

export async function savePortfolioToCloud(userId: string, portfolio: unknown[], watchlist: string[]): Promise<boolean> {
  try {
    localStorage.setItem(`bu_portfolio_${userId}`, JSON.stringify({
      portfolio, watchlist, updatedAt: new Date().toISOString(),
    }));
    return true;
  } catch {
    return false;
  }
}

export async function loadPortfolioFromCloud(userId: string): Promise<{ portfolio: unknown[]; watchlist: string[] } | null> {
  try {
    const raw = localStorage.getItem(`bu_portfolio_${userId}`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      portfolio: (data.portfolio as unknown[]) || [],
      watchlist: (data.watchlist as string[]) || [],
    };
  } catch {
    return null;
  }
}
