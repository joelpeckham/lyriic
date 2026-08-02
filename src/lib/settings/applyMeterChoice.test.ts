import { describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS } from "@/lib/settings";

import { applyMeterChoice } from "./applyMeterChoice";

describe("applyMeterChoice", () => {
  it("leaves overlays alone when choosing free verse", () => {
    const prev = {
      ...DEFAULT_SETTINGS,
      showCounts: false,
      showStress: true,
    };
    const next = applyMeterChoice(prev, "none");
    expect(next.meter).toBe("none");
    expect(next.showCounts).toBe(false);
    expect(next.showStress).toBe(true);
  });

  it("enables stress overlays for stress-aware meters", () => {
    const next = applyMeterChoice(DEFAULT_SETTINGS, "iambic-pentameter");
    expect(next.showCounts).toBe(true);
    expect(next.showRulers).toBe(true);
    expect(next.showStress).toBe(true);
    expect(next.showMeterBreaks).toBe(true);
  });

  it("does not force stress on syllable-only meters", () => {
    const next = applyMeterChoice(DEFAULT_SETTINGS, "haiku");
    expect(next.showCounts).toBe(true);
    expect(next.showRulers).toBe(true);
    expect(next.showStress).toBe(false);
    expect(next.showMeterBreaks).toBe(false);
  });

  it("clears stress when switching from stress-aware to syllable form", () => {
    const prev = {
      ...DEFAULT_SETTINGS,
      showStress: true,
      showMeterBreaks: true,
    };
    const next = applyMeterChoice(prev, "haiku");
    expect(next.showStress).toBe(false);
    expect(next.showMeterBreaks).toBe(false);
  });
});
