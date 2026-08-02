import { describe, expect, it } from "vitest";

import {
  COUNT_FONT_REM,
  COUNT_PAD_TOP_REM,
  RHYME_DOT_SIZE_REM,
  RHYME_DOT_TO_COUNT_GAP_REM,
} from "./constants";
import {
  posOnLine,
  rhymeDotClass,
  rhymeDotOffset,
  statusClass,
  tickClass,
} from "./syllableOverlay";

describe("statusClass", () => {
  it("maps meter statuses to count classes", () => {
    expect(statusClass("exact")).toBe("lyriic-count--exact");
    expect(statusClass("over")).toBe("lyriic-count--over");
    expect(statusClass("stress")).toBe("lyriic-count--stress");
    expect(statusClass("under")).toBe("lyriic-count--subtle");
    expect(statusClass("none")).toBe("lyriic-count--subtle");
  });
});

describe("tickClass", () => {
  it("marks target and over syllables", () => {
    expect(tickClass(4, 4)).toBe("lyriic-ruler-tick--target");
    expect(tickClass(5, 4)).toBe("lyriic-ruler-tick--over");
    expect(tickClass(3, 4)).toBe("lyriic-ruler-tick");
    expect(tickClass(1, null)).toBe("lyriic-ruler-tick");
  });
});

describe("posOnLine", () => {
  it("clamps offsets onto the line", () => {
    expect(posOnLine(10, 20, 0)).toBe(10);
    expect(posOnLine(10, 20, 5)).toBe(15);
    expect(posOnLine(10, 20, 99)).toBe(19);
    expect(posOnLine(10, 10, 3)).toBe(10);
  });
});

describe("rhymeDotClass", () => {
  it("builds status and palette classes", () => {
    expect(
      rhymeDotClass({
        letter: "A",
        colorIndex: 0,
        status: "match",
        endWord: "day",
      }),
    ).toBe("lyriic-rhyme-dot lyriic-rhyme-dot--match");
    expect(
      rhymeDotClass({
        letter: "B",
        colorIndex: 1,
        status: "open",
        endWord: "fire",
      }),
    ).toBe("lyriic-rhyme-dot lyriic-rhyme-dot--muted lyriic-rhyme-dot--B");
  });
});

describe("rhymeDotOffset", () => {
  const rootFontPx = 16;
  const countLeft = 400;
  const rowTop = 100;

  it("keeps a fixed root-rem gap from the count column", () => {
    const { left } = rhymeDotOffset(countLeft, rowTop, rootFontPx);
    const gapPx = countLeft - (left + RHYME_DOT_SIZE_REM * rootFontPx);
    expect(gapPx).toBeCloseTo(RHYME_DOT_TO_COUNT_GAP_REM * rootFontPx);
  });

  it("aligns top to the count optical mid, independent of editor fontSize", () => {
    const expectedTop =
      rowTop + (COUNT_PAD_TOP_REM + COUNT_FONT_REM / 2) * rootFontPx;
    // Editor font size is not an input — S and XL share the same mid.
    expect(rhymeDotOffset(countLeft, rowTop, rootFontPx).top).toBe(expectedTop);
    expect(rhymeDotOffset(countLeft, rowTop, rootFontPx).top).toBe(
      rhymeDotOffset(countLeft + 50, rowTop, rootFontPx).top,
    );
  });
});
