import type { RankedCandidate } from "./rankCandidates";

type CacheKey = string;

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
