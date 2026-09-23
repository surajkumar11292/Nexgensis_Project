'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, ProductFormData } from '@/types/product';
import { useProductStorage } from '@/context/ProductStorageContext';
import { useToast } from '@/context/ToastContext';
import productService from '@/services/productService';
import ProductFormModal from '@/components/products/ProductFormModal';
import ConfirmDeleteModal from '@/components/products/ConfirmDeleteModal';
import {
  ChevronLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Box,
  Layers,
  Edit3,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id, 10);

  const { getProduct, saveLocalUpdate, saveLocalDelete } = useProductStorage();
  const { success } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      if (isNaN(productId) || productId <= 0) {
        if (isMounted) {
          setNotFound(true);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const data = await getProduct(productId);
        if (isMounted) {
          if (!data) {
            setNotFound(true);
          } else {
            setProduct(data);
            setSelectedImage(data.images?.[0] || data.thumbnail || '');
            setNotFound(false);
          }
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setNotFound(true);
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId, getProduct]);

  // Handle Edit Submission
  const handleEditSubmit = async (formData: ProductFormData) => {
    if (!product) return;
    setIsSubmitting(true);
    try {
      // 1. Call server API
      await productService.updateProduct(product.id, formData);
      // 2. Persist locally in ProductStorageContext
      saveLocalUpdate(product.id, formData);
      // 3. Update local state
      setProduct((prev) => (prev ? { ...prev, ...formData } : null));
      if (formData.thumbnail) setSelectedImage(formData.thumbnail);
      success(`"${formData.title}" updated successfully.`);
      setIsEditModalOpen(false);
    } catch {
      // Still apply local update for demo persistence
      saveLocalUpdate(product.id, formData);
      setProduct((prev) => (prev ? { ...prev, ...formData } : null));
      success(`"${formData.title}" updated locally.`);
      setIsEditModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!product) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(product.id);
      saveLocalDelete(product.id);
      success(`"${product.title}" has been deleted.`);
      setIsDeleteModalOpen(false);
      router.push('/products');
    } catch {
      saveLocalDelete(product.id);
      success(`"${product.title}" removed from catalog.`);
      setIsDeleteModalOpen(false);
      router.push('/products');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-xs text-[#787771]">
        <Loader2 className="h-6 w-6 animate-spin text-[#141413]" />
        <span>Loading product details...</span>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="py-20 px-6 max-w-lg mx-auto text-center space-y-5 bg-[#ffffff] rounded-3xl border border-[#e7e6e1] shadow-2xs">
        <div className="h-12 w-12 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#dc2626] mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold text-[#141413]">Product Not Found</h2>
          <p className="text-xs text-[#787771] leading-relaxed">
            The product with ID <span className="font-mono font-medium text-[#141413]">#{resolvedParams.id}</span> does not exist or has been removed from the inventory.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#141413] text-white hover:bg-[#262624] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.thumbnail
      ? [product.thumbnail]
      : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e7e6e1]">
        <div className="flex items-center gap-2 text-xs text-[#787771] flex-wrap">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-[#5a5954] hover:text-[#141413] transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Catalog</span>
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-[#141413] font-medium truncate max-w-xs">{product.title}</span>
        </div>

        {/* Action Buttons: Edit and Delete */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#141413] bg-[#ffffff] hover:bg-[#f2f1ed] border border-[#e2e0da] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Edit3 className="h-3.5 w-3.5 text-[#5a5954]" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#dc2626] bg-[#fff5f5] hover:bg-[#fee2e2] border border-[#fecaca] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Preview Image */}
          <div className="relative aspect-square w-full rounded-3xl bg-[#ffffff] border border-[#e7e6e1] overflow-hidden shadow-2xs flex items-center justify-center p-6">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                unoptimized
                className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                priority
              />
            ) : (
              <div className="text-xs text-[#9c9b94]">No image available</div>
            )}
          </div>

          {/* Thumbnail Selector Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {galleryImages.map((img, idx) => {
                const isSelected = selectedImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-16 w-16 rounded-xl bg-[#ffffff] border overflow-hidden shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#141413] ring-2 ring-[#141413]/20 shadow-xs'
                        : 'border-[#e2e0da] opacity-70 hover:opacity-100 hover:border-[#141413]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} - view ${idx + 1}`}
                      fill
                      sizes="64px"
                      unoptimized
                      className="object-cover p-1"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Information, Specs, & Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-semibold uppercase tracking-wider bg-[#f2f1ed] text-[#5a5954] border border-[#e5e4de]">
                {product.category}
              </span>

              {product.brand && (
                <span className="text-xs font-medium text-[#787771]">
                  Brand: <strong className="text-[#141413]">{product.brand}</strong>
                </span>
              )}

              {product.isLocal && (
                <span className="px-2 py-0.5 rounded-full text-3xs font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                  Locally Stored
                </span>
              )}

              {product.sku && (
                <span className="text-2xs font-mono text-[#8e8d86]">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#141413] leading-snug">
              {product.title}
            </h1>

            {/* Rating Stars & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-semibold text-[#141413]">
                <Star className="h-4 w-4 fill-[#d97706] text-[#d97706]" />
                <span className="tabular-nums">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-[#8e8d86]">·</span>
              <span className="text-xs text-[#787771]">
                {product.reviews?.length || 0} Customer Reviews
              </span>
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="p-5 rounded-2xl bg-[#ffffff] border border-[#e7e6e1] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-2xs uppercase tracking-wider text-[#787771]">Catalog Price</div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-bold tabular-nums text-[#141413]">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercentage && product.discountPercentage > 0 ? (
                  <span className="text-xs font-medium text-[#059669] bg-[#edf7f2] px-2 py-0.5 rounded-full border border-[#d2edd9]">
                    {Math.round(product.discountPercentage)}% Off
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  product.stock > 10
                    ? 'bg-[#edf7f2] text-[#0d6e49] border border-[#d2edd9]'
                    : product.stock > 0
                    ? 'bg-[#fffbeb] text-[#92400e] border border-[#fef3c7]'
                    : 'bg-[#fef2f2] text-[#991b1b] border border-[#fee2e2]'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full mr-2 ${
                    product.stock > 10
                      ? 'bg-[#059669]'
                      : product.stock > 0
                      ? 'bg-[#d97706]'
                      : 'bg-[#dc2626]'
                  }`}
                />
                {product.stock > 0 ? `${product.stock} Units in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#787771]">
              Description
            </h2>
            <p className="text-sm text-[#5a5954] leading-relaxed">
              {product.description || 'No description provided for this product.'}
            </p>
          </div>

          {/* Specs & Logistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {product.dimensions && (
              <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] space-y-1">
                <div className="flex items-center gap-1.5 text-2xs text-[#787771]">
                  <Box className="h-3.5 w-3.5 text-[#5a5954]" />
                  <span>Dimensions</span>
                </div>
                <div className="text-xs font-semibold text-[#141413] tabular-nums">
                  {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                </div>
              </div>
            )}

            {product.weight && (
              <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] space-y-1">
                <div className="flex items-center gap-1.5 text-2xs text-[#787771]">
                  <Layers className="h-3.5 w-3.5 text-[#5a5954]" />
                  <span>Weight</span>
                </div>
                <div className="text-xs font-semibold text-[#141413] tabular-nums">
                  {product.weight} kg
                </div>
              </div>
            )}

            {product.warrantyInformation && (
              <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] space-y-1">
                <div className="flex items-center gap-1.5 text-2xs text-[#787771]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#5a5954]" />
                  <span>Warranty</span>
                </div>
                <div className="text-xs font-semibold text-[#141413] truncate">
                  {product.warrantyInformation}
                </div>
              </div>
            )}

            {product.shippingInformation && (
              <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] space-y-1">
                <div className="flex items-center gap-1.5 text-2xs text-[#787771]">
                  <Truck className="h-3.5 w-3.5 text-[#5a5954]" />
                  <span>Shipping</span>
                </div>
                <div className="text-xs font-semibold text-[#141413] truncate">
                  {product.shippingInformation}
                </div>
              </div>
            )}

            {product.returnPolicy && (
              <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] space-y-1">
                <div className="flex items-center gap-1.5 text-2xs text-[#787771]">
                  <RotateCcw className="h-3.5 w-3.5 text-[#5a5954]" />
                  <span>Returns</span>
                </div>
                <div className="text-xs font-semibold text-[#141413] truncate">
                  {product.returnPolicy}
                </div>
              </div>
            )}

            {product.availabilityStatus && (
              <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] space-y-1">
                <div className="flex items-center gap-1.5 text-2xs text-[#787771]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#5a5954]" />
                  <span>Status</span>
                </div>
                <div className="text-xs font-semibold text-[#141413]">
                  {product.availabilityStatus}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#e7e6e1]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#141413]">
              Customer Reviews ({product.reviews.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#ffffff] rounded-2xl border border-[#e7e6e1] space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-2xs font-semibold text-[#d97706]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#d97706]" />
                    ))}
                  </div>
                  <span className="text-3xs text-[#8e8d86]">
                    {new Date(rev.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-xs text-[#5a5954] leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="text-2xs font-semibold text-[#141413] pt-1 border-t border-[#f2f1ed]">
                  {rev.reviewerName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        mode="edit"
        initialProduct={product}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        product={product}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
