import { describe, expect, it } from "vitest";

import {
  isMeterCatalogId,
  isStressAwareMeterConfig,
  listFormCheckerMeters,
  listMeterCatalogByGroup,
  METER_CATALOG,
  METER_GROUP_LABELS,
  resolveMeterConfig,
  rhymeSchemesForMeter,
  stressExplainerIdForEntry,
} from "./presets";

describe("METER_CATALOG", () => {
  it("has unique ids", () => {
    const ids = METER_CATALOG.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps stress pattern lengths aligned with syllable targets", () => {
    for (const entry of METER_CATALOG) {
      if (!entry.stressPatterns?.length) continue;
      expect(entry.stressPatterns.length).toBe(entry.pattern.length);
      for (let i = 0; i < entry.pattern.length; i++) {
        expect(entry.stressPatterns[i]?.length).toBe(entry.pattern[i]);
      }
    }
  });

  it("includes core legacy meters", () => {
    for (const id of [
      "none",
      "haiku",
      "iambic-pentameter",
      "common-meter",
      "custom",
    ]) {
      expect(isMeterCatalogId(id)).toBe(true);
    }
  });

  it("uses trochaic contour for 8s & 7s", () => {
    const entry = METER_CATALOG.find((e) => e.id === "eights-and-sevens");
    expect(entry?.stressPatterns?.[0]).toEqual([1, 0, 1, 0, 1, 0, 1, 0]);
    expect(entry?.stressPatterns?.[1]).toEqual([1, 0, 1, 0, 1, 0, 1]);
    expect(entry?.footId).toBe("trochee");
  });

  it("tags stress-aware form checkers with footId and stress explainer ids", () => {
    const forms = listFormCheckerMeters();
    expect(forms.length).toBeGreaterThanOrEqual(28);
    for (const entry of forms) {
      if (entry.stressPatterns?.length) {
        expect(entry.footId).toBeTruthy();
        expect(stressExplainerIdForEntry(entry)).toMatch(/^[a-z]+-/);
      } else {
        expect(stressExplainerIdForEntry(entry)).toBeNull();
      }
    }
    expect(stressExplainerIdForEntry(getEntry("iambic-pentameter"))).toBe(
      "iamb-5",
    );
    expect(stressExplainerIdForEntry(getEntry("common-meter"))).toBe(
      "iamb-8-6",
    );
    expect(getEntry("short-meter").pattern).toEqual([6, 6, 8, 6]);
    expect(stressExplainerIdForEntry(getEntry("short-meter"))).toBe(
      "iamb-6-6-8-6",
    );
  });
});

function getEntry(id: string) {
  return METER_CATALOG.find((entry) => entry.id === id)!;
}

describe("listMeterCatalogByGroup", () => {
  it("puts None and Custom under General with no trailing Custom group", () => {
    const groups = listMeterCatalogByGroup();
    expect(groups.map((g) => g.group)).toEqual([
      "free",
      "accentual",
      "ballad",
      "syllable",
    ]);
    expect(METER_GROUP_LABELS.free).toBe("General");
    const general = groups[0]!;
    expect(general.label).toBe("General");
    expect(general.entries.map((e) => e.id)).toEqual(["none", "custom"]);
  });
});

describe("resolveMeterConfig", () => {
  it("resolves catalog meters", () => {
    const haiku = resolveMeterConfig({
      meter: "haiku",
      customPattern: [8],
      customFoot: "none",
    });
    expect(haiku.pattern).toEqual([5, 7, 5]);
    expect(haiku.stanzaLines).toBe(3);
    expect(isStressAwareMeterConfig(haiku)).toBe(false);
  });

  it("resolves custom syllable + foot combinations", () => {
    const custom = resolveMeterConfig({
      meter: "custom",
      customPattern: [5, 7, 5],
      customFoot: "trochee",
    });
    expect(custom.pattern).toEqual([5, 7, 5]);
    expect(custom.stressPatterns?.[0]).toEqual([1, 0, 1, 0, 1]);
    expect(isStressAwareMeterConfig(custom)).toBe(true);
    expect(custom.rhymeSchemes).toBeUndefined();
  });

  it("includes custom rhyme schemes when a pattern is set", () => {
    const custom = resolveMeterConfig({
      meter: "custom",
      customPattern: [8],
      customFoot: "none",
      customRhymePattern: "ABAB",
    });
    expect(custom.rhymeSchemes).toEqual([
      { id: "custom", label: "Custom", pattern: "ABAB" },
    ]);
    expect(rhymeSchemesForMeter("custom", "ABAB")).toEqual(
      custom.rhymeSchemes,
    );
    expect(rhymeSchemesForMeter("custom", "")).toEqual([]);
  });

  it("falls back to none for unknown ids", () => {
    const config = resolveMeterConfig({
      meter: "not-a-real-meter",
      customPattern: [8],
      customFoot: "none",
    });
    expect(config.id).toBe("none");
    expect(config.pattern).toEqual([]);
  });
});
