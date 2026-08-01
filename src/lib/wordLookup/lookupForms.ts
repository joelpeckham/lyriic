/**
 * Surface form plus simple English inflectional bases for dictionary lookup.
 * Dictionaries are mostly lemmatized (remain, stay); typed words are often
 * inflected (remains, stays).
 */
export function lookupForms(word: string): string[] {
  const forms: string[] = [];
  const seen = new Set<string>();

  function add(form: string): void {
    if (!form || form.length < 2 || seen.has(form)) return;
    seen.add(form);
    forms.push(form);
  }

  add(word);

  if (word.endsWith("ies") && word.length > 4) {
    add(`${word.slice(0, -3)}y`);
  }
  if (word.endsWith("ves") && word.length > 4) {
    // knives → knife; leaves → leaf (leave comes from the -s strip).
    add(`${word.slice(0, -3)}fe`);
    add(`${word.slice(0, -3)}f`);
  }
  if (word.endsWith("ing") && word.length > 4) {
    const stem = word.slice(0, -3);
    if (stem.length >= 2 && stem.at(-1) === stem.at(-2)) {
      add(stem.slice(0, -1));
    } else {
      add(`${stem}e`);
      add(stem);
    }
  }
  if (word.endsWith("ed") && word.length > 3) {
    const stem = word.slice(0, -2);
    if (stem.length >= 2 && stem.at(-1) === stem.at(-2)) {
      add(stem.slice(0, -1));
    } else {
      add(`${stem}e`);
      add(stem);
    }
  }
  if (word.endsWith("es") && word.length > 3) {
    add(word.slice(0, -2));
  }
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 2) {
    add(word.slice(0, -1));
  }

  return forms;
}
