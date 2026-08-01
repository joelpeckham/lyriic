type SynonymMap = Record<string, string[]>;

let dataPromise: Promise<SynonymMap> | null = null;
let data: SynonymMap | null = null;

function normalizeKey(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .replace(/[\u2019]/g, "'");
}

/** Lazy-load the embedded synonym map (separate Vite chunk). */
export function loadThesaurus(): Promise<SynonymMap> {
  if (data) return Promise.resolve(data);
  if (!dataPromise) {
    dataPromise = import("./data/synonyms.json").then((mod) => {
      data = mod.default as SynonymMap;
      return data;
    });
  }
  return dataPromise;
}

/** True once the synonym map has finished loading. */
export function isThesaurusReady(): boolean {
  return data !== null;
}

/**
 * Sync lookup after {@link loadThesaurus} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 */
export function lookupSynonyms(word: string): string[] {
  if (!data) return [];
  const key = normalizeKey(word);
  if (!key) return [];
  return data[key] ?? [];
}

/** Test helper — inject a map without hitting the JSON chunk. */
export function __setThesaurusDataForTests(map: SynonymMap | null): void {
  data = map;
  dataPromise = map ? Promise.resolve(map) : null;
}
