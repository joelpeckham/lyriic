import { createLazyJsonData, normalizeLookupKey } from "@/lib/data/lazyJson";

export type RhymeIndex = {
  /** Primary rhyme key, or all pronunciation keys when variants exist. */
  byWord: Record<string, string | string[]>;
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

function keysForWord(
  data: RhymeIndex,
  word: string,
): string[] {
  const raw = data.byWord[word];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

/**
 * Sync lookup after {@link loadRhymeIndex} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 * Excludes the query word from the rhyme bucket.
 * Unions buckets across alternate pronunciations (primary first).
 */
export function lookupRhymes(word: string): string[] {
  const data = store.get();
  if (!data) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];
  const rhymeKeys = keysForWord(data, key);
  if (rhymeKeys.length === 0) return [];

  const out: string[] = [];
  const seen = new Set<string>([key]);
  for (const rhymeKey of rhymeKeys) {
    const bucket = data.byKey[rhymeKey];
    if (!bucket) continue;
    for (const w of bucket) {
      if (seen.has(w)) continue;
      seen.add(w);
      out.push(w);
    }
  }
  return out;
}

/** Test helper — inject an index without hitting the JSON chunk. */
export function __setRhymeDataForTests(index: RhymeIndex | null): void {
  store.__setForTests(index);
}
