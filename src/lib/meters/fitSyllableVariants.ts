/**
 * When a metered line is over/under target, try dictionary syllable alts
 * (1–2 words) to hit the count. Prefers fits that also improve stress match.
 * When count already matches, try same-syllable stress alts.
 */

import type { StressCode } from "@/lib/data/dictPack";
import {
  isVariantsReady,
  lookupSyllableVariants,
  type ResolvedSyllableVariant,
} from "@/lib/data/variants";
import { countWord } from "@/lib/syllables/countWord";
import { normalizeWord } from "@/lib/syllables/normalize";
import {
  isValidOverrideCount,
  normalizeOverrideKey,
} from "@/lib/syllables/overrides";
import { resolveWordStress } from "@/lib/stress";
import type { BinaryStressPattern } from "./feet";
import {
  applyMetricalMonosyllables,
  hasStressOverride,
  stressMismatchMask,
} from "./scanLineStress";
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

/** Keep rightmost primary; demote earlier primaries to secondary. */
function demoteExtraPrimaries(pattern: StressCode[]): StressCode[] {
  let keep = -1;
  for (let i = pattern.length - 1; i >= 0; i--) {
    if (pattern[i] === 1) {
      keep = i;
      break;
    }
  }
  if (keep < 0) return pattern;
  for (let i = 0; i < pattern.length; i++) {
    if (i !== keep && pattern[i] === 1) pattern[i] = 2;
  }
  return pattern;
}

/**
 * Alts for a token: whole-word variants.bin, else synthesize from hyphen parts.
 */
function altsForToken(
  word: string,
  primarySyl: number,
): ResolvedSyllableVariant[] {
  const direct = lookupSyllableVariants(word);
  if (direct.length > 0) return direct;

  const memo = normalizeWord(word, { keepHyphen: true });
  if (!memo.includes("-")) return [];

  const parts = memo
    .split("-")
    .map((part) => normalizeWord(part))
    .filter(Boolean);
  if (parts.length < 2) return [];

  const partInfos = parts.map((part) => {
    const syl = countWord(part, {}).count;
    const stress = resolveWordStress(part).pattern;
    return {
      syl,
      stress,
      alts: lookupSyllableVariants(part),
    };
  });

  const out: ResolvedSyllableVariant[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < partInfos.length; i++) {
    const info = partInfos[i]!;
    for (const alt of info.alts) {
      let totalSyl = 0;
      const stress: StressCode[] = [];
      for (let j = 0; j < partInfos.length; j++) {
        if (j === i) {
          totalSyl += alt.syllables;
          stress.push(...alt.stress);
        } else {
          const other = partInfos[j]!;
          totalSyl += other.syl;
          stress.push(...other.stress);
        }
      }
      demoteExtraPrimaries(stress);
      if (totalSyl < 1) continue;
      // Skip no-op same count + same stress as primary compound.
      if (totalSyl === primarySyl) {
        // Still useful for stress repair — keep.
      }
      const key = `${totalSyl}:${stress.join(",")}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ syllables: totalSyl, stress: stress.slice() });
    }
  }
  return out;
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
  /** When true, include same-syllable (stress-only) alts. */
  includeSameSyl: boolean,
): Candidate[] {
  const out: Candidate[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    if (token.syllables <= 0) continue;
    if (hasSyllableOverride(token.word, syllableOverrides)) continue;
    const alts = altsForToken(token.word, token.syllables);
    for (const alt of alts) {
      if (!includeSameSyl && alt.syllables === token.syllables) continue;
      if (includeSameSyl && alt.syllables !== token.syllables) continue;
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

function cloneTokens(tokens: readonly MeteredToken[]): MeteredToken[] {
  return tokens.map((t) => ({ ...t, stress: t.stress.slice() }));
}

function mismatchFailures(
  tokens: readonly MeteredToken[],
  expectedStress: BinaryStressPattern | null | undefined,
  stressOverrides: Record<string, number>,
): number {
  if (!expectedStress || expectedStress.length === 0) return 0;
  const clone = cloneTokens(tokens);
  applyMetricalMonosyllables(clone, expectedStress, stressOverrides);
  const actual: StressCode[] = [];
  for (const t of clone) actual.push(...t.stress);
  const mask = stressMismatchMask(actual, expectedStress);
  if (mask === null) return expectedStress.length;
  return mask.reduce((n, bit) => n + (bit ? 1 : 0), 0);
}

function scoreChoices(
  tokens: readonly MeteredToken[],
  choices: readonly AltChoice[],
  expectedStress: BinaryStressPattern | null | undefined,
  stressOverrides: Record<string, number>,
): number {
  const clone = cloneTokens(tokens);
  applySyllableVariantFit(clone, choices);
  return mismatchFailures(clone, expectedStress, stressOverrides);
}

/** Prefer fewer stress failures; then fewer words; then size; then leftmost. */
function compareSingle(
  a: Candidate,
  b: Candidate,
  need: number,
  tokens: readonly MeteredToken[],
  expectedStress: BinaryStressPattern | null | undefined,
  stressOverrides: Record<string, number>,
): number {
  const aScore = scoreChoices(
    tokens,
    [toChoice(a, stressOverrides, tokens)],
    expectedStress,
    stressOverrides,
  );
  const bScore = scoreChoices(
    tokens,
    [toChoice(b, stressOverrides, tokens)],
    expectedStress,
    stressOverrides,
  );
  if (aScore !== bScore) return aScore - bScore;
  if (need < 0) {
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
  tokens: readonly MeteredToken[],
  expectedStress: BinaryStressPattern | null | undefined,
  stressOverrides: Record<string, number>,
): number {
  const aChoices = [
    toChoice(a[0], stressOverrides, tokens),
    toChoice(a[1], stressOverrides, tokens),
  ];
  const bChoices = [
    toChoice(b[0], stressOverrides, tokens),
    toChoice(b[1], stressOverrides, tokens),
  ];
  const aScore = scoreChoices(tokens, aChoices, expectedStress, stressOverrides);
  const bScore = scoreChoices(tokens, bChoices, expectedStress, stressOverrides);
  if (aScore !== bScore) return aScore - bScore;
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
  expectedStress: BinaryStressPattern | null = null,
): AltChoice[] | null {
  if (need === 0 || !isVariantsReady()) return null;
  const candidates = collectCandidates(tokens, syllableOverrides, false);
  if (candidates.length === 0) return null;

  const singles = candidates.filter((c) => c.delta === need);
  if (singles.length > 0) {
    singles.sort((a, b) =>
      compareSingle(a, b, need, tokens, expectedStress, stressOverrides),
    );
    return [toChoice(singles[0]!, stressOverrides, tokens)];
  }

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
  pairs.sort((a, b) =>
    comparePair(a, b, need, tokens, expectedStress, stressOverrides),
  );
  const best = pairs[0]!;
  return [
    toChoice(best[0], stressOverrides, tokens),
    toChoice(best[1], stressOverrides, tokens),
  ];
}

/**
 * When syllable count already matches, try same-syllable stress alts (1–2 words)
 * to reduce contour mismatches. Returns true if tokens were mutated.
 */
export function fitLineStressVariants(
  tokens: MeteredToken[],
  expectedStress: BinaryStressPattern,
  syllableOverrides: Record<string, number> = {},
  stressOverrides: Record<string, number> = {},
): boolean {
  if (!isVariantsReady() || expectedStress.length === 0) return false;
  const baseline = mismatchFailures(tokens, expectedStress, stressOverrides);
  if (baseline === 0) return false;

  const candidates = collectCandidates(tokens, syllableOverrides, true);
  if (candidates.length === 0) return false;

  let bestChoices: AltChoice[] | null = null;
  let bestScore = baseline;

  for (const c of candidates) {
    const choices = [toChoice(c, stressOverrides, tokens)];
    // Skip no-op stress (identical pattern).
    const token = tokens[c.tokenIndex]!;
    if (
      token.stress.length === choices[0]!.stress.length &&
      token.stress.every((s, i) => s === choices[0]!.stress[i])
    ) {
      continue;
    }
    const score = scoreChoices(
      tokens,
      choices,
      expectedStress,
      stressOverrides,
    );
    if (score < bestScore) {
      bestScore = score;
      bestChoices = choices;
    }
  }

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const a = candidates[i]!;
      const b = candidates[j]!;
      if (a.tokenIndex === b.tokenIndex) continue;
      const choices = [
        toChoice(a, stressOverrides, tokens),
        toChoice(b, stressOverrides, tokens),
      ];
      const score = scoreChoices(
        tokens,
        choices,
        expectedStress,
        stressOverrides,
      );
      if (score < bestScore) {
        bestScore = score;
        bestChoices = choices;
      }
    }
  }

  if (!bestChoices || bestScore >= baseline) return false;
  applySyllableVariantFit(tokens, bestChoices);
  return true;
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
  expectedStress: BinaryStressPattern | null = null,
): number {
  const need = target - total;
  const choices = chooseSyllableVariantFit(
    tokens,
    need,
    syllableOverrides,
    stressOverrides,
    expectedStress,
  );
  if (!choices) return total;
  return applySyllableVariantFit(tokens, choices);
}
