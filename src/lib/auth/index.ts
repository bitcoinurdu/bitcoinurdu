import type { User } from '@/types';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'bitcoinurdu-admin-2024';
const SESSION_COOKIE = 'bu_session';

export interface Session {
  userId: string;
  role: User['role'];
  permissions: User['permissions'];
  expiresAt: number;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + ADMIN_SECRET);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === ADMIN_SECRET;
}

export function createSession(user: User): Session {
  return {
    userId: user.id,
    role: user.role,
    permissions: user.permissions,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
}

export function hasPermission(
  session: Session | null,
  permission: User['permissions'][number]
): boolean {
  if (!session) return false;
  if (session.role === 'admin') return true;
  return session.permissions.includes(permission);
}

export function getRolePermissions(role: User['role']): User['permissions'] {
  switch (role) {
    case 'admin':
      return ['view', 'edit', 'delete', 'publish', 'admin'];
    case 'editor':
      return ['view', 'edit', 'publish'];
    case 'moderator':
      return ['view', 'edit'];
    case 'viewer':
    default:
      return ['view'];
  }
}

export async function authenticateAdmin(password: string): Promise<User | null> {
  const isValid = await verifyPassword(password);
  if (!isValid) return null;

  return {
    id: 'admin-001',
    email: 'admin@bitcoinurdu.com',
    name: 'Admin',
    role: 'admin',
    permissions: getRolePermissions('admin'),
    created_at: new Date().toISOString(),
    active: true,
  };
}

export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
