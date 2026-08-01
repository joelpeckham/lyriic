import { describe, expect, it } from "vitest";

import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  parseCustomPattern,
  settingsForMeter,
} from "./settings";

describe("normalizeSettings", () => {
  it("migrates legacy customSyllables to customPattern", () => {
    const next = normalizeSettings({
      meter: "custom",
      customSyllables: 12,
      showCounts: true,
    });
    expect(next.customPattern).toEqual([12]);
    expect(next.customFoot).toBe("none");
    expect(next.meter).toBe("custom");
  });

  it("keeps known catalog meters and drops unknown ones", () => {
    expect(normalizeSettings({ meter: "tanka" }).meter).toBe("tanka");
    expect(normalizeSettings({ meter: "bogus" }).meter).toBe(
      DEFAULT_SETTINGS.meter,
    );
  });

  it("clamps custom pattern values", () => {
    const next = normalizeSettings({
      meter: "custom",
      customPattern: [0, 99, 7],
    });
    expect(next.customPattern).toEqual([1, 20, 7]);
  });
});

describe("parseCustomPattern", () => {
  it("parses comma and slash cycles", () => {
    expect(parseCustomPattern("5, 7, 5")).toEqual([5, 7, 5]);
    expect(parseCustomPattern("8/6")).toEqual([8, 6]);
  });

  it("rejects empty input", () => {
    expect(parseCustomPattern("")).toBeNull();
    expect(parseCustomPattern("  ,  ")).toBeNull();
  });
});

describe("settingsForMeter", () => {
  it("seeds overlays for stress-aware meters", () => {
    const next = settingsForMeter("iambic-pentameter");
    expect(next?.meter).toBe("iambic-pentameter");
    expect(next?.showCounts).toBe(true);
    expect(next?.showRulers).toBe(true);
    expect(next?.showMeterBreaks).toBe(true);
    expect(next?.showStress).toBe(false);
  });

  it("seeds syllable forms without meter breaks", () => {
    const next = settingsForMeter("haiku");
    expect(next?.showRulers).toBe(true);
    expect(next?.showMeterBreaks).toBe(false);
  });

  it("rejects custom and unknown ids", () => {
    expect(settingsForMeter("custom")).toBeNull();
    expect(settingsForMeter("nope")).toBeNull();
  });
});
