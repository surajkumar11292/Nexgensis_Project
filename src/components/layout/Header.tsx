'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProductStorage } from '@/context/ProductStorageContext';
import { useUrlParams } from '@/hooks/useUrlParams';
import SearchInput from '@/components/products/SearchInput';
import { LogOut, Plus, RotateCcw } from 'lucide-react';

function HeaderSearch() {
  const { params, setSearch } = useUrlParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchChange = (query: string) => {
    if (pathname !== '/products') {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    } else {
      setSearch(query);
    }
  };

  return (
    <SearchInput
      initialValue={params.q || ''}
      onSearchChange={handleSearchChange}
      placeholder="Search catalog by title, brand, or keywords..."
    />
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const { catalogTotal, setIsAddModalOpen, hasLocalChanges, resetToDefaults } = useProductStorage();
  const pathname = usePathname();
  const router = useRouter();

  const handleOpenAdd = () => {
    if (pathname !== '/products') {
      router.push('/products');
    }
    setIsAddModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#f9f9f8]/95 backdrop-blur-sm border-b border-[#e7e6e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4 h-[4.5rem]">
          {/* Brand & Catalog Count */}
          <Link
            href="/products"
            className="flex flex-col justify-center shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-lg cursor-pointer"
          >
            <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[#141413] leading-none">
              Products
            </h1>
            <span className="text-xs text-[#5a5954] mt-1.5 leading-none">
              <strong className="font-semibold text-[#141413] tabular-nums">{catalogTotal}</strong> in catalog
            </span>
          </Link>

          {/* Search & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-1 max-w-xl mx-2">
            <Suspense fallback={<div className="flex-1 h-9 rounded-full bg-[#f2f1ed] animate-pulse" />}>
              <HeaderSearch />
            </Suspense>

            {hasLocalChanges && (
              <button
                type="button"
                onClick={resetToDefaults}
                title="Reset demo changes"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#b45309] bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#fde68a] transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden xl:inline">Reset</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-semibold bg-[#141413] hover:bg-[#262624] text-white transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {user && (
              <div className="flex items-center gap-1.5 sm:gap-2 py-1.5 px-3 sm:px-4 rounded-full bg-[#ffffff] border border-[#e7e6e1] shadow-2xs">
                <span className="font-semibold text-xs sm:text-sm text-[#141413]">
                  {user.firstName || 'Emily'}
                </span>
                <span className="text-2xs sm:text-xs text-[#787771] font-normal">
                  (admin)
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-[#dc2626] bg-[#fef2f2] hover:bg-[#b91c1c] hover:text-white border border-[#fecaca] hover:border-[#b91c1c] transition-all cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shadow-2xs"
            >
              <LogOut className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
