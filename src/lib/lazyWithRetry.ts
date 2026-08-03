import { lazy, type ComponentType, type LazyExoticComponent } from "react";

type DefaultExport<T> = { default: T };

/** Retries a failed async factory once (or `retries` times) before rethrowing. */
export async function importWithRetry<T>(
  factory: () => Promise<T>,
  retries = 1,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await factory();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => {
          setTimeout(resolve, 300 * (attempt + 1));
        });
      }
    }
  }
  throw lastError;
}

/**
 * Like React.lazy, but retries a failed dynamic import once before surfacing
 * the error. Helps with flaky networks and briefly stale deploy hashes.
 */
/** Match React.lazy's ComponentType constraint so props-bearing sheets/tools type-check. */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<DefaultExport<T>>,
  retries = 1,
): LazyExoticComponent<T> {
  return lazy(() => importWithRetry(factory, retries));
}
