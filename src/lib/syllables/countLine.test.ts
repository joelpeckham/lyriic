import { afterEach, describe, expect, it } from "vitest";

import {
  clearAllOverrides,
  countLine,
  countLinesIncremental,
  setOverride,
} from "@/lib/syllables";

afterEach(() => {
  clearAllOverrides();
});

describe("countLine", () => {
  it("sums per-word counts for a line", () => {
    const result = countLine("to be or");
    expect(result.total).toBe(3);
    expect(result.perWord).toHaveLength(3);
    expect(result.tokens).toHaveLength(3);
  });
});

describe("countLinesIncremental", () => {
  it("reuses unchanged lines by index and recounts changed ones", () => {
    const first = countLinesIncremental("one\ntwo", null, null);
    expect(first.counts.map((c) => c.total)).toEqual([1, 1]);

    const second = countLinesIncremental(
      "one\nthree",
      first.lines,
      first.counts,
    );
    expect(second.counts[0]).toBe(first.counts[0]);
    expect(second.counts[1]).not.toBe(first.counts[1]);
    expect(second.counts[1]?.total).toBe(1);
  });

  it("recounts shifted indices after a line insert", () => {
    const first = countLinesIncremental("alpha\nbeta", null, null);
    const inserted = countLinesIncremental(
      "new\nalpha\nbeta",
      first.lines,
      first.counts,
    );

    // Index 0 is new; former "alpha"/"beta" shift and must be recounted objects.
    expect(inserted.counts[0]?.total).toBe(1);
    expect(inserted.counts[1]).not.toBe(first.counts[0]);
    expect(inserted.counts[1]?.total).toBe(first.counts[0]?.total);
    expect(inserted.lines[1]).toBe("alpha");
    expect(inserted.counts[2]?.total).toBe(first.counts[1]?.total);
  });

  it("respects threaded overrides without relying on the module Map", () => {
    setOverride("fire", 1);
    const withEmpty = countLinesIncremental("a fire", null, null, {});
    expect(withEmpty.counts[0]?.total).toBe(1 + 2);

    const withOverride = countLinesIncremental("a fire", null, null, {
      fire: 1,
    });
    expect(withOverride.counts[0]?.total).toBe(2);
  });
});
