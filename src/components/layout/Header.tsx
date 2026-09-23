'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#f9f9f8]/95 backdrop-blur-sm border-b border-[#e7e6e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand mark & Wordmark */}
          <div className="flex items-center gap-8">
            <Link
              href="/products"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-lg cursor-pointer"
            >
              {/* Monogram emblem */}
              <div className="h-8 w-8 rounded-lg bg-[#141413] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-2xs group-hover:bg-[#272725] transition-colors">
                N
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold tracking-tight text-[#141413] uppercase">
                  Nexgensis
                </span>
                <span className="text-2xs font-medium text-[#787771] tracking-widest uppercase">
                  Admin
                </span>
              </div>
            </Link>

            {/* Navigation Pills */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#ffffff] text-[#141413] border border-[#e7e6e1] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#cfcdca] transition-colors cursor-pointer"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" aria-hidden="true" />
                <span>Products</span>
              </Link>
            </nav>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2.5 py-1 px-3 rounded-full bg-[#ffffff] border border-[#e7e6e1] shadow-2xs">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.firstName}
                    width={24}
                    height={24}
                    unoptimized
                    className="h-6 w-6 rounded-full bg-[#f2f1ec] object-cover border border-[#e7e6e1]"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-[#141413] text-white flex items-center justify-center text-2xs font-semibold">
                    {user.firstName ? user.firstName[0] : 'U'}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-[#141413]">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-2xs text-[#787771]">
                    @{user.username}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#5a5954] hover:text-[#141413] bg-[#f0eee9] hover:bg-[#e4e2dc] border border-[#e2e0da] transition-all cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413]"
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
