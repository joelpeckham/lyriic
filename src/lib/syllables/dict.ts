/**
 * CMU Pronouncing Dictionary primary syllable counts.
 * Built by scripts/build-cmu-syllables.mjs from cmusphinx/cmudict.
 */
import cmuSyllables from "./data/cmu-syllables.json";

const map = cmuSyllables as Record<string, number>;

/** Look up the CMU-primary syllable count for a normalized word. */
export function lookupDict(normalized: string): number | undefined {
  const direct = map[normalized];
  if (direct !== undefined) return direct;

  // Possessive: teacher's → teacher
  if (normalized.endsWith("'s") && normalized.length > 2) {
    const base = normalized.slice(0, -2);
    const count = map[base];
    if (count !== undefined) return count;
  }

  // Trailing apostrophe plural possessive: teachers'
  if (normalized.endsWith("'") && normalized.length > 1) {
    const base = normalized.slice(0, -1);
    const count = map[base];
    if (count !== undefined) return count;
  }

  return undefined;
}

export function dictSize(): number {
  return Object.keys(map).length;
}
