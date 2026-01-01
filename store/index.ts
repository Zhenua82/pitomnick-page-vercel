// import { configureStore } from '@reduxjs/toolkit';
// import cartReducer from './cartSlice';

// export const store = configureStore({
//   reducer: {
//     cart: cartReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore } from "@reduxjs/toolkit";
import plantsReducer from "./plantsSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    plants: plantsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
