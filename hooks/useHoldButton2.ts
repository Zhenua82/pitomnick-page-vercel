// hooks/useHoldButton2.ts
import { useRef, useCallback } from "react";

export function useHoldButton2(delay = 500, interval = 80) {
  // useRef должен иметь начальное значение null
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const savedAction = useRef<(() => void) | null>(null);
  const start = useCallback(
    (action: () => void) => {
      savedAction.current = action;
      // Выполнить один раз сразу
      action();
      // Таймаут перед интервалом
      timeoutRef.current = window.setTimeout(() => {
        intervalRef.current = window.setInterval(() => {
          savedAction.current?.();
        }, interval);
      }, delay);
    },
    [delay, interval] // включаем все используемые переменные
  );
  const stop = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  return { start, stop };
}