import { describe, expect, it } from "vitest";

import {
  formatLiteraryFitLabel,
  formatMeterMatchLabel,
} from "./literaryFitLabel";

describe("formatLiteraryFitLabel", () => {
  it("labels non-ideal literary fits", () => {
    expect(formatLiteraryFitLabel("catalexis")).toBe("catalexis");
    expect(formatLiteraryFitLabel("feminine")).toBe("feminine ending");
    expect(formatLiteraryFitLabel("inversion")).toBe("inversion");
    expect(formatLiteraryFitLabel("ideal")).toBeNull();
    expect(formatLiteraryFitLabel(undefined)).toBeNull();
  });
});

describe("formatMeterMatchLabel", () => {
  it("shows Matches with optional fit", () => {
    expect(formatMeterMatchLabel("exact", "ideal", 0, false, 8)).toBe(
      "Matches",
    );
    expect(formatMeterMatchLabel("exact", "catalexis", -1, false, 8)).toBe(
      "Matches · catalexis",
    );
    expect(formatMeterMatchLabel("exact", "feminine", 1, false, 10)).toBe(
      "Matches · feminine ending",
    );
  });

  it("shows stress-off and deltas", () => {
    expect(formatMeterMatchLabel("stress", undefined, 0, false, 10)).toBe(
      "Stress off",
    );
    expect(formatMeterMatchLabel("over", undefined, 1, false, 10)).toBe("+1");
    expect(formatMeterMatchLabel("under", undefined, -2, false, 10)).toBe(
      "−2",
    );
    expect(formatMeterMatchLabel("none", undefined, -8, true, 8)).toBe(
      "Need 8",
    );
  });
});
