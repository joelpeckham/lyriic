import { afterEach, describe, expect, it } from "vitest";

import {
  __setThesaurusDataForTests,
  lookupSynonyms,
  lookupSynonymsForBrowse,
} from "./lookup";

describe("lookupSynonyms", () => {
  afterEach(() => {
    __setThesaurusDataForTests(null);
  });

  it("merges inflectional base senses (remains → remain)", () => {
    __setThesaurusDataForTests({
      remains: { n: ["cadaver", "corpse"] },
      remain: { v: ["stay", "persist", "continue"] },
    });
    const syns = lookupSynonyms("remains");
    expect(syns.map((s) => s.word)).toEqual(
      expect.arrayContaining(["cadaver", "stay", "persist"]),
    );
    expect(syns[0]?.word).toBe("cadaver");
  });

  it("hard-filters to detected n/v when noun/verb-ambiguous", () => {
    __setThesaurusDataForTests({
      remains: { n: ["cadaver", "corpse"] },
      remain: { v: ["stay", "persist", "continue"] },
    });
    const asVerb = lookupSynonyms("remains", "v");
    expect(asVerb.map((s) => s.word)).toEqual(["stay", "persist", "continue"]);
    expect(asVerb.every((s) => s.matchesUsage)).toBe(true);

    const asNoun = lookupSynonyms("remains", "n");
    expect(asNoun.map((s) => s.word)).toEqual(["cadaver", "corpse"]);
    expect(asNoun.map((s) => s.word)).not.toContain("stay");
  });

  it("keeps all POS when usage is unset on noun/verb-ambiguous heads", () => {
    __setThesaurusDataForTests({
      bathe: { n: ["swim", "jackknife"], v: ["wash", "scrub"] },
    });
    const syns = lookupSynonyms("bathe");
    expect(syns.map((s) => s.word)).toEqual(
      expect.arrayContaining(["swim", "jackknife", "wash", "scrub"]),
    );
  });

  it("ranks matching non-n/v usage first without hard-filtering", () => {
    __setThesaurusDataForTests({
      light: { n: ["lamp"], v: ["ignite"], a: ["bright", "pale"] },
    });
    const syns = lookupSynonyms("light", "a");
    expect(syns[0]?.word).toBe("bright");
    expect(syns[0]?.matchesUsage).toBe(true);
    expect(syns.map((s) => s.word)).toEqual(
      expect.arrayContaining(["lamp", "ignite"]),
    );
  });

  it("does not pull adjective senses from false -s stems (news ↛ new)", () => {
    __setThesaurusDataForTests({
      news: { n: ["tidings", "info"] },
      new: { a: ["fresh", "novel"], r: ["anew"] },
    });
    const syns = lookupSynonyms("news");
    expect(syns.map((s) => s.word)).toEqual(["tidings", "info"]);
  });

  it("drops hop/scar when hope/scare also exist", () => {
    __setThesaurusDataForTests({
      hoped: { a: ["optimistic"] },
      hope: { v: ["wish", "desire"], n: ["aspiration"] },
      hop: { v: ["skip", "jump"] },
    });
    const syns = lookupSynonyms("hoped", "v");
    expect(syns.map((s) => s.word)).toEqual(["wish", "desire"]);
    expect(syns.map((s) => s.word)).not.toContain("skip");
  });

  it("marks shared lemmas as matchesUsage under n/v hard-filter", () => {
    __setThesaurusDataForTests({
      remains: { n: ["stay", "cadaver"] },
      remain: { v: ["stay", "persist"] },
    });
    const syns = lookupSynonyms("remains", "v");
    expect(syns.map((s) => s.word)).toEqual(["stay", "persist"]);
    expect(syns.every((s) => s.matchesUsage)).toBe(true);
  });
});

describe("lookupSynonymsForBrowse", () => {
  afterEach(() => {
    __setThesaurusDataForTests(null);
  });

  it("emits the same lemma under multiple usages", () => {
    __setThesaurusDataForTests({
      remains: { n: ["stay", "cadaver"] },
      remain: { v: ["stay", "persist"] },
    });
    const rows = lookupSynonymsForBrowse("remains");
    expect(rows).toEqual(
      expect.arrayContaining([
        { word: "stay", usage: "n" },
        { word: "stay", usage: "v" },
        { word: "cadaver", usage: "n" },
        { word: "persist", usage: "v" },
      ]),
    );
    expect(rows.filter((r) => r.word === "stay")).toHaveLength(2);
  });

  it("merges inflectional bases like lookupSynonyms", () => {
    __setThesaurusDataForTests({
      remains: { n: ["cadaver"] },
      remain: { v: ["stay", "persist"] },
    });
    const rows = lookupSynonymsForBrowse("remains");
    expect(rows.map((r) => r.word)).toEqual(
      expect.arrayContaining(["cadaver", "stay", "persist"]),
    );
  });

  it("does not pull adjective senses from false -s stems (news ↛ new)", () => {
    __setThesaurusDataForTests({
      news: { n: ["tidings", "info"] },
      new: { a: ["fresh", "novel"] },
    });
    expect(lookupSynonymsForBrowse("news").map((r) => r.word)).toEqual([
      "tidings",
      "info",
    ]);
  });
});
