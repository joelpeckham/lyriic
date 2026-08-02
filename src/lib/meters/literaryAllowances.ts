/**
 * Literary scansion allowances: acceptable contours beyond the ideal grid
 * (first-foot inversion, feminine ending, catalexis).
 */

import { isStressReady } from "@/lib/data/stress";
import { isVariantsReady } from "@/lib/data/variants";
import type { FootId } from "./feet";
import { fitLineStressVariants } from "./fitSyllableVariants";
import type { BinaryStressPattern } from "./presets";
import {
  applyMetricalMonosyllables,
  flattenTokenStress,
  stressMismatchMask,
} from "./scanLineStress";
import type { LiteraryFit, MeteredToken } from "./types";

export type { LiteraryFit };

export type LiteraryCandidate = {
  pattern: BinaryStressPattern;
  fit: LiteraryFit;
};

export type LiteraryMatchResult = {
  /** True when some acceptable contour matches with zero mismatches. */
  ok: boolean;
  fit?: LiteraryFit;
  /** Best-fitting acceptable contour (for break highlighting). */
  matchedStress: BinaryStressPattern | null;
  /** Mismatch count against the best contour. */
  bestFailures: number;
  /** Token stress after bending to the best contour (apply when ok or for breaks). */
  bentTokens: MeteredToken[] | null;
};

function cloneTokens(tokens: readonly MeteredToken[]): MeteredToken[] {
  return tokens.map((t) => ({ ...t, stress: t.stress.slice() }));
}

function invertFirstFoot(
  pattern: BinaryStressPattern,
  footLen: number,
): BinaryStressPattern | null {
  if (pattern.length < footLen || footLen < 2) return null;
  const head = pattern.slice(0, footLen);
  const inverted = head.map((bit) => (bit === 0 ? 1 : 0)) as (0 | 1)[];
  // Only emit when the head actually changes (duple inversion).
  if (inverted.every((bit, i) => bit === head[i])) return null;
  return [...inverted, ...pattern.slice(footLen)];
}

function pushUnique(
  out: LiteraryCandidate[],
  seen: Set<string>,
  pattern: BinaryStressPattern,
  fit: LiteraryFit,
): void {
  const key = `${fit}:${pattern.join(",")}`;
  if (seen.has(key)) return;
  seen.add(key);
  out.push({ pattern, fit });
}

/**
 * Acceptable contours for a line’s ideal stress pattern and foot.
 * Order prefers ideal, then inversion, then length-shifted allowances.
 */
export function literaryCandidates(
  ideal: BinaryStressPattern,
  footId: FootId | null | undefined,
): LiteraryCandidate[] {
  const out: LiteraryCandidate[] = [];
  const seen = new Set<string>();
  if (ideal.length === 0) return out;

  pushUnique(out, seen, ideal, "ideal");

  if (footId === "iamb" || footId === "trochee") {
    const inverted = invertFirstFoot(ideal, 2);
    if (inverted) pushUnique(out, seen, inverted, "inversion");
  }

  if (footId === "iamb" || footId === "amphibrach") {
    pushUnique(out, seen, [...ideal, 0], "feminine");
  }
  // Inverted + feminine is traditional for iamb only (duple first-foot flip).
  if (footId === "iamb") {
    const inverted = invertFirstFoot(ideal, 2);
    if (inverted) {
      pushUnique(out, seen, [...inverted, 0], "feminine");
    }
  }

  if (footId === "trochee") {
    // Drop final weak of a falling duple line → ends strong.
    if (ideal.length >= 2 && ideal[ideal.length - 1] === 0) {
      pushUnique(out, seen, ideal.slice(0, -1), "catalexis");
      const inverted = invertFirstFoot(ideal, 2);
      if (inverted && inverted[inverted.length - 1] === 0) {
        pushUnique(out, seen, inverted.slice(0, -1), "catalexis");
      }
    }
  }

  if (footId === "dactyl") {
    // Drop trailing unstressed syllable(s) from the final foot.
    if (ideal.length >= 2 && ideal[ideal.length - 1] === 0) {
      pushUnique(out, seen, ideal.slice(0, -1), "catalexis");
    }
    if (
      ideal.length >= 3 &&
      ideal[ideal.length - 1] === 0 &&
      ideal[ideal.length - 2] === 0
    ) {
      pushUnique(out, seen, ideal.slice(0, -2), "catalexis");
    }
  }

  return out;
}

function scoreCandidate(
  tokens: readonly MeteredToken[],
  expected: BinaryStressPattern,
  stressOverrides: Record<string, number>,
  syllableOverrides: Record<string, number>,
  tryStressVariants: boolean,
): { failures: number; bent: MeteredToken[] } {
  const bent = cloneTokens(tokens);
  applyMetricalMonosyllables(bent, expected, stressOverrides);
  if (
    tryStressVariants &&
    isStressReady() &&
    isVariantsReady() &&
    !stressMatches(bent, expected)
  ) {
    fitLineStressVariants(
      bent,
      expected,
      syllableOverrides,
      stressOverrides,
    );
    applyMetricalMonosyllables(bent, expected, stressOverrides);
  }
  const mask = stressMismatchMask(flattenTokenStress(bent), expected);
  const failures =
    mask === null ? expected.length : mask.reduce((n, bit) => n + (bit ? 1 : 0), 0);
  return { failures, bent };
}

function stressMatches(
  tokens: readonly MeteredToken[],
  expected: BinaryStressPattern,
): boolean {
  const mask = stressMismatchMask(flattenTokenStress(tokens), expected);
  return mask !== null && !mask.some(Boolean);
}

/**
 * Try acceptable literary contours whose length equals the line syllable total.
 * Mutates nothing; caller applies `bentTokens` when desired.
 */
export function matchLiteraryStress(
  tokens: readonly MeteredToken[],
  ideal: BinaryStressPattern,
  footId: FootId | null | undefined,
  stressOverrides: Record<string, number> = {},
  syllableOverrides: Record<string, number> = {},
): LiteraryMatchResult {
  const total = tokens.reduce((n, t) => n + t.syllables, 0);
  if (ideal.length === 0 || total <= 0) {
    return {
      ok: false,
      matchedStress: null,
      bestFailures: Infinity,
      bentTokens: null,
    };
  }

  const candidates = literaryCandidates(ideal, footId).filter(
    (c) => c.pattern.length === total,
  );
  if (candidates.length === 0) {
    return {
      ok: false,
      matchedStress: null,
      bestFailures: Infinity,
      bentTokens: null,
    };
  }

  // Stress alts help every length-matched contour (ideal, feminine, catalexis).
  const tryVariants = true;
  let bestFailures = Infinity;
  let bestFit: LiteraryFit | undefined;
  let bestPattern: BinaryStressPattern | null = null;
  let bestBent: MeteredToken[] | null = null;

  for (const candidate of candidates) {
    const { failures, bent } = scoreCandidate(
      tokens,
      candidate.pattern,
      stressOverrides,
      syllableOverrides,
      tryVariants,
    );
    if (failures < bestFailures) {
      bestFailures = failures;
      bestFit = candidate.fit;
      bestPattern = candidate.pattern;
      bestBent = bent;
    }
    if (failures === 0) {
      // Prefer earlier candidates (ideal before inversion, etc.).
      break;
    }
  }

  return {
    ok: bestFailures === 0,
    fit: bestFailures === 0 ? bestFit : undefined,
    matchedStress: bestPattern,
    bestFailures,
    bentTokens: bestBent,
  };
}

/** Apply bent token stress + syllable spans from a literary match. */
export function applyLiteraryMatch(
  tokens: MeteredToken[],
  bentTokens: readonly MeteredToken[],
): void {
  for (let i = 0; i < tokens.length; i++) {
    const src = bentTokens[i];
    const dst = tokens[i];
    if (!src || !dst) continue;
    dst.syllables = src.syllables;
    dst.stress = src.stress.slice();
    dst.syllableStart = src.syllableStart;
    dst.syllableEnd = src.syllableEnd;
  }
}
