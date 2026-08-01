import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { DEFAULT_PREFS, PREFS_STORAGE_KEY } from "@/lib/prefs";

import { PrefsProvider, usePrefs } from "./usePrefs";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
});

afterEach(() => {
  localStorage.removeItem(PREFS_STORAGE_KEY);
});

function wrapper({ children }: { children: ReactNode }) {
  return <PrefsProvider>{children}</PrefsProvider>;
}

describe("usePrefs", () => {
  it("throws outside PrefsProvider", () => {
    expect(() => renderHook(() => usePrefs())).toThrow(
      /usePrefs must be used within PrefsProvider/,
    );
  });

  it("applies sequential same-tick theme and contrast updates", () => {
    const { result } = renderHook(() => usePrefs(), { wrapper });

    expect(result.current.prefs).toEqual(DEFAULT_PREFS);

    act(() => {
      result.current.setTheme("dark");
      result.current.setContrast("more");
    });

    expect(result.current.prefs).toEqual({
      theme: "dark",
      contrast: "more",
      seenEditorHint: false,
    });
  });

  it("marks editor hint seen once", () => {
    const { result } = renderHook(() => usePrefs(), { wrapper });

    act(() => {
      result.current.markEditorHintSeen();
      result.current.markEditorHintSeen();
    });

    expect(result.current.prefs.seenEditorHint).toBe(true);
  });
});
