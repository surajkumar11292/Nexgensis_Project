'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Package, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProductsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Title & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Products Dashboard
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your catalog, stock levels, categories, and product details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            Authenticated Session Active
          </span>
        </div>
      </div>

      {/* Phase 1 Verification Card */}
      <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl text-zinc-900">
            <Package className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">
              Phase 1 Complete: Authentication & Axios Interceptor Ready
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl">
              You are securely authenticated as <strong className="text-zinc-900">{user?.firstName} {user?.lastName}</strong> (<code className="text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded text-2xs">@{user?.username}</code>). All subsequent API requests will automatically attach your Bearer token via the shared Axios interceptor.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-2xs text-zinc-500">
              <span className="inline-flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-md">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Shared Axios Instance with Bearer Interceptor
              </span>
              <span className="inline-flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-md">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Route Protection Guard (Unauthenticated &rarr; /login)
              </span>
              <span className="inline-flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-md">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Logout Button with Token Teardown
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
