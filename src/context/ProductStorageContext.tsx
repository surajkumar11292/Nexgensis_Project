'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Product } from '@/types/product';
import productService from '@/services/productService';

const STORAGE_KEY = 'nexgensis_products_local_storage';

interface LocalStorageState {
  added: Product[];
  updated: Record<number, Partial<Product>>;
  deleted: number[];
}

interface ProductStorageContextType {
  addedProducts: Product[];
  updatedProducts: Record<number, Partial<Product>>;
  deletedProductIds: number[];
  saveLocalAdd: (product: Product) => void;
  saveLocalUpdate: (id: number, product: Partial<Product>) => void;
  saveLocalDelete: (id: number) => void;
  applyLocalOverrides: (
    serverProducts: Product[],
    serverTotal: number,
    page: number,
    categoryFilter?: string,
    searchFilter?: string
  ) => { products: Product[]; total: number };
  getProduct: (id: number) => Promise<Product | null>;
  resetToDefaults: () => void;
  hasLocalChanges: boolean;
}

const ProductStorageContext = createContext<ProductStorageContextType | undefined>(undefined);

function readStorage(): LocalStorageState {
  if (typeof window === 'undefined') {
    return { added: [], updated: {}, deleted: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { added: [], updated: {}, deleted: [] };
    return JSON.parse(raw);
  } catch {
    return { added: [], updated: {}, deleted: [] };
  }
}

function writeStorage(state: LocalStorageState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors
  }
}

export function ProductStorageProvider({ children }: { children: React.ReactNode }) {
  const [storageState, setStorageState] = useState<LocalStorageState>(() => readStorage());

  const saveLocalAdd = useCallback((product: Product) => {
    setStorageState((prev) => {
      const nextAdded = [{ ...product, isLocal: true }, ...prev.added.filter((p) => p.id !== product.id)];
      const nextState = { ...prev, added: nextAdded };
      writeStorage(nextState);
      return nextState;
    });
  }, []);

  const saveLocalUpdate = useCallback((id: number, partialProduct: Partial<Product>) => {
    setStorageState((prev) => {
      // If it's a locally added product, update it in added array
      const isLocallyAdded = prev.added.some((p) => p.id === id);
      let nextAdded = prev.added;
      if (isLocallyAdded) {
        nextAdded = prev.added.map((p) => (p.id === id ? { ...p, ...partialProduct } : p));
      }

      const nextUpdated = {
        ...prev.updated,
        [id]: { ...(prev.updated[id] || {}), ...partialProduct },
      };

      const nextState = { ...prev, added: nextAdded, updated: nextUpdated };
      writeStorage(nextState);
      return nextState;
    });
  }, []);

  const saveLocalDelete = useCallback((id: number) => {
    setStorageState((prev) => {
      const nextAdded = prev.added.filter((p) => p.id !== id);
      const nextDeleted = prev.deleted.includes(id) ? prev.deleted : [...prev.deleted, id];
      const nextState = { ...prev, added: nextAdded, deleted: nextDeleted };
      writeStorage(nextState);
      return nextState;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    const emptyState: LocalStorageState = { added: [], updated: {}, deleted: [] };
    setStorageState(emptyState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const hasLocalChanges = useMemo(() => {
    return (
      storageState.added.length > 0 ||
      Object.keys(storageState.updated).length > 0 ||
      storageState.deleted.length > 0
    );
  }, [storageState]);

  /**
   * Seamlessly merges server-fetched products with optimistic client-side mutations.
   */
  const applyLocalOverrides = useCallback(
    (
      serverProducts: Product[],
      serverTotal: number,
      page: number,
      categoryFilter?: string,
      searchFilter?: string
    ) => {
      // 1. Exclude deleted products
      let filteredServer = serverProducts.filter(
        (product) => !storageState.deleted.includes(product.id)
      );

      // 2. Apply modifications to server products
      filteredServer = filteredServer.map((product) => {
        const override = storageState.updated[product.id];
        if (override) {
          return { ...product, ...override };
        }
        return product;
      });

      // 3. Filter matching locally added products
      let matchingAdded = storageState.added.filter(
        (product) => !storageState.deleted.includes(product.id)
      );

      if (categoryFilter) {
        matchingAdded = matchingAdded.filter(
          (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      if (searchFilter) {
        const query = searchFilter.toLowerCase();
        matchingAdded = matchingAdded.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      // Prepend local additions on page 1
      let combinedProducts = filteredServer;
      if (page === 1 && matchingAdded.length > 0) {
        combinedProducts = [...matchingAdded, ...filteredServer];
      }

      // Adjust total count accurately
      const adjustedTotal = Math.max(
        0,
        serverTotal + matchingAdded.length - storageState.deleted.length
      );

      return {
        products: combinedProducts,
        total: adjustedTotal,
      };
    },
    [storageState]
  );

  const getProduct = useCallback(
    async (id: number): Promise<Product | null> => {
      // 1. If marked as deleted locally, treat as not found
      if (storageState.deleted.includes(id)) {
        return null;
      }

      // 2. If locally created product
      const localProduct = storageState.added.find((p) => p.id === id);
      if (localProduct) {
        const override = storageState.updated[id];
        return override ? { ...localProduct, ...override } : localProduct;
      }

      // 3. Otherwise fetch from server and apply any local modifications
      try {
        const serverProduct = await productService.getProductById(id);
        const override = storageState.updated[id];
        return override ? { ...serverProduct, ...override } : serverProduct;
      } catch {
        return null;
      }
    },
    [storageState]
  );

  return (
    <ProductStorageContext.Provider
      value={{
        addedProducts: storageState.added,
        updatedProducts: storageState.updated,
        deletedProductIds: storageState.deleted,
        saveLocalAdd,
        saveLocalUpdate,
        saveLocalDelete,
        applyLocalOverrides,
        getProduct,
        resetToDefaults,
        hasLocalChanges,
      }}
    >
      {children}
    </ProductStorageContext.Provider>
  );
}

export function useProductStorage(): ProductStorageContextType {
  const context = useContext(ProductStorageContext);
  if (!context) {
    throw new Error('useProductStorage must be used within a ProductStorageProvider');
  }
  return context;
}
