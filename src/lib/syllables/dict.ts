/**
 * Primary syllable counts from the fused pronunciation corpus
 * (Misaki + CMUdict + WikiPron). Built by scripts/build-pronunciation.mjs.
 * Lazy-loaded so the main chunk stays light (heuristic until ready).
 */
import { clearMemo } from "./countWord";

type SyllableMap = Record<string, number>;

let dataPromise: Promise<SyllableMap> | null = null;
let map: SyllableMap | null = null;
let revision = 0;
const listeners = new Set<() => void>();

/** Monotonic revision bumped when the dict becomes ready or is replaced in tests. */
export function getDictRevision(): number {
  return revision;
}

/** Subscribe to dict-ready / test-inject notifications. Returns unsubscribe. */
export function subscribeDictReady(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyReady(): void {
  for (const listener of listeners) listener();
}

/** Lazy-load the embedded CMU map (separate Vite chunk). */
export function loadDict(): Promise<SyllableMap> {
  if (map) return Promise.resolve(map);
  if (!dataPromise) {
    dataPromise = import("./data/cmu-syllables.json").then((mod) => {
      map = mod.default as SyllableMap;
      clearMemo();
      revision += 1;
      notifyReady();
      return map;
    });
  }
  return dataPromise;
}

/** True once the CMU map has finished loading. */
export function isDictReady(): boolean {
  return map !== null;
}

/** Look up the CMU-primary syllable count for a normalized word. */
export function lookupDict(normalized: string): number | undefined {
  if (!map) return undefined;

  const direct = map[normalized];
  if (direct !== undefined) return direct;

  // Possessive: teacher's → teacher
  if (normalized.endsWith("'s") && normalized.length > 2) {
    const base = normalized.slice(0, -2);
    const count = map[base];
    if (count !== undefined) return count;
  }

  // Trailing apostrophe plural possessive: teachers'
  if (normalized.endsWith("'") && normalized.length > 1) {
    const base = normalized.slice(0, -1);
    const count = map[base];
    if (count !== undefined) return count;
  }

  return undefined;
}

export function dictSize(): number {
  return map ? Object.keys(map).length : 0;
}

/** Test helper — inject a map without hitting the JSON chunk. */
export function __setDictForTests(next: SyllableMap | null): void {
  map = next;
  dataPromise = next ? Promise.resolve(next) : null;
  clearMemo();
  revision += 1;
  notifyReady();
}
