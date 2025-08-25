import { getCartModule, getProductModule, getInventoryModule } from './init';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
  category: string;
  rating?: number;
  reviewCount?: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  region: string;
}

export class ShopenupCartService {
  private cartModule!: Record<string, unknown>;
  private productModule!: Record<string, unknown>;
  private inventoryModule!: Record<string, unknown>;

  constructor() {
    this.initializeModules();
  }

  private async initializeModules() {
    try {
      this.cartModule = await getCartModule();
      this.productModule = await getProductModule();
      this.inventoryModule = await getInventoryModule();
    } catch (error) {
      console.error('Failed to initialize cart modules:', error);
    }
  }

  // Create a new cart
  async createCart(region: string = 'IN', currency: string = 'INR'): Promise<Cart> {
    try {
      const cartData = await this.cartModule.createCart({
        region,
        currency,
        items: []
      });

      return {
        id: cartData.id,
        items: [],
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        currency,
        region
      };
    } catch (error) {
      console.error('Failed to create cart:', error);
      throw error;
    }
  }

  // Get cart by ID
  async getCart(cartId: string): Promise<Cart> {
    try {
      const cartData = await this.cartModule.getCart(cartId);
      
      // Transform Shopenup cart items to our format
      const items: CartItem[] = await Promise.all(
        cartData.items.map(async (item: Record<string, unknown>) => {
          const product = await this.productModule.getProduct(item.productId);
          const stockStatus = await this.inventoryModule.checkStock(item.productId);
          
          return {
            id: item.id,
            productId: item.productId,
            name: product.title,
            price: item.unit_price,
            originalPrice: product.original_price,
            image: product.thumbnail || product.images?.[0] || '',
            quantity: item.quantity,
            inStock: stockStatus,
            category: product.type?.value || 'General',
            rating: product.rating,
            reviewCount: product.review_count
          };
        })
      );

      return {
        id: cartData.id,
        items,
        subtotal: cartData.subtotal,
        discount: cartData.discount_total,
        shipping: cartData.shipping_total,
        total: cartData.total,
        currency: cartData.currency_code,
        region: cartData.region_id
      };
    } catch (error) {
      console.error('Failed to get cart:', error);
      throw error;
    }
  }

  // Add item to cart
  async addToCart(cartId: string, productId: string, quantity: number = 1): Promise<Cart> {
    try {
      // Check stock availability
      const stockStatus = await this.inventoryModule.checkStock(productId);
      if (!stockStatus) {
        throw new Error('Product is out of stock');
      }

      // Add item to cart
      await this.cartModule.addToCart(cartId, {
        product_id: productId,
        quantity
      });

      // Return updated cart
      return this.getCart(cartId);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  }

  // Update cart item quantity
  async updateCartItem(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return this.removeFromCart(cartId, itemId);
      }

      await this.cartModule.updateCartItem(cartId, itemId, {
        quantity
      });

      return this.getCart(cartId);
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(cartId: string, itemId: string): Promise<Cart> {
    try {
      await this.cartModule.removeFromCart(cartId, itemId);
      return this.getCart(cartId);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  }

  // Clear cart
  async clearCart(cartId: string): Promise<Cart> {
    try {
      await this.cartModule.clearCart(cartId);
      return this.getCart(cartId);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }

  // Calculate cart totals
  async calculateTotals(cartId: string): Promise<{
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  }> {
    try {
      const cart = await this.getCart(cartId);
      
      // Calculate subtotal
      const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Calculate discount (from original prices)
      const discount = cart.items.reduce((sum, item) => {
        if (item.originalPrice) {
          return sum + ((item.originalPrice - item.price) * item.quantity);
        }
        return sum;
      }, 0);
      
      // Calculate shipping (free over ₹500)
      const shipping = subtotal > 500 ? 0 : 50;
      
      // Calculate total
      const total = subtotal + shipping;
      
      return {
        subtotal,
        discount,
        shipping,
        total
      };
    } catch (error) {
      console.error('Failed to calculate cart totals:', error);
      throw error;
    }
  }

  // Apply discount code
  async applyDiscount(cartId: string, discountCode: string): Promise<Cart> {
    try {
      await this.cartModule.applyDiscount(cartId, discountCode);
      return this.getCart(cartId);
    } catch (error) {
      console.error('Failed to apply discount:', error);
      throw error;
    }
  }

  // Remove discount code
  async removeDiscount(cartId: string): Promise<Cart> {
    try {
      await this.cartModule.removeDiscount(cartId);
      return this.getCart(cartId);
    } catch (error) {
      console.error('Failed to remove discount:', error);
      throw error;
    }
  }

  // Get cart count (for header badge)
  async getCartCount(cartId: string): Promise<number> {
    try {
      const cart = await this.getCart(cartId);
      return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
      console.error('Failed to get cart count:', error);
      return 0;
    }
  }

  // Check if cart is empty
  async isCartEmpty(cartId: string): Promise<boolean> {
    try {
      const cart = await this.getCart(cartId);
      return cart.items.length === 0;
    } catch (error) {
      console.error('Failed to check if cart is empty:', error);
      return true;
    }
  }

  // Get cart summary for checkout
  async getCartSummary(cartId: string): Promise<{
    itemCount: number;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    currency: string;
  }> {
    try {
      const cart = await this.getCart(cartId);
      const totals = await this.calculateTotals(cartId);
      
      return {
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
        currency: cart.currency
      };
    } catch (error) {
      console.error('Failed to get cart summary:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const cartService = new ShopenupCartService();
