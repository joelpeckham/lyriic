/**
 * Prefix autocomplete against the sorted lexicon word list.
 */

import { getLexicon, syllablesForId } from "@/lib/data/lexicon";
import { normalizeLookupKey, normalizeWord } from "@/lib/syllables/normalize";

const DEFAULT_LIMIT = 8;
const MIN_PREFIX_LEN = 2;

/** First index where `words[i] >= prefix` (sorted ascending). */
function lowerBound(words: readonly string[], prefix: string): number {
  let lo = 0;
  let hi = words.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if ((words[mid] ?? "") < prefix) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Return lexicon lemmas that start with `prefix`, in sorted order.
 * Skips entries with unusable syllable counts (`syllables < 1`).
 */
export function suggestWords(prefix: string, limit: number = DEFAULT_LIMIT): string[] {
  const lex = getLexicon();
  if (!lex) return [];

  const key = normalizeLookupKey(normalizeWord(prefix.trim()));
  if (!key || key.length < MIN_PREFIX_LEN) return [];

  const max = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : DEFAULT_LIMIT;
  if (max === 0) return [];

  const { words } = lex;
  const out: string[] = [];
  for (let i = lowerBound(words, key); i < words.length; i++) {
    const word = words[i]!;
    if (!word.startsWith(key)) break;
    if (syllablesForId(i) === undefined) continue;
    out.push(word);
    if (out.length >= max) break;
  }
  return out;
}
