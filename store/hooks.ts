import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Использовать вместо обычного useDispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Использовать вместо обычного useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
