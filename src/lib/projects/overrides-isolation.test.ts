import { afterEach, describe, expect, it } from "vitest";
import {
  clearAllOverrides,
  countLine,
  countLinesIncremental,
  replaceOverrides,
  setOverride,
} from "@/lib/syllables";

afterEach(() => {
  clearAllOverrides();
});

describe("project override isolation", () => {
  it("same text yields different totals via threaded project overrides", () => {
    const text = "a fire burns";

    const projectA = countLinesIncremental(text, null, null, {});
    expect(projectA.counts[0]?.total).toBe(countLine(text, {}).total);

    const projectB = countLinesIncremental(text, null, null, { fire: 1 });
    expect(projectB.counts[0]?.total).toBe(projectA.counts[0]!.total - 1);

    const backToA = countLinesIncremental(text, null, null, {});
    expect(backToA.counts[0]?.total).toBe(projectA.counts[0]?.total);
  });

  it("threaded overrides ignore a stale module Map from another project", () => {
    const text = "a fire";
    // Simulate prior project still resident in the module Map (layout sync pending).
    setOverride("fire", 1);
    expect(countLine(text).total).toBe(2);

    // New project with empty overrides must count correctly on first call.
    expect(countLine(text, {}).total).toBe(1 + 2);
    expect(countLinesIncremental(text, null, null, {}).counts[0]?.total).toBe(
      1 + 2,
    );
  });

  it("does not reuse prior counts across override policy changes", () => {
    const text = "every fire";
    const first = countLinesIncremental(text, null, null, {});

    // Same prev snapshot + new overrides would reuse stale objects — callers
    // must clear the snapshot (as useSyllableLineCounts does via revision).
    const reused = countLinesIncremental(
      text,
      first.lines,
      first.counts,
      { every: 2, fire: 1 },
    );
    expect(reused.counts[0]).toBe(first.counts[0]);

    const invalidated = countLinesIncremental(text, null, null, {
      every: 2,
      fire: 1,
    });
    expect(invalidated.counts[0]?.total).toBe(2 + 1);
    expect(invalidated.counts[0]).not.toBe(first.counts[0]);
  });

  it("module Map swap still works for non-threaded callers", () => {
    const text = "a fire burns";

    replaceOverrides({});
    const projectA = countLinesIncremental(text, null, null);
    expect(projectA.counts[0]?.total).toBe(countLine(text).total);

    replaceOverrides({ fire: 1 });
    const projectB = countLinesIncremental(text, null, null);
    expect(projectB.counts[0]?.total).toBe(projectA.counts[0]!.total - 1);
  });
});
