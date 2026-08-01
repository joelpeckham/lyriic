import { describe, expect, it } from "vitest";
import { countWord } from "./countWord";
import { countLine, countLines, countLinesIncremental } from "./countLine";

describe("countWord — ambiguous poetic defaults (CMU primary)", () => {
  // Sesquisyllables: poets may count 1; CMU primary is 2.
  it("fire → 2 (also heard as 1)", () => {
    expect(countWord("fire")).toEqual({
      word: "fire",
      count: 2,
      source: "dict",
    });
  });

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

describe("countWord — overrides", () => {
  it("override wins over dict and does not leak into empty overrides", () => {
    expect(countWord("fire", { fire: 1 })).toEqual({
      word: "fire",
      count: 1,
      source: "override",
    });
    expect(countWord("fire", {})).toMatchObject({ count: 2, source: "dict" });
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
