/**
 * Lowercase, straighten apostrophes, strip to letters + apostrophe
 * (and hyphens when keepHyphen is set, for override / compound keys).
 */
export function normalizeWord(
  word: string,
  options?: { keepHyphen?: boolean },
): string {
  const strip = options?.keepHyphen ? /[^\p{L}'-]/gu : /[^\p{L}']/gu;
  return word
    .toLowerCase()
    .replace(/['\u2019]/g, "'")
    .replace(strip, "");
}

/** Trim + lowercase + straighten apostrophes for rhyme/thesaurus keys. */
export function normalizeLookupKey(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, "'");
}
