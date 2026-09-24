'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ProductFilterParams, SortField, SortOrder } from '@/types/product';

const ALLOWED_LIMITS = [10, 20, 50];
const ALLOWED_SORTS: SortField[] = ['price', 'rating', 'title'];

/**
 * Custom hook to synchronize filter, search, sort, and pagination state with URL search parameters.
 * Defensively parses query parameters to guarantee malformed values like ?page=abc or ?limit=9999
 * never break or crash the application.
 */
export function useUrlParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Defensively parse current search parameters
  const params: ProductFilterParams = useMemo(() => {
    // Defensive page parsing
    const rawPage = searchParams.get('page');
    let page = parseInt(rawPage || '1', 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    // Defensive limit parsing
    const rawLimit = searchParams.get('limit');
    let limit = parseInt(rawLimit || '10', 10);
    if (isNaN(limit) || !ALLOWED_LIMITS.includes(limit)) {
      limit = 10;
    }

    // Defensive search string
    const q = (searchParams.get('q') || '').trim();

    // Defensive category
    const category = (searchParams.get('category') || '').trim();

    // Defensive sort field
    const rawSort = searchParams.get('sortBy') as SortField;
    const sortBy: SortField = ALLOWED_SORTS.includes(rawSort) ? rawSort : '';

    // Defensive sort order
    const rawOrder = searchParams.get('order');
    const order: SortOrder = rawOrder === 'desc' ? 'desc' : 'asc';

    // Optional network delay parameter
    const rawDelay = searchParams.get('delay');
    const delay = rawDelay ? parseInt(rawDelay, 10) : undefined;

    return {
      page,
      limit,
      q,
      category,
      sortBy,
      order,
      delay,
    };
  }, [searchParams]);

  /**
   * Helper to construct and push updated URL search params.
   */
  const updateUrl = useCallback(
    (newParams: Partial<ProductFilterParams>, resetPage: boolean = false) => {
      const sp = new URLSearchParams(searchParams.toString());

      const merged = {
        ...params,
        ...newParams,
        page: resetPage ? 1 : newParams.page ?? params.page,
      };

      // Set or remove page
      if (merged.page && merged.page > 1) {
        sp.set('page', merged.page.toString());
      } else {
        sp.delete('page');
      }

      // Set or remove limit
      if (merged.limit && merged.limit !== 10) {
        sp.set('limit', merged.limit.toString());
      } else {
        sp.delete('limit');
      }

      // Set or remove query
      if (merged.q) {
        sp.set('q', merged.q);
      } else {
        sp.delete('q');
      }

      // Set or remove category
      if (merged.category) {
        sp.set('category', merged.category);
      } else {
        sp.delete('category');
      }

      // Set or remove sort
      if (merged.sortBy) {
        sp.set('sortBy', merged.sortBy);
        sp.set('order', merged.order || 'asc');
      } else {
        sp.delete('sortBy');
        sp.delete('order');
      }

      // Preserve delay parameter if set
      if (merged.delay) {
        sp.set('delay', merged.delay.toString());
      } else {
        sp.delete('delay');
      }

      const queryString = sp.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [searchParams, params, pathname, router]
  );

  const setPage = useCallback(
    (page: number) => {
      updateUrl({ page });
    },
    [updateUrl]
  );

  const setLimit = useCallback(
    (limit: number) => {
      updateUrl({ limit }, true); // Reset to page 1 on limit change
    },
    [updateUrl]
  );

  const setSearch = useCallback(
    (q: string) => {
      updateUrl({ q }, true); // Reset to page 1 on search change
    },
    [updateUrl]
  );

  const setCategory = useCallback(
    (category: string) => {
      updateUrl({ category }, true); // Reset to page 1 on category change
    },
    [updateUrl]
  );

  const setSort = useCallback(
    (sortBy: SortField, order: SortOrder) => {
      updateUrl({ sortBy, order }, true);
    },
    [updateUrl]
  );

  const clearFilters = useCallback(() => {
    const sp = new URLSearchParams();
    if (params.limit !== 10) {
      sp.set('limit', params.limit.toString());
    }
    const queryString = sp.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  }, [params.limit, pathname, router]);

  return {
    params,
    setPage,
    setLimit,
    setSearch,
    setCategory,
    setSort,
    clearFilters,
  };
}

export default useUrlParams;
