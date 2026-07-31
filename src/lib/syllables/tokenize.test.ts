import { describe, expect, it } from "vitest";
import { tokenizeLine } from "./tokenize";

describe("tokenizeLine", () => {
  it("strips surrounding punctuation via match boundaries", () => {
    const tokens = tokenizeLine("Hello, world!");
    expect(tokens.map((t) => t.word)).toEqual(["hello", "world"]);
    expect(tokens[0]).toMatchObject({ start: 0, end: 5, raw: "Hello" });
    expect(tokens[1]).toMatchObject({ start: 7, end: 12, raw: "world" });
  });

  it("normalizes curly apostrophes in contractions", () => {
    const tokens = tokenizeLine("don’t stop");
    expect(tokens[0]?.word).toBe("don't");
  });

  it("keeps possessives", () => {
    const tokens = tokenizeLine("the teacher's pet");
    expect(tokens.map((t) => t.word)).toEqual(["the", "teacher's", "pet"]);
  });

  it("keeps hyphenated compounds as one token", () => {
    const tokens = tokenizeLine("wine-bottle");
    expect(tokens).toHaveLength(1);
    expect(tokens[0]?.word).toBe("wine-bottle");
    expect(tokens[0]?.raw).toBe("wine-bottle");
  });

  it("returns empty for non-word lines", () => {
    expect(tokenizeLine("… — !")).toEqual([]);
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

  it("includes trailing possessive apostrophes in spans", () => {
    const tokens = tokenizeLine("teachers' lounge");
    expect(tokens[0]?.raw).toBe("teachers'");
    expect(tokens[0]?.end).toBe("teachers'".length);
  });

  it("tokenizes Unicode letters", () => {
    const tokens = tokenizeLine("café naïve");
    expect(tokens.map((t) => t.word)).toEqual(["café", "naïve"]);
  });
});
