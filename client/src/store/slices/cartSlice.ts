import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem, Product } from '../../types';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  isDrawerOpen: boolean;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.cart = null;
      state.error = null;
    },
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    // Optimistic updates for better UX
    addItemOptimistic: (state, action: PayloadAction<{
      product: Product;
      quantity: number;
      variant?: any;
    }>) => {
      if (!state.cart) {
        state.cart = {
          _id: 'temp',
          user: 'temp',
          items: [],
          totalItems: 0,
          totalPrice: 0,
          estimatedTax: 0,
          estimatedShipping: 0,
          estimatedTotal: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      const { product, quantity, variant } = action.payload;
      const existingItemIndex = state.cart.items.findIndex(
        (item) =>
          item.product._id === product._id &&
          JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingItemIndex > -1) {
        state.cart.items[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          _id: Date.now().toString(),
          product,
          quantity,
          variant,
          price: product.price,
          addedAt: new Date().toISOString(),
        };
        state.cart.items.push(newItem);
      }

      // Recalculate totals
      state.cart.totalItems = state.cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.cart.totalPrice = state.cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      state.cart.estimatedTax = Math.round(state.cart.totalPrice * 0.08 * 100) / 100;
      state.cart.estimatedShipping = state.cart.totalPrice >= 50 ? 0 : 9.99;
      state.cart.estimatedTotal =
        state.cart.totalPrice + state.cart.estimatedTax + state.cart.estimatedShipping;
    },
    updateItemQuantityOptimistic: (state, action: PayloadAction<{
      itemId: string;
      quantity: number;
    }>) => {
      if (!state.cart) return;

      const { itemId, quantity } = action.payload;
      const itemIndex = state.cart.items.findIndex((item) => item._id === itemId);

      if (itemIndex > -1) {
        if (quantity <= 0) {
          state.cart.items.splice(itemIndex, 1);
        } else {
          state.cart.items[itemIndex].quantity = quantity;
        }

        // Recalculate totals
        state.cart.totalItems = state.cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.cart.totalPrice = state.cart.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        state.cart.estimatedTax = Math.round(state.cart.totalPrice * 0.08 * 100) / 100;
        state.cart.estimatedShipping = state.cart.totalPrice >= 50 ? 0 : 9.99;
        state.cart.estimatedTotal =
          state.cart.totalPrice + state.cart.estimatedTax + state.cart.estimatedShipping;
      }
    },
    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;

      const itemId = action.payload;
      const itemIndex = state.cart.items.findIndex((item) => item._id === itemId);

      if (itemIndex > -1) {
        state.cart.items.splice(itemIndex, 1);

        // Recalculate totals
        state.cart.totalItems = state.cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.cart.totalPrice = state.cart.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        state.cart.estimatedTax = Math.round(state.cart.totalPrice * 0.08 * 100) / 100;
        state.cart.estimatedShipping = state.cart.totalPrice >= 50 ? 0 : 9.99;
        state.cart.estimatedTotal =
          state.cart.totalPrice + state.cart.estimatedTax + state.cart.estimatedShipping;
      }
    },
    applyCouponOptimistic: (state, action: PayloadAction<{
      code: string;
      discount: number;
      discountType: 'percentage' | 'fixed';
    }>) => {
      if (!state.cart) return;

      state.cart.appliedCoupon = action.payload;

      // Recalculate total with discount
      let discount = 0;
      if (action.payload.discountType === 'percentage') {
        discount = Math.round(state.cart.totalPrice * (action.payload.discount / 100) * 100) / 100;
      } else {
        discount = action.payload.discount;
      }

      state.cart.estimatedTotal =
        state.cart.totalPrice + state.cart.estimatedTax + state.cart.estimatedShipping - discount;
      state.cart.estimatedTotal = Math.max(0, state.cart.estimatedTotal);
    },
    removeCouponOptimistic: (state) => {
      if (!state.cart) return;

      state.cart.appliedCoupon = undefined;
      state.cart.estimatedTotal =
        state.cart.totalPrice + state.cart.estimatedTax + state.cart.estimatedShipping;
    },
  },
});

export const {
  setCart,
  setLoading,
  setError,
  clearError,
  clearCart,
  toggleCartDrawer,
  openCartDrawer,
  closeCartDrawer,
  addItemOptimistic,
  updateItemQuantityOptimistic,
  removeItemOptimistic,
  applyCouponOptimistic,
  removeCouponOptimistic,
} = cartSlice.actions;

export default cartSlice.reducer;