/**
 * Greg Fast / MorphAdorner-style OOV syllable heuristic.
 * ~85–90% accurate; dictionary lookup is preferred when available.
 *
 * @see https://metacpan.org/dist/Lingua-EN-Syllable
 * @see https://github.com/inkcheck/readability/blob/main/docs/syllables.md
 */

const SUB_SYL = [
  /cial$/,
  /tia$/,
  /cius$/,
  /cious$/,
  /giu/,
  /ion$/,
  /iou/,
  /sia$/,
  /.ely$/,
  /[^td]ed$/,
];

const ADD_SYL = [
  /ia/,
  /riet/,
  /dien/,
  /iu/,
  /io/,
  /ii/,
  /[aeiouym]bl$/,
  /[aeiou]{3}/,
  /^mc/,
  /ism$/,
  /([^aeiouy])\1l$/,
  /[^l]lien/,
  /^coa[dglx]./,
  /[^gq]ua[^auieo]/,
  /dnt$/,
];

/** Estimate syllables from spelling for words missing from the dictionary. */
export function countHeuristic(normalized: string): number {
  let word = normalized.toLowerCase().replace(/'/g, "");
  if (!word) return 0;
  if (word.length <= 1) return 1;
  if (word === "w") return 2;

  // Strip silent final e before grouping (Greg Fast).
  word = word.replace(/e$/, "");

  const groups = word.split(/[^aeiouy]+/).filter(Boolean);
  let syl = groups.length;

  for (const re of SUB_SYL) {
    if (re.test(word)) syl -= 1;
  }
  for (const re of ADD_SYL) {
    if (re.test(word)) syl += 1;
  }

  return Math.max(1, syl);
}
