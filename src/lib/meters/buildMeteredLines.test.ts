import { describe, expect, it } from "vitest";
import { countLine } from "@/lib/syllables";
import { buildMeteredLine } from "./buildMeteredLine";
import { buildMeteredLines } from "./buildMeteredLines";

describe("buildMeteredLines", () => {
  it("matches per-line buildMeteredLine", () => {
    const counts = [
      countLine("to be or"),
      countLine("not to be"),
      countLine("that is"),
    ];
    const pattern = [5, 7, 5] as const;
    const metered = buildMeteredLines(counts, pattern);
    expect(metered).toEqual(
      counts.map((count, index) => buildMeteredLine(count, index, pattern)),
    );
  });

  it("reuses cached MeteredLine for the same count object", () => {
    const counts = [countLine("to be or"), countLine("not to be")];
    const pattern = [10] as const;
    const first = buildMeteredLines(counts, pattern);
    const second = buildMeteredLines(counts, pattern);
    expect(second[0]).toBe(first[0]);
    expect(second[1]).toBe(first[1]);
  });

  it("rebuilds when pattern identity changes", () => {
    const counts = [countLine("to be or")];
    const a = buildMeteredLines(counts, [5]);
    const b = buildMeteredLines(counts, [7]);
    expect(a[0]!.target).toBe(5);
    expect(b[0]!.target).toBe(7);
    expect(b[0]).not.toBe(a[0]);
  });
});
