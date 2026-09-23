'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  product,
  onClose,
  onConfirm,
  isDeleting,
}: ConfirmDeleteModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#ffffff] rounded-3xl p-6 sm:p-7 shadow-[0_24px_48px_rgba(0,0,0,0.14)] border border-[#e7e6e1] space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#8e8d86] hover:text-[#141413] hover:bg-[#f2f1ed] transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-2xl bg-[#fef2f2] border border-[#fee2e2] flex items-center justify-center text-[#dc2626] shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h3 id="delete-dialog-title" className="text-base font-semibold text-[#141413]">
              Delete Product
            </h3>
            <p className="text-xs text-[#787771] leading-relaxed">
              Are you sure you want to delete this catalog item? This will remove it from the catalog and cannot be undone.
            </p>
          </div>
        </div>

        {/* Product preview card */}
        <div className="p-3 rounded-2xl bg-[#faf9f5] border border-[#ebe8e2] flex items-center gap-3">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={40}
              height={40}
              unoptimized
              className="h-10 w-10 rounded-xl object-cover border border-[#e5e4de] bg-[#ffffff] shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-[#edebe6] flex items-center justify-center text-3xs text-[#8e8d86] shrink-0">
              N/A
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-[#141413] truncate">
              {product.title}
            </div>
            <div className="text-2xs text-[#787771]">
              <span className="capitalize">{product.category}</span> · <span className="font-semibold text-[#141413] tabular-nums">${product.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#5a5954] hover:text-[#141413] hover:bg-[#f2f1ed] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
