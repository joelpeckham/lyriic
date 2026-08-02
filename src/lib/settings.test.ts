import { describe, expect, it } from "vitest";

import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  parseCustomPattern,
  parseCustomRhymePattern,
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
    expect(next.customRhymePattern).toBe("");
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

  it("normalizes custom rhyme patterns", () => {
    const next = normalizeSettings({
      meter: "custom",
      customRhymePattern: "ab ab",
    });
    expect(next.customRhymePattern).toBe("ABAB");
    expect(next.rhymeSchemeId).toBe("custom");
    expect(next.showRhymeScheme).toBe(true);
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

describe("parseCustomRhymePattern", () => {
  it("uppercases and strips separators", () => {
    expect(parseCustomRhymePattern("ab/ab")).toBe("ABAB");
    expect(parseCustomRhymePattern("a a b b a")).toBe("AABBA");
  });

  it("keeps X for unrhymed lines", () => {
    expect(parseCustomRhymePattern("axbx")).toBe("AXBX");
  });

  it("returns empty for blank or letterless input", () => {
    expect(parseCustomRhymePattern("")).toBe("");
    expect(parseCustomRhymePattern("  ,  ")).toBe("");
  });

  it("clamps length", () => {
    const long = "A".repeat(40);
    expect(parseCustomRhymePattern(long)).toHaveLength(32);
  });
});

describe("settingsForMeter", () => {
  it("seeds overlays for stress-aware meters", () => {
    const next = settingsForMeter("iambic-pentameter");
    expect(next?.meter).toBe("iambic-pentameter");
    expect(next?.showCounts).toBe(true);
    expect(next?.showRulers).toBe(true);
    expect(next?.showMeterBreaks).toBe(true);
    expect(next?.showStress).toBe(true);
    expect(next?.showRhymeScheme).toBe(false);
    expect(next?.rhymeSchemeId).toBeNull();
  });

  it("seeds syllable forms without meter breaks", () => {
    const next = settingsForMeter("haiku");
    expect(next?.showRulers).toBe(true);
    expect(next?.showMeterBreaks).toBe(false);
  });

  it("seeds rhyme scheme for sonnet", () => {
    const next = settingsForMeter("sonnet");
    expect(next?.rhymeSchemeId).toBe("shakespearean");
    expect(next?.showRhymeScheme).toBe(true);
  });

  it("rejects custom and unknown ids", () => {
    expect(settingsForMeter("custom")).toBeNull();
    expect(settingsForMeter("nope")).toBeNull();
  });
});

describe("normalizeSettings rhyme", () => {
  it("defaults rhymeSchemeId to first scheme for rhyming meters", () => {
    const next = normalizeSettings({ meter: "limerick" });
    expect(next.rhymeSchemeId).toBe("limerick");
    expect(next.showRhymeScheme).toBe(true);
  });

  it("keeps a valid named scheme", () => {
    const next = normalizeSettings({
      meter: "sonnet",
      rhymeSchemeId: "petrarchan",
      showRhymeScheme: false,
    });
    expect(next.rhymeSchemeId).toBe("petrarchan");
    expect(next.showRhymeScheme).toBe(false);
  });

  it("clears rhymeSchemeId for custom without a pattern", () => {
    const next = normalizeSettings({
      meter: "custom",
      rhymeSchemeId: "custom",
      customRhymePattern: "",
    });
    expect(next.rhymeSchemeId).toBeNull();
  });
});
