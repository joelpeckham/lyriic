import { describe, expect, it } from "vitest";

import { countLine } from "@/lib/syllables";

import { buildMeteredLines } from "./buildMeteredLines";

describe("buildMeteredLines", () => {
  it("does not reuse cache when stressOverrides change under the same revision", () => {
    const count = countLine("poem");
    const pattern = [2] as const;
    const stressPatterns = [[0, 1] as const];

    const first = buildMeteredLines(
      [count],
      {
        pattern,
        stressPatterns,
        stressOverrides: { poem: 0 },
      },
      "same-rev",
    );
    expect(first[0]!.status).toBe("stress");

    const second = buildMeteredLines(
      [count],
      {
        pattern,
        stressPatterns,
        stressOverrides: { poem: 1 },
      },
      "same-rev",
    );
    expect(second[0]!.status).toBe("exact");
  });
});
