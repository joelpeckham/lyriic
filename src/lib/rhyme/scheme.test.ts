import { afterEach, describe, expect, it } from "vitest";

import { __setRhymeDataForTests } from "./lookup";
import { analyzeRhymeScheme, endWordOfLine } from "./scheme";

afterEach(() => {
  __setRhymeDataForTests(null);
});

function fixtureRhymes() {
  __setRhymeDataForTests({
    byWord: {
      day: "eɪ",
      way: "eɪ",
      night: "aɪt",
      light: "aɪt",
      cat: "æt",
      dog: "ɔg",
      bat: "æt",
      fog: "ɔg",
      // Perfect keys differ; end keys share ɚ (bomber ↔ her).
      bomber: "ɑmɚ",
      her: "ɝ",
      there: "ɛr",
      care: "ɛr",
      hair: "ɛr",
      // Slant only: night ↔ side (family AI+T); no perfect/end share.
      side: "aɪd",
    },
    byKey: {
      eɪ: ["day", "way"],
      aɪt: ["night", "light"],
      aɪd: ["side"],
      æt: ["cat", "bat"],
      ɔg: ["dog", "fog"],
      ɑmɚ: ["bomber"],
      ɝ: ["her"],
      ɛr: ["there", "care", "hair"],
    },
    byWordEnd: {
      day: "eɪ",
      way: "eɪ",
      night: "aɪt",
      light: "aɪt",
      side: "aɪd",
      cat: "æt",
      dog: "ɔg",
      bat: "æt",
      fog: "ɔg",
      bomber: "ɚ",
      her: "ɚ",
      there: "ɛr",
      care: "ɛr",
      hair: "ɛr",
    },
    byKeyEnd: {
      eɪ: ["day", "way"],
      aɪt: ["night", "light"],
      aɪd: ["side"],
      æt: ["cat", "bat"],
      ɔg: ["dog", "fog"],
      ɚ: ["bomber", "her"],
      ɛr: ["there", "care", "hair"],
    },
    byWordSlant: {
      night: "f:AI+T",
      light: "f:AI+T",
      side: "f:AI+T",
      day: "f:E+Ø",
      way: "f:E+Ø",
    },
    byKeySlant: {
      "f:AI+T": ["night", "light", "side"],
      "f:E+Ø": ["day", "way"],
    },
  });
}

describe("endWordOfLine", () => {
  it("returns the last word token", () => {
    expect(endWordOfLine("The quiet day")).toBe("day");
    expect(endWordOfLine("  ")).toBeNull();
  });
});

describe("analyzeRhymeScheme", () => {
  it("marks perfect matches for ABAB", () => {
    fixtureRhymes();
    const rows = analyzeRhymeScheme(
      ["a quiet day", "dark night", "another way", "bright light"],
      "ABAB",
    );
    expect(rows.map((r) => r.letter)).toEqual(["A", "B", "A", "B"]);
    expect(rows.map((r) => r.status)).toEqual([
      "match",
      "match",
      "match",
      "match",
    ]);
  });

  it("marks end-only pairs as endMatch", () => {
    fixtureRhymes();
    const a = `A climber once said, "that's bomber!"`;
    const b = `below Nat's first lead to calm her.`;
    const rows = analyzeRhymeScheme([a, b], "AA");
    expect(rows.map((r) => r.endWord)).toEqual(["bomber", "her"]);
    expect(rows.map((r) => r.status)).toEqual(["endMatch", "endMatch"]);
  });

  it("marks slant-only pairs as slantMatch", () => {
    fixtureRhymes();
    const rows = analyzeRhymeScheme(["dark night", "the other side"], "AA");
    expect(rows.map((r) => r.endWord)).toEqual(["night", "side"]);
    expect(rows.map((r) => r.status)).toEqual(["slantMatch", "slantMatch"]);
  });

  it("flags mismatched same-letter peers", () => {
    fixtureRhymes();
    const rows = analyzeRhymeScheme(
      ["a quiet day", "dark night", "a loud cat", "bright light"],
      "ABAB",
    );
    expect(rows[0]?.status).toBe("mismatch");
    expect(rows[2]?.status).toBe("mismatch");
    expect(rows[1]?.status).toBe("match");
    expect(rows[3]?.status).toBe("match");
  });

  it("treats X as open / unrhymed", () => {
    fixtureRhymes();
    const rows = analyzeRhymeScheme(
      ["line one cat", "the day", "line three dog", "the way"],
      "XAXA",
    );
    expect(rows[0]?.status).toBe("open");
    expect(rows[2]?.status).toBe("open");
    expect(rows[1]?.status).toBe("match");
    expect(rows[3]?.status).toBe("match");
  });

  it("marks unknown words without dictionary rhyme keys", () => {
    fixtureRhymes();
    const rows = analyzeRhymeScheme(
      ["a quiet day", "zzzzyx", "another way", "zzzzyx"],
      "ABAB",
    );
    expect(rows[1]?.status).toBe("unknown");
    expect(rows[0]?.status).toBe("match");
    expect(rows[2]?.status).toBe("match");
  });

  it("matches independent scheme periods (heroic couplets)", () => {
    fixtureRhymes();
    const rows = analyzeRhymeScheme(
      ["a quiet day", "another way", "dark night", "bright light"],
      "AA",
    );
    expect(rows.map((r) => r.letter)).toEqual(["A", "A", "A", "A"]);
    expect(rows.map((r) => r.status)).toEqual([
      "match",
      "match",
      "match",
      "match",
    ]);
  });

  it("matches independent ABAB stanzas with different rhyme sets", () => {
    fixtureRhymes();
    const rows = analyzeRhymeScheme(
      [
        "a quiet day",
        "dark night",
        "another way",
        "bright light",
        "a loud cat",
        "a big dog",
        "a small bat",
        "thick fog",
      ],
      "ABAB",
    );
    expect(rows.map((r) => r.letter)).toEqual([
      "A",
      "B",
      "A",
      "B",
      "A",
      "B",
      "A",
      "B",
    ]);
    expect(rows.every((r) => r.status === "match")).toBe(true);
  });

  it("does not consume scheme slots for blank lines", () => {
    fixtureRhymes();
    const rows = analyzeRhymeScheme(
      [
        "there once was a man from there",
        "who never had much to care",
        "he walked with flair",
        "and styled his hair",
        "then sat in his favorite chair",
        "",
        "there once was a man from there",
        "who never had much to care",
        "he walked with flair",
        "and styled his hair",
        "then sat in his favorite chair",
      ],
      "AABBA",
    );
    expect(rows.map((r) => r.letter)).toEqual([
      "A",
      "A",
      "B",
      "B",
      "A",
      null,
      "A",
      "A",
      "B",
      "B",
      "A",
    ]);
    expect(rows[5]?.status).toBe("empty");
  });
});
