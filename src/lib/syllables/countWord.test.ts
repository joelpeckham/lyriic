import { describe, expect, it } from "vitest";
import { countWord } from "./countWord";
import { countLine, countLines, countLinesIncremental } from "./countLine";

describe("countWord — CMU primary dictionary", () => {
  const dictCases: Array<[string, number]> = [
    ["the", 1],
    ["poem", 2],
    ["rhythm", 2],
    ["family", 3],
    ["comfortable", 4],
    ["people", 2],
    ["business", 2],
    ["beautiful", 3],
    ["wine", 1],
    ["bottle", 2],
    ["queue", 1],
    ["don't", 1],
    ["doesn't", 2],
    ["teacher", 2],
    ["teacher's", 2],
  ];

  it.each(dictCases)("%s → %i (dict)", (word, count) => {
    const result = countWord(word);
    expect(result.count).toBe(count);
    expect(result.source).toBe("dict");
  });
});

describe("countWord — ambiguous poetic defaults (CMU primary)", () => {
  // Sesquisyllables: poets may count 1; CMU primary is 2.
  it("fire → 2 (also heard as 1)", () => {
    expect(countWord("fire")).toEqual({
      word: "fire",
      count: 2,
      source: "dict",
    });
  });

  it("hour → 2 (also heard as 1)", () => {
    expect(countWord("hour").count).toBe(2);
    expect(countWord("hour").source).toBe("dict");
  });

  // Syncope: casual speech often drops a syllable; CMU primary keeps it
  // except where the primary entry itself is already reduced.
  it("every → 3 (casual often 2)", () => {
    expect(countWord("every")).toMatchObject({ count: 3, source: "dict" });
  });

  // Primary CMU entry is IH1 N T R AH0 S T IH0 NG (3); careful variants are 4.
  it("interesting → 3 (careful variants often 4)", () => {
    expect(countWord("interesting")).toMatchObject({
      count: 3,
      source: "dict",
    });
  });

  it("different → 3 (CMU also has a 2-syllable variant)", () => {
    expect(countWord("different")).toMatchObject({
      count: 3,
      source: "dict",
    });
  });
});

describe("countWord — hyphenated compounds (split + sum)", () => {
  it("wine-bottle → 1 + 2 = 3", () => {
    expect(countWord("wine-bottle")).toEqual({
      word: "wine-bottle",
      count: 3,
      source: "dict",
    });
  });

  it("mother-in-law sums parts", () => {
    const mother = countWord("mother").count;
    const inCount = countWord("in").count;
    const law = countWord("law").count;
    expect(countWord("mother-in-law").count).toBe(mother + inCount + law);
    expect(countWord("mother-in-law").source).toBe("dict");
  });
});

describe("countWord — heuristic OOV", () => {
  it("falls back for invented words", () => {
    const result = countWord("xyzzyfoo");
    expect(result.source).toBe("heuristic");
    expect(result.count).toBeGreaterThanOrEqual(1);
  });

  it("silent e: made → 1", () => {
    // "made" is in CMU; use a nonsense silent-e shape via heuristic unit tests elsewhere
    expect(countWord("made")).toMatchObject({ count: 1, source: "dict" });
  });
});

describe("countWord — overrides", () => {
  it("override wins over dict", () => {
    expect(countWord("fire", { fire: 1 })).toEqual({
      word: "fire",
      count: 1,
      source: "override",
    });
  });

  it("empty overrides restore dict", () => {
    expect(countWord("fire", { fire: 1 })).toMatchObject({
      count: 1,
      source: "override",
    });
    expect(countWord("fire", {})).toMatchObject({ count: 2, source: "dict" });
  });

  it("override applies case-insensitively", () => {
    // Record keys are normalized at persistence; lookup normalizes the word.
    expect(countWord("Fire", { fire: 1 })).toMatchObject({
      count: 1,
      source: "override",
    });
    expect(countWord("FIRE", { fire: 1 }).count).toBe(1);
  });

  it("hyphen compound with overridden part reports source override", () => {
    const truck = countWord("truck").count;
    expect(countWord("fire-truck", { fire: 1 })).toEqual({
      word: "fire-truck",
      count: 1 + truck,
      source: "override",
    });
  });

  it("rejects invalid override counts", () => {
    expect(countWord("fire", { fire: 0 })).toMatchObject({
      count: 2,
      source: "dict",
    });
    expect(countWord("fire", { fire: Number.NaN })).toMatchObject({
      count: 2,
      source: "dict",
    });
    expect(
      countWord("fire", { fire: Number.POSITIVE_INFINITY }),
    ).toMatchObject({ count: 2, source: "dict" });
  });

  it("keeps hyphenated override keys distinct from unhyphenated forms", () => {
    expect(countWord("co-operate", { "co-operate": 4 })).toMatchObject({
      count: 4,
      source: "override",
    });
    expect(countWord("cooperate", { "co-operate": 4 }).source).not.toBe(
      "override",
    );
  });

  it("base memo is shared across override records (no leak)", () => {
    expect(countWord("fire", { fire: 1 }).count).toBe(1);
    // Empty overrides must still see the dict base, not a cached override.
    expect(countWord("fire", {})).toMatchObject({ count: 2, source: "dict" });
    expect(countWord("fire", { fire: 1 })).toMatchObject({
      count: 1,
      source: "override",
    });
  });

  it("explicit overrides apply case-insensitively via normalizeOverrideKey", () => {
    expect(countWord("Fire", { fire: 1 })).toMatchObject({
      count: 1,
      source: "override",
    });
  });
});

describe("override changes invalidate incremental line reuse", () => {
  it("recounts when previous snapshot is cleared after an override", () => {
    const text = "a fire";
    const first = countLinesIncremental(text, null, null);
    expect(first.counts[0]?.total).toBe(1 + 2);

    const stale = countLinesIncremental(text, first.lines, first.counts, {
      fire: 1,
    });
    // Same snapshot + new overrides would reuse stale objects — callers must
    // clear the snapshot when counting policy changes.
    expect(stale.counts[0]).toBe(first.counts[0]);

    const fresh = countLinesIncremental(text, null, null, { fire: 1 });
    expect(fresh.counts[0]?.total).toBe(2);
  });

  it("threaded overrides recount without module Map sync", () => {
    const text = "a fire";
    const withOverride = countLinesIncremental(text, null, null, { fire: 1 });
    expect(withOverride.counts[0]?.total).toBe(2);

    const without = countLinesIncremental(text, null, null, {});
    expect(without.counts[0]?.total).toBe(1 + 2);
  });
});

describe("countLine", () => {
  it("sums per-word counts and preserves tokens", () => {
    const result = countLine("The poem has rhythm.");
    expect(result.tokens.map((t) => t.word)).toEqual([
      "the",
      "poem",
      "has",
      "rhythm",
    ]);
    expect(result.total).toBe(
      result.perWord.reduce((sum, w) => sum + w.count, 0),
    );
    expect(result.total).toBe(1 + 2 + 1 + 2);
  });

  it("sums per-word counts for a short line", () => {
    const result = countLine("to be or");
    expect(result.total).toBe(3);
    expect(result.perWord).toHaveLength(3);
    expect(result.tokens).toHaveLength(3);
  });

  it("counts hyphenates as one token", () => {
    const result = countLine("a wine-bottle");
    expect(result.tokens).toHaveLength(2);
    expect(result.perWord[1]?.count).toBe(3);
  });

  it("counts rock'n'roll via CMU when tokenized as one word", () => {
    const result = countLine("rock'n'roll");
    expect(result.tokens).toHaveLength(1);
    expect(result.total).toBe(3);
    expect(result.perWord[0]?.source).toBe("dict");
  });
});

describe("countLinesIncremental", () => {
  it("reuses unchanged line counts", () => {
    const first = countLinesIncremental("one poem\ntwo lines", null, null);
    const second = countLinesIncremental(
      "one poem\nchanged line",
      first.lines,
      first.counts,
    );
    expect(second.counts[0]).toBe(first.counts[0]);
    expect(second.counts[1]).not.toBe(first.counts[1]);
    expect(second.counts[1]?.total).toBe(countLine("changed line").total);
  });

  it("recounts shifted indices after a line insert", () => {
    const first = countLinesIncremental("alpha\nbeta", null, null);
    const inserted = countLinesIncremental(
      "new\nalpha\nbeta",
      first.lines,
      first.counts,
    );

    // Index 0 is new; former "alpha"/"beta" shift and must be recounted objects.
    expect(inserted.counts[0]?.total).toBe(1);
    expect(inserted.counts[1]).not.toBe(first.counts[0]);
    expect(inserted.counts[1]?.total).toBe(first.counts[0]?.total);
    expect(inserted.lines[1]).toBe("alpha");
    expect(inserted.counts[2]?.total).toBe(first.counts[1]?.total);
  });

  it("handles 500-line documents", () => {
    const text = Array.from(
      { length: 500 },
      (_, i) => `Line ${i} has a steady rhythm here`,
    ).join("\n");
    const { counts } = countLinesIncremental(text, null, null);
    expect(counts).toHaveLength(500);
    expect(countLines(text)).toHaveLength(500);
    expect(counts[0]?.total).toBeGreaterThan(0);
  });
});
