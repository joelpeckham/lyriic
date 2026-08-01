import { describe, expect, it } from "vitest";
import { countLine } from "@/lib/syllables";
import { buildMeteredLine, stressMismatchMask } from "./buildMeteredLine";
import { getMeterPreset } from "./presets";

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
    expect(metered.tokens[0]!.stress.length).toBe(1);
    expect(metered.expectedStress).toBeNull();
  });

  it("marks exact and over status against the line target", () => {
    const three = countLine("to be or");
    expect(buildMeteredLine(three, 0, [3]).status).toBe("exact");
    expect(buildMeteredLine(three, 0, [2]).status).toBe("over");
    expect(buildMeteredLine(three, 0, []).status).toBe("none");
    expect(buildMeteredLine(three, 0, []).target).toBeNull();
  });

  it("marks stress mismatch when count matches but pattern does not", () => {
    // Force a 2-syllable line with expected iamb (u S).
    const count = countLine("poem");
    expect(count.total).toBe(2);
    const mismatch = buildMeteredLine(count, 0, {
      pattern: [2],
      stressPatterns: [[0, 1]],
      // Put primary on first syllable → trochee vs expected iamb.
      stressOverrides: { poem: 0 },
    });
    expect(mismatch.status).toBe("stress");
    expect(stressMismatchMask(mismatch.tokens[0]!.stress, [0, 1])).toEqual([
      true,
      true,
    ]);

    const match = buildMeteredLine(count, 0, {
      pattern: [2],
      stressPatterns: [[0, 1]],
      stressOverrides: { poem: 1 },
    });
    expect(match.status).toBe("exact");
    expect(stressMismatchMask(match.tokens[0]!.stress, [0, 1])).toEqual([
      false,
      false,
    ]);
  });

  it("stressMismatchMask returns null when lengths differ", () => {
    expect(stressMismatchMask([0, 1], [0, 1, 0])).toBeNull();
    expect(stressMismatchMask([1], [0, 1])).toBeNull();
  });

  it("stressMismatchMask flags only mismatched syllables", () => {
    // Secondary stress (2) counts as stressed in binary comparison.
    expect(stressMismatchMask([0, 2, 1, 0], [0, 1, 0, 1])).toEqual([
      false,
      false,
      true,
      true,
    ]);
  });

  it("treats a as unstressed so iambic match is possible", () => {
    const preset = getMeterPreset("iambic-pentameter");
    expect(preset.stressPatterns?.[0]?.length).toBe(10);

    // 4-syllable iamb with "a" on a weak beat: u S u S
    const count = countLine("to love a rose");
    expect(count.total).toBe(4);
    const aToken = buildMeteredLine(count, 0, {
      pattern: [4],
      stressPatterns: [[0, 1, 0, 1]],
    }).tokens.find((t) => t.word === "a");
    expect(aToken?.stress).toEqual([0]);

    const metered = buildMeteredLine(count, 0, {
      pattern: [4],
      stressPatterns: [[0, 1, 0, 1]],
      // Force remaining monos to the expected binary contour.
      // (Primary-index override on a monosyllable → stressed [1].)
      stressOverrides: { love: 0, rose: 0 },
    });
    // "to" may already be unstressed in the pack; "a" is [0] via function-word table.
    expect(metered.tokens.map((t) => t.stress)).toEqual([
      [0],
      [1],
      [0],
      [1],
    ]);
    expect(metered.status).toBe("exact");
  });
});
