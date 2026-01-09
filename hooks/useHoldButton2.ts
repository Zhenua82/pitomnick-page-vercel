import { useCallback, useRef } from "react";

// hooks/useHoldButton2.ts
export function useHoldButton2(delay = 400, interval = 80) {
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  const start = useCallback((action: () => void) => {
    if (activeRef.current) return;
    activeRef.current = true;

    action();

    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(action, interval);
    }, delay);
  }, [delay, interval]);

  const stop = useCallback(() => {
    activeRef.current = false;

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