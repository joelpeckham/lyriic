import { describe, expect, it } from "vitest";

import { rankCandidates } from "./rankCandidates";

describe("rankCandidates", () => {
  it("sorts by syllable count ascending then alphabetically", () => {
    const ranked = rankCandidates({
      candidates: ["beautiful", "cat", "dog", "elephant"],
      tokenSyllables: 1,
      lineTotal: 5,
      lineTarget: null,
    });
    const words = ranked.map((r) => r.word);
    // 1-syllable first (cat, dog), then multi
    expect(words.indexOf("cat")).toBeLessThan(words.indexOf("beautiful"));
    expect(words.indexOf("dog")).toBeLessThan(words.indexOf("beautiful"));
    expect(ranked.every((r) => !r.keepsMeter)).toBe(true);
  });

  it("flags same-syllable and land-on-target candidates", () => {
    // line total 8, target 10, replacing 1-syllable word → need +2 to land
    const ranked = rankCandidates({
      candidates: ["cat", "silent", "fire"],
      tokenSyllables: 1,
      lineTotal: 8,
      lineTarget: 10,
      overrides: { fire: 1 },
    });

    const byWord = Object.fromEntries(ranked.map((r) => [r.word, r]));
    // cat: 1 syllable → preserves total → keepsMeter
    expect(byWord.cat.keepsMeter).toBe(true);
    // silent: typically 2 → newTotal 9 ≠ 10, not same as token → false
    // fire with override 1 → keeps
    expect(byWord.fire.keepsMeter).toBe(true);
  });

  it("lands on target with different syllable count", () => {
    // total 8, replace 1-syllable, target 10 → 2-syllable lands
    const ranked = rankCandidates({
      candidates: ["silent"],
      tokenSyllables: 1,
      lineTotal: 8,
      lineTarget: 9,
    });
    // silent ≈ 2 → newTotal = 8 - 1 + 2 = 9 → keeps
    expect(ranked[0]?.keepsMeter).toBe(true);
  });

  it("dedupes and respects limit", () => {
    const ranked = rankCandidates({
      candidates: ["Cat", "cat", "dog", "bird"],
      tokenSyllables: 1,
      lineTotal: 1,
      lineTarget: null,
      limit: 2,
    });
    expect(ranked).toHaveLength(2);
    expect(ranked.filter((r) => r.word === "cat")).toHaveLength(1);
  });
});
