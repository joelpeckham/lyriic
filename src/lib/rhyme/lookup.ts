export type RhymeIndex = {
  byWord: Record<string, string>;
  byKey: Record<string, string[]>;
};

let dataPromise: Promise<RhymeIndex> | null = null;
let data: RhymeIndex | null = null;

function normalizeKey(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, "'");
}

/** Lazy-load the embedded rhyme index (separate Vite chunk). */
export function loadRhymeIndex(): Promise<RhymeIndex> {
  if (data) return Promise.resolve(data);
  if (!dataPromise) {
    dataPromise = import("./data/rhyme-index.json").then((mod) => {
      data = mod.default as RhymeIndex;
      return data;
    });
  }
  return dataPromise;
}

/** True once the rhyme index has finished loading. */
export function isRhymeIndexReady(): boolean {
  return data !== null;
}

/**
 * Sync lookup after {@link loadRhymeIndex} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 * Excludes the query word from the rhyme bucket.
 */
export function lookupRhymes(word: string): string[] {
  if (!data) return [];
  const key = normalizeKey(word);
  if (!key) return [];
  const rhymeKey = data.byWord[key];
  if (!rhymeKey) return [];
  const bucket = data.byKey[rhymeKey];
  if (!bucket) return [];
  return bucket.filter((w) => w !== key);
}

/** Test helper — inject an index without hitting the JSON chunk. */
export function __setRhymeDataForTests(index: RhymeIndex | null): void {
  data = index;
  dataPromise = index ? Promise.resolve(index) : null;
}
