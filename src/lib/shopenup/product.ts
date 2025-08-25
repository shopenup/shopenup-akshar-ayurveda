import { getProductModule, getInventoryModule } from './init';
import { sdk } from '@lib/config';

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  thumbnail?: string;
  category: string;
  type?: {
    value: string;
    label: string;
  };
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  variants?: ProductVariant[];
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  inventoryQuantity: number;
  options: Record<string, string>;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  count: number;
  parentId?: string;
  children?: ProductCategory[];
}

export interface ProductCollection {
  id: string;
  title: string;
  description?: string;
  image?: string;
  products: Product[];
}

export interface ProductFilter {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  rating?: number;
  tags?: string[];
  search?: string;
}

export interface ProductSearchParams {
  q?: string;
  category?: string;
  collection?: string;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  rating?: number;
  sortBy?: 'price' | 'name' | 'rating' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class ShopenupProductService {
  private productModule!: Record<string, unknown>;
  private inventoryModule!: Record<string, unknown>;

  constructor() {
    this.initializeModules();
  }

  private async initializeModules() {
    try {
      this.productModule = await getProductModule();
      this.inventoryModule = await getInventoryModule();
    } catch (error) {
      console.error('Failed to initialize product modules:', error);
    }
  }

  // Get all products with optional filtering
  async getProducts(params?: ProductSearchParams): Promise<Product[]> {
    try {
      const query: any = {
        ...(params?.q && { q: params.q }),
        ...(params?.category && { category_id: params.category }),
        ...(params?.collection && { collection_id: params.collection }),
        ...(params?.tags && { tags: params.tags.join(',') }),
        ...(params?.priceMin && { price_min: params.priceMin }),
        ...(params?.priceMax && { price_max: params.priceMax }),
        ...(params?.inStock !== undefined && { in_stock: params.inStock }),
        ...(params?.rating && { rating: params.rating }),
        ...(params?.sortBy && { sort_by: params.sortBy }),
        ...(params?.sortOrder && { sort_order: params.sortOrder }),
        limit: params?.limit || 50,
        offset: params?.offset || 0,
      };
      const response = await sdk.client.fetch<{ products: any[] }>(
        '/store/products',
        {
          query,
          next: { tags: ['products'] },
          cache: 'force-cache',
        }
      );
      return (response.products || []).map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.original_price,
        images: product.images || [],
        thumbnail: product.thumbnail,
        category: product.type?.value || 'General',
        type: product.type,
        rating: product.rating,
        reviewCount: product.review_count,
        inStock: product.in_stock,
        variants: product.variants,
        tags: product.tags,
        metadata: product.metadata,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      }));
    } catch (error) {
      console.error('Failed to get products:', error);
      throw error;
    }
  }
  // async getProducts(params?: ProductSearchParams): Promise<Product[]> {
  //   try {
  //     // Check if product module is available
  //     if (!this.productModule || !this.productModule.listProducts) {
  //       console.warn('Product module not available, returning empty array');
  //       return [];
  //     }

  //     const searchParams = {
  //       q: params?.q,
  //       category_id: params?.category,
  //       collection_id: params?.collection,
  //       tags: params?.tags,
  //       price_min: params?.priceMin,
  //       price_max: params?.priceMax,
  //       in_stock: params?.inStock,
  //       rating: params?.rating,
  //       sort_by: params?.sortBy,
  //       sort_order: params?.sortOrder,
  //       limit: params?.limit || 50,
  //       offset: params?.offset || 0
  //     };

  //     const products = await this.productModule.listProducts(searchParams);
      
  //     // Transform Shopenup products to our format
  //     const transformedProducts: Product[] = await Promise.all(
  //       products.map(async (product: Record<string, unknown>) => {
  //         const stockStatus = await this.inventoryModule.checkStock(product.id as string);
          
  //         return {
  //           id: product.id as string,
  //           title: product.title as string,
  //           description: product.description as string,
  //           price: product.price as number,
  //           originalPrice: product.original_price as number,
  //           images: product.images as string[] || [],
  //           thumbnail: product.thumbnail as string,
  //           category: product.type?.value as string || 'General',
  //           type: product.type as { value: string; label: string },
  //           rating: product.rating as number,
  //           reviewCount: product.review_count as number,
  //           inStock: stockStatus as boolean,
  //           variants: product.variants as ProductVariant[],
  //           tags: product.tags as string[],
  //           metadata: product.metadata as Record<string, unknown>,
  //           createdAt: product.created_at as string,
  //           updatedAt: product.updated_at as string
  //         };
  //       })
  //     );

  //     return transformedProducts;
  //   } catch (error) {
  //     console.error('Failed to get products:', error);
  //     throw error;
  //   }
  // }

  // Get product by ID
  async getProduct(productId: string): Promise<Product> {
    try {
      const response = await sdk.client.fetch<{ product: any }>(`/store/products/${productId}`, {
        next: { tags: ['products'] },
        cache: 'force-cache',
      });
      const product = response.product;
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.original_price,
        images: product.images || [],
        thumbnail: product.thumbnail,
        category: product.type?.value || 'General',
        type: product.type,
        rating: product.rating,
        reviewCount: product.review_count,
        inStock: product.in_stock,
        variants: product.variants,
        tags: product.tags,
        metadata: product.metadata,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      };
    } catch (error) {
      console.error('Failed to get product:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId: string, params?: ProductSearchParams): Promise<Product[]> {
    return this.getProducts({ ...params, category: categoryId });
  }

  // Get products by collection
  async getProductsByCollection(collectionId: string, params?: ProductSearchParams): Promise<Product[]> {
    return this.getProducts({ ...params, collection: collectionId });
  }

  // Search products
  async searchProducts(query: string, params?: ProductSearchParams): Promise<Product[]> {
    try {
      return this.getProducts({
        ...params,
        q: query
      });
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  }

  // Get new arrivals
  async getNewArrivals(limit: number = 8): Promise<Product[]> {
    try {
      return this.getProducts({
        sortBy: 'created_at',
        sortOrder: 'desc',
        limit
      });
    } catch (error) {
      console.error('Failed to get new arrivals:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      return this.getProducts({
        tags: ['featured'],
        limit
      });
    } catch (error) {
      console.error('Failed to get featured products:', error);
      throw error;
    }
  }

  // Get products on sale
  async getProductsOnSale(limit: number = 8): Promise<Product[]> {
    try {
      const products = await this.getProducts({ limit });
      return products.filter(product => product.originalPrice && product.originalPrice > product.price);
    } catch (error) {
      console.error('Failed to get products on sale:', error);
      throw error;
    }
  }

  // Get all categories
  async getCategories(): Promise<ProductCategory[]> {
    try {
      const response = await sdk.client.fetch<{ product_categories: any[] }>(
        '/store/product-categories',
        {
          query: {},
          next: { tags: ['categories'] },
          cache: 'force-cache',
        }
      );
      return (response.product_categories || []).map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
        count: category.product_count,
        parentId: category.parent_id,
        children: category.children,
      }));
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw error;
    }
  }

  // Get category by ID
  async getCategory(categoryId: string): Promise<ProductCategory> {
    try {
      const response = await sdk.client.fetch<{ product_category: any }>(
        `/store/product-categories/${categoryId}`,
        {
          next: { tags: ['categories'] },
          cache: 'force-cache',
        }
      );
      const category = response.product_category;
      return {
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
        count: category.product_count,
        parentId: category.parent_id,
        children: category.children,
      };
    } catch (error) {
      console.error('Failed to get category:', error);
      throw error;
    }
  }

  // Get all collections
  async getCollections(): Promise<ProductCollection[]> {
    try {
      const response = await sdk.client.fetch<{ product_collections: any[] }>(
        '/store/collections',
        {
          query: {},
          next: { tags: ['collections'] },
          cache: 'force-cache',
        }
      );
      return (response.product_collections || []).map((collection: any) => ({
        id: collection.id,
        title: collection.title,
        description: collection.description,
        image: collection.image,
        products: [], // You can fetch products for each collection if needed
      }));
    } catch (error) {
      console.error('Failed to get collections:', error);
      throw error;
    }
  }

  // Get collection by ID
  async getCollection(collectionId: string): Promise<ProductCollection> {
    try {
      const response = await sdk.client.fetch<{ product_collection: any }>(
        `/store/collections/${collectionId}`,
        {
          next: { tags: ['collections'] },
          cache: 'force-cache',
        }
      );
      const collection = response.product_collection;
      return {
        id: collection.id,
        title: collection.title,
        description: collection.description,
        image: collection.image,
        products: [], // You can fetch products for this collection if needed
      };
    } catch (error) {
      console.error('Failed to get collection:', error);
      throw error;
    }
  }

  // Get product recommendations
  async getProductRecommendations(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      const response = await sdk.client.fetch<{ products: any[] }>(
        `/store/products/${productId}/recommendations`,
        {
          query: { limit },
          next: { tags: ['products'] },
          cache: 'force-cache',
        }
      );
      return (response.products || []).map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.original_price,
        images: product.images || [],
        thumbnail: product.thumbnail,
        category: product.type?.value || 'General',
        type: product.type,
        rating: product.rating,
        reviewCount: product.review_count,
        inStock: product.in_stock,
        variants: product.variants,
        tags: product.tags,
        metadata: product.metadata,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      }));
    } catch (error) {
      console.error('Failed to get product recommendations:', error);
      throw error;
    }
  }

  // Get product inventory
  async getProductInventory(productId: string): Promise<{
    inStock: boolean;
    quantity: number;
    lowStockThreshold: number;
  }> {
    try {
      const response = await sdk.client.fetch<{ inventory: any }>(
        `/store/products/${productId}/inventory`,
        {
          next: { tags: ['products'] },
          cache: 'force-cache',
        }
      );
      const inventory = response.inventory;
      return {
        inStock: inventory.in_stock,
        quantity: inventory.quantity,
        lowStockThreshold: inventory.low_stock_threshold,
      };
    } catch (error) {
      console.error('Failed to get product inventory:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const productService = new ShopenupProductService();
