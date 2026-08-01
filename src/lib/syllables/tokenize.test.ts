import { describe, expect, it } from "vitest";
import { tokenizeLine } from "./tokenize";

describe("tokenizeLine", () => {
  it("normalizes curly apostrophes in contractions", () => {
    const tokens = tokenizeLine("don’t stop");
    expect(tokens[0]?.word).toBe("don't");
  });

  it("keeps hyphenated compounds as one token", () => {
    const tokens = tokenizeLine("wine-bottle");
    expect(tokens).toHaveLength(1);
    expect(tokens[0]?.word).toBe("wine-bottle");
  });

  it("keeps multiple internal apostrophes as one token", () => {
    const tokens = tokenizeLine("rock'n'roll");
    expect(tokens).toHaveLength(1);
    expect(tokens[0]?.word).toBe("rock'n'roll");
  });

  it("includes leading elision apostrophes", () => {
    const tokens = tokenizeLine("'tis the season");
    expect(tokens[0]?.raw).toBe("'tis");
    expect(tokens[0]?.word).toBe("'tis");
    expect(tokens[0]?.start).toBe(0);
  });

  it("tokenizes Unicode letters", () => {
    const tokens = tokenizeLine("café naïve");
    expect(tokens.map((t) => t.word)).toEqual(["café", "naïve"]);
  });
});
