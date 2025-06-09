import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string | number;
  color?: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const exist = state.cartItems.find(
        (i) => i.id === item.id && i.color === item.color
      );
      if (exist) {
        exist.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }
    },
    deleteFromCart(state, action: PayloadAction<CartItem>) {
      state.cartItems = state.cartItems.filter(
        (i) => !(i.id === action.payload.id && i.color === action.payload.color)
      );
    },
    updateCartItem(
      state,
      action: PayloadAction<{ item: CartItem; newQuantity: number }>
    ) {
      const { item, newQuantity } = action.payload;
      const exist = state.cartItems.find(
        (i) => i.id === item.id && i.color === item.color
      );
      if (exist) {
        exist.quantity = newQuantity;
      }
    },
    clearCart(state) {
      state.cartItems = [];
    },
  },
});

export const { addToCart, deleteFromCart, updateCartItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
