import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
// import { supabaseServer } from '@/lib/supabaseServer';

/* =========================
   TYPES
========================= */

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
  loading: boolean;
};

const initialState: CartState = {
  items: [],
  loading: false,
};

/* =========================
   LOCAL STORAGE
========================= */

const saveToLS = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
  }
};

const loadFromLS = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem('cart');
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/* =========================
   ASYNC: UPDATE PRICES FROM DB
========================= */

// export const restoreCartFromDB = createAsyncThunk<CartItem[]>(
//   'cart/restoreFromDB',
//   async () => {
//     const stored = loadFromLS();
//     if (stored.length === 0) return [];

//     const slugs = [...new Set(stored.map(i => i.slug))];

//     const { data, error } = await supabaseServer
//       .from('plants')
//       .select(`
//         id,
//         slug,
//         title,
//         plant_variants (
//           age,
//           price,
//           photo
//         )
//       `)
//       .in('slug', slugs);

//     if (error || !data) {
//       console.error('Ошибка загрузки корзины:', error);
//       return stored;
//     }

//     return stored.map(item => {
//       const plant = data.find(p => p.slug === item.slug);
//       if (!plant) return item;

//       const variant = plant.plant_variants?.find(
//         (v: any) => v.age === item.age
//       );

//       if (!variant) return item;

//       const parsedPrice = parseInt(
//         String(variant.price).replace(/\D/g, ''),
//         10
//       );

//       return {
//         ...item,
//         title: plant.title,
//         photo: variant.photo ?? item.photo,
//         price: isNaN(parsedPrice) ? item.price : parsedPrice,
//       };
//     });
//   }
// );

/* =========================
   SLICE
========================= */

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    restoreCart(state) {
      state.items = loadFromLS();
    },

    addItem(state, action: PayloadAction<CartItem>) {
      const { slug, age, quantity } = action.payload;

      const existing = state.items.find(
        i => i.slug === slug && i.age === age
      );

      if (existing) {
        existing.quantity = quantity;
      } else {
        state.items.push(action.payload);
      }

      saveToLS(state.items);
    },

    updateQuantity(
      state,
      action: PayloadAction<{ slug: string; age: string; qty: number }>
    ) {
      const { slug, age, qty } = action.payload;

      const item = state.items.find(
        i => i.slug === slug && i.age === age
      );
      if (!item) return;

      item.quantity = Math.max(0, Math.min(1000, qty));
      saveToLS(state.items);
    },

    removeItem(
      state,
      action: PayloadAction<{ slug: string; age: string }>
    ) {
      state.items = state.items.filter(
        i => !(i.slug === action.payload.slug && i.age === action.payload.age)
      );
      saveToLS(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveToLS([]);
    },
  },

  // extraReducers: builder => {
  //   builder
  //     .addCase(restoreCartFromDB.pending, state => {
  //       state.loading = true;
  //     })
  //     .addCase(restoreCartFromDB.fulfilled, (state, action) => {
  //       state.items = action.payload;
  //       state.loading = false;
  //       saveToLS(state.items);
  //     })
  //     .addCase(restoreCartFromDB.rejected, state => {
  //       state.loading = false;
  //     });
  // },
});

/* =========================
   EXPORTS
========================= */

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  restoreCart,
} = cartSlice.actions;

export default cartSlice.reducer;
