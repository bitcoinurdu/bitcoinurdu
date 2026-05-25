'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores';
import { loginUser, signupUser, forgotPassword, verifyResetCode, resetPassword, savePortfolioToCloud, loadPortfolioFromCloud } from '@/lib/auth/cloud';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, Cloud, CheckCircle, AlertTriangle, KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'verify-code' | 'reset-password';

export default function AuthClient() {
  const router = useRouter();
  const { setUser, setPortfolio, toggleWatchlist, portfolio, watchlist } = useAppStore();
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (view === 'login') {
        const result = await loginUser(formData.email, formData.password);
        if (result) {
          localStorage.setItem('bu_auth_token', result.token);
          setUser(result.user);

          const cloudData = await loadPortfolioFromCloud(result.user.id);
          if (cloudData) {
            setPortfolio(cloudData.portfolio as typeof portfolio);
            cloudData.watchlist.forEach((id) => {
              if (!watchlist.includes(id)) toggleWatchlist(id);
            });
          }
          router.push('/portfolio');
        } else {
          setError('Email ya password galat hai. Naya account banayein.');
        }
      } else if (view === 'signup') {
        const result = await signupUser(formData.email, formData.password, formData.name);
        localStorage.setItem('bu_auth_token', result.token);
        setUser(result.user);

        await savePortfolioToCloud(result.user.id, portfolio as unknown[], watchlist);
        router.push('/portfolio');
      }
    } catch {
      setError('Kuch ghalti ho gayi. Dobara koshish karein.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await forgotPassword(resetEmail);
      setGeneratedCode(result.code);
      setSuccess(`Verification code bheja gaya: ${resetEmail}\n(Code: ${result.code} - demo mode)`);
      setTimeout(() => setView('verify-code'), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kuch ghalti ho gayi';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyResetCode(resetEmail, verificationCode);
      setSuccess('Code verified! Ab naya password set karein.');
      setTimeout(() => setView('reset-password'), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password kam az kam 6 characters ka hona chahiye');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords match nahi karte');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(resetEmail, verificationCode, newPassword);
      setSuccess('Password successfully reset ho gaya! Login karein.');
      setTimeout(() => {
        setView('login');
        setFormData({ ...formData, email: resetEmail });
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Password reset failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    if (view === 'forgot-password') {
      return (
        <div className="max-w-md mx-auto py-12 px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center">
                  <KeyRound className="h-8 w-8 text-bitcoin" />
                </div>
              </div>
              <CardTitle>Password Reset</CardTitle>
              <p className="text-sm text-muted-foreground">
                Apna registered email darj karein, verification code bheja jayega
              </p>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-500">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-sm text-green-500 whitespace-pre-line">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="bitcoin" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <button
                  onClick={() => { setView('login'); setError(''); setSuccess(''); }}
                  className="text-sm text-bitcoin hover:underline flex items-center gap-1 justify-center"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (view === 'verify-code') {
      return (
        <div className="max-w-md mx-auto py-12 px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-bitcoin" />
                </div>
              </div>
              <CardTitle>Verify Code</CardTitle>
              <p className="text-sm text-muted-foreground">
                {resetEmail} par bheja gaya 6-digit code darj karein
              </p>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-500">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Verification Code</label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                    required
                  />
                </div>
                <Button type="submit" variant="bitcoin" className="w-full" disabled={loading || verificationCode.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </form>
              <div className="mt-6 text-center space-y-2">
                <button
                  onClick={() => { setView('forgot-password'); setError(''); setSuccess(''); }}
                  className="text-sm text-bitcoin hover:underline flex items-center gap-1 justify-center"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Email Input
                </button>
                <div>
                  <button
                    onClick={handleForgotPassword}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Code dobara bhejein
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (view === 'reset-password') {
      return (
        <div className="max-w-md mx-auto py-12 px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-bitcoin" />
                </div>
              </div>
              <CardTitle>Set New Password</CardTitle>
              <p className="text-sm text-muted-foreground">
                Apna naya password set karein
              </p>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-500">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button type="submit" variant="bitcoin" className="w-full" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {view === 'login' ? (
                <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center">
                  <LogIn className="h-8 w-8 text-bitcoin" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center">
                  <UserPlus className="h-8 w-8 text-bitcoin" />
                </div>
              )}
            </div>
            <CardTitle>{view === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {view === 'login'
                ? 'Apna account login karein aur portfolio sync karein'
                : 'Naya account banayein aur portfolio cloud mein save karein'}
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-500">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-2 text-xs text-muted-foreground">
              <Cloud className="h-4 w-4 shrink-0 mt-0.5 text-bitcoin" />
              <div>
                <strong>Cloud Sync:</strong> Login karne ke baad aapka portfolio cloud mein save hoga.
                Aap kisi bhi browser ya device se apna portfolio dekh sakte hain.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'signup' && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Naam</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Aapka naam"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {view === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setView('forgot-password'); setError(''); setSuccess(''); setResetEmail(formData.email); }}
                    className="text-sm text-bitcoin hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              <Button type="submit" variant="bitcoin" className="w-full" disabled={loading}>
                {loading ? (
                  'Processing...'
                ) : view === 'login' ? (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); }}
                className="text-sm text-bitcoin hover:underline"
              >
                {view === 'login' ? 'Naya account banayein →' : 'Pehle se account hai? Login karein →'}
              </button>
            </div>
          </CardContent>
        </Card>

        {view === 'signup' && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-crypto-green" />
                Account Benefits
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Portfolio kisi bhi device se access karein</li>
                <li>• Data cloud mein safe rahega</li>
                <li>• Browser change karne par bhi data milega</li>
                <li>• Watchlist bhi sync hogi</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return renderView();
}
