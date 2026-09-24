'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function Pagination({
  currentPage,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  // Generate page numbers with ellipsis windowing
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e7e6e1] text-xs text-[#383733]">
      {/* Result Count Summary */}
      <div className="flex items-center gap-2">
        <span className="tabular-nums font-normal text-[#383733]">
          {total === 0 ? (
            'No products to display'
          ) : startItem === endItem ? (
            <>
              Showing <strong className="text-[#141413] font-semibold">{startItem}</strong> of{' '}
              <strong className="text-[#141413] font-semibold">{total}</strong> {total === 1 ? 'product' : 'products'}
            </>
          ) : (
            <>
              Showing <strong className="text-[#141413] font-semibold">{startItem}–{endItem}</strong> of{' '}
              <strong className="text-[#141413] font-semibold">{total}</strong> products
            </>
          )}
        </span>
      </div>

      {/* Pagination Controls & Page Size Selector */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* Page Size Selector */}
        <div className="flex items-center gap-1.5 text-2xs font-medium text-[#383733]">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            aria-label="Items per page"
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#ffffff] text-[#141413] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] shadow-2xs cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page Buttons Strip */}
        <nav aria-label="Pagination" className="inline-flex items-center p-1 rounded-full bg-[#f2f1ed] border border-[#e5e4de] gap-1 shadow-2xs">
          {/* Previous Button */}
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Go to previous page"
            className="inline-flex items-center justify-center h-7 px-2.5 rounded-full text-xs font-medium text-[#141413] hover:bg-[#ffffff] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:mr-0.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Numeric Page Buttons */}
          <div className="flex items-center gap-0.5">
            {pages.map((p, idx) => {
              if (p === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="h-7 w-6 sm:w-7 flex items-center justify-center text-xs text-[#5a5954] select-none"
                  >
                    …
                  </span>
                );
              }

              const pageNum = p as number;
              const isCurrent = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`h-7 min-w-6 sm:min-w-7 px-1.5 sm:px-2 flex items-center justify-center rounded-full text-xs font-medium tabular-nums transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#141413] text-[#ffffff] shadow-xs'
                      : 'text-[#383733] hover:text-[#141413] hover:bg-[#ffffff]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Go to next page"
            className="inline-flex items-center justify-center h-7 px-2.5 rounded-full text-xs font-medium text-[#141413] hover:bg-[#ffffff] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5 sm:ml-0.5" />
          </button>
        </nav>
      </div>
    </div>
  );
}
