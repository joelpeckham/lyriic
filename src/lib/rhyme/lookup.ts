import { createLazyJsonData, normalizeLookupKey } from "@/lib/data/lazyJson";

export type RhymeIndex = {
  byWord: Record<string, string>;
  byKey: Record<string, string[]>;
};

const store = createLazyJsonData<RhymeIndex>(
  () => import("./data/rhyme-index.json"),
);

/** Lazy-load the embedded rhyme index (separate Vite chunk). */
export function loadRhymeIndex(): Promise<RhymeIndex> {
  return store.load();
}

/** True once the rhyme index has finished loading. */
export function isRhymeIndexReady(): boolean {
  return store.isReady();
}

/**
 * Sync lookup after {@link loadRhymeIndex} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 * Excludes the query word from the rhyme bucket.
 */
export function lookupRhymes(word: string): string[] {
  const data = store.get();
  if (!data) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];
  const rhymeKey = data.byWord[key];
  if (!rhymeKey) return [];
  const bucket = data.byKey[rhymeKey];
  if (!bucket) return [];
  return bucket.filter((w) => w !== key);
}

/** Test helper — inject an index without hitting the JSON chunk. */
export function __setRhymeDataForTests(index: RhymeIndex | null): void {
  store.__setForTests(index);
}
