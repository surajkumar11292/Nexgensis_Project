import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string | null;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="py-16 px-6 text-center bg-[#ffffff] rounded-2xl border border-[#fee2e2] shadow-2xs flex flex-col items-center justify-center space-y-4">
      <div className="h-12 w-12 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#dc2626]">
        <AlertCircle className="h-6 w-6 text-[#dc2626]" />
      </div>

      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-semibold tracking-tight text-[#991b1b]">
          Failed to load product data
        </h3>
        <p className="text-xs text-[#7f1d1d] leading-relaxed">
          {message || 'An unexpected network error occurred while communicating with DummyJSON API.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white transition-all cursor-pointer shadow-xs active:scale-95"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Retry Request</span>
      </button>
    </div>
  );
}
