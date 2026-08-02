/** Client-side filters for synonym / rhyme browse lists. */

export type FilterableCandidate = {
  word: string;
  syllables: number;
  usage?: "n" | "v" | "a" | "r";
};

export type CandidateFilters = {
  substring?: string;
  usages?: ReadonlySet<"n" | "v" | "a" | "r"> | null;
  syllableMin?: number | null;
  syllableMax?: number | null;
};

const DEFAULT_CAP = 150;

/**
 * Filter candidates by substring, optional POS, and inclusive syllable range.
 * Unknown syllable counts (`<= 0`) pass the syllable filter.
 * When min > max, syllable bounds are ignored.
 * Preserves input order; caps the result.
 */
export function filterCandidates<T extends FilterableCandidate>(
  candidates: readonly T[],
  filters: CandidateFilters,
  cap: number = DEFAULT_CAP,
): T[] {
  const sub = filters.substring?.trim().toLowerCase() ?? "";
  const usages = filters.usages;
  let min =
    filters.syllableMin != null && Number.isFinite(filters.syllableMin)
      ? filters.syllableMin
      : null;
  let max =
    filters.syllableMax != null && Number.isFinite(filters.syllableMax)
      ? filters.syllableMax
      : null;
  if (min != null && max != null && min > max) {
    min = null;
    max = null;
  }

  const out: T[] = [];
  for (const c of candidates) {
    if (sub && !c.word.toLowerCase().includes(sub)) continue;
    if (usages && usages.size > 0) {
      if (!c.usage || !usages.has(c.usage)) continue;
    }
    // Unknown / overflow syllable counts pass rather than failing min≥1.
    if (c.syllables > 0) {
      if (min != null && c.syllables < min) continue;
      if (max != null && c.syllables > max) continue;
    }
    out.push(c);
    if (out.length >= cap) break;
  }
  return out;
}
