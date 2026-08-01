import { countWord } from "@/lib/syllables/countWord";

export type RankedCandidate = {
  word: string;
  syllables: number;
  /** True when replacing would keep (or land on) the line meter target. */
  keepsMeter: boolean;
};

export type RankCandidatesInput = {
  candidates: readonly string[];
  /** Syllable count of the word being replaced. */
  tokenSyllables: number;
  lineTotal: number;
  lineTarget: number | null;
  overrides?: Record<string, number>;
  /** Max rows to return after sort (default 24). */
  limit?: number;
};

/**
 * Rank synonym candidates by syllable count ascending and flag meter-preserving ones.
 * When `lineTarget` is null, `keepsMeter` is always false.
 */
export function rankCandidates({
  candidates,
  tokenSyllables,
  lineTotal,
  lineTarget,
  overrides,
  limit = 24,
}: RankCandidatesInput): RankedCandidate[] {
  const seen = new Set<string>();
  const ranked: RankedCandidate[] = [];

  for (const raw of candidates) {
    const word = raw.trim().toLowerCase();
    if (!word || seen.has(word)) continue;
    seen.add(word);

    const { count } = countWord(word, overrides);
    const newTotal = lineTotal - tokenSyllables + count;
    const keepsMeter =
      lineTarget !== null &&
      (count === tokenSyllables || newTotal === lineTarget);

    ranked.push({ word, syllables: count, keepsMeter });
  }

  ranked.sort((a, b) => {
    if (a.syllables !== b.syllables) return a.syllables - b.syllables;
    return a.word.localeCompare(b.word);
  });

  return ranked.slice(0, limit);
}
