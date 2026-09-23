'use client';

import React, { useEffect, useState } from 'react';
import { ProductCategory, SortField, SortOrder } from '@/types/product';
import productService from '@/services/productService';
import { LayoutGrid, LayoutList, X } from 'lucide-react';

interface ProductFiltersProps {
  selectedCategory: string;
  sortBy: SortField;
  order: SortOrder;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: SortField, order: SortOrder) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  viewMode?: 'table' | 'cards';
  onViewModeChange?: (mode: 'table' | 'cards') => void;
}

export default function ProductFilters({
  selectedCategory,
  sortBy,
  order,
  onCategoryChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  viewMode = 'table',
  onViewModeChange,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const data = await productService.getCategories();
        if (isMounted) {
          setCategories(data);
          setIsLoadingCategories(false);
        }
      } catch {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentSortKey = sortBy ? `${sortBy}_${order}` : '';

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      onSortChange('', 'asc');
      return;
    }
    const [field, sortOrder] = val.split('_') as [SortField, SortOrder];
    onSortChange(field, sortOrder);
  };

  // Curated quick filter pills
  const quickCategories = [
    { slug: '', label: 'All' },
    { slug: 'beauty', label: 'Beauty' },
    { slug: 'fragrances', label: 'Fragrances' },
    { slug: 'furniture', label: 'Furniture' },
    { slug: 'groceries', label: 'Groceries' },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
      {/* Category Pills & Dropdown */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Quick Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {quickCategories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#141413] text-[#ffffff] shadow-xs'
                    : 'bg-[#ffffff] text-[#6e6d67] hover:text-[#141413] hover:bg-[#f2f1ed] border border-[#e2e0da]'
                }`}
              >
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* All Categories Dropdown */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoadingCategories}
            aria-label="Filter by category"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#ffffff] text-[#141413] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <option value="">More Categories ({categories.length || '...'})</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort, View Mode, and Clear Filters */}
      <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end">
        {/* Sort selector dropdown */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <select
              value={currentSortKey}
              onChange={handleSortSelect}
              aria-label="Sort products"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#ffffff] text-[#141413] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] shadow-2xs cursor-pointer"
            >
              <option value="">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Rating: Highest First</option>
              <option value="rating_asc">Rating: Lowest First</option>
              <option value="title_asc">Title: A to Z</option>
              <option value="title_desc">Title: Z to A</option>
            </select>
          </div>
        </div>

        {/* View mode toggle (Table / Grid) for desktop */}
        {onViewModeChange && (
          <div className="hidden md:inline-flex items-center p-0.5 rounded-full bg-[#f2f1ed] border border-[#e2e0da]">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              aria-label="Table view"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#ffffff] text-[#141413] shadow-xs'
                  : 'text-[#8e8d86] hover:text-[#141413]'
              }`}
              title="Table view"
            >
              <LayoutList className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              aria-label="Grid view"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#ffffff] text-[#141413] shadow-xs'
                  : 'text-[#8e8d86] hover:text-[#141413]'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Clear Filters CTA */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#5a5954] hover:text-[#141413] bg-[#f0eee9] hover:bg-[#e6e4de] border border-[#e2e0da] transition-all cursor-pointer active:scale-95"
          >
            <X className="h-3 w-3" />
            <span>Clear filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
