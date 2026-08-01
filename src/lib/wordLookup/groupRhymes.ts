import { syllablesForId } from "@/lib/data/lexicon";
import { countWord } from "@/lib/syllables/countWord";
import { normalizeOverrideKey } from "@/lib/syllables/overrides";

import { rankRhymeIds, type RankedCandidate } from "./rankCandidates";

export type RhymeSyllableGroup = {
  syllables: number;
  words: string[];
};

function syllablesForWordId(
  id: number,
  word: string,
  overrides?: Record<string, number>,
): number {
  const overrideKey = normalizeOverrideKey(word);
  const override =
    overrides && overrideKey ? overrides[overrideKey] : undefined;
  if (typeof override === "number") return override;
  const packed = syllablesForId(id);
  if (packed !== undefined) return packed;
  return countWord(word).count;
}

/**
 * Group Zipf-ordered rhyme ids by syllable count.
 * Preserves input order within each bucket (Zipf).
 */
export function groupRhymeIdsBySyllables(
  ids: readonly number[],
  options: {
    words: readonly string[];
    overrides?: Record<string, number>;
  },
): RhymeSyllableGroup[] {
  const { words, overrides } = options;
  const map = new Map<number, string[]>();
  for (const id of ids) {
    const word = words[id];
    if (!word) continue;
    const syllables = syllablesForWordId(id, word, overrides);
    const list = map.get(syllables);
    if (list) list.push(word);
    else map.set(syllables, [word]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([syllables, groupWords]) => ({
      syllables,
      words: groupWords,
    }));
}

/**
 * Group already-ranked candidates by syllable count (ascending headers).
 * Preserves relative order within each bucket.
 */
export function groupRankedBySyllables(
  ranked: readonly RankedCandidate[],
): RhymeSyllableGroup[] {
  const map = new Map<number, string[]>();
  for (const candidate of ranked) {
    const list = map.get(candidate.syllables);
    if (list) list.push(candidate.word);
    else map.set(candidate.syllables, [candidate.word]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([syllables, groupWords]) => ({
      syllables,
      words: groupWords,
    }));
}

/**
 * Rank Zipf-ordered rhyme ids with no line meter (`lineTarget: null`), then
 * group by syllables. Within each bucket, Zipf order is preserved.
 */
export function rankAndGroupRhymeIds(input: {
  ids: readonly number[];
  words: readonly string[];
  tokenSyllables: number;
  overrides?: Record<string, number>;
  limit?: number;
}): RhymeSyllableGroup[] {
  const ranked = rankRhymeIds({
    ids: input.ids,
    words: input.words,
    tokenSyllables: input.tokenSyllables,
    lineTotal: input.tokenSyllables,
    lineTarget: null,
    overrides: input.overrides,
    limit: input.limit,
  });
  return groupRankedBySyllables(ranked);
}
