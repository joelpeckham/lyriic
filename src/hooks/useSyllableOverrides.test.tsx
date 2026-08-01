import { useState } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  clearAllOverrides,
  getOverride,
  getOverrides,
} from "@/lib/syllables";

import { useSyllableOverrides } from "./useSyllableOverrides";

afterEach(() => {
  clearAllOverrides();
});

describe("useSyllableOverrides", () => {
  it("replaces the engine Map after layout on mount (legacy bridge)", () => {
    // Editor counting threads overrides directly; this hook only syncs the
    // module Map for getOverride / setOverride callers.
    renderHook(() => useSyllableOverrides({ fire: 1 }));

    expect(getOverride("fire")).toBe(1);
    expect([...getOverrides().entries()]).toEqual([["fire", 1]]);
  });

  it("replaces the Map when switching project overrides", () => {
    const { rerender } = renderHook(
      ({ overrides }) => {
        useSyllableOverrides(overrides);
      },
      { initialProps: { overrides: { fire: 1 } as Record<string, number> } },
    );

    expect(getOverride("fire")).toBe(1);

    rerender({ overrides: { every: 2 } });

    expect(getOverride("fire")).toBeUndefined();
    expect(getOverride("every")).toBe(2);
  });

  it("syncs when setOverride-style project state changes", () => {
    const { result } = renderHook(() => {
      const [overrides, setOverrides] = useState<Record<string, number>>({});
      useSyllableOverrides(overrides);
      return { overrides, setOverrides };
    });

    expect(getOverrides().size).toBe(0);

    act(() => {
      result.current.setOverrides({ fire: 1, every: 2 });
    });

    expect(getOverride("fire")).toBe(1);
    expect(getOverride("every")).toBe(2);

    act(() => {
      result.current.setOverrides({});
    });

    expect(getOverrides().size).toBe(0);
  });
});
