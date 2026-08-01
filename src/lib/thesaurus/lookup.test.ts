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
});
