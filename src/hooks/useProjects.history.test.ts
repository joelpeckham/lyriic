import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEY } from "@/lib/projects/storage";

import { AUTOSAVE_MS, useProjects } from "./useProjects";

function memoryLocalStorage() {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
    removeItem(key: string) {
      map.delete(key);
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
  };
}

describe("useProjects setText history modes", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryLocalStorage());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("clears history when one-arg setText changes the document", () => {
    const { result } = renderHook(() => useProjects());

    act(() => {
      result.current.setText("hello world", {
        done: [{ changes: [[11]] }],
        undone: [],
      });
    });
    act(() => {
      vi.advanceTimersByTime(AUTOSAVE_MS);
    });

    expect(result.current.active.text).toBe("hello world");
    expect(result.current.active.history).toEqual({
      done: [{ changes: [[11]] }],
      undone: [],
    });

    act(() => {
      // Omitting history must not keep a stack that predates the new text.
      result.current.setText("replaced");
    });

    expect(result.current.active.text).toBe("replaced");
    expect(result.current.active.history).toBeUndefined();
  });

  it("keeps history when one-arg setText retries with the same text", () => {
    const { result } = renderHook(() => useProjects());
    const history = { done: [{ changes: [[5]] }], undone: [] };

    act(() => {
      result.current.setText("hello", history);
    });
    act(() => {
      vi.advanceTimersByTime(AUTOSAVE_MS);
    });

    act(() => {
      result.current.setText("hello");
    });

    expect(result.current.active.text).toBe("hello");
    expect(result.current.active.history).toEqual(history);
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"hello"');
  });
});
