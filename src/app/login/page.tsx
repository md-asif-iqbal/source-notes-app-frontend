'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FiLock, FiMail, FiLogIn, FiAlertCircle, FiShield, FiUser } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/notes');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-md py-12 px-4 sm:px-6">
      <Card className="shadow-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs mb-3">
            <FiLock size={22} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Enter your credentials to access your notes dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <FiAlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
                <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
                <FiLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              <FiLogIn size={16} />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </Button>
          </form>

          {/* Quick-fill Demo Box for Interviewer */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                1-Click Demo Credentials
              </span>
              <Badge variant="outline" className="text-[10px] bg-white">
                Reviewer Shortcut
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillCredentials('admin@example.com', 'password123')}
                className="w-full text-xs justify-start gap-1.5 bg-white hover:bg-slate-100"
              >
                <FiShield size={13} className="text-amber-600" />
                <span>Admin Demo</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillCredentials('alice@example.com', 'password123')}
                className="w-full text-xs justify-start gap-1.5 bg-white hover:bg-slate-100"
              >
                <FiUser size={13} className="text-blue-600" />
                <span>User Demo</span>
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-100 py-4 text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="ml-1 font-semibold text-blue-600 hover:underline">
            Register here
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
