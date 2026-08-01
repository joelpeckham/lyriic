import { createLazyJsonData, normalizeLookupKey } from "@/lib/data/lazyJson";

export type RhymeMode = "perfect" | "end";

export type RhymeIndex = {
  /** Perfect-rhyme key(s) per word (stress-aware). */
  byWord: Record<string, string | string[]>;
  byKey: Record<string, string[]>;
  /** End-rhyme / unstressed key(s) per word (last nucleus). */
  byWordEnd: Record<string, string | string[]>;
  byKeyEnd: Record<string, string[]>;
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
  map: Record<string, string | string[]>,
  word: string,
): string[] {
  const raw = map[word];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function mapsForMode(data: RhymeIndex, mode: RhymeMode) {
  if (mode === "end") {
    return { byWord: data.byWordEnd, byKey: data.byKeyEnd };
  }
  return { byWord: data.byWord, byKey: data.byKey };
}

/** True when the word has an entry for the given rhyme mode. */
export function hasRhymeEntry(
  word: string,
  mode: RhymeMode = "perfect",
): boolean {
  const data = store.get();
  if (!data) return false;
  const key = normalizeLookupKey(word);
  if (!key) return false;
  const { byWord } = mapsForMode(data, mode);
  return byWord[key] !== undefined;
}

/**
 * Sync lookup after {@link loadRhymeIndex} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 * Excludes the query word from the rhyme bucket.
 * Unions buckets across alternate pronunciations (primary first).
 */
export function lookupRhymes(
  word: string,
  mode: RhymeMode = "perfect",
): string[] {
  const data = store.get();
  if (!data) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];
  const { byWord, byKey } = mapsForMode(data, mode);
  const rhymeKeys = keysForWord(byWord, key);
  if (rhymeKeys.length === 0) return [];

  const out: string[] = [];
  const seen = new Set<string>([key]);
  for (const rhymeKey of rhymeKeys) {
    const bucket = byKey[rhymeKey];
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
