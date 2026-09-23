'use client';

import React, { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useProducts } from '@/hooks/useProducts';
import { useProductStorage } from '@/context/ProductStorageContext';
import { useToast } from '@/context/ToastContext';
import productService from '@/services/productService';
import { Product, ProductFormData } from '@/types/product';
import SearchInput from '@/components/products/SearchInput';
import ProductFilters from '@/components/products/ProductFilters';
import ProductTable from '@/components/products/ProductTable';
import ProductCardGrid from '@/components/products/ProductCardGrid';
import Pagination from '@/components/products/Pagination';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import EmptyState from '@/components/products/EmptyState';
import ErrorState from '@/components/products/ErrorState';
import ProductFormModal from '@/components/products/ProductFormModal';
import ConfirmDeleteModal from '@/components/products/ConfirmDeleteModal';
import { RotateCcw, Sparkles, Loader2, X, Plus } from 'lucide-react';

function ProductsContent() {
  const router = useRouter();
  const { params, setPage, setLimit, setSearch, setCategory, setSort, clearFilters } =
    useUrlParams();
  const { products, total, isLoading, error, retry, isHybridFiltered } = useProducts(params);
  const { hasLocalChanges, resetToDefaults, saveLocalAdd, saveLocalUpdate, saveLocalDelete } =
    useProductStorage();
  const { success, error: toastError } = useToast();

  const [desktopViewMode, setDesktopViewMode] = useState<'table' | 'cards'>('table');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const hasActiveFilters = Boolean(params.q || params.category || params.sortBy);

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Add Product Handler
  const handleAddSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    try {
      let createdProduct: Product;
      try {
        createdProduct = await productService.addProduct(formData);
      } catch {
        // Fallback for offline / network issues
        createdProduct = {
          ...formData,
          id: Date.now(),
          price: formData.price,
          stock: formData.stock,
          rating: formData.rating || 4.5,
          thumbnail: formData.thumbnail || '',
          images: formData.thumbnail ? [formData.thumbnail] : [],
        } as Product;
      }

      const localItem: Product = {
        ...createdProduct,
        ...formData,
        id: createdProduct.id || Date.now(),
        isLocal: true,
      };

      saveLocalAdd(localItem);
      success(`"${formData.title}" added to inventory.`);
      setIsAddModalOpen(false);
    } catch {
      toastError('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Product Handler
  const handleEditSubmit = async (formData: ProductFormData) => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      try {
        await productService.updateProduct(selectedProduct.id, formData);
      } catch {
        // Handled optimistically
      }

      saveLocalUpdate(selectedProduct.id, formData);
      success(`"${formData.title}" updated successfully.`);
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch {
      toastError('Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product Handler
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      try {
        await productService.deleteProduct(selectedProduct.id);
      } catch {
        // Handled optimistically
      }

      saveLocalDelete(selectedProduct.id);
      success(`"${selectedProduct.title}" has been deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch {
      toastError('Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Catalog Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-[#e7e6e1]">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f1ed] border border-[#e5e4de] text-2xs font-medium text-[#5a5954]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
            <span>Catalog &amp; Inventory</span>
            <span className="text-[#8e8d86]">·</span>
            <span className="font-semibold text-[#141413] tabular-nums">{total} Products</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-[#141413] leading-tight">
            Manage product inventory with craft.
          </h1>

          <p className="text-xs sm:text-sm text-[#6e6d67] leading-relaxed">
            Curated overview of items, stock status, ratings, and live prices synchronized with DummyJSON.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Add Product Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#141413] hover:bg-[#262624] text-white transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Product</span>
          </button>

          {hasLocalChanges && (
            <button
              type="button"
              onClick={resetToDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-[#b45309] bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#fde68a] transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Demo Changes</span>
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-[#5a5954] hover:text-[#141413] bg-[#f0eee9] hover:bg-[#e6e4de] border border-[#e2e0da] transition-all cursor-pointer active:scale-95"
            >
              <X className="h-3 w-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Hybrid Filter Warning Notice */}
      {isHybridFiltered && (
        <div className="p-3.5 rounded-2xl bg-[#fffbf2] border border-[#f5e6c8] text-[#8a5b14] text-xs flex items-start gap-3 shadow-2xs">
          <Sparkles className="h-4 w-4 text-[#d97706] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold text-[#6e460b]">Hybrid Filter Applied:</strong> DummyJSON API does not allow simultaneous server-side search and category filtering. Items matching <span className="font-mono font-medium text-[#5c3a08] underline">&quot;{params.q}&quot;</span> are filtered within category <span className="font-mono font-medium text-[#5c3a08] underline">&quot;{params.category}&quot;</span>.
          </div>
        </div>
      )}

      {/* Control Strip: Search & Filters */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#f2f1ed] border border-[#e5e4de] space-y-3.5 shadow-2xs">
        {/* Search Bar Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <SearchInput
            initialValue={params.q || ''}
            onSearchChange={setSearch}
            placeholder="Search catalog by title, brand, or keywords..."
          />

          <div className="text-2xs text-[#787771] sm:text-right">
            Page <span className="font-semibold text-[#141413] tabular-nums">{params.page}</span> of{' '}
            <span className="font-semibold text-[#141413] tabular-nums">
              {Math.max(1, Math.ceil(total / params.limit))}
            </span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <ProductFilters
          selectedCategory={params.category || ''}
          sortBy={params.sortBy || ''}
          order={params.order || 'asc'}
          onCategoryChange={setCategory}
          onSortChange={setSort}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          viewMode={desktopViewMode}
          onViewModeChange={setDesktopViewMode}
        />
      </div>

      {/* Main Content Area with State Management */}
      <div>
        {isLoading ? (
          <ProductSkeleton viewMode="all" />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : products.length === 0 ? (
          <EmptyState onClearFilters={clearFilters} hasFilters={hasActiveFilters} />
        ) : (
          <div className="space-y-6">
            {/* Desktop View: Table or Card Grid */}
            <div className="hidden md:block">
              {desktopViewMode === 'table' ? (
                <ProductTable
                  products={products}
                  sortBy={params.sortBy}
                  order={params.order}
                  onSortChange={setSort}
                  onViewProduct={handleViewProduct}
                  onEditProduct={handleOpenEdit}
                  onDeleteProduct={handleOpenDelete}
                />
              ) : (
                <ProductCardGrid
                  products={products}
                  onViewProduct={handleViewProduct}
                  onEditProduct={handleOpenEdit}
                  onDeleteProduct={handleOpenDelete}
                />
              )}
            </div>

            {/* Mobile View: Always Touch-Friendly Card Grid */}
            <div className="block md:hidden">
              <ProductCardGrid
                products={products}
                onViewProduct={handleViewProduct}
                onEditProduct={handleOpenEdit}
                onDeleteProduct={handleOpenDelete}
              />
            </div>

            {/* Custom Pagination with Result Count & Page Size Selector */}
            <Pagination
              currentPage={params.page}
              total={total}
              limit={params.limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        mode="add"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Edit Product Modal */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        mode="edit"
        initialProduct={selectedProduct}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        product={selectedProduct}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-96 flex items-center justify-center bg-[#f9f9f8]">
          <Loader2 className="h-5 w-5 animate-spin text-[#141413]" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
