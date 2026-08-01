import { describe, expect, it } from "vitest";

import {
  lookupSyllableVariants,
  syllableCountsForWord,
  stressForSyllableCount,
} from "./variants";

describe("variants lookup", () => {
  it("exposes fire 1-syl alt and keeps primary 2", () => {
    expect(syllableCountsForWord("fire")).toEqual(
      expect.arrayContaining([1, 2]),
    );
    const alts = lookupSyllableVariants("fire");
    expect(alts.some((a) => a.syllables === 1)).toBe(true);
    expect(stressForSyllableCount("fire", 2)?.length).toBe(2);
    expect(stressForSyllableCount("fire", 1)?.length).toBe(1);
  });

  it("exposes curated juliet 2-syl alt without changing citation primary", () => {
    expect(syllableCountsForWord("juliet")).toEqual(
      expect.arrayContaining([2, 3]),
    );
    const alts = lookupSyllableVariants("juliet");
    const two = alts.find((a) => a.syllables === 2);
    expect(two?.stress).toEqual([1, 0]);
  });
});
