import { describe, expect, it } from "vitest";

import {
  posOnLine,
  rhymeDotClass,
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
