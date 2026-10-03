'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { FiUserPlus, FiUser, FiMail, FiLock, FiTag, FiAlertCircle } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interestsText, setInterestsText] = useState('chess, reading, tech');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const interestsArray = interestsText
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item.length > 0);

      await register(name, email, password, interestsArray);
      router.push('/notes');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-10 px-4 sm:px-6">
      <Card className="shadow-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs mb-3">
            <FiUserPlus size={22} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Create an Account
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Sign up to get a secure private workspace
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
              <label htmlFor="name" className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                />
                <FiUser size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

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
                Password (Min 6 characters)
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
                <FiLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="interests" className="block text-xs font-semibold text-slate-700">
                Interests (Comma-separated)
              </label>
              <div className="relative">
                <Input
                  id="interests"
                  type="text"
                  placeholder="chess, reading, tech"
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  className="pl-9"
                />
                <FiTag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500">
                Used in the Scenario 1 Aggregation Pipeline view.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              <FiUserPlus size={16} />
              <span>{loading ? 'Creating Account...' : 'Register'}</span>
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-100 py-4 text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="ml-1 font-semibold text-blue-600 hover:underline">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
