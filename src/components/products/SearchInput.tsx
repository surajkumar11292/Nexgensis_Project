'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  initialValue?: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  initialValue = '',
  onSearchChange,
  placeholder = 'Search products by title or keyword...',
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Synchronize internal state with external URL updates using official React pattern
  // (adjusting state during render without synchronous useEffect setState)
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setSearchTerm(initialValue);
  }

  // Dispatch debounced search query only when it actually differs from external prop
  useEffect(() => {
    if (debouncedSearch !== initialValue) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, initialValue, onSearchChange]);

  const handleClear = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8d86]">
        <Search className="h-3.5 w-3.5" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className="w-full pl-9 pr-8 py-2 rounded-full text-xs bg-[#ffffff] text-[#141413] placeholder:text-[#9c9b94] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] focus:border-[#141413] transition-colors shadow-2xs"
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
