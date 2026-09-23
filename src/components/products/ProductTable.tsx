'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, SortField, SortOrder } from '@/types/product';
import { ArrowUp, ArrowDown, ArrowUpDown, Star, Eye, Edit3, Trash2 } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  sortBy?: SortField;
  order?: SortOrder;
  onSortChange?: (field: SortField, order: SortOrder) => void;
  onViewProduct?: (productId: number) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

export default function ProductTable({
  products,
  sortBy,
  order,
  onSortChange,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductTableProps) {
  const handleSortToggle = (field: SortField) => {
    if (!onSortChange) return;
    if (sortBy === field) {
      onSortChange(field, order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-3 w-3 text-[#6e6d67] opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return order === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-[#141413] font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#141413] font-bold" />
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#e7e6e1] bg-[#ffffff] shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table">
          <thead>
            {/* Generous padding for breathable table hierarchy (fixes CRAMPED PADDING flag) */}
            <tr className="border-b border-[#e7e6e1] bg-[#f9f8f5] text-2xs font-semibold uppercase tracking-wider text-[#383733]">
              <th scope="col" className="py-4 pl-6 pr-4 w-18">
                Preview
              </th>

              {/* Title Header with Sort */}
              <th scope="col" className="py-4 px-5 min-w-[240px]">
                <button
                  type="button"
                  onClick={() => handleSortToggle('title')}
                  className="group inline-flex items-center gap-1.5 font-semibold text-[#383733] hover:text-[#141413] transition-colors cursor-pointer"
                >
                  <span>Product Title</span>
                  {renderSortIndicator('title')}
                </button>
              </th>

              {/* Category */}
              <th scope="col" className="py-4 px-5 min-w-[140px]">
                Category
              </th>

              {/* Price Header with Sort */}
              <th scope="col" className="py-4 px-5 min-w-[130px]">
                <button
                  type="button"
                  onClick={() => handleSortToggle('price')}
                  className="group inline-flex items-center gap-1.5 font-semibold text-[#383733] hover:text-[#141413] transition-colors cursor-pointer"
                >
                  <span>Price</span>
                  {renderSortIndicator('price')}
                </button>
              </th>

              {/* Rating Header with Sort */}
              <th scope="col" className="py-4 px-5 min-w-[120px]">
                <button
                  type="button"
                  onClick={() => handleSortToggle('rating')}
                  className="group inline-flex items-center gap-1.5 font-semibold text-[#383733] hover:text-[#141413] transition-colors cursor-pointer"
                >
                  <span>Rating</span>
                  {renderSortIndicator('rating')}
                </button>
              </th>

              {/* Stock Status */}
              <th scope="col" className="py-4 px-5 min-w-[130px]">
                Stock
              </th>

              {/* Actions */}
              <th scope="col" className="py-4 pl-5 pr-6 text-right min-w-[110px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f2f1ed] text-xs">
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => onViewProduct && onViewProduct(product.id)}
                className="group hover:bg-[#faf9f5] transition-colors cursor-pointer"
              >
                {/* Thumbnail Image (No hover scale to prevent image blur and satisfy Impeccable) */}
                <td className="py-4 pl-6 pr-4">
                  <div className="relative h-11 w-11 rounded-xl bg-[#f2f1ed] border border-[#e5e4de] overflow-hidden shrink-0">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        width={44}
                        height={44}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-3xs text-[#6e6d67]">
                        N/A
                      </div>
                    )}
                  </div>
                </td>

                {/* Title & Brand/Description with Semantic h2 */}
                <td className="py-4 px-5">
                  <div className="space-y-0.5 max-w-xs">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-semibold text-[#141413] group-hover:text-[#000000] transition-colors line-clamp-1">
                        {product.title}
                      </h2>
                      {product.isLocal && (
                        <span className="text-3xs px-1.5 py-0.2 rounded-full bg-[#fef3c7] text-[#92400e] font-semibold border border-[#fde68a] shrink-0">
                          Local
                        </span>
                      )}
                    </div>
                    <div className="text-2xs text-[#5a5954] line-clamp-1">
                      {product.brand ? (
                        <span className="font-medium text-[#383733]">{product.brand} · </span>
                      ) : null}
                      <span>{product.description}</span>
                    </div>
                  </div>
                </td>

                {/* Category Badge */}
                <td className="py-4 px-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-medium bg-[#f2f1ed] text-[#383733] border border-[#e5e4de] capitalize">
                    {product.category}
                  </span>
                </td>

                {/* Price with optional discount */}
                <td className="py-4 px-5">
                  <div className="flex flex-col">
                    <span className="font-bold tabular-nums text-[#141413]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discountPercentage && product.discountPercentage > 0 ? (
                      <span className="text-3xs font-medium text-[#059669]">
                        Save {Math.round(product.discountPercentage)}%
                      </span>
                    ) : null}
                  </div>
                </td>

                {/* Rating with Star */}
                <td className="py-4 px-5">
                  <div className="inline-flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-[#d97706] text-[#d97706]" />
                    <span className="font-semibold tabular-nums text-[#141413]">
                      {product.rating.toFixed(1)}
                    </span>
                    {product.reviews && product.reviews.length > 0 && (
                      <span className="text-3xs text-[#5a5954] tabular-nums">
                        ({product.reviews.length})
                      </span>
                    )}
                  </div>
                </td>

                {/* Stock Badge */}
                <td className="py-4 px-5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-medium ${
                      product.stock > 10
                        ? 'bg-[#edf7f2] text-[#0d6e49] border border-[#d2edd9]'
                        : product.stock > 0
                        ? 'bg-[#fffbeb] text-[#92400e] border border-[#fef3c7]'
                        : 'bg-[#fef2f2] text-[#991b1b] border border-[#fee2e2]'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                        product.stock > 10
                          ? 'bg-[#059669]'
                          : product.stock > 0
                          ? 'bg-[#d97706]'
                          : 'bg-[#dc2626]'
                      }`}
                    />
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </td>

                {/* Actions Column */}
                <td className="py-4 pl-5 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-medium bg-[#f0eee9] hover:bg-[#141413] text-[#383733] hover:text-[#ffffff] border border-[#e2e0da] transition-all cursor-pointer shadow-2xs active:scale-95"
                      title="View product details"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </Link>

                    {onEditProduct && (
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        aria-label={`Edit ${product.title}`}
                        className="inline-flex items-center p-1 rounded-full text-[#5a5954] hover:text-[#141413] hover:bg-[#edebe6] border border-[#e2e0da] transition-all cursor-pointer shadow-2xs active:scale-95"
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
                        className="inline-flex items-center p-1 rounded-full text-[#dc2626] hover:text-[#b91c1c] hover:bg-[#fee2e2] border border-[#fecaca] transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Delete product"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
