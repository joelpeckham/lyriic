import { describe, expect, it } from "vitest";
import { countLine, countLinesIncremental } from "@/lib/syllables";

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

  it("threaded empty overrides are independent of other project records", () => {
    const text = "a fire";
    expect(countLine(text, { fire: 1 }).total).toBe(2);
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
});
