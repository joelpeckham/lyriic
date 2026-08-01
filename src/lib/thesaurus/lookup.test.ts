import { afterEach, describe, expect, it } from "vitest";

import {
  __setThesaurusDataForTests,
  isThesaurusReady,
  lookupSynonyms,
} from "./lookup";

describe("lookupSynonyms", () => {
  afterEach(() => {
    __setThesaurusDataForTests(null);
  });

  it("returns [] when data is not loaded", () => {
    expect(isThesaurusReady()).toBe(false);
    expect(lookupSynonyms("fire")).toEqual([]);
  });

  it("returns synonyms for known words and [] for unknown", () => {
    __setThesaurusDataForTests({
      fire: ["flame", "blaze"],
      silent: ["quiet", "mute"],
    });
    expect(isThesaurusReady()).toBe(true);
    expect(lookupSynonyms("Fire")).toEqual(["flame", "blaze"]);
    expect(lookupSynonyms("xyzzy")).toEqual([]);
  });
});
