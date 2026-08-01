import {
  stressPatternForLine,
  targetForLine,
  type BinaryStressPattern,
} from "./presets";
import { fitLineSyllableVariants } from "./fitSyllableVariants";
import {
  applyMetricalMonosyllables,
  flattenTokenStress,
  stressMismatchMask,
} from "./scanLineStress";
import type { MeteredLine, MeteredToken, MeterStatus } from "./types";
import type { StressCode } from "@/lib/data/dictPack";
import { isStressReady } from "@/lib/data/stress";
import { resolveWordStress } from "@/lib/stress";
import type { LineSyllableCount, WordToken } from "@/lib/syllables/types";

export type { MeteredLine, MeteredToken, MeterStatus } from "./types";
export { stressMismatchMask } from "./scanLineStress";

export type BuildMeteredLineOptions = {
  pattern: readonly number[];
  stressPatterns?: readonly BinaryStressPattern[];
  stressOverrides?: Record<string, number>;
  syllableOverrides?: Record<string, number>;
};

function isBuildOptions(
  value: readonly number[] | BuildMeteredLineOptions,
): value is BuildMeteredLineOptions {
  return !Array.isArray(value);
}

function stressMatches(
  actual: readonly StressCode[],
  expected: BinaryStressPattern,
): boolean {
  const mask = stressMismatchMask(actual, expected);
  if (mask === null) return false;
  return !mask.some(Boolean);
}

export function buildMeteredLine(
  count: LineSyllableCount,
  lineIndex: number,
  patternOrOptions: readonly number[] | BuildMeteredLineOptions,
  maybeStressPatterns?: readonly BinaryStressPattern[],
  maybeStressOverrides?: Record<string, number>,
  maybeSyllableOverrides?: Record<string, number>,
): MeteredLine {
  // Support legacy (pattern) and options-object call sites.
  const options: BuildMeteredLineOptions = isBuildOptions(patternOrOptions)
    ? patternOrOptions
    : {
        pattern: patternOrOptions,
        stressPatterns: maybeStressPatterns,
        stressOverrides: maybeStressOverrides,
        syllableOverrides: maybeSyllableOverrides,
      };

  const {
    pattern,
    stressPatterns,
    stressOverrides = {},
    syllableOverrides = {},
  } = options;

  const target = targetForLine(pattern, lineIndex);
  const expectedStress = stressPatternForLine(stressPatterns, lineIndex);
  const tokens: MeteredToken[] = [];
  let cursor = 0;

  for (let i = 0; i < count.tokens.length; i++) {
    const token: WordToken = count.tokens[i]!;
    const wordCount = count.perWord[i];
    const syllables = wordCount?.count ?? 0;
    const syllableStart = cursor;
    const syllableEnd = cursor + syllables;
    const stress =
      syllables > 0
        ? resolveWordStress(token.word, stressOverrides, syllableOverrides)
            .pattern
        : [];
    // Keep token stress length aligned with syllable count for geometry.
    const aligned =
      stress.length === syllables
        ? stress
        : stress.length > syllables
          ? stress.slice(0, syllables)
          : [
              ...stress,
              ...new Array<StressCode>(syllables - stress.length).fill(0),
            ];
    tokens.push({
      raw: token.raw,
      word: token.word,
      start: token.start,
      end: token.end,
      syllables,
      syllableStart,
      syllableEnd,
      source: wordCount?.source ?? "heuristic",
      stress: aligned,
    });
    cursor = syllableEnd;
  }

  let total = count.total;

  // Dictionary / curated alts: bend syllable counts toward the meter target.
  if (target !== null && total !== target && total > 0) {
    total = fitLineSyllableVariants(
      tokens,
      total,
      target,
      syllableOverrides,
      stressOverrides,
    );
  }

  // Poetic scansion: bend monosyllables to the meter when the count fits.
  if (
    expectedStress !== null &&
    target !== null &&
    total === target &&
    total > 0
  ) {
    applyMetricalMonosyllables(tokens, expectedStress, stressOverrides);
  }

  const lineStress = flattenTokenStress(tokens);

  let status: MeterStatus = "none";
  if (target !== null) {
    if (total === 0 && !count.tokens.length) {
      status = "none";
    } else if (total < target) {
      status = "under";
    } else if (total > target) {
      status = "over";
    } else if (
      expectedStress !== null &&
      isStressReady() &&
      !stressMatches(lineStress, expectedStress)
    ) {
      status = "stress";
    } else {
      // Syllable count matches; treat as exact while stress pack is loading
      // (avoid heuristic flash labeled "stress").
      status = "exact";
    }
  }

  return { total, target, status, tokens, expectedStress };
}
