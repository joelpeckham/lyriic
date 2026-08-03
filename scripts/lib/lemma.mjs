/** Shared lemma normalization for pronunciation / thesaurus / rhyme / defs builds. */

/** Single token: letters with optional internal apostrophes (matches tokenizer). */
export const WORD_RE = /^[a-z]+(?:'[a-z]+)*$/;

/** Curated trailing-apostrophe lemmas (not open possessives like teachers'). */
const TRAILING_APOSTROPHE_LEMMAS = new Set(["th'"]);

/** High-frequency 1-letter lemmas allowed into pronunciation packs. */
const ONE_LETTER_LEMMAS = new Set(["a", "i"]);

/**
 * @param {string} value
 * @returns {string | null}
 */
export function normalizeLemma(value) {
  const word = value
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, "'");
  if (TRAILING_APOSTROPHE_LEMMAS.has(word)) return word;
  if (!WORD_RE.test(word)) return null;
  if (word.length === 1) {
    return ONE_LETTER_LEMMAS.has(word) ? word : null;
  }
  if (word.length < 2 || word.length > 28) return null;
  return word;
}
