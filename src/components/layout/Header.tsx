'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Package2 } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-zinc-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-lg p-1"
            >
              <div className="h-9 w-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-semibold text-base shadow-xs group-hover:bg-zinc-800 transition-colors">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-900">
                  Nexgensis
                </span>
                <span className="text-2xs font-medium text-zinc-500 uppercase tracking-wider">
                  Product Admin
                </span>
              </div>
            </Link>

            <nav className="hidden sm:flex items-center gap-1 border-l border-zinc-200 pl-6 h-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-900 hover:bg-zinc-200/70 transition-colors"
              >
                <Package2 className="h-3.5 w-3.5 text-zinc-700" />
                <span>Products</span>
              </Link>
            </nav>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2.5 py-1 px-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.firstName}
                    width={28}
                    height={28}
                    unoptimized
                    className="h-7 w-7 rounded-full bg-zinc-200 object-cover border border-zinc-200"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-medium">
                    {user.firstName ? user.firstName[0] : 'U'}
                  </div>
                )}
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-900 leading-tight">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-2xs text-zinc-500 leading-tight">
                    @{user.username}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-rose-600 hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
