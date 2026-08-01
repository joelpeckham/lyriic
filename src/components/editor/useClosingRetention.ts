import { useState } from "react";

/**
 * Keep the last non-null value while a controlled popover/dialog closes so
 * exit animations still have an anchor and stable content (avoids a (0,0) flash).
 */
export function useClosingRetention<T>(value: T | null): T | null {
  const [retained, setRetained] = useState<T | null>(value);
  if (value !== null && !Object.is(value, retained)) {
    setRetained(value);
  }
  return value ?? retained;
}
