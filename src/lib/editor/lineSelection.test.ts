import { describe, expect, it } from "vitest";

import {
  extractRangeText,
  highlightForLine,
  isFullDocumentRange,
  normalizeRange,
  replaceRange,
} from "./lineSelection";

describe("normalizeRange", () => {
  it("orders reversed drag endpoints", () => {
    expect(
      normalizeRange({
        anchor: { line: 2, offset: 3 },
        focus: { line: 0, offset: 1 },
      }),
    ).toEqual({
      start: { line: 0, offset: 1 },
      end: { line: 2, offset: 3 },
    });
  });
});

describe("extractRangeText", () => {
  const lines = ["alpha", "beta", "gamma"];

  it("slices within one line", () => {
    expect(
      extractRangeText(lines, {
        anchor: { line: 0, offset: 1 },
        focus: { line: 0, offset: 4 },
      }),
    ).toBe("lph");
  });

  it("joins multi-line ranges with newlines", () => {
    expect(
      extractRangeText(lines, {
        anchor: { line: 0, offset: 2 },
        focus: { line: 2, offset: 3 },
      }),
    ).toBe("pha\nbeta\ngam");
  });
});

describe("replaceRange", () => {
  it("deletes a multi-line range", () => {
    const result = replaceRange(
      ["one", "two", "three"],
      { anchor: { line: 0, offset: 1 }, focus: { line: 2, offset: 2 } },
      "",
    );
    expect(result.lines).toEqual(["oree"]);
    expect(result.caret).toEqual({ line: 0, offset: 1 });
  });

  it("inserts a newline into a range", () => {
    const result = replaceRange(
      ["abcdef"],
      { anchor: { line: 0, offset: 2 }, focus: { line: 0, offset: 4 } },
      "\n",
    );
    expect(result.lines).toEqual(["ab", "ef"]);
    expect(result.caret).toEqual({ line: 1, offset: 0 });
  });
});

describe("highlightForLine", () => {
  const range = {
    anchor: { line: 0, offset: 2 },
    focus: { line: 2, offset: 3 },
  };

  it("partially highlights the start line", () => {
    expect(highlightForLine("hello", 0, range)).toEqual({
      before: "he",
      selected: "llo",
      after: "",
      emptyMarker: false,
    });
  });

  it("fully highlights a middle line", () => {
    expect(highlightForLine("mid", 1, range)).toEqual({
      before: "",
      selected: "mid",
      after: "",
      emptyMarker: false,
    });
  });

  it("marks empty middle lines", () => {
    expect(highlightForLine("", 1, range)).toEqual({
      before: "",
      selected: "",
      after: "",
      emptyMarker: true,
    });
  });
});

describe("isFullDocumentRange", () => {
  it("detects a whole-document drag", () => {
    expect(
      isFullDocumentRange(
        {
          anchor: { line: 0, offset: 0 },
          focus: { line: 1, offset: 3 },
        },
        ["abc", "def"],
      ),
    ).toBe(true);
  });
});
