import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  normalizeSettings,
} from "./settings";

describe("normalizeSettings", () => {
  it("fills defaults for empty input", () => {
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
  });

  it("preserves valid fields and clamps ranges", () => {
    expect(
      normalizeSettings({
        meter: "custom",
        showCounts: false,
        showRulers: true,
        customSyllables: 100,
        fontSize: 0.5,
      }),
    ).toEqual({
      meter: "custom",
      showCounts: false,
      showRulers: true,
      customSyllables: 20,
      fontSize: 1,
    });
  });

  it("falls back unknown meter ids", () => {
    expect(normalizeSettings({ meter: "trochee" }).meter).toBe("none");
  });
});
