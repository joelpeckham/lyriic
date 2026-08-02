import type { StressCode } from "@/lib/data/dictPack";

/**
 * Common monosyllabic function words: citation stress is unstressed.
 * Meter scansion may still bend them to the beat.
 */
const WEAK_FUNCTION_WORDS = new Set([
  "a",
  "an",
  "the",
  "of",
  "to",
  "in",
  "on",
  "at",
  "for",
  "from",
  "with",
  "by",
  "as",
  "and",
  "or",
  "but",
  "if",
  "than",
  "that",
  "is",
  "are",
  "was",
  "were",
  "be",
  "am",
  "do",
  "does",
  "did",
  "have",
  "has",
  "had",
  "will",
  "would",
  "shall",
  "should",
  "can",
  "could",
  "may",
  "might",
  "must",
  "i",
  "o",
  "my",
  "his",
  "her",
  "its",
  "our",
  "your",
  "their",
]);

/** True when the normalized lemma should resolve as unstressed monosyllable. */
export function isWeakFunctionWord(normalized: string): boolean {
  return WEAK_FUNCTION_WORDS.has(normalized);
}

/**
 * Primary-stress index for an OOV multi-syllable word from light English
 * suffix rules. Returns null to use the default (first syllable).
 */
export function heuristicPrimaryIndex(
  word: string,
  syllableCount: number,
): number | null {
  const n = Math.max(0, Math.floor(syllableCount));
  if (n < 2) return null;
  const w = word.toLowerCase();

  // Antepenult: -ity / -ety / -ify / -ical / -ogy / -ophy / -graphy
  if (
    n >= 3 &&
    (w.endsWith("ity") ||
      w.endsWith("ety") ||
      w.endsWith("ify") ||
      w.endsWith("ical") ||
      w.endsWith("ogy") ||
      w.endsWith("ophy") ||
      w.endsWith("graphy") ||
      w.endsWith("aphy"))
  ) {
    return n - 3;
  }

  // Penult: -tion / -sion / -cion / -ic (incl. -aic) / -eous
  // Intentionally omit broad -ious/-uous/-ics/-ion/-ial/-ian (too many
  // first-stress exceptions: curious, politics, champion, indian, …).
  if (
    w.endsWith("tion") ||
    w.endsWith("sion") ||
    w.endsWith("cion") ||
    w.endsWith("eous") ||
    w.endsWith("ic")
  ) {
    return n - 2;
  }

  // First syllable: -ment / -ness / -less / -ful (not -ly: supply, assembly)
  if (
    w.endsWith("ment") ||
    w.endsWith("ness") ||
    w.endsWith("less") ||
    w.endsWith("ful")
  ) {
    return 0;
  }

  return null;
}

/**
 * OOV fallback: monosyllables are unstressed; multi-syllable words get
 * primary stress from suffix heuristics, else the first syllable.
 */
export function heuristicStress(
  syllableCount: number,
  word = "",
): StressCode[] {
  const n = Math.max(0, Math.floor(syllableCount));
  if (n <= 0) return [];
  const pattern = new Array<StressCode>(n).fill(0);
  if (n === 1) return pattern;
  const fromSuffix = word ? heuristicPrimaryIndex(word, n) : null;
  const idx =
    fromSuffix !== null
      ? Math.min(Math.max(0, fromSuffix), n - 1)
      : 0;
  pattern[idx] = 1;
  return pattern;
}
