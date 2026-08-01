import { createLazyJsonData, normalizeLookupKey } from "@/lib/data/lazyJson";
import { lookupForms } from "@/lib/wordLookup/lookupForms";

type SynonymMap = Record<string, string[]>;

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

/**
 * Sync lookup after {@link loadThesaurus} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 * Also checks inflectional bases (remains → remain) so verb senses surface.
 */
export function lookupSynonyms(word: string): string[] {
  const data = store.get();
  if (!data) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];

  const out: string[] = [];
  const seen = new Set<string>([key]);
  for (const form of lookupForms(key)) {
    const syns = data[form];
    if (!syns) continue;
    for (const syn of syns) {
      if (seen.has(syn)) continue;
      seen.add(syn);
      out.push(syn);
    }
  }
  return out;
}

/** Test helper — inject a map without hitting the JSON chunk. */
export function __setThesaurusDataForTests(map: SynonymMap | null): void {
  store.__setForTests(map);
}
