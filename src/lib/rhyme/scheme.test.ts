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
      // Perfect keys differ; end keys share ɚ (bomber ↔ her).
      bomber: "ɑmɚ",
      her: "ɝ",
    },
    byKey: {
      eɪ: ["day", "way"],
      aɪt: ["night", "light"],
      æt: ["cat"],
      ɔg: ["dog"],
      ɑmɚ: ["bomber"],
      ɝ: ["her"],
    },
    byWordEnd: {
      day: "eɪ",
      way: "eɪ",
      night: "aɪt",
      light: "aɪt",
      cat: "æt",
      dog: "ɔg",
      bomber: "ɚ",
      her: "ɚ",
    },
    byKeyEnd: {
      eɪ: ["day", "way"],
      aɪt: ["night", "light"],
      æt: ["cat"],
      ɔg: ["dog"],
      ɚ: ["bomber", "her"],
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

  it("cycles the scheme pattern", () => {
    fixtureRhymes();
    const rows = analyzeRhymeScheme(
      ["day", "night", "way", "light", "day", "night"],
      "AB",
    );
    expect(rows.map((r) => r.letter)).toEqual(["A", "B", "A", "B", "A", "B"]);
    expect(rows.every((r) => r.status === "match" || r.status === "open")).toBe(
      true,
    );
  });
});
