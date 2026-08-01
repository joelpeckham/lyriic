import { describe, expect, it } from "vitest";

import { wordAt } from "./wordAt";

describe("wordAt", () => {
  it("expands caret inside a word", () => {
    const line = "soft silent fire";
    // caret in "silent" (index 7 = 'i')
    const result = wordAt(line, 0, 0, 7, 7);
    expect(result).toMatchObject({
      from: 5,
      to: 11,
      raw: "silent",
      word: "silent",
      lineIndex: 0,
    });
  });

  it("accepts caret at token end", () => {
    const line = "soft fire";
    // "fire" is [5,9); caret at 9
    const result = wordAt(line, 0, 0, 9, 9);
    expect(result?.raw).toBe("fire");
  });

  it("accepts exact single-word selection", () => {
    const line = "soft silent fire";
    const result = wordAt(line, 10, 2, 15, 21); // lineFrom=10, select "silent"
    expect(result).toMatchObject({
      from: 15,
      to: 21,
      raw: "silent",
      lineIndex: 2,
    });
  });

  it("trims whitespace around a single-word selection", () => {
    const line = "soft silent fire";
    const result = wordAt(line, 0, 0, 4, 12); // " silent "
    expect(result?.raw).toBe("silent");
  });

  it("rejects multi-word selection", () => {
    const line = "soft silent fire";
    expect(wordAt(line, 0, 0, 0, 11)).toBeNull();
  });

  it("returns null for empty line / non-word caret", () => {
    expect(wordAt("", 0, 0, 0, 0)).toBeNull();
    expect(wordAt("soft  fire", 0, 0, 5, 5)).toBeNull();
  });
});
