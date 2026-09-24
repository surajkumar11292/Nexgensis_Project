'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useProducts } from '@/hooks/useProducts';
import { useProductStorage } from '@/context/ProductStorageContext';
import { useToast } from '@/context/ToastContext';
import productService from '@/services/productService';
import { Product, ProductFormData } from '@/types/product';
import ProductFilters from '@/components/products/ProductFilters';
import ProductTable from '@/components/products/ProductTable';
import ProductCardGrid from '@/components/products/ProductCardGrid';
import Pagination from '@/components/products/Pagination';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import EmptyState from '@/components/products/EmptyState';
import ErrorState from '@/components/products/ErrorState';
import ProductFormModal from '@/components/products/ProductFormModal';
import ConfirmDeleteModal from '@/components/products/ConfirmDeleteModal';
import { Sparkles, Loader2 } from 'lucide-react';

function ProductsContent() {
  const router = useRouter();
  const { params, setPage, setLimit, setSearch, setCategory, setSort, clearFilters } =
    useUrlParams();
  const { products, total, isLoading, error, retry, isHybridFiltered } = useProducts(params);
  const {
    hasLocalChanges,
    resetToDefaults,
    saveLocalAdd,
    saveLocalUpdate,
    saveLocalDelete,
    setCatalogTotal,
    isAddModalOpen,
    setIsAddModalOpen,
  } = useProductStorage();
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (!params.q && !params.category && total > 0) {
      setCatalogTotal(total);
    }
  }, [total, params.q, params.category, setCatalogTotal]);

  // Restore scroll position to last-viewed product on return navigation
  useEffect(() => {
    if (!isLoading && products.length > 0 && typeof window !== 'undefined') {
      const lastId = sessionStorage.getItem('last_viewed_product_id');
      const savedPos = sessionStorage.getItem('products_scroll_pos');

      if (lastId || savedPos) {
        const timer = setTimeout(() => {
          let restored = false;
          if (lastId) {
            const targetEl =
              document.getElementById(`product-row-${lastId}`) ||
              document.getElementById(`product-card-${lastId}`);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });
              targetEl.classList.add('bg-[#fef9c3]/70', 'transition-colors', 'duration-700');
              setTimeout(() => {
                targetEl.classList.remove('bg-[#fef9c3]/70');
              }, 1800);
              restored = true;
            }
          }
          if (!restored && savedPos) {
            window.scrollTo({ top: parseInt(savedPos, 10), behavior: 'instant' });
          }

          sessionStorage.removeItem('last_viewed_product_id');
          sessionStorage.removeItem('products_scroll_pos');
        }, 60);

        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, products]);

  const [desktopViewMode, setDesktopViewMode] = useState<'table' | 'cards'>('table');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const hasActiveFilters = Boolean(params.q || params.category || params.sortBy);

  const handleViewProduct = (productId: number) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('products_scroll_pos', window.scrollY.toString());
      sessionStorage.setItem('last_viewed_product_id', productId.toString());
      sessionStorage.setItem('products_return_url', window.location.pathname + window.location.search);
    }
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
    <div className="space-y-3">
      {/* Hybrid Filter Warning Notice */}
      {isHybridFiltered && (
        <div className="p-3.5 rounded-2xl bg-[#fffbf2] border border-[#f5e6c8] text-[#8a5b14] text-xs flex items-start gap-3 shadow-2xs">
          <Sparkles className="h-4 w-4 text-[#d97706] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold text-[#6e460b]">Hybrid Filter Applied:</strong> DummyJSON API does not allow simultaneous server-side search and category filtering. Items matching <span className="font-mono font-medium text-[#5c3a08] underline">&quot;{params.q}&quot;</span> are filtered within category <span className="font-mono font-medium text-[#5c3a08] underline">&quot;{params.category}&quot;</span>.
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-[#f2f1ed] border border-[#e5e4de] shadow-2xs">
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
          currentPage={params.page}
          totalPages={Math.max(1, Math.ceil(total / params.limit))}
        />
      </div>

      {/* Product list */}
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

            {/* Pagination */}
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
