'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, User, AlertCircle, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to products
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/products');
    }
  }, [authLoading, isAuthenticated, router]);

  // Demo credentials autofill helper for evaluators
  const fillDemoCredentials = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate rapid submissions while already loading
    if (isSubmitting) return;

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await login({
        username: username.trim(),
        password: password,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Invalid username or password.');
      } else {
        setError('Failed to authenticate. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
          <span>Checking session...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-zinc-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand header */}
        <div className="flex justify-center items-center gap-2.5 mb-2">
          <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            Nexgensis Admin
          </span>
        </div>
        <p className="text-center text-sm text-zinc-500">
          Sign in to access and manage the product catalog
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-2xl border border-zinc-200/80">
          {/* Quick-fill helper banner for interviewer evaluation */}
          <div className="mb-6 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-start justify-between gap-3">
            <div className="text-xs text-zinc-600">
              <span className="font-semibold text-zinc-800 flex items-center gap-1.5 mb-0.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Assignment Demo Credentials
              </span>
              <span>Username: <strong className="text-zinc-900 font-mono">emilys</strong> · Password: <strong className="text-zinc-900 font-mono">emilyspass</strong></span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2 shrink-0 transition-colors"
            >
              Auto-fill
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1.5"
              >
                Username
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. emilys"
                  disabled={isSubmitting}
                  className="block w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="block w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Connected to DummyJSON Auth API</span>
          </div>
        </div>
      </div>
    </main>
  );
}
