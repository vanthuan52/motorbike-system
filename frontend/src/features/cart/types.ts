/**
 * Cart Feature — Type Definitions
 *
 * Defines the core data structures for the shopping cart.
 * CartItem represents a single line-item in the cart (product + color + quantity).
 */

export interface CartItem {
  /** Product ID from the catalog */
  productId: string;
  /** Selected color variant (nullable for products without color options) */
  color?: string;
  /** Number of units */
  quantity: number;
}

export interface AddToCartPayload {
  productId: string;
  color?: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  productId: string;
  color?: string;
  quantity: number;
}

export interface RemoveCartItemPayload {
  productId: string;
  color?: string;
}
