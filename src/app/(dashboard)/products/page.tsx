'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useProducts } from '@/hooks/useProducts';
import { useProductStorage } from '@/context/ProductStorageContext';
import {
  Search,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
} from 'lucide-react';

function ProductsContent() {
  const { params, setPage, setLimit, setSearch, setCategory, setSort, clearFilters } =
    useUrlParams();
  const { products, total, isLoading, error, retry, isHybridFiltered } = useProducts(params);
  const { hasLocalChanges, resetToDefaults } = useProductStorage();

  const totalPages = Math.max(1, Math.ceil(total / params.limit));

  const categories = [
    { slug: '', label: 'All Categories' },
    { slug: 'beauty', label: 'Beauty' },
    { slug: 'fragrances', label: 'Fragrances' },
    { slug: 'furniture', label: 'Furniture' },
    { slug: 'groceries', label: 'Groceries' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section matching Swiss wealth & Impeccable design vocabulary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e7e6e1]">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f1ed] border border-[#e5e4de] text-2xs font-medium text-[#5a5954]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
            <span>Catalog &amp; Inventory</span>
            <span className="text-[#8e8d86]">·</span>
            <span className="font-semibold text-[#141413] tabular-nums">{total} Products</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-[#141413] leading-tight">
            Manage product inventory with craft.
          </h1>

          <p className="text-xs sm:text-sm text-[#6e6d67] leading-relaxed">
            Curated overview of items, stock status, ratings, and live prices synchronized with DummyJSON.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {hasLocalChanges && (
            <button
              type="button"
              onClick={resetToDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#b45309] bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#fde68a] transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Demo Changes
            </button>
          )}

          {(params.q || params.category || params.sortBy) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#5a5954] hover:text-[#141413] bg-[#f0eee9] hover:bg-[#e6e4de] border border-[#e2e0da] transition-all cursor-pointer active:scale-95"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Impeccable-style Hybrid Warning Pill */}
      {isHybridFiltered && (
        <div className="p-3.5 rounded-2xl bg-[#fffbf2] border border-[#f5e6c8] text-[#8a5b14] text-xs flex items-start gap-3 shadow-2xs">
          <Sparkles className="h-4 w-4 text-[#d97706] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold text-[#6e460b]">Hybrid Filter Applied:</strong> DummyJSON API does not allow concurrent server-side search and category filtering. Products matching <span className="font-mono font-medium text-[#5c3a08] underline">&quot;{params.q}&quot;</span> are filtered within <span className="font-mono font-medium text-[#5c3a08] underline">&quot;{params.category}&quot;</span>.
          </div>
        </div>
      )}

      {/* Control Strip (Search bar + Category Instrument Strip + Sort) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 rounded-2xl bg-[#f2f1ed] border border-[#e5e4de]">
        {/* Search input with Impeccable pill styling */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8d86]">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            value={params.q || ''}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by title or keyword..."
            className="w-full pl-9 pr-8 py-2 rounded-full text-xs bg-[#ffffff] text-[#141413] placeholder:text-[#9c9b94] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] focus:border-[#141413] transition-colors shadow-2xs"
          />
          {params.q && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8e8d86] hover:text-[#141413] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Instrument Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = (params.category || '') === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#ffffff] text-[#141413] border border-[#e2e0da] shadow-xs'
                    : 'text-[#6e6d67] hover:text-[#141413] hover:bg-[#e8e6e0]'
                }`}
              >
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort & Limit Dropdowns */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSort('price', params.order === 'asc' ? 'desc' : 'asc')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
              params.sortBy === 'price'
                ? 'bg-[#ffffff] text-[#141413] border-[#e2e0da] shadow-xs'
                : 'bg-[#f0eee9] text-[#6e6d67] border-[#e2e0da] hover:bg-[#e6e4de]'
            }`}
          >
            <ArrowUpDown className="h-3 w-3" />
            <span>Price: {params.sortBy === 'price' ? (params.order === 'asc' ? 'Low → High' : 'High → Low') : 'Sort'}</span>
          </button>

          <select
            value={params.limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#ffffff] text-[#141413] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] shadow-2xs cursor-pointer"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Error State with Retry Button */}
      {error && (
        <div className="p-8 rounded-2xl bg-[#fef2f2] border border-[#fee2e2] text-center space-y-3">
          <p className="text-xs font-semibold text-[#991b1b]">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-[#991b1b] text-white hover:bg-[#7f1d1d] transition-colors cursor-pointer active:scale-95"
          >
            Retry Request
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="p-16 text-center bg-[#ffffff] rounded-2xl border border-[#e7e6e1] flex flex-col items-center justify-center gap-3 text-[#787771] text-xs shadow-2xs">
          <Loader2 className="h-5 w-5 animate-spin text-[#141413]" />
          <span>Synchronizing catalog items...</span>
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="p-16 text-center bg-[#ffffff] rounded-2xl border border-[#e7e6e1] flex flex-col items-center justify-center gap-3 text-[#6e6d67] shadow-2xs">
          <div className="h-10 w-10 rounded-full bg-[#f2f1ed] flex items-center justify-center text-[#141413]">
            <Search className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#141413]">No products found</h3>
            <p className="text-xs text-[#8e8d86]">
              No catalog items match your active search or category filters.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-[#141413] text-white hover:bg-[#262624] transition-colors cursor-pointer active:scale-95"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        /* Product Cards Grid with Swiss Bank elevation & motion effects */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative p-5 bg-[#ffffff] rounded-2xl border border-[#e7e6e1] hover:border-[#141413]/40 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="flex gap-4">
                  {product.thumbnail ? (
                    <div className="relative h-18 w-18 rounded-xl bg-[#f7f6f2] overflow-hidden shrink-0 border border-[#ebe8e2]">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        width={72}
                        height={72}
                        unoptimized
                        className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    </div>
                  ) : (
                    <div className="h-18 w-18 rounded-xl bg-[#f7f6f2] shrink-0 border border-[#ebe8e2] flex items-center justify-center text-2xs text-[#9c9b94]">
                      No img
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xs font-semibold text-[#787771] uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.isLocal && (
                        <span className="text-2xs px-1.5 py-0.2 rounded-full bg-[#fef3c7] text-[#92400e] font-medium border border-[#fde68a]">
                          Local
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-[#141413] truncate group-hover:text-[#000000] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-2xs text-[#8e8d86] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics with Swiss bank clean typography */}
                <div className="pt-3 border-t border-[#f2f1ed] flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold tabular-nums text-[#141413]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discountPercentage && (
                      <span className="text-2xs text-[#059669] font-semibold bg-[#edf7f2] px-1.5 py-0.5 rounded">
                        -{Math.round(product.discountPercentage)}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-2xs font-medium text-[#5a5954]">
                      <Star className="h-3 w-3 fill-[#d97706] text-[#d97706]" />
                      <span className="tabular-nums font-semibold">{product.rating.toFixed(1)}</span>
                    </span>

                    <span
                      className={`text-2xs px-2.5 py-0.5 rounded-full font-medium ${
                        product.stock > 10
                          ? 'bg-[#edf7f2] text-[#0d6e49] border border-[#d2edd9]'
                          : product.stock > 0
                          ? 'bg-[#fffbeb] text-[#92400e] border border-[#fef3c7]'
                          : 'bg-[#fef2f2] text-[#991b1b] border border-[#fee2e2]'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Impeccable Pagination Pill Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e7e6e1] text-xs text-[#6e6d67]">
            <span className="tabular-nums">
              Showing <strong className="text-[#141413]">{(params.page - 1) * params.limit + 1}–{Math.min(params.page * params.limit, total)}</strong> of{' '}
              <strong className="text-[#141413]">{total}</strong> products
            </span>

            <div className="inline-flex items-center p-1 rounded-full bg-[#f2f1ed] border border-[#e5e4de] gap-1 shadow-2xs">
              <button
                type="button"
                disabled={params.page <= 1}
                onClick={() => setPage(params.page - 1)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-[#141413] hover:bg-[#ffffff] disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-3 py-1 text-2xs font-semibold text-[#141413] tabular-nums">
                {params.page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={params.page >= totalPages}
                onClick={() => setPage(params.page + 1)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-[#141413] hover:bg-[#ffffff] disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-96 flex items-center justify-center bg-[#f9f9f8]">
          <Loader2 className="h-5 w-5 animate-spin text-[#141413]" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
