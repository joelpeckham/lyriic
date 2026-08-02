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
  /** When true, perfect ∪ end rhymes; ignored for thesaurus. */
  includeEndRhymes?: boolean;
  /** When true, also union slant rhymes; ignored for thesaurus. */
  includeSlantRhymes?: boolean;
  /** Detected usage / POS; ignored for rhyme. */
  usage?: string | null;
}): CacheKey {
  const rhymeModes = [
    "perfect",
    parts.includeEndRhymes ? "end+" : "",
    parts.includeSlantRhymes ? "slant+" : "",
  ]
    .filter(Boolean)
    .join("");
  return [
    parts.mode,
    rhymeModes,
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
