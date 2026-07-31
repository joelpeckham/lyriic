import { describe, expect, it } from "vitest";
import { countHeuristic } from "./heuristic";

describe("countHeuristic", () => {
  it("floors at 1 for vowelless strings", () => {
    expect(countHeuristic("rhythm")).toBeGreaterThanOrEqual(1);
    expect(countHeuristic("psst")).toBe(1);
  });

  it("counts contiguous vowel groups", () => {
    expect(countHeuristic("hi")).toBe(1);
    expect(countHeuristic("hihi")).toBe(2);
  });

  it("handles silent trailing e after strip", () => {
    // After stripping final e: "mak" → one vowel group
    expect(countHeuristic("make")).toBe(1);
  });

  it("counts -le after consonant as an extra beat (bottle-like)", () => {
    // Greg Fast AddSyl: ([^aeiouy])\1l$ or consonant+le via groups
    expect(countHeuristic("bottle")).toBeGreaterThanOrEqual(2);
  });

  it("returns 0 for empty", () => {
    expect(countHeuristic("")).toBe(0);
  });
});
