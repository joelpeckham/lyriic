/**
 * Map a 1-based cumulative syllable index to a character offset within a line.
 *
 * Rulers use token char spans + linear interpolation inside multi-syllable
 * words. `MeteredLine.boundaries` / `token.syllableEnd` are the same cumulative
 * ends; this helper is the canonical geometry for tick placement.
 */

export type SyllableOffsetToken = {
  start: number;
  end: number;
  syllables: number;
  syllableStart: number;
  syllableEnd: number;
};

/**
 * @param tokens Metered tokens for one poetic line (char offsets relative to line start)
 * @param syllable 1-based syllable index along the line
 * @returns Character offset from line start, or null if unmappable
 */
export function mapSyllableToOffset(
  tokens: readonly SyllableOffsetToken[],
  syllable: number,
): number | null {
  if (!Number.isFinite(syllable) || syllable < 1) return null;

  for (const token of tokens) {
    if (token.syllables <= 0) continue;
    if (syllable <= token.syllableStart || syllable > token.syllableEnd) {
      continue;
    }

    if (token.syllables === 1) {
      return token.end;
    }

    const within = syllable - token.syllableStart;
    const span = token.end - token.start;
    const offset = token.start + (span * within) / token.syllables;
    return Math.floor(offset);
  }

  return null;
}

/** Highest syllable index to place ticks for (at least written total; include target when set). */
export function rulerSyllableCount(
  total: number,
  target: number | null,
): number {
  if (target !== null && target > total) return target;
  return total;
}
