import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
  hasFilters: boolean;
}

export default function EmptyState({ onClearFilters, hasFilters }: EmptyStateProps) {
  return (
    <div className="py-20 px-6 text-center bg-[#ffffff] rounded-2xl border border-[#e7e6e1] shadow-2xs flex flex-col items-center justify-center space-y-4">
      <div className="h-12 w-12 rounded-full bg-[#f2f1ed] border border-[#e5e4de] flex items-center justify-center text-[#141413]">
        <Search className="h-5 w-5 text-[#6e6d67]" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold tracking-tight text-[#141413]">
          No products found
        </h3>
        <p className="text-xs text-[#787771] leading-relaxed">
          {hasFilters
            ? 'We could not find any products matching your active keyword search or category filters.'
            : 'No products are currently available in the catalog.'}
        </p>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#141413] text-white hover:bg-[#262624] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#d97706]" />
          <span>Reset all filters</span>
        </button>
      )}
    </div>
  );
}
