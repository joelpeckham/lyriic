/**
 * When a metered line is over/under target, try dictionary syllable alts
 * (1–2 words) to hit the count.
 */

import type { StressCode } from "@/lib/data/dictPack";
import {
  isVariantsReady,
  lookupSyllableVariants,
  type ResolvedSyllableVariant,
} from "@/lib/data/variants";
import { isValidOverrideCount, normalizeOverrideKey } from "@/lib/syllables/overrides";
import { hasStressOverride } from "./scanLineStress";
import type { MeteredToken } from "./types";

type AltChoice = {
  tokenIndex: number;
  syllables: number;
  stress: StressCode[];
};

function hasSyllableOverride(
  word: string,
  syllableOverrides: Record<string, number>,
): boolean {
  const key = normalizeOverrideKey(word);
  if (!key) return false;
  return isValidOverrideCount(syllableOverrides[key]);
}

function patternFromPrimary(
  syllableCount: number,
  primaryIndex: number,
): StressCode[] {
  const n = Math.max(0, Math.floor(syllableCount));
  if (n <= 0) return [];
  const pattern = new Array<StressCode>(n).fill(0);
  pattern[Math.min(Math.max(0, primaryIndex), n - 1)] = 1;
  return pattern;
}

function resolveAppliedStress(
  word: string,
  syllables: number,
  stress: StressCode[],
  stressOverrides: Record<string, number>,
): StressCode[] {
  if (hasStressOverride(word, stressOverrides, syllables)) {
    const key = normalizeOverrideKey(word);
    const index = Math.floor(stressOverrides[key!]!);
    return patternFromPrimary(syllables, index);
  }
  return stress;
}

type Candidate = {
  tokenIndex: number;
  primarySyl: number;
  alt: ResolvedSyllableVariant;
  delta: number;
};

function collectCandidates(
  tokens: readonly MeteredToken[],
  syllableOverrides: Record<string, number>,
): Candidate[] {
  const out: Candidate[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    if (token.syllables <= 0) continue;
    if (hasSyllableOverride(token.word, syllableOverrides)) continue;
    const alts = lookupSyllableVariants(token.word);
    for (const alt of alts) {
      if (alt.syllables === token.syllables) continue;
      out.push({
        tokenIndex: i,
        primarySyl: token.syllables,
        alt,
        delta: alt.syllables - token.syllables,
      });
    }
  }
  return out;
}

/** Prefer fewer words; then size toward target; then leftmost. */
function compareSingle(
  a: Candidate,
  b: Candidate,
  need: number,
): number {
  if (need < 0) {
    // Over: prefer smaller alt syllable count.
    if (a.alt.syllables !== b.alt.syllables) {
      return a.alt.syllables - b.alt.syllables;
    }
  } else if (need > 0) {
    if (a.alt.syllables !== b.alt.syllables) {
      return b.alt.syllables - a.alt.syllables;
    }
  }
  return a.tokenIndex - b.tokenIndex;
}

function comparePair(
  a: [Candidate, Candidate],
  b: [Candidate, Candidate],
  need: number,
): number {
  if (a[0].tokenIndex !== b[0].tokenIndex) {
    return a[0].tokenIndex - b[0].tokenIndex;
  }
  if (a[1].tokenIndex !== b[1].tokenIndex) {
    return a[1].tokenIndex - b[1].tokenIndex;
  }
  const aSum = a[0].alt.syllables + a[1].alt.syllables;
  const bSum = b[0].alt.syllables + b[1].alt.syllables;
  if (need < 0 && aSum !== bSum) return aSum - bSum;
  if (need > 0 && aSum !== bSum) return bSum - aSum;
  return 0;
}

function toChoice(
  c: Candidate,
  stressOverrides: Record<string, number>,
  tokens: readonly MeteredToken[],
): AltChoice {
  const word = tokens[c.tokenIndex]!.word;
  return {
    tokenIndex: c.tokenIndex,
    syllables: c.alt.syllables,
    stress: resolveAppliedStress(
      word,
      c.alt.syllables,
      c.alt.stress,
      stressOverrides,
    ),
  };
}

/**
 * Choose 1–2 alt pronunciations so line total moves by `need` (= target - total).
 * Returns null when no solution.
 */
export function chooseSyllableVariantFit(
  tokens: readonly MeteredToken[],
  need: number,
  syllableOverrides: Record<string, number> = {},
  stressOverrides: Record<string, number> = {},
): AltChoice[] | null {
  if (need === 0 || !isVariantsReady()) return null;
  const candidates = collectCandidates(tokens, syllableOverrides);
  if (candidates.length === 0) return null;

  const singles = candidates.filter((c) => c.delta === need);
  if (singles.length > 0) {
    singles.sort((a, b) => compareSingle(a, b, need));
    return [toChoice(singles[0]!, stressOverrides, tokens)];
  }

  /** @type {[Candidate, Candidate][]} */
  const pairs: [Candidate, Candidate][] = [];
  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const a = candidates[i]!;
      const b = candidates[j]!;
      if (a.tokenIndex === b.tokenIndex) continue;
      if (a.delta + b.delta !== need) continue;
      const ordered =
        a.tokenIndex < b.tokenIndex ? ([a, b] as const) : ([b, a] as const);
      pairs.push([ordered[0], ordered[1]]);
    }
  }
  if (pairs.length === 0) return null;
  pairs.sort((a, b) => comparePair(a, b, need));
  const best = pairs[0]!;
  return [
    toChoice(best[0], stressOverrides, tokens),
    toChoice(best[1], stressOverrides, tokens),
  ];
}

/** Apply fit choices and realign cumulative syllable spans. Returns new total. */
export function applySyllableVariantFit(
  tokens: MeteredToken[],
  choices: readonly AltChoice[],
): number {
  for (const choice of choices) {
    const token = tokens[choice.tokenIndex];
    if (!token) continue;
    token.syllables = choice.syllables;
    token.stress = choice.stress;
  }
  let cursor = 0;
  for (const token of tokens) {
    token.syllableStart = cursor;
    token.syllableEnd = cursor + token.syllables;
    cursor = token.syllableEnd;
  }
  return cursor;
}

/**
 * If the line misses `target`, try fitting dictionary alts. Mutates tokens.
 * Returns the (possibly updated) total.
 */
export function fitLineSyllableVariants(
  tokens: MeteredToken[],
  total: number,
  target: number,
  syllableOverrides: Record<string, number> = {},
  stressOverrides: Record<string, number> = {},
): number {
  const need = target - total;
  const choices = chooseSyllableVariantFit(
    tokens,
    need,
    syllableOverrides,
    stressOverrides,
  );
  if (!choices) return total;
  return applySyllableVariantFit(tokens, choices);
}
