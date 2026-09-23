'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProductStorage } from '@/context/ProductStorageContext';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const { catalogTotal } = useProductStorage();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#f9f9f8]/95 backdrop-blur-sm border-b border-[#e7e6e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Products Title & Catalog Count */}
          <Link
            href="/products"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-lg cursor-pointer"
          >
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#141413]">
              Products
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#5a5954]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#059669]" />
              <span>
                <strong className="font-semibold text-[#141413] tabular-nums">{catalogTotal}</strong> in catalog
              </span>
            </span>
          </Link>

          {/* User first name + (admin) & Red Logout button */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#ffffff] border border-[#e7e6e1] shadow-2xs text-xs">
                <span className="font-semibold text-[#141413]">
                  {user.firstName || 'Emily'}
                </span>
                <span className="text-xs text-[#787771] font-normal">
                  (admin)
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#dc2626] bg-[#fef2f2] hover:bg-[#b91c1c] hover:text-white border border-[#fecaca] hover:border-[#b91c1c] transition-all cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
