import { describe, expect, it } from "vitest";

import {
  groupRankedBySyllables,
  groupRhymeIdsBySyllables,
  rankAndGroupRhymeIds,
} from "./groupRhymes";

describe("groupRhymeIdsBySyllables", () => {
  it("groups by syllable count ascending and preserves Zipf/input order", () => {
    const words = ["", "cat", "domains", "entertains", "bat", "hat"];
    // ids in Zipf order: cat, bat, hat (1), domains (2), entertains (3)
    const ids = [1, 4, 5, 2, 3];
    const groups = groupRhymeIdsBySyllables(ids, {
      words,
      overrides: {
        cat: 1,
        bat: 1,
        hat: 1,
        domains: 2,
        entertains: 3,
      },
    });
    expect(groups.map((g) => g.syllables)).toEqual([1, 2, 3]);
    expect(groups[0]?.words).toEqual(["cat", "bat", "hat"]);
    expect(groups[1]?.words).toEqual(["domains"]);
    expect(groups[2]?.words).toEqual(["entertains"]);
  });
});

describe("groupRankedBySyllables", () => {
  it("keeps relative order within buckets", () => {
    const groups = groupRankedBySyllables([
      {
        word: "domains",
        syllables: 2,
        keepsMeter: false,
        matchesUsage: false,
      },
      {
        word: "cat",
        syllables: 1,
        keepsMeter: false,
        matchesUsage: false,
      },
      {
        word: "bat",
        syllables: 1,
        keepsMeter: false,
        matchesUsage: false,
      },
    ]);
    expect(groups).toEqual([
      { syllables: 1, words: ["cat", "bat"] },
      { syllables: 2, words: ["domains"] },
    ]);
  });
});

describe("rankAndGroupRhymeIds", () => {
  it("ranks with lineTarget null then groups (Zipf within buckets)", () => {
    const words = ["", "gains", "domains", "entertains", "cat"];
    // Zipf order among 1-syllable: gains before cat
    const groups = rankAndGroupRhymeIds({
      ids: [1, 4, 2, 3],
      words,
      tokenSyllables: 2,
      overrides: {
        gains: 1,
        cat: 1,
        domains: 2,
        entertains: 3,
      },
    });
    expect(groups.map((g) => g.syllables)).toEqual([1, 2, 3]);
    expect(groups[0]?.words).toEqual(["gains", "cat"]);
    expect(groups[1]?.words).toEqual(["domains"]);
  });
});
