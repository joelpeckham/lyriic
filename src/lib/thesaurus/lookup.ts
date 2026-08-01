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

  const matched: string[] = [];
  const other: string[] = [];
  const seen = new Set<string>([key]);

  for (const form of lookupForms(key)) {
    const groups = groupsFor(data, form);
    if (!groups) continue;

    const preferred = usage ? (groups[usage] ?? []) : [];
    for (const syn of preferred) {
      if (seen.has(syn)) continue;
      seen.add(syn);
      matched.push(syn);
    }

    for (const pos of USAGE_ORDER) {
      if (usage && pos === usage) continue;
      const syns = groups[pos];
      if (!syns) continue;
      for (const syn of syns) {
        if (seen.has(syn)) continue;
        seen.add(syn);
        other.push(syn);
      }
    }
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
