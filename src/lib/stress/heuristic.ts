import type { StressCode } from "@/lib/data/dictPack";

/**
 * Single-letter lemmas are excluded from the lexicon (`length < 2`).
 * Treat them as unstressed function words for meter.
 */
const WEAK_FUNCTION_WORDS = new Set(["a", "i", "o"]);

/** True when the normalized lemma should resolve as unstressed monosyllable. */
export function isWeakFunctionWord(normalized: string): boolean {
  return WEAK_FUNCTION_WORDS.has(normalized);
}

/**
 * OOV fallback: monosyllables are unstressed; multi-syllable words get
 * primary stress on the first syllable.
 */
export function heuristicStress(syllableCount: number): StressCode[] {
  const n = Math.max(0, Math.floor(syllableCount));
  if (n <= 0) return [];
  const pattern = new Array<StressCode>(n).fill(0);
  if (n >= 2) pattern[0] = 1;
  return pattern;
}
