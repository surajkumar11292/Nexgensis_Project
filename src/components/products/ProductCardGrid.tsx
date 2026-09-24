'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Star, Eye, Edit3, Trash2 } from 'lucide-react';

interface ProductCardGridProps {
  products: Product[];
  onViewProduct?: (productId: number) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

export default function ProductCardGrid({
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <article
          id={`product-card-${product.id}`}
          key={product.id}
          onClick={() => onViewProduct && onViewProduct(product.id)}
          className="group relative p-4 bg-[#ffffff] rounded-2xl border border-[#e7e6e1] hover:border-[#141413]/40 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] flex flex-col justify-between gap-3.5 cursor-pointer"
        >
          {/* Card Top: Image + Info */}
          <div className="flex gap-3.5">
            <div className="relative h-18 w-18 rounded-xl bg-[#f7f6f2] border border-[#ebe8e2] overflow-hidden shrink-0">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={72}
                  height={72}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-3xs text-[#6e6d67]">
                  No img
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-3xs font-semibold text-[#383733] uppercase tracking-wider bg-[#f2f1ed] px-2 py-0.5 rounded-full border border-[#e5e4de]">
                  {product.category}
                </span>
                {product.isLocal && (
                  <span className="text-3xs px-1.5 py-0.2 rounded-full bg-[#fef3c7] text-[#92400e] font-semibold border border-[#fde68a]">
                    Local
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h2 className="text-sm font-semibold text-[#141413] truncate group-hover:text-[#000000] transition-colors">
                {product.title}
              </h2>

              <p className="text-2xs text-[#5a5954] line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Card Bottom: Metrics + Quick Actions */}
          <div className="pt-2.5 border-t border-[#f2f1ed] flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-baseline gap-1 sm:gap-1.5 shrink-0">
              <span className="text-sm font-bold tabular-nums text-[#141413]">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage && product.discountPercentage > 0 ? (
                <span className="text-3xs text-[#059669] font-medium bg-[#edf7f2] px-1.5 py-0.5 rounded">
                  -{Math.round(product.discountPercentage)}%
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <div className="inline-flex items-center gap-0.5 sm:gap-1 text-2xs font-medium text-[#383733]">
                <Star className="h-3 w-3 fill-[#d97706] text-[#d97706]" />
                <span className="tabular-nums font-semibold">{product.rating.toFixed(1)}</span>
              </div>

              <span
                className={`text-3xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  product.stock > 10
                    ? 'bg-[#edf7f2] text-[#0d6e49] border border-[#d2edd9]'
                    : product.stock > 0
                    ? 'bg-[#fffbeb] text-[#92400e] border border-[#fef3c7]'
                    : 'bg-[#fef2f2] text-[#991b1b] border border-[#fee2e2]'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out'}
              </span>

              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Link
                  href={`/products/${product.id}`}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('products_scroll_pos', window.scrollY.toString());
                      sessionStorage.setItem('last_viewed_product_id', product.id.toString());
                      sessionStorage.setItem('products_return_url', window.location.pathname + window.location.search);
                    }
                  }}
                  className="inline-flex items-center p-1.5 rounded-full text-2xs font-medium bg-[#f2f1ed] hover:bg-[#141413] text-[#383733] hover:text-[#ffffff] transition-all cursor-pointer"
                  title="View product details"
                >
                  <Eye className="h-3 w-3" />
                </Link>

                {onEditProduct && (
                  <button
                    type="button"
                    onClick={() => onEditProduct(product)}
                    aria-label={`Edit ${product.title}`}
                    className="inline-flex items-center p-1.5 rounded-full text-2xs font-medium bg-[#f2f1ed] hover:bg-[#141413] text-[#383733] hover:text-[#ffffff] transition-all cursor-pointer"
                    title="Edit product"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                )}

                {onDeleteProduct && (
                  <button
                    type="button"
                    onClick={() => onDeleteProduct(product)}
                    aria-label={`Delete ${product.title}`}
                    className="inline-flex items-center p-1.5 rounded-full text-2xs font-medium bg-[#fff5f5] hover:bg-[#fee2e2] text-[#dc2626] transition-all cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
