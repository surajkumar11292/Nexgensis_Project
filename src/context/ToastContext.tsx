'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,0.12)] border flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              t.type === 'success'
                ? 'bg-[#ffffff] border-[#bbf7d0] text-[#14532d]'
                : t.type === 'error'
                ? 'bg-[#ffffff] border-[#fecaca] text-[#991b1b]'
                : 'bg-[#ffffff] border-[#e5e4de] text-[#141413]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {t.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
              ) : t.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-[#dc2626] shrink-0" />
              ) : (
                <Info className="h-4 w-4 text-[#2563eb] shrink-0" />
              )}
              <span className="text-xs font-medium text-[#141413] leading-snug break-words">
                {t.message}
              </span>
            </div>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              aria-label="Close notification"
              className="p-1 rounded-full text-[#8e8d86] hover:text-[#141413] hover:bg-[#f2f1ed] transition-colors cursor-pointer shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
