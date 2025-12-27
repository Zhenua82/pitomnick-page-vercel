import { useRef } from "react";

export function useHoldButton(delay = 500, interval = 100) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = (action: () => void) => {
    // обычный клик
    action();

    // запуск долгого удержания
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        action();
      }, interval);
    }, delay);
  };

  const stop = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    timeoutRef.current = null;
    intervalRef.current = null;
  };

  return {
    start,
    stop,
  };
}
