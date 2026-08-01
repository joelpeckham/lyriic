import { createLazyJsonData, normalizeLookupKey } from "@/lib/data/lazyJson";
import { lookupForms } from "@/lib/wordLookup/lookupForms";

import type { WordUsage } from "./usage";

export type { WordUsage };

/** Synonyms grouped by WordNet-style usage (n/v/a/r). */
export type SynonymGroups = Partial<Record<WordUsage, string[]>>;

type SynonymMap = Record<string, SynonymGroups>;

export type ThesaurusCandidate = {
  word: string;
  /** True when the synonym shares the detected usage of the query word. */
  matchesUsage: boolean;
};

const USAGE_ORDER: WordUsage[] = ["n", "v", "a", "r"];

const store = createLazyJsonData<SynonymMap>(
  () => import("./data/synonyms.json"),
);

/** Lazy-load the embedded synonym map (separate Vite chunk). */
export function loadThesaurus(): Promise<SynonymMap> {
  return store.load();
}

/** True once the synonym map has finished loading. */
export function isThesaurusReady(): boolean {
  return store.isReady();
}

function groupsFor(data: SynonymMap, form: string): SynonymGroups | null {
  const groups = data[form];
  return groups && Object.keys(groups).length > 0 ? groups : null;
}

/**
 * Inflectional candidates present in the map, with aggressive false stems
 * dropped when a better silent-e / -fe lemma also exists.
 */
function dictionaryForms(data: SynonymMap, key: string): string[] {
  const raw = lookupForms(key);
  const present = raw.filter((form) => form === key || groupsFor(data, form));

  return present.filter((form) => {
    if (form === key) return true;
    // hoped/scared: drop hop/scar when hope/scare is in the map.
    if (
      (key.endsWith("ed") || key.endsWith("ing")) &&
      present.includes(`${form}e`)
    ) {
      return false;
    }
    // leaves: drop leaf when leave is in the map.
    if (
      key.endsWith("ves") &&
      form.endsWith("f") &&
      !form.endsWith("ff") &&
      present.includes(`${form}e`)
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Sync lookup after {@link loadThesaurus} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 * Also checks inflectional bases (remains → remain) so verb senses surface.
 * When `usage` is set, synonyms for that usage are marked and listed first.
 */
export function lookupSynonyms(
  word: string,
  usage: WordUsage | null = null,
): ThesaurusCandidate[] {
  const data = store.get();
  if (!data) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];

  const forms = dictionaryForms(data, key);
  const surfaceGroups = groupsFor(data, key);

  /** Best tier per synonym: true = matches requested usage. */
  const best = new Map<string, boolean>();
  const order: string[] = [];

  function absorb(syn: string, matched: boolean): void {
    if (!syn || syn === key) return;
    const prev = best.get(syn);
    if (prev === undefined) {
      best.set(syn, matched);
      order.push(syn);
      return;
    }
    if (matched && !prev) best.set(syn, true);
  }

  for (const form of forms) {
    const groups = groupsFor(data, form);
    if (!groups) continue;

    // Surface form (or missing surface): take all POS. Inflectional bases when
    // the surface already exists: verbs only (remains → remain, not news → new).
    const usages: WordUsage[] =
      form === key || !surfaceGroups ? USAGE_ORDER : ["v"];

    if (usage && usages.includes(usage)) {
      for (const syn of groups[usage] ?? []) absorb(syn, true);
    }

    for (const pos of usages) {
      if (usage && pos === usage) continue;
      for (const syn of groups[pos] ?? []) absorb(syn, false);
    }
  }

  const matched: string[] = [];
  const other: string[] = [];
  for (const syn of order) {
    if (best.get(syn)) matched.push(syn);
    else other.push(syn);
  }

  return [
    ...matched.map((w) => ({ word: w, matchesUsage: true })),
    ...other.map((w) => ({ word: w, matchesUsage: false })),
  ];
}

/** Test helper — inject a map without hitting the JSON chunk. */
export function __setThesaurusDataForTests(map: SynonymMap | null): void {
  store.__setForTests(map);
}
