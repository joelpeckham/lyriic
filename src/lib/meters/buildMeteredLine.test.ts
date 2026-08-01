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

  it("stressMismatchMask treats secondary as a wildcard", () => {
    // Secondary (2) matches either expected bit; primary/unstressed must match.
    expect(stressMismatchMask([0, 2, 1, 0], [0, 1, 0, 1])).toEqual([
      false,
      false,
      true,
      true,
    ]);
    expect(stressMismatchMask([2, 1, 0], [0, 1, 0])).toEqual([
      false,
      false,
      false,
    ]);
  });

  it("assigns metrical stress to monosyllables for iambic match", () => {
    const count = countLine("to love a rose");
    expect(count.total).toBe(4);
    const metered = buildMeteredLine(count, 0, {
      pattern: [4],
      stressPatterns: [[0, 1, 0, 1]],
    });
    expect(metered.tokens.map((t) => t.stress)).toEqual([
      [0],
      [1],
      [0],
      [1],
    ]);
    expect(metered.status).toBe("exact");
  });

  it("respects monosyllable stress overrides over meter assignment", () => {
    const count = countLine("to love");
    const metered = buildMeteredLine(count, 0, {
      pattern: [2],
      stressPatterns: [[0, 1]],
      // Primary index 0 on a mono → stressed [1], fighting expected weak beat.
      stressOverrides: { to: 0 },
    });
    expect(metered.tokens[0]!.stress).toEqual([1]);
    expect(metered.status).toBe("stress");
  });

  it("fits Juliet via curated syllable alt under iambic pentameter", () => {
    const preset = getMeterPreset("iambic-pentameter");
    const count = countLine("It is the east, and Juliet is the sun.");
    expect(count.total).toBe(11);
    const metered = buildMeteredLine(count, 0, {
      pattern: preset.pattern,
      stressPatterns: preset.stressPatterns,
    });
    expect(metered.total).toBe(10);
    expect(metered.status).toBe("exact");
    const juliet = metered.tokens.find((t) => t.word === "juliet");
    expect(juliet?.syllables).toBe(2);
  });

  it("does not fit when a syllable override blocks the only fix", () => {
    const preset = getMeterPreset("iambic-pentameter");
    const count = countLine("It is the east, and Juliet is the sun.");
    const metered = buildMeteredLine(count, 0, {
      pattern: preset.pattern,
      stressPatterns: preset.stressPatterns,
      syllableOverrides: { juliet: 3 },
    });
    expect(metered.total).toBe(11);
    expect(metered.status).toBe("over");
  });

  it("fits fire to 1 syllable when the line is one over target", () => {
    // "a fire" = 1+2 citation; target 2 → compress fire.
    const count = countLine("a fire");
    expect(count.total).toBe(3);
    const metered = buildMeteredLine(count, 0, { pattern: [2] });
    expect(metered.total).toBe(2);
    expect(metered.status).toBe("exact");
    expect(metered.tokens.find((t) => t.word === "fire")?.syllables).toBe(1);
  });

  it("accepts classic iambic pentameter samples as exact", () => {
    const preset = getMeterPreset("iambic-pentameter");
    const lines = [
      "In Oxford there once lived a rich old lout",
      "Who had some guest rooms that he rented out,",
      "But, soft! what light through yonder window breaks?",
      "It is the east, and Juliet is the sun.",
      "Arise, fair sun, and kill the envious moon,",
      "Who is already sick and pale with grief,",
      "Where are the songs of Spring? Ay, where are they?",
      "Think not of them, thou hast thy music too,",
    ];

    for (const line of lines) {
      const count = countLine(line);
      const metered = buildMeteredLine(count, 0, {
        pattern: preset.pattern,
        stressPatterns: preset.stressPatterns,
      });
      expect({ line, total: metered.total, status: metered.status }).toEqual({
        line,
        total: 10,
        status: "exact",
      });
    }
  });
});
