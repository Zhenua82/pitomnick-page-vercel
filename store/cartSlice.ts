import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  slug: string;
  title: string;
  age: string;
  price: number;
  photo: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const saveToLS = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

const loadFromLS = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("cart");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    restoreCart(state) {
      state.items = loadFromLS();
    },
    updateItemPrice(
      state,
      action: PayloadAction<{ slug: string; age: string; price: number }>
    ) {
      const item = state.items.find(
        (i) =>
          i.slug === action.payload.slug &&
          i.age === action.payload.age
      );

      if (item) {
        item.price = action.payload.price;
        saveToLS(state.items);
      }
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (i) => i.slug === action.payload.slug && i.age === action.payload.age
      );

      if (existing) {
        existing.quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      saveToLS(state.items);
    },

    updateQuantity(
      state,
      action: PayloadAction<{ slug: string; age: string; qty: number }>
    ) {
      const item = state.items.find(
        (i) => i.slug === action.payload.slug && i.age === action.payload.age
      );
      if (!item) return;

      item.quantity = Math.max(0, action.payload.qty);
      saveToLS(state.items);
    },

    removeItem(state, action: PayloadAction<{ slug: string; age: string }>) {
      state.items = state.items.filter(
        (i) => !(i.slug === action.payload.slug && i.age === action.payload.age)
      );
      saveToLS(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveToLS([]);
    },
  },
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  restoreCart,
  updateItemPrice,
} = cartSlice.actions;

export default cartSlice.reducer;
