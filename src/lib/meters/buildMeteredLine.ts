import {
  stressPatternForLine,
  targetForLine,
  type BinaryStressPattern,
} from "./presets";
import type { MeteredLine, MeteredToken, MeterStatus } from "./types";
import type { StressCode } from "@/lib/data/dictPack";
import { isStressReady } from "@/lib/data/stress";
import { resolveWordStress, toBinaryStress } from "@/lib/stress";
import type { LineSyllableCount, WordToken } from "@/lib/syllables/types";

export type { MeteredLine, MeteredToken, MeterStatus } from "./types";

export type BuildMeteredLineOptions = {
  pattern: readonly number[];
  stressPatterns?: readonly BinaryStressPattern[];
  stressOverrides?: Record<string, number>;
  syllableOverrides?: Record<string, number>;
};

function stressMatches(
  actual: readonly StressCode[],
  expected: BinaryStressPattern,
): boolean {
  const mask = stressMismatchMask(actual, expected);
  if (mask === null) return false;
  return !mask.some(Boolean);
}

/**
 * Per-syllable mismatch flags when actual and expected lengths match;
 * otherwise null (not comparable).
 */
export function stressMismatchMask(
  actual: readonly StressCode[],
  expected: BinaryStressPattern,
): boolean[] | null {
  if (actual.length !== expected.length) return null;
  const binary = toBinaryStress(actual);
  return expected.map((bit, i) => binary[i] !== bit);
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
  const options: BuildMeteredLineOptions = Array.isArray(patternOrOptions)
    ? {
        pattern: patternOrOptions,
        stressPatterns: maybeStressPatterns,
        stressOverrides: maybeStressOverrides,
        syllableOverrides: maybeSyllableOverrides,
      }
    : patternOrOptions;

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
  const lineStress: StressCode[] = [];

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
    lineStress.push(...aligned);
    cursor = syllableEnd;
  }

  const total = count.total;
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
