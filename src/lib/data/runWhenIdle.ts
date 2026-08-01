/**
 * Schedule work after the browser is idle (or after `timeout` ms).
 * Returns a cancel function.
 */
export function runWhenIdle(fn: () => void, timeout: number): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  if (typeof window.requestIdleCallback === "function") {
    const idleId = window.requestIdleCallback(fn, { timeout });
    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }
  const timeoutId = window.setTimeout(fn, timeout);
  return () => window.clearTimeout(timeoutId);
}
