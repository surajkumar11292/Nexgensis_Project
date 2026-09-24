import React from 'react';

export default function ProductSkeleton({ viewMode = 'all' }: { viewMode?: 'all' | 'table' | 'cards' }) {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Table Skeleton */}
      {(viewMode === 'all' || viewMode === 'table') && (
        <div className="hidden md:block bg-[#ffffff] rounded-2xl border border-[#e7e6e1] overflow-hidden shadow-2xs">
          <div className="h-12 bg-[#f2f1ed] border-b border-[#e7e6e1]" />
          <div className="divide-y divide-[#f2f1ed]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-12 w-12 rounded-xl bg-[#edebe6] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded bg-[#edebe6]" />
                  <div className="h-2.5 w-1/2 rounded bg-[#f2f1ed]" />
                </div>
                <div className="h-6 w-20 rounded-full bg-[#edebe6]" />
                <div className="h-4 w-16 rounded bg-[#edebe6]" />
                <div className="h-4 w-12 rounded bg-[#edebe6]" />
                <div className="h-6 w-20 rounded-full bg-[#edebe6]" />
                <div className="h-8 w-16 rounded-full bg-[#edebe6]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards Skeleton */}
      {(viewMode === 'all' || viewMode === 'cards') && (
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-[#ffffff] rounded-2xl border border-[#e7e6e1] space-y-3 shadow-2xs"
            >
              <div className="flex gap-3">
                <div className="h-16 w-16 rounded-xl bg-[#edebe6] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/4 rounded bg-[#edebe6]" />
                  <div className="h-4 w-3/4 rounded bg-[#edebe6]" />
                  <div className="h-3 w-1/2 rounded bg-[#f2f1ed]" />
                </div>
              </div>
              <div className="pt-2 border-t border-[#f2f1ed] flex justify-between items-center">
                <div className="h-4 w-14 rounded bg-[#edebe6]" />
                <div className="h-5 w-20 rounded-full bg-[#edebe6]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
