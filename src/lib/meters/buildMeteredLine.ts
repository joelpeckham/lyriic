import {
  stressPatternForLine,
  targetForLine,
  type BinaryStressPattern,
} from "./presets";
import { fitLineSyllableVariants } from "./fitSyllableVariants";
import {
  applyLiteraryMatch,
  matchLiteraryStress,
  type LiteraryMatchResult,
} from "./literaryAllowances";
import {
  flattenTokenStress,
  stressMismatchMask,
} from "./scanLineStress";
import type { MeteredLine, MeteredToken, MeterStatus } from "./types";
import type { StressCode } from "@/lib/data/dictPack";
import { isStressReady } from "@/lib/data/stress";
import { resolveWordStress } from "@/lib/stress";
import type { FootId } from "./feet";
import type { LineSyllableCount, WordToken } from "@/lib/syllables/types";

export type { MeteredLine, MeteredToken, MeterStatus } from "./types";
export { stressMismatchMask } from "./scanLineStress";

export type BuildMeteredLineOptions = {
  pattern: readonly number[];
  stressPatterns?: readonly BinaryStressPattern[];
  /** Dominant foot; drives literary allowances (inversion, feminine, catalexis). */
  footId?: FootId | null;
  stressOverrides?: Record<string, number>;
  syllableOverrides?: Record<string, number>;
};

function isBuildOptions(
  value: readonly number[] | BuildMeteredLineOptions,
): value is BuildMeteredLineOptions {
  return !Array.isArray(value);
}

function cloneMeteredTokens(tokens: readonly MeteredToken[]): MeteredToken[] {
  return tokens.map((t) => ({
    ...t,
    stress: t.stress.slice(),
  }));
}

function restoreMeteredTokens(
  tokens: MeteredToken[],
  snapshot: readonly MeteredToken[],
): void {
  for (let i = 0; i < tokens.length; i++) {
    const src = snapshot[i];
    const dst = tokens[i];
    if (!src || !dst) continue;
    dst.syllables = src.syllables;
    dst.stress = src.stress.slice();
    dst.syllableStart = src.syllableStart;
    dst.syllableEnd = src.syllableEnd;
    dst.source = src.source;
  }
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
    footId = null,
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
  const citationTotal = total;
  const citationSnapshot =
    target !== null && total !== target && total > 0
      ? cloneMeteredTokens(tokens)
      : null;

  // Dictionary / curated alts: bend syllable counts toward the meter target.
  if (citationSnapshot) {
    total = fitLineSyllableVariants(
      tokens,
      total,
      target!,
      syllableOverrides,
      stressOverrides,
      expectedStress,
    );
  }

  let fit: MeteredLine["fit"];
  let matchedStress: MeteredLine["matchedStress"];

  // Literary scansion: ideal + inversion / feminine / catalexis.
  if (expectedStress !== null && total > 0) {
    let literary: LiteraryMatchResult = matchLiteraryStress(
      tokens,
      expectedStress,
      footId,
      stressOverrides,
      syllableOverrides,
    );

    // If syllable variants stole a valid feminine/catalexis reading, restore it.
    if (
      !literary.ok &&
      citationSnapshot &&
      total !== citationTotal
    ) {
      const citationLiterary = matchLiteraryStress(
        citationSnapshot,
        expectedStress,
        footId,
        stressOverrides,
        syllableOverrides,
      );
      if (citationLiterary.ok) {
        restoreMeteredTokens(tokens, citationSnapshot);
        total = citationTotal;
        literary = citationLiterary;
      }
    }

    if (literary.bentTokens) {
      applyLiteraryMatch(tokens, literary.bentTokens);
    }
    matchedStress = literary.matchedStress;
    if (literary.ok) {
      fit = literary.fit;
    }
  }

  let status: MeterStatus = "none";
  if (target !== null) {
    if (total === 0 && !count.tokens.length) {
      status = "none";
    } else if (fit) {
      // Accepted literary contour (may differ in length from nominal target).
      status = "exact";
    } else if (
      expectedStress !== null &&
      isStressReady() &&
      matchedStress != null &&
      matchedStress.length === total
    ) {
      // Length matches a literary candidate; classify stress before under/over.
      const lineStress = flattenTokenStress(tokens);
      const mask = stressMismatchMask(lineStress, matchedStress);
      if (mask !== null && mask.some(Boolean)) {
        status = "stress";
      } else {
        status = "exact";
      }
    } else if (total < target) {
      status = "under";
    } else if (total > target) {
      status = "over";
    } else if (
      expectedStress !== null &&
      isStressReady() &&
      !stressMatchesIdeal(tokens, expectedStress)
    ) {
      // Fallback when no length-matched literary candidate existed.
      status = "stress";
    } else {
      // Syllable count matches; treat as exact while stress pack is loading
      // (avoid heuristic flash labeled "stress").
      status = "exact";
    }
  }

  return {
    total,
    target,
    status,
    tokens,
    expectedStress,
    fit,
    matchedStress: matchedStress ?? null,
  };
}

function stressMatchesIdeal(
  tokens: readonly MeteredToken[],
  expected: BinaryStressPattern,
): boolean {
  const mask = stressMismatchMask(flattenTokenStress(tokens), expected);
  if (mask === null) return false;
  return !mask.some(Boolean);
}
