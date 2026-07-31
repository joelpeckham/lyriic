import { describe, expect, it } from "vitest";
import {
  getMeterPreset,
  METER_PRESETS,
  targetForLine,
} from "./presets";

describe("targetForLine", () => {
  it("returns null for an empty pattern", () => {
    expect(targetForLine([], 0)).toBeNull();
    expect(targetForLine([], 3)).toBeNull();
  });

  it("returns the single target for a fixed pattern", () => {
    expect(targetForLine([10], 0)).toBe(10);
    expect(targetForLine([10], 4)).toBe(10);
  });

  it("cycles multi-line patterns", () => {
    const haiku = [5, 7, 5];
    expect(targetForLine(haiku, 0)).toBe(5);
    expect(targetForLine(haiku, 1)).toBe(7);
    expect(targetForLine(haiku, 2)).toBe(5);
    expect(targetForLine(haiku, 3)).toBe(5);
    expect(targetForLine(haiku, 4)).toBe(7);
  });

  it("cycles common meter 8 / 6", () => {
    const ballad = [8, 6];
    expect(targetForLine(ballad, 0)).toBe(8);
    expect(targetForLine(ballad, 1)).toBe(6);
    expect(targetForLine(ballad, 2)).toBe(8);
  });
});

describe("getMeterPreset", () => {
  it("resolves known presets", () => {
    expect(getMeterPreset("haiku").pattern).toEqual([5, 7, 5]);
    expect(getMeterPreset("iambic-pentameter").pattern).toEqual([10]);
    expect(getMeterPreset("common-meter").pattern).toEqual([8, 6]);
    expect(getMeterPreset("none").pattern).toEqual([]);
  });

  it("falls back to none for unknown ids", () => {
    expect(getMeterPreset("not-a-meter" as "none").id).toBe(
      METER_PRESETS[0].id,
    );
  });
});
