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
      remains: ["cadaver", "corpse"],
      remain: ["stay", "persist", "continue"],
    });
    const syns = lookupSynonyms("remains");
    expect(syns).toContain("cadaver");
    expect(syns).toContain("stay");
    expect(syns).toContain("persist");
    expect(syns[0]).toBe("cadaver");
  });
});
