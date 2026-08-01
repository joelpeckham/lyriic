import { syllablesForId } from "@/lib/data/lexicon";
import { countWord } from "@/lib/syllables/countWord";
import { normalizeOverrideKey } from "@/lib/syllables/overrides";

export type RankCandidateInput =
  | string
  | {
      word: string;
      /** Prefer this candidate when sorting (e.g. matching part of speech). */
      matchesUsage?: boolean;
      /** Optional precomputed syllable count (skips countWord). */
      syllables?: number;
    };

export type RankedCandidate = {
  word: string;
  syllables: number;
  /** True when replacing would keep (or land on) the line meter target. */
  keepsMeter: boolean;
  /** True when the candidate matches detected usage / part of speech. */
  matchesUsage: boolean;
};

export type RankCandidatesInput = {
  candidates: readonly RankCandidateInput[];
  /** Syllable count of the word being replaced. */
  tokenSyllables: number;
  lineTotal: number;
  lineTarget: number | null;
  overrides?: Record<string, number>;
  /** When set, only the first N candidates (already Zipf-ordered) are ranked. */
  limit?: number;
};

function normalizeInput(raw: RankCandidateInput): {
  word: string;
  matchesUsage: boolean;
  syllables?: number;
} | null {
  if (typeof raw === "string") {
    const word = raw.trim().toLowerCase();
    return word ? { word, matchesUsage: false } : null;
  }
  const word = raw.word.trim().toLowerCase();
  if (!word) return null;
  return {
    word,
    matchesUsage: Boolean(raw.matchesUsage),
    syllables: raw.syllables,
  };
}

/**
 * Rank lookup candidates for the editor popover.
 * Prefer usage matches, then meter-preserving matches, then closest syllable
 * count to the replaced token, then alpha.
 * When `lineTarget` is null, `keepsMeter` is always false.
 */
export function rankCandidates({
  candidates,
  tokenSyllables,
  lineTotal,
  lineTarget,
  overrides,
  limit,
}: RankCandidatesInput): RankedCandidate[] {
  const seen = new Set<string>();
  const ranked: RankedCandidate[] = [];
  const max = limit ?? candidates.length;

  for (let i = 0; i < candidates.length && ranked.length < max; i++) {
    const normalized = normalizeInput(candidates[i]!);
    if (!normalized || seen.has(normalized.word)) continue;
    seen.add(normalized.word);

    const count =
      normalized.syllables ??
      countWord(normalized.word, overrides).count;
    const newTotal = lineTotal - tokenSyllables + count;
    const keepsMeter =
      lineTarget !== null &&
      (count === tokenSyllables || newTotal === lineTarget);

    ranked.push({
      word: normalized.word,
      syllables: count,
      keepsMeter,
      matchesUsage: normalized.matchesUsage,
    });
  }

  ranked.sort((a, b) => {
    if (a.matchesUsage !== b.matchesUsage) return a.matchesUsage ? -1 : 1;
    if (a.keepsMeter !== b.keepsMeter) return a.keepsMeter ? -1 : 1;
    const da = Math.abs(a.syllables - tokenSyllables);
    const db = Math.abs(b.syllables - tokenSyllables);
    if (da !== db) return da - db;
    if (a.syllables !== b.syllables) return a.syllables - b.syllables;
    return a.word.localeCompare(b.word);
  });

  return ranked;
}

/**
 * Rank rhyme candidates from lexicon word ids (uses packed syllable counts).
 */
export function rankRhymeIds(input: {
  ids: readonly number[];
  words: readonly string[];
  tokenSyllables: number;
  lineTotal: number;
  lineTarget: number | null;
  overrides?: Record<string, number>;
  limit?: number;
}): RankedCandidate[] {
  const { ids, words, overrides, limit } = input;
  const max = limit ?? ids.length;
  const candidates: RankCandidateInput[] = [];
  for (let i = 0; i < ids.length && candidates.length < max; i++) {
    const id = ids[i]!;
    const word = words[id];
    if (!word) continue;
    const overrideKey = normalizeOverrideKey(word);
    const override =
      overrides && overrideKey ? overrides[overrideKey] : undefined;
    if (typeof override === "number") {
      candidates.push({ word, syllables: override });
      continue;
    }
    const packed = syllablesForId(id);
    candidates.push(
      packed !== undefined ? { word, syllables: packed } : word,
    );
  }
  return rankCandidates({
    ...input,
    candidates,
    limit: undefined, // already windowed
  });
}
