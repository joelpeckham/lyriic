import type { RankedCandidate } from "./rankCandidates";

type CacheKey = string;

const MAX_ENTRIES = 64;
const cache = new Map<CacheKey, RankedCandidate[]>();

export function rankedCacheKey(parts: {
  mode: "thesaurus" | "rhyme";
  word: string;
  lineTotal: number;
  lineTarget: number | null;
  tokenSyllables: number;
  overrideRevision: string;
  /** Perfect vs end rhyme; ignored for thesaurus. */
  rhymeMode?: "perfect" | "end";
  /** Detected usage / POS; ignored for rhyme. */
  usage?: string | null;
}): CacheKey {
  return [
    parts.mode,
    parts.rhymeMode ?? "perfect",
    parts.word,
    parts.usage ?? "",
    parts.lineTotal,
    parts.lineTarget ?? "none",
    parts.tokenSyllables,
    parts.overrideRevision,
  ].join("\0");
}

export function getCachedRanked(key: CacheKey): RankedCandidate[] | undefined {
  const value = cache.get(key);
  if (value === undefined) return undefined;
  // LRU: refresh insertion order
  cache.delete(key);
  cache.set(key, value);
  return value;
}

export function setCachedRanked(
  key: CacheKey,
  value: RankedCandidate[],
): void {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, value);
  while (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}
