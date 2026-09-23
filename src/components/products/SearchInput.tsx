'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  initialValue?: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  initialValue = '',
  onSearchChange,
  placeholder = 'Search products by title, brand, or keywords...',
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal state when external initialValue changes (e.g. from Clear Filters or URL navigation)
  // Official React pattern for adjusting state from props during render without synchronous useEffect setState
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setSearchTerm(initialValue);
  }

  // Handle typing with 400ms debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSearchChange(val.trim());
    }, 400);
  };

  // Immediate clear on X click: cancels timer, clears local state, and immediately clears URL
  const handleClear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSearchTerm('');
    setPrevInitialValue('');
    onSearchChange('');
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8d86]">
        <Search className="h-3.5 w-3.5" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search products"
        className="w-full pl-9 pr-9 py-2 rounded-full text-xs bg-[#ffffff] text-[#141413] placeholder:text-[#9c9b94] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] focus:border-[#141413] transition-colors shadow-2xs"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          title="Clear search"
          aria-label="Clear search query"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8e8d86] hover:text-[#141413] cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
