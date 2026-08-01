import { describe, expect, it } from "vitest";

import {
  isValidStressOverride,
  normalizeStressOverridesRecord,
} from "./overrides";

describe("stress overrides", () => {
  it("accepts non-negative integers", () => {
    expect(isValidStressOverride(0)).toBe(true);
    expect(isValidStressOverride(3)).toBe(true);
    expect(isValidStressOverride(-1)).toBe(false);
    expect(isValidStressOverride(1.5)).toBe(false);
    expect(isValidStressOverride("1")).toBe(false);
  });

  it("normalizes keys and drops invalid values", () => {
    expect(
      normalizeStressOverridesRecord({
        Poem: 1,
        "": 0,
        bad: -1,
        ok: 2.0,
      }),
    ).toEqual({ poem: 1, ok: 2 });
  });
});
