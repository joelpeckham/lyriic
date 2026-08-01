import { createLazyJsonData, normalizeLookupKey } from "@/lib/data/lazyJson";

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
 */
export function lookupSynonyms(word: string): string[] {
  const data = store.get();
  if (!data) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];
  return data[key] ?? [];
}

/** Test helper — inject a map without hitting the JSON chunk. */
export function __setThesaurusDataForTests(map: SynonymMap | null): void {
  store.__setForTests(map);
}
