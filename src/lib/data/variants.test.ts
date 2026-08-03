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
    // Citation primary wins when syllable count matches primary.
    expect(stressForSyllableCount("juliet", 3)?.length).toBe(3);
    expect(stressForSyllableCount("juliet", 2)).toEqual([1, 0]);
  });

  it("exposes curated heaven 1-syl poetic compression", () => {
    expect(syllableCountsForWord("heaven")).toEqual(
      expect.arrayContaining([1, 2]),
    );
    expect(
      lookupSyllableVariants("heaven").some((a) => a.syllables === 1),
    ).toBe(true);
    expect(stressForSyllableCount("heaven", 1)).toEqual([1]);
  });

  it("exposes curated dangerous / trivial / amorous compressions", () => {
    expect(syllableCountsForWord("dangerous")).toEqual(
      expect.arrayContaining([2, 3]),
    );
    expect(
      lookupSyllableVariants("dangerous").some((a) => a.syllables === 2),
    ).toBe(true);
    expect(stressForSyllableCount("dangerous", 2)).toEqual([1, 0]);
    expect(
      lookupSyllableVariants("trivial").some((a) => a.syllables === 2),
    ).toBe(true);
    expect(
      lookupSyllableVariants("amorous").some((a) => a.syllables === 2),
    ).toBe(true);
  });

  it("bridges apostrophe forms to citation lemma alts", () => {
    const fromBridge = lookupSyllableVariants("dang'rous");
    expect(fromBridge.some((a) => a.syllables === 2)).toBe(true);
    expect(fromBridge.some((a) => a.syllables === 3)).toBe(true);
    expect(
      lookupSyllableVariants("am'rous").some((a) => a.syllables === 2),
    ).toBe(true);
    // Helpers must bridge when the surface form is absent from the lexicon.
    expect(syllableCountsForWord("dang'rous")).toEqual(
      expect.arrayContaining([2, 3]),
    );
    expect(stressForSyllableCount("dang'rous", 2)).toEqual([1, 0]);
    expect(syllableCountsForWord("am'rous")).toEqual(
      expect.arrayContaining([2]),
    );
    // Curly apostrophe normalizes to the same bridge key.
    expect(syllableCountsForWord("dang\u2019rous")).toEqual(
      expect.arrayContaining([2, 3]),
    );
  });

  it("exposes pierian same-syllable stress alt for meter-fit", () => {
    const alts = lookupSyllableVariants("pierian");
    expect(alts.some((a) => a.syllables === 3 && a.stress.join(",") === "0,1,0")).toBe(
      true,
    );
  });

  it("uses teaching overrides for o'er and ev'ry", () => {
    expect(syllableCountsForWord("o'er")).toEqual(
      expect.arrayContaining([1]),
    );
    expect(stressForSyllableCount("o'er", 1)).toEqual([1]);
    expect(stressForSyllableCount("ev'ry", 2)).toEqual([1, 0]);
  });
});
