/** Shared lemma normalization for build-thesaurus / build-rhyme-index. */

/** Single token: letters with optional internal apostrophes (matches tokenizer). */
export const WORD_RE = /^[a-z]+(?:'[a-z]+)*$/;

/**
 * @param {string} value
 * @returns {string | null}
 */
export function normalizeLemma(value) {
  const word = value
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, "'");
  if (!WORD_RE.test(word)) return null;
  if (word.length < 2 || word.length > 28) return null;
  return word;
}
