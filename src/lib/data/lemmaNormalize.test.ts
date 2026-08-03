import { describe, expect, it } from "vitest";

import { normalizeLemma } from "../../../scripts/lib/lemma.mjs";

describe("normalizeLemma", () => {
  it("keeps curated trailing-apostrophe and one-letter lemmas", () => {
    expect(normalizeLemma("th'")).toBe("th'");
    expect(normalizeLemma("a")).toBe("a");
    expect(normalizeLemma("i")).toBe("i");
    expect(normalizeLemma("dang'rous")).toBe("dang'rous");
    expect(normalizeLemma("o'er")).toBe("o'er");
  });

  it("rejects open possessives and other one-letter lemmas", () => {
    expect(normalizeLemma("teachers'")).toBeNull();
    expect(normalizeLemma("foreigners'")).toBeNull();
    expect(normalizeLemma("b")).toBeNull();
  });
});
