import { describe, expect, it } from "vitest";

import {
  buildStressFromFeet,
  fillStressForSyllables,
  stressPatternsForCycle,
  syllablesPerFoot,
} from "./feet";

describe("feet", () => {
  it("builds iambic pentameter as ten alternating beats", () => {
    expect(buildStressFromFeet("iamb", 5)).toEqual([
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    ]);
    expect(syllablesPerFoot("iamb")).toBe(2);
  });

  it("fills and truncates a foot to an odd syllable count", () => {
    expect(fillStressForSyllables("iamb", 7)).toEqual([0, 1, 0, 1, 0, 1, 0]);
    expect(fillStressForSyllables("anapest", 5)).toEqual([0, 0, 1, 0, 0]);
  });

  it("builds stress cycles for custom patterns", () => {
    expect(stressPatternsForCycle("none", [8, 6])).toBeUndefined();
    expect(stressPatternsForCycle("iamb", [8, 6])).toEqual([
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1],
    ]);
  });
});
