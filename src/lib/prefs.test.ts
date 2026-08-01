import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_PREFS,
  normalizePrefs,
  PREFS_STORAGE_KEY,
  resolveDark,
} from "./prefs";

describe("normalizePrefs", () => {
  it("fills defaults for empty input", () => {
    expect(normalizePrefs(undefined)).toEqual(DEFAULT_PREFS);
  });

  it("preserves valid fields", () => {
    expect(
      normalizePrefs({
        theme: "dark",
        contrast: "more",
        seenEditorHint: true,
      }),
    ).toEqual({
      theme: "dark",
      contrast: "more",
      seenEditorHint: true,
    });
  });

  it("falls back unknown values", () => {
    expect(normalizePrefs({ theme: "sepia", contrast: "max" })).toEqual(
      DEFAULT_PREFS,
    );
  });

  it("defaults seenEditorHint when missing", () => {
    expect(normalizePrefs({ theme: "light" }).seenEditorHint).toBe(false);
  });
});

describe("resolveDark", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("respects explicit theme", () => {
    expect(resolveDark("dark")).toBe(true);
    expect(resolveDark("light")).toBe(false);
  });

  it("follows system preference when theme is system", () => {
    vi.stubGlobal("window", {
      matchMedia: (query: string) => ({
        matches: query.includes("prefers-color-scheme: dark"),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
    expect(resolveDark("system")).toBe(true);
  });
});

describe("PREFS_STORAGE_KEY", () => {
  it("is stable", () => {
    expect(PREFS_STORAGE_KEY).toBe("lyriic.prefs.v1");
  });
});
