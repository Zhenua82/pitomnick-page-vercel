import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//Обновление актуальной цены в корзине из хардкорд даных в data/plants.ts:
import { plants } from "../data/plants";

export type CartItem = {
  slug: string;       // ключ растения
  title: string;      // название
  age: string;        // 1 год / 2 года и т.д.
  price: number;      // цена
  photo: string;      // ссылка на фото
  quantity: number;   // количество
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

// сохранение корзины в localStorage
const saveToLS = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
  }
};

// восстановление корзины из localStorage
const loadFromLS = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('cart');

    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }
  return [];
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    //Обновление актуальной цены в корзине из хардкорд даных в data/plants.ts:
    restoreCart(state) {
      const loaded = loadFromLS();
      state.items = loaded.map((item) => {
        const plant = plants[item.slug];
        if (!plant) return item; // если растения уже нет — не трогаем
        const ageKey = item.age as keyof typeof plant.cena;
        const newPriceStr = plant.cena[ageKey];
        if (!newPriceStr) return item; // если цена для такого возраста не найдена — не трогаем
        // Преобразуем "700 рубл" → 700
        const parsed = parseInt(newPriceStr.replace(/\D/g, ""), 10);
        return {
          ...item,
          price: isNaN(parsed) ? item.price : parsed, // если цена корректная — обновляем
        };
      });
    },

    addItem: (state, action: PayloadAction<CartItem>) => {
    const { slug, age, quantity, title, photo, price } = action.payload;

    const existing = state.items.find(
        (it) => it.slug === slug && it.age === age
    );

    if (existing) {
        // existing.quantity += quantity; //добавление количества к уже имеющемуся
        existing.quantity = quantity; //замена количества
    } else {
        state.items.push({
        slug,
        age,
        quantity,
        title,
        photo,
        price, // тут уже число
        });
    }

    saveToLS(state.items);
    },


    updateQuantity(
      state,
      action: PayloadAction<{ slug: string; age: string; qty: number }>
    ) {
      const { slug, age, qty } = action.payload;

      const item = state.items.find((i) => i.slug === slug && i.age === age);
      if (!item) return;

      item.quantity = Math.max(0, Math.min(1000, qty));

      saveToLS(state.items);
    },

    removeItem(
      state,
      action: PayloadAction<{ slug: string; age: string }>
    ) {
      state.items = state.items.filter(
        (i) => !(i.slug === action.payload.slug && i.age === action.payload.age)
      );
      saveToLS(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveToLS(state.items);
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart, restoreCart } = cartSlice.actions;
export default cartSlice.reducer;
