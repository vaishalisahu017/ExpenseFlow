import { useEffect, useState } from "react";

export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}
