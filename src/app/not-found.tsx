import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f9f9f8] text-[#141413]">
      <div className="max-w-md w-full p-8 bg-[#ffffff] rounded-3xl border border-[#e7e6e1] shadow-[0_20px_40px_rgba(0,0,0,0.06)] text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="h-14 w-14 rounded-2xl bg-[#f2f1ed] border border-[#e5e4de] flex items-center justify-center text-[#141413] mx-auto shadow-2xs">
          <Compass className="h-7 w-7 text-[#5a5954]" />
        </div>

        <div className="space-y-2">
          <span className="text-2xs font-semibold uppercase tracking-wider text-[#8e8d86] bg-[#f2f1ed] px-3 py-1 rounded-full border border-[#e5e4de]">
            404 Error
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-[#141413]">
            Page Not Found
          </h1>
          <p className="text-xs text-[#787771] leading-relaxed">
            The page you are looking for does not exist or has been relocated within the institutional portal.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#141413] text-white hover:bg-[#262624] transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
