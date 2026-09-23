export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images?: string[];
  thumbnail: string;
  // Flag indicating optimistic locally added product
  isLocal?: boolean;
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortField = 'price' | 'rating' | 'title' | '';
export type SortOrder = 'asc' | 'desc';

export interface ProductFilterParams {
  page: number;
  limit: number;
  q?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
  delay?: number; // Support for testing &delay=2000 per PDF
}

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating?: number;
  brand?: string;
  thumbnail?: string;
}
