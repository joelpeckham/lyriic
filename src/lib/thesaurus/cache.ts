import type { RankedCandidate } from "./rankCandidates";

type CacheKey = string;

const cache = new Map<CacheKey, RankedCandidate[]>();

export function rankedCacheKey(parts: {
  word: string;
  lineTotal: number;
  lineTarget: number | null;
  tokenSyllables: number;
  overrideRevision: string;
}): CacheKey {
  return [
    parts.word,
    parts.lineTotal,
    parts.lineTarget ?? "none",
    parts.tokenSyllables,
    parts.overrideRevision,
  ].join("\0");
}

export function getCachedRanked(key: CacheKey): RankedCandidate[] | undefined {
  return cache.get(key);
}

export function setCachedRanked(
  key: CacheKey,
  value: RankedCandidate[],
): void {
  cache.set(key, value);
}

/** Test / project-switch helper. */
export function clearRankedCache(): void {
  cache.clear();
}
