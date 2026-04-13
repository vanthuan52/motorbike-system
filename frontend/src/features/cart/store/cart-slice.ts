import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  CartItem,
  AddToCartPayload,
  UpdateCartItemPayload,
  RemoveCartItemPayload,
} from "../types";

/* ── Helpers ── */

/** Unique key for matching cart items by productId + color */
const matchItem = (a: CartItem, b: { productId: string; color?: string }) =>
  a.productId === b.productId && a.color === b.color;

/* ── State ── */

interface CartState {
  items: CartItem[];
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
};

/** Recalculate the total item count */
const recalcTotal = (state: CartState) => {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
};

/* ── Slice ── */

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Add a product to the cart.
     * If the same product+color already exists, increment its quantity.
     */
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const { productId, color, quantity } = action.payload;
      const existing = state.items.find((i) => matchItem(i, { productId, color }));

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, color, quantity });
      }
      recalcTotal(state);
    },

    /**
     * Set the exact quantity for a cart item.
     * Removes the item if quantity <= 0.
     */
    updateCartItem(state, action: PayloadAction<UpdateCartItemPayload>) {
      const { productId, color, quantity } = action.payload;
      const existing = state.items.find((i) => matchItem(i, { productId, color }));

      if (existing) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => !matchItem(i, { productId, color }));
        } else {
          existing.quantity = quantity;
        }
      }
      recalcTotal(state);
    },

    /**
     * Increment item quantity by 1.
     */
    incrementItem(state, action: PayloadAction<RemoveCartItemPayload>) {
      const { productId, color } = action.payload;
      const existing = state.items.find((i) => matchItem(i, { productId, color }));
      if (existing) {
        existing.quantity += 1;
      }
      recalcTotal(state);
    },

    /**
     * Decrement item quantity by 1 (min 1).
     */
    decrementItem(state, action: PayloadAction<RemoveCartItemPayload>) {
      const { productId, color } = action.payload;
      const existing = state.items.find((i) => matchItem(i, { productId, color }));
      if (existing && existing.quantity > 1) {
        existing.quantity -= 1;
      }
      recalcTotal(state);
    },

    /**
     * Remove a specific product+color from the cart entirely.
     */
    removeFromCart(state, action: PayloadAction<RemoveCartItemPayload>) {
      const { productId, color } = action.payload;
      state.items = state.items.filter((i) => !matchItem(i, { productId, color }));
      recalcTotal(state);
    },

    /**
     * Clear the entire cart.
     */
    clearCart(state) {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const cartActions = cartSlice.actions;

/**
 * @deprecated Use `cartActions.addToCart` instead.
 * Kept for backward compatibility during migration.
 */
export const {
  addToCart,
  removeFromCart,
  updateCartItem,
  incrementItem,
  decrementItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
