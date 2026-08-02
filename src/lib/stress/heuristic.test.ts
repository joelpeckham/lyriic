import { describe, expect, it } from "vitest";
import {
  heuristicPrimaryIndex,
  heuristicStress,
  isWeakFunctionWord,
} from "./heuristic";

describe("isWeakFunctionWord", () => {
  it("covers articles, prepositions, and auxiliaries", () => {
    for (const w of ["a", "the", "of", "to", "and", "is", "have", "will"]) {
      expect(isWeakFunctionWord(w)).toBe(true);
    }
    expect(isWeakFunctionWord("poem")).toBe(false);
    expect(isWeakFunctionWord("love")).toBe(false);
  });
});

describe("heuristicStress", () => {
  it("leaves monosyllables unstressed", () => {
    expect(heuristicStress(1)).toEqual([0]);
  });

  it("defaults multi-syllable OOV to first-syllable stress", () => {
    expect(heuristicStress(3, "xyzzyfoo")).toEqual([1, 0, 0]);
  });

  it("puts -tion / -ic stress on the penult", () => {
    expect(heuristicPrimaryIndex("invention", 3)).toBe(1);
    expect(heuristicStress(3, "invention")).toEqual([0, 1, 0]);
    expect(heuristicPrimaryIndex("atomic", 3)).toBe(1);
    expect(heuristicStress(3, "atomic")).toEqual([0, 1, 0]);
  });

  it("puts -aic stress on the penult (no special exclusion)", () => {
    expect(heuristicPrimaryIndex("archaic", 3)).toBe(1);
    expect(heuristicStress(3, "archaic")).toEqual([0, 1, 0]);
    expect(heuristicPrimaryIndex("prosaic", 3)).toBe(1);
    expect(heuristicStress(3, "mosaic")).toEqual([0, 1, 0]);
  });

  it("puts -ity stress on the antepenult", () => {
    expect(heuristicPrimaryIndex("reality", 4)).toBe(1);
    expect(heuristicStress(4, "reality")).toEqual([0, 1, 0, 0]);
  });

  it("puts -graphy stress on the antepenult", () => {
    expect(heuristicPrimaryIndex("photography", 4)).toBe(1);
    expect(heuristicStress(4, "photography")).toEqual([0, 1, 0, 0]);
    expect(heuristicPrimaryIndex("geography", 4)).toBe(1);
  });

  it("keeps -ment stress on the first syllable", () => {
    expect(heuristicPrimaryIndex("basement", 2)).toBe(0);
    expect(heuristicStress(2, "basement")).toEqual([1, 0]);
  });

  it("does not force penult for first-stress -ious / -ics / -ion / -ial", () => {
    // Fall through to default first-syllable stress.
    expect(heuristicPrimaryIndex("curious", 3)).toBeNull();
    expect(heuristicStress(3, "curious")).toEqual([1, 0, 0]);
    expect(heuristicPrimaryIndex("politics", 3)).toBeNull();
    expect(heuristicStress(3, "politics")).toEqual([1, 0, 0]);
    expect(heuristicPrimaryIndex("champion", 3)).toBeNull();
    expect(heuristicStress(3, "champion")).toEqual([1, 0, 0]);
    expect(heuristicPrimaryIndex("indian", 3)).toBeNull();
    expect(heuristicStress(3, "indian")).toEqual([1, 0, 0]);
  });

  it("does not treat non-adverb -ly stems as first-stress morphology", () => {
    expect(heuristicPrimaryIndex("supply", 2)).toBeNull();
    expect(heuristicPrimaryIndex("assembly", 3)).toBeNull();
  });
});
