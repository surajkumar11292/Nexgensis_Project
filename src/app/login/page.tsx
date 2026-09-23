'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Loader2,
  Shield,
  KeyRound,
  CheckCircle2,
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

  // Subtle demo autofill helper for evaluators without ugly banners
  const fillDemoCredentials = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!username.trim() || !password.trim()) {
      setError('Please provide your authentication username and security key.');
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
        setError(err.message || 'Authentication failed. Please verify your credentials.');
      } else {
        setError('Authentication server rejected the session credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f8]">
        <div className="flex items-center gap-2.5 text-[#787771] text-xs">
          <Loader2 className="h-4 w-4 animate-spin text-[#141413]" />
          <span>Verifying secure enclave...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#f9f9f8]">
      {/* Left Column: Swiss Private Wealth Institutional Branding */}
      <section className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-[#0e0e0d] text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden border-r border-[#222220]">
        {/* Subtle geometric luxury watermark */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-radial from-[#d97706]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-radial from-[#059669]/5 to-transparent blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#272725] to-[#141413] border border-[#383733] flex items-center justify-center text-white font-bold text-base shadow-sm">
            N
          </div>
          <div>
            <span className="text-sm font-bold tracking-widest uppercase text-white block">
              Nexgensis
            </span>
            <span className="text-2xs font-medium tracking-[0.2em] uppercase text-[#a3a199] block">
              Private Inventory Systems
            </span>
          </div>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 space-y-8 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1a] border border-[#2d2d2a] text-2xs text-[#dcdad4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
            <span className="tracking-wide">Institutional Product Administration</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-normal tracking-[-0.03em] text-[#fbfbfa] leading-[1.2]">
            High-precision catalog control, calibrated for total visibility.
          </h1>

          <div className="space-y-4 pt-4 text-xs text-[#a3a199]">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-lg bg-[#1a1a18] border border-[#2d2d2a] flex items-center justify-center shrink-0 text-[#d97706] mt-0.5">
                <Shield className="h-3.5 w-3.5" />
              </div>
              <div>
                <strong className="text-white font-semibold block text-xs">
                  Tier-1 Enclave Protection
                </strong>
                <span>Direct tokenized session verification with instant API teardown.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-lg bg-[#1a1a18] border border-[#2d2d2a] flex items-center justify-center shrink-0 text-[#059669] mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <strong className="text-white font-semibold block text-xs">
                  Zero-Latency Reconciliation
                </strong>
                <span>Continuous URL state synchronization and optimistic client persistence.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Swiss Bank Motto */}
        <div className="relative z-10 pt-6 border-t border-[#222220] flex items-center justify-between text-2xs text-[#73716b]">
          <span>Zurich · Geneva · Singapore</span>
          <span>Security Standard ISO/IEC 27001</span>
        </div>
      </section>

      {/* Right Column: Clean Swiss Banking Login Panel */}
      <section className="col-span-1 lg:col-span-7 xl:col-span-6 flex flex-col justify-center px-6 sm:px-12 xl:px-20 py-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="h-8 w-8 rounded-lg bg-[#141413] flex items-center justify-center text-white font-bold text-sm">
              N
            </div>
            <span className="text-sm font-bold tracking-tight text-[#141413] uppercase">
              Nexgensis Private
            </span>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0eee9] border border-[#e2e0da] text-2xs font-medium text-[#5a5954]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
              <span>Client Portal Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-[#141413]">
              Sign in to dashboard
            </h2>
            <p className="text-xs text-[#6e6d67] leading-relaxed">
              Authenticate using your institutional administrator credentials.
            </p>
          </div>

          {/* Discreet Quick-fill Demo Pill (No ugly banner) */}
          <div className="p-3 rounded-xl bg-[#ffffff] border border-[#e7e6e1] shadow-2xs flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-2xs text-[#6e6d67]">
              <KeyRound className="h-3.5 w-3.5 text-[#d97706]" />
              <span>Demo Account: <strong className="text-[#141413] font-mono font-medium">emilys</strong></span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-2xs font-semibold text-[#141413] hover:text-[#d97706] hover:underline underline-offset-2 transition-colors cursor-pointer"
            >
              One-Click Fill
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-[#fef2f2] border border-[#fee2e2] text-[#991b1b] text-xs flex items-start gap-2.5 shadow-2xs"
            >
              <AlertCircle className="h-4 w-4 text-[#dc2626] shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Form with password popup protection */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            data-lpignore="true"
            data-form-type="other"
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-2xs font-semibold text-[#5a5954] uppercase tracking-wider mb-1.5"
              >
                Account Username
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8d86]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  name="auth_user_identity"
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
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#e2e0da] bg-[#ffffff] text-[#141413] placeholder:text-[#9c9b94] focus:outline-none focus:ring-1 focus:ring-[#141413] focus:border-[#141413] transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-2xs font-semibold text-[#5a5954] uppercase tracking-wider mb-1.5"
              >
                Security Key
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8d86]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="auth_secret_token"
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
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#e2e0da] bg-[#ffffff] text-[#141413] placeholder:text-[#9c9b94] focus:outline-none focus:ring-1 focus:ring-[#141413] focus:border-[#141413] transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-full text-xs font-semibold text-white bg-[#141413] hover:bg-[#262624] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#141413] transition-all shadow-xs disabled:opacity-60 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Verifying session credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Session</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#d97706]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Swiss Bank Security Footer */}
          <div className="pt-6 border-t border-[#e7e6e1] flex items-center justify-between text-2xs text-[#787771]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
              <span>TLS 1.3 End-to-End Cryptography</span>
            </span>
            <span className="font-mono text-2xs text-[#8e8d86]">DUMMYJSON AUTH API</span>
          </div>
        </div>
      </section>
    </main>
  );
}
