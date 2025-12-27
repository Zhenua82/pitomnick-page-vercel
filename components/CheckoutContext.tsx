"use client";

import { createContext, useContext } from "react";

type CheckoutContextType = {
  openCheckout: () => void;
};

export const CheckoutContext = createContext<CheckoutContextType | null>(null);

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
};
