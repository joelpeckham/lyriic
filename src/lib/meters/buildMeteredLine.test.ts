import { describe, expect, it } from "vitest";
import { countLine } from "@/lib/syllables";
import { buildMeteredLine } from "./buildMeteredLine";

describe("buildMeteredLine", () => {
  it("builds cumulative syllable spans per token", () => {
    const count = countLine("The poem has rhythm");
    const metered = buildMeteredLine(count, 0, [10]);

    expect(metered.total).toBe(1 + 2 + 1 + 2);
    expect(metered.target).toBe(10);
    expect(metered.status).toBe("under");
    expect(metered.tokens.map((t) => t.syllableStart)).toEqual([0, 1, 3, 4]);
    expect(metered.tokens.map((t) => t.syllableEnd)).toEqual([1, 3, 4, 6]);
    expect(metered.tokens[0]).toMatchObject({
      word: "the",
      start: 0,
      syllables: 1,
    });
  });

  it("marks exact and over status against the line target", () => {
    const three = countLine("to be or");
    expect(buildMeteredLine(three, 0, [3]).status).toBe("exact");
    expect(buildMeteredLine(three, 0, [2]).status).toBe("over");
    expect(buildMeteredLine(three, 0, []).status).toBe("none");
    expect(buildMeteredLine(three, 0, []).target).toBeNull();
  });
});
