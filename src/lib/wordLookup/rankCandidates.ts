import { countWord } from "@/lib/syllables/countWord";

export type RankCandidateInput =
  | string
  | {
      word: string;
      /** Prefer this candidate when sorting (e.g. matching part of speech). */
      matchesUsage?: boolean;
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
};

function normalizeInput(raw: RankCandidateInput): {
  word: string;
  matchesUsage: boolean;
} | null {
  if (typeof raw === "string") {
    const word = raw.trim().toLowerCase();
    return word ? { word, matchesUsage: false } : null;
  }
  const word = raw.word.trim().toLowerCase();
  if (!word) return null;
  return { word, matchesUsage: Boolean(raw.matchesUsage) };
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
}: RankCandidatesInput): RankedCandidate[] {
  const seen = new Set<string>();
  const ranked: RankedCandidate[] = [];

  for (const raw of candidates) {
    const normalized = normalizeInput(raw);
    if (!normalized || seen.has(normalized.word)) continue;
    seen.add(normalized.word);

    const { count } = countWord(normalized.word, overrides);
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
