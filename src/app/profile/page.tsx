'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores';
import { updatePassword } from '@/lib/auth/cloud';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('bu_auth_token');
    if (!stored || !user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-bitcoin border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    </div>
  );

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newPassword || newPassword.length < 6) { setError('Min 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await updatePassword(user.email, currentPassword, newPassword);
      setSuccess('Password updated!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bu_auth_token');
    setUser(null);
    router.push('/auth');
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-bitcoin" />
          </div>
          <CardTitle>{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Mail className="h-3 w-3" /> {user.email}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => router.push('/portfolio')} variant="outline" className="flex-1">Portfolio</Button>
            <Button onClick={handleLogout} variant="destructive" className="flex-1">
              <LogOut className="h-4 w-4 mr-1.5" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-500">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-sm text-green-500">
              <CheckCircle className="h-4 w-4 shrink-0" /> {success}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPwd ? 'text' : 'password'} value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPwd ? 'text' : 'password'} value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPwd ? 'text' : 'password'} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                {showPwd ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />} {showPwd ? 'Hide' : 'Show'} passwords
              </button>
            </div>
            <Button type="submit" variant="bitcoin" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <button onClick={() => router.push('/')} className="text-sm text-bitcoin hover:underline flex items-center gap-1 justify-center">
          <ArrowLeft className="h-3 w-3" /> Back to Home
        </button>
      </div>
    </div>
  );
}
