import { describe, expect, it } from "vitest";

import { filterCandidates } from "./filterCandidates";

const rows = [
  { word: "night", syllables: 1, usage: "n" as const },
  { word: "ignite", syllables: 2, usage: "v" as const },
  { word: "delight", syllables: 2, usage: "n" as const },
  { word: "tonight", syllables: 2, usage: "r" as const },
  { word: "overflow", syllables: 0, usage: "n" as const },
];

describe("filterCandidates", () => {
  it("filters by case-insensitive substring", () => {
    expect(
      filterCandidates(rows, { substring: "NIG" }).map((r) => r.word),
    ).toEqual(["night", "tonight"]);
    expect(
      filterCandidates(rows, { substring: "light" }).map((r) => r.word),
    ).toEqual(["delight"]);
  });

  it("filters by usage set", () => {
    expect(
      filterCandidates(rows, { usages: new Set(["n"]) }).map((r) => r.word),
    ).toEqual(["night", "delight", "overflow"]);
  });

  it("treats empty usage set as no POS filter", () => {
    expect(
      filterCandidates(rows, { usages: new Set() }).map((r) => r.word),
    ).toEqual(rows.map((r) => r.word));
  });

  it("filters by inclusive syllable range", () => {
    expect(
      filterCandidates(rows, { syllableMin: 2, syllableMax: 2 }).map(
        (r) => r.word,
      ),
    ).toEqual(["ignite", "delight", "tonight", "overflow"]);
  });

  it("lets unknown syllable counts pass the syllable filter", () => {
    expect(
      filterCandidates(rows, { syllableMin: 1 }).map((r) => r.word),
    ).toContain("overflow");
  });

  it("ignores syllable bounds when min > max", () => {
    expect(
      filterCandidates(rows, { syllableMin: 3, syllableMax: 1 }).map(
        (r) => r.word,
      ),
    ).toEqual(rows.map((r) => r.word));
  });

  it("caps results while preserving order", () => {
    expect(filterCandidates(rows, {}, 2).map((r) => r.word)).toEqual([
      "night",
      "ignite",
    ]);
  });
});
