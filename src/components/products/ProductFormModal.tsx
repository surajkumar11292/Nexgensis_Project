'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, ProductCategory, ProductFormData } from '@/types/product';
import productService from '@/services/productService';
import { Loader2, X, PlusCircle, Edit3, Image as ImageIcon } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialProduct?: Product | null;
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => Promise<void> | void;
  isSubmitting: boolean;
}

interface FormErrors {
  title?: string;
  category?: string;
  price?: string;
  stock?: string;
}

function ProductFormDialog({
  mode,
  initialProduct,
  onClose,
  onSubmit,
  isSubmitting,
}: Omit<ProductFormModalProps, 'isOpen'>) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  // Compute initial form data synchronously upon mount
  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (mode === 'edit' && initialProduct) {
      return {
        title: initialProduct.title || '',
        description: initialProduct.description || '',
        category: initialProduct.category || '',
        price: initialProduct.price || 0,
        stock: initialProduct.stock !== undefined ? initialProduct.stock : 10,
        brand: initialProduct.brand || '',
        thumbnail: initialProduct.thumbnail || '',
        rating: initialProduct.rating || 4.5,
      };
    }
    return {
      title: '',
      description: '',
      category: 'beauty',
      price: 19.99,
      stock: 25,
      brand: '',
      thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
      rating: 4.5,
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch categories on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const data = await productService.getCategories();
        if (isMounted) setCategories(data);
      } catch {
        if (isMounted) {
          setCategories([
            { slug: 'beauty', name: 'Beauty', url: '' },
            { slug: 'fragrances', name: 'Fragrances', url: '' },
            { slug: 'furniture', name: 'Furniture', url: '' },
            { slug: 'groceries', name: 'Groceries', url: '' },
          ]);
        }
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, onClose]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category selection is required';
    }

    if (formData.price === undefined || formData.price === null || isNaN(formData.price)) {
      newErrors.price = 'Price is required';
    } else if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than $0';
    }

    if (formData.stock === undefined || formData.stock === null || isNaN(formData.stock)) {
      newErrors.stock = 'Stock count is required';
    } else if (formData.stock < 0) {
      newErrors.stock = 'Stock count cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;
    await onSubmit(formData);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl my-8 bg-[#ffffff] rounded-3xl p-6 sm:p-8 shadow-[0_24px_48px_rgba(0,0,0,0.14)] border border-[#e7e6e1] space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#f2f1ed]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#f2f1ed] border border-[#e5e4de] flex items-center justify-center text-[#141413]">
              {mode === 'add' ? (
                <PlusCircle className="h-5 w-5" />
              ) : (
                <Edit3 className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 id="product-modal-title" className="text-lg font-semibold tracking-tight text-[#141413]">
                {mode === 'add' ? 'Add New Product' : 'Edit Product Details'}
              </h2>
              <p className="text-2xs text-[#787771]">
                {mode === 'add'
                  ? 'Create a new inventory item in the catalog.'
                  : `Update specifications for ${initialProduct?.title}.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close form"
            className="p-1.5 rounded-full text-[#8e8d86] hover:text-[#141413] hover:bg-[#f2f1ed] transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#141413] flex items-center justify-between">
              <span>Title <span className="text-[#dc2626]">*</span></span>
              {errors.title && (
                <span className="text-2xs font-normal text-[#dc2626]">{errors.title}</span>
              )}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Essence Mascara Lash Princess"
              className={`w-full px-3.5 py-2 rounded-xl text-xs bg-[#ffffff] text-[#141413] border focus:outline-none focus:ring-1 transition-colors ${
                errors.title
                  ? 'border-[#fca5a5] focus:ring-[#dc2626]'
                  : 'border-[#e2e0da] focus:ring-[#141413]'
              }`}
            />
          </div>

          {/* Category & Brand Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#141413] flex items-center justify-between">
                <span>Category <span className="text-[#dc2626]">*</span></span>
                {errors.category && (
                  <span className="text-2xs font-normal text-[#dc2626]">{errors.category}</span>
                )}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs bg-[#ffffff] text-[#141413] border focus:outline-none focus:ring-1 transition-colors cursor-pointer ${
                  errors.category
                    ? 'border-[#fca5a5] focus:ring-[#dc2626]'
                    : 'border-[#e2e0da] focus:ring-[#141413]'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#141413]">Brand</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g. Essence, Chanel, Apple"
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#ffffff] text-[#141413] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] transition-colors"
              />
            </div>
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#141413] flex items-center justify-between">
                <span>Price (USD) <span className="text-[#dc2626]">*</span></span>
                {errors.price && (
                  <span className="text-2xs font-normal text-[#dc2626]">{errors.price}</span>
                )}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs text-[#8e8d86]">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="0.00"
                  className={`w-full pl-7 pr-3.5 py-2 rounded-xl text-xs bg-[#ffffff] text-[#141413] border focus:outline-none focus:ring-1 tabular-nums transition-colors ${
                    errors.price
                      ? 'border-[#fca5a5] focus:ring-[#dc2626]'
                      : 'border-[#e2e0da] focus:ring-[#141413]'
                  }`}
                />
              </div>
            </div>

            {/* Stock Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#141413] flex items-center justify-between">
                <span>Stock Quantity <span className="text-[#dc2626]">*</span></span>
                {errors.stock && (
                  <span className="text-2xs font-normal text-[#dc2626]">{errors.stock}</span>
                )}
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={formData.stock !== undefined ? formData.stock : ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: parseInt(e.target.value, 10) || 0 }))
                }
                placeholder="10"
                className={`w-full px-3.5 py-2 rounded-xl text-xs bg-[#ffffff] text-[#141413] border focus:outline-none focus:ring-1 tabular-nums transition-colors ${
                  errors.stock
                    ? 'border-[#fca5a5] focus:ring-[#dc2626]'
                    : 'border-[#e2e0da] focus:ring-[#141413]'
                }`}
              />
            </div>
          </div>

          {/* Thumbnail URL with Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#141413]">Thumbnail Image URL</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={formData.thumbnail || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))}
                  placeholder="https://example.com/product-thumbnail.jpg"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#ffffff] text-[#141413] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] transition-colors"
                />
              </div>

              {/* Preview Thumbnail Container */}
              <div className="h-10 w-10 rounded-xl bg-[#f2f1ed] border border-[#e5e4de] overflow-hidden shrink-0 flex items-center justify-center relative">
                {formData.thumbnail ? (
                  <Image
                    src={formData.thumbnail}
                    alt="Preview"
                    width={40}
                    height={40}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-4 w-4 text-[#9c9b94]" />
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#141413]">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a detailed description of the product features and specifications..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#ffffff] text-[#141413] border border-[#e2e0da] focus:outline-none focus:ring-1 focus:ring-[#141413] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Footer Actions with Double-Submission Lock */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#f2f1ed]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#5a5954] hover:text-[#141413] hover:bg-[#f2f1ed] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold bg-[#141413] hover:bg-[#262624] text-white transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{mode === 'add' ? 'Create Product' : 'Save Changes'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductFormModal(props: ProductFormModalProps) {
  if (!props.isOpen) return null;
  return <ProductFormDialog {...props} />;
}
