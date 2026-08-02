import { describe, expect, it } from "vitest";

import { definitionPairKey } from "./pairKey";

describe("definitionPairKey", () => {
  it("uses the first two letters for normal lemmas", () => {
    expect(definitionPairKey("light")).toBe("li");
    expect(definitionPairKey("aa")).toBe("aa");
    expect(definitionPairKey("zebra")).toBe("ze");
  });

  it("pads a one-letter lemma", () => {
    expect(definitionPairKey("a")).toBe("a_");
    expect(definitionPairKey("i")).toBe("i_");
  });

  it("pads when the second character is not a–z", () => {
    expect(definitionPairKey("a'n't")).toBe("a_");
  });

  it("buckets non a–z starts", () => {
    expect(definitionPairKey("'tis")).toBe("_");
    expect(definitionPairKey("")).toBe("_");
  });

  it("matches the build-time sharding helper", async () => {
    const { definitionPairKey: buildKey } = await import(
      "../../../scripts/lib/writeDefinitionsPacks.mjs"
    );
    for (const lemma of ["light", "a", "i", "a'n't", "'tis", "", "zebra", "x"]) {
      expect(definitionPairKey(lemma)).toBe(buildKey(lemma));
    }
  });
});
