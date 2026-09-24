'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  User,
  AlertCircle,
  Loader2,
  Package,
  Search,
  Database,
  ArrowRight,
} from 'lucide-react';

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

  // Demo account autofill
  const fillDemoCredentials = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
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
        setError('Authentication failed. Please verify your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f8]">
        <div className="flex items-center gap-2.5 text-[#5a5954] text-xs">
          <Loader2 className="h-4 w-4 animate-spin text-[#141413]" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#f9f9f8]">
      {/* Left Column: Clean Workspace Overview */}
      <section className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-[#141413] text-white p-12 xl:p-16 flex-col justify-center relative border-r border-[#262624]">
        {/* Core Value Statement */}
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#fbfbfa] leading-tight">
              Product catalog
            </h1>
            <p className="text-xs sm:text-sm text-[#a3a199] leading-relaxed">
              A clean administrative workspace to manage inventory, track stock levels, and review catalog updates in real time.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-[#222220] border border-[#383733] flex items-center justify-center shrink-0 text-[#e7e6e1] mt-0.5">
                <Search className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-0.5">
                <strong className="text-white font-medium block text-xs sm:text-sm">
                  Fast search &amp; filters
                </strong>
                <span className="text-2xs sm:text-xs text-[#a3a199] leading-relaxed block">
                  Filter by category, search by title, and sort products instantly.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-[#222220] border border-[#383733] flex items-center justify-center shrink-0 text-[#e7e6e1] mt-0.5">
                <Package className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-0.5">
                <strong className="text-white font-medium block text-xs sm:text-sm">
                  Inventory &amp; stock overview
                </strong>
                <span className="text-2xs sm:text-xs text-[#a3a199] leading-relaxed block">
                  Monitor availability, pricing, discount percentages, and customer reviews.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-[#222220] border border-[#383733] flex items-center justify-center shrink-0 text-[#e7e6e1] mt-0.5">
                <Database className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-0.5">
                <strong className="text-white font-medium block text-xs sm:text-sm">
                  Catalog management
                </strong>
                <span className="text-2xs sm:text-xs text-[#a3a199] leading-relaxed block">
                  Add, update, or remove products directly in your catalog.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Clean Login Panel */}
      <section className="col-span-1 lg:col-span-7 xl:col-span-6 flex flex-col justify-center px-6 sm:px-12 xl:px-20 py-12">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-normal tracking-[-0.02em] text-[#141413]">
              Sign in
            </h2>
            <p className="text-xs text-[#5a5954]">
              Enter your credentials to access the product catalog.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-[#fef2f2] border border-[#fee2e2] text-[#991b1b] text-xs flex items-start gap-2 shadow-2xs"
            >
              <AlertCircle className="h-4 w-4 text-[#dc2626] shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            data-lpignore="true"
            data-form-type="other"
            className="space-y-4"
          >
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-2xs font-semibold text-[#383733] uppercase tracking-wider"
              >
                Username
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5a5954]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. emilys"
                  disabled={isSubmitting}
                  className="block w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-[#e2e0da] bg-[#ffffff] text-[#141413] placeholder:text-[#6e6d67] focus:outline-none focus:ring-1 focus:ring-[#141413] focus:border-[#141413] transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-2xs font-semibold text-[#383733] uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5a5954]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  className="block w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-[#e2e0da] bg-[#ffffff] text-[#141413] placeholder:text-[#6e6d67] focus:outline-none focus:ring-1 focus:ring-[#141413] focus:border-[#141413] transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold text-white bg-[#141413] hover:bg-[#262624] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#141413] transition-all shadow-xs disabled:opacity-60 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo credentials helper */}
          <div className="p-3 rounded-xl bg-[#ffffff] border border-[#e7e6e1] shadow-2xs flex items-center justify-between gap-3 text-xs">
            <div className="text-2xs text-[#454440]">
              <span>Demo: <strong className="text-[#141413] font-mono">emilys</strong> / <strong className="text-[#141413] font-mono">emilyspass</strong></span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] bg-[#eff6ff] hover:bg-[#dbeafe] border border-[#bfdbfe] px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              Autofill
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
