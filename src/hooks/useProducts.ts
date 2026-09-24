'use client';

import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { Product, ProductFilterParams } from '@/types/product';
import productService from '@/services/productService';
import { useProductStorage } from '@/context/ProductStorageContext';
import axios from 'axios';

interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
  isHybridFiltered: boolean;
}

/**
 * Custom hook to fetch and manage products with:
 * - AbortController request cancellation for search queries
 * - Monotonic request ID tracking to prevent race conditions
 * - Hybrid client/server filtering when search and category are combined
 * - Optimistic local state persistence via useProductStorage
 */
export function useProducts(params: ProductFilterParams): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isHybridFiltered, setIsHybridFiltered] = useState<boolean>(false);

  const { applyLocalOverrides } = useProductStorage();

  // References to handle race conditions and request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestIdRef = useRef<number>(0);

  const fetchProducts = useCallback(async () => {
    // Cancel previous in-flight request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Instantiate new AbortController and increment monotonic request ID
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++activeRequestIdRef.current;

    startTransition(() => {
      setIsLoading(true);
      setError(null);
    });

    const hasSearch = !!(params.q && params.q.trim().length > 0);
    const hasCategory = !!(params.category && params.category.trim().length > 0);

    try {
      let rawProducts: Product[] = [];
      let rawTotal = 0;

      // Handle DummyJSON search + category conflict
      if (hasSearch && hasCategory) {
        startTransition(() => {
          setIsHybridFiltered(true);
        });
        // Strategy: Fetch search results with high limit, then client-filter by category
        const response = await productService.searchProducts(
          { ...params, limit: 100, page: 1 },
          controller.signal
        );

        // Client-side category refinement
        const filtered = response.products.filter(
          (p) => p.category.toLowerCase() === (params.category || '').toLowerCase()
        );

        rawTotal = filtered.length;
        const start = (params.page - 1) * params.limit;
        rawProducts = filtered.slice(start, start + params.limit);
      } else if (hasSearch) {
        startTransition(() => {
          setIsHybridFiltered(false);
        });
        const response = await productService.searchProducts(params, controller.signal);
        rawProducts = response.products;
        rawTotal = response.total;
      } else if (hasCategory) {
        startTransition(() => {
          setIsHybridFiltered(false);
        });
        const response = await productService.getProductsByCategory(
          params.category!,
          params,
          controller.signal
        );
        rawProducts = response.products;
        rawTotal = response.total;
      } else {
        startTransition(() => {
          setIsHybridFiltered(false);
        });
        const response = await productService.getProducts(params, controller.signal);
        rawProducts = response.products;
        rawTotal = response.total;
      }

      // Check if this response is still the latest requested response
      if (currentRequestId === activeRequestIdRef.current) {
        const { products: finalProducts, total: finalTotal } = applyLocalOverrides(
          rawProducts,
          rawTotal,
          params.page,
          params.category,
          params.q
        );

        startTransition(() => {
          setProducts(finalProducts);
          setTotal(finalTotal);
          setIsLoading(false);
        });
      }
    } catch (err: unknown) {
      // Ignore Abort errors - they represent cancelled stale requests
      if (axios.isCancel(err) || (err instanceof DOMException && err.name === 'AbortError')) {
        return;
      }

      if (currentRequestId === activeRequestIdRef.current) {
        const message = err instanceof Error ? err.message : 'Failed to fetch products. Please try again.';
        startTransition(() => {
          setError(message);
          setIsLoading(false);
        });
      }
    }
  }, [params, applyLocalOverrides]);

  useEffect(() => {
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  return {
    products,
    total,
    isLoading,
    error,
    retry: fetchProducts,
    isHybridFiltered,
  };
}

export default useProducts;
