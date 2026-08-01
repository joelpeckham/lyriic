import { useState } from "react";

/**
 * Identity-keyed local UI state: when `identity` changes, the exposed value
 * falls back to `defaultValue` without an effect reset.
 */
export function useKeyedState<T>(
  identity: string,
  defaultValue: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<{ id: string; value: T }>({
    id: "",
    value: defaultValue,
  });
  const value = state.id === identity ? state.value : defaultValue;

  function setValue(next: T | ((prev: T) => T)): void {
    const resolved =
      typeof next === "function" ? (next as (prev: T) => T)(value) : next;
    setState({ id: identity, value: resolved });
  }

  return [value, setValue];
}
