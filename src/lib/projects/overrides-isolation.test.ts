import { afterEach, describe, expect, it } from "vitest";
import {
  clearAllOverrides,
  countLine,
  countLinesIncremental,
  replaceOverrides,
} from "@/lib/syllables";

afterEach(() => {
  clearAllOverrides();
});

describe("project override isolation", () => {
  it("same text yields different totals after swapping project overrides", () => {
    const text = "a fire burns";

    replaceOverrides({});
    const projectA = countLinesIncremental(text, null, null);
    expect(projectA.counts[0]?.total).toBe(countLine(text).total);

    replaceOverrides({ fire: 1 });
    const projectB = countLinesIncremental(text, null, null);
    expect(projectB.counts[0]?.total).toBe(projectA.counts[0]!.total - 1);

    replaceOverrides({});
    const backToA = countLinesIncremental(text, null, null);
    expect(backToA.counts[0]?.total).toBe(projectA.counts[0]?.total);
  });

  it("does not reuse prior counts across override policy changes", () => {
    const text = "every fire";
    replaceOverrides({});
    const first = countLinesIncremental(text, null, null);

    replaceOverrides({ every: 2, fire: 1 });
    const reused = countLinesIncremental(text, first.lines, first.counts);
    expect(reused.counts[0]).toBe(first.counts[0]);

    const invalidated = countLinesIncremental(text, null, null);
    expect(invalidated.counts[0]?.total).toBe(2 + 1);
    expect(invalidated.counts[0]).not.toBe(first.counts[0]);
  });
});
