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

  // Immediate search on button click or form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onSearchChange(searchTerm.trim());
  };

  // Immediate clear on X click: cancels timer, clears local state, and immediately updates URL
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
    <form
      onSubmit={handleSubmit}
      role="search"
      className="relative flex-1 max-w-md h-9 flex items-center bg-[#ffffff] rounded-full border border-[#d2d0c7] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#b8b5aa] focus-within:border-[#141413] focus-within:ring-1 focus-within:ring-[#141413] transition-all"
    >
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search products"
        className="w-full h-full pl-4 pr-16 bg-transparent text-xs font-medium text-[#141413] placeholder:text-[#787771] focus:outline-none rounded-full"
      />

      <div className="absolute inset-y-0 right-2 flex items-center gap-1">
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear search"
            aria-label="Clear search query"
            className="p-1 text-[#8e8d86] hover:text-[#141413] cursor-pointer transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Clean search icon button: no background fill, no border, just the icon */}
        <button
          type="submit"
          title="Search"
          aria-label="Search"
          className="p-1 text-[#141413] hover:text-[#5a5954] cursor-pointer transition-colors flex items-center justify-center"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
