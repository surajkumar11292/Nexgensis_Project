import apiClient from './api';
import {
  Product,
  ProductCategory,
  ProductFilterParams,
  ProductFormData,
  ProductsApiResponse,
} from '@/types/product';
import { GenericAbortSignal } from 'axios';

export const productService = {
  /**
   * Fetch paginated products with optional sort parameters.
   * DummyJSON endpoint: GET /products
   */
  async getProducts(
    params: ProductFilterParams,
    signal?: GenericAbortSignal
  ): Promise<ProductsApiResponse> {
    const skip = (params.page - 1) * params.limit;
    const queryParams: Record<string, string | number> = {
      limit: params.limit,
      skip,
    };

    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
      queryParams.order = params.order || 'asc';
    }

    if (params.delay) {
      queryParams.delay = params.delay;
    }

    const response = await apiClient.get<ProductsApiResponse>('/products', {
      params: queryParams,
      signal,
    });

    return response.data;
  },

  /**
   * Search products by keyword with pagination and sort.
   * DummyJSON endpoint: GET /products/search?q=
   */
  async searchProducts(
    params: ProductFilterParams,
    signal?: GenericAbortSignal
  ): Promise<ProductsApiResponse> {
    const skip = (params.page - 1) * params.limit;
    const queryParams: Record<string, string | number> = {
      q: params.q || '',
      limit: params.limit,
      skip,
    };

    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
      queryParams.order = params.order || 'asc';
    }

    if (params.delay) {
      queryParams.delay = params.delay;
    }

    const response = await apiClient.get<ProductsApiResponse>('/products/search', {
      params: queryParams,
      signal,
    });

    return response.data;
  },

  /**
   * Filter products by category.
   * DummyJSON endpoint: GET /products/category/{category}
   */
  async getProductsByCategory(
    category: string,
    params: ProductFilterParams,
    signal?: GenericAbortSignal
  ): Promise<ProductsApiResponse> {
    const skip = (params.page - 1) * params.limit;
    const queryParams: Record<string, string | number> = {
      limit: params.limit,
      skip,
    };

    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
      queryParams.order = params.order || 'asc';
    }

    if (params.delay) {
      queryParams.delay = params.delay;
    }

    const response = await apiClient.get<ProductsApiResponse>(
      `/products/category/${encodeURIComponent(category)}`,
      {
        params: queryParams,
        signal,
      }
    );

    return response.data;
  },

  /**
   * Fetch all product categories.
   * DummyJSON endpoint: GET /products/categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    const response = await apiClient.get<ProductCategory[] | string[]>(
      '/products/categories'
    );
    const data = response.data;

    // Normalize response: DummyJSON returns either string[] or ProductCategory[] objects
    return data.map((item) => {
      if (typeof item === 'string') {
        return {
          slug: item,
          name: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' '),
          url: `https://dummyjson.com/products/category/${item}`,
        };
      }
      return item;
    });
  },

  /**
   * Fetch single product by ID.
   * DummyJSON endpoint: GET /products/{id}
   */
  async getProductById(id: number | string, signal?: GenericAbortSignal): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`, { signal });
    return response.data;
  },

  /**
   * Add a new product.
   * DummyJSON endpoint: POST /products/add
   */
  async addProduct(product: ProductFormData): Promise<Product> {
    const response = await apiClient.post<Product>('/products/add', product);
    return response.data;
  },

  /**
   * Update an existing product.
   * DummyJSON endpoint: PUT /products/{id}
   */
  async updateProduct(id: number, product: Partial<ProductFormData>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  /**
   * Delete a product.
   * DummyJSON endpoint: DELETE /products/{id}
   */
  async deleteProduct(id: number): Promise<Product> {
    const response = await apiClient.delete<Product>(`/products/${id}`);
    return response.data;
  },
};

export default productService;
