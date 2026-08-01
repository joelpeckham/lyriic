import { afterEach, describe, expect, it } from "vitest";

import {
  __setThesaurusDataForTests,
  lookupSynonyms,
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

  it("ranks matching usage first", () => {
    __setThesaurusDataForTests({
      remains: { n: ["cadaver", "corpse"] },
      remain: { v: ["stay", "persist", "continue"] },
    });
    const syns = lookupSynonyms("remains", "v");
    expect(syns[0]?.word).toBe("stay");
    expect(syns[0]?.matchesUsage).toBe(true);
    expect(syns.find((s) => s.word === "cadaver")?.matchesUsage).toBe(false);
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
    expect(syns.filter((s) => s.matchesUsage).map((s) => s.word)).toEqual([
      "wish",
      "desire",
    ]);
    expect(syns.map((s) => s.word)).not.toContain("skip");
  });

  it("upgrades a synonym to matchesUsage across forms", () => {
    __setThesaurusDataForTests({
      remains: { n: ["stay", "cadaver"] },
      remain: { v: ["stay", "persist"] },
    });
    const syns = lookupSynonyms("remains", "v");
    expect(syns.find((s) => s.word === "stay")?.matchesUsage).toBe(true);
    expect(syns.find((s) => s.word === "persist")?.matchesUsage).toBe(true);
    expect(syns.find((s) => s.word === "cadaver")?.matchesUsage).toBe(false);
  });
});
