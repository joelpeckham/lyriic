/** Binary foot: 0 = unstressed, 1 = stressed. */
export type BinaryStressPattern = readonly (0 | 1)[];

export type FootId = "iamb" | "trochee" | "anapest" | "dactyl" | "amphibrach";

export type CustomFootId = FootId | "none";

export const FOOT_IDS: readonly FootId[] = [
  "iamb",
  "trochee",
  "anapest",
  "dactyl",
  "amphibrach",
] as const;

export const CUSTOM_FOOT_IDS: readonly CustomFootId[] = [
  "none",
  ...FOOT_IDS,
] as const;

const FOOT_UNITS: Record<FootId, BinaryStressPattern> = {
  iamb: [0, 1],
  trochee: [1, 0],
  anapest: [0, 0, 1],
  dactyl: [1, 0, 0],
  amphibrach: [0, 1, 0],
};

export const FOOT_LABELS: Record<CustomFootId, string> = {
  none: "None (syllables only)",
  iamb: "Iambic",
  trochee: "Trochaic",
  anapest: "Anapestic",
  dactyl: "Dactylic",
  amphibrach: "Amphibrachic",
};

export function isFootId(value: string): value is FootId {
  return (FOOT_IDS as readonly string[]).includes(value);
}

export function isCustomFootId(value: string): value is CustomFootId {
  return (CUSTOM_FOOT_IDS as readonly string[]).includes(value);
}

export function footUnit(foot: FootId): BinaryStressPattern {
  return FOOT_UNITS[foot];
}

export function syllablesPerFoot(foot: FootId): number {
  return FOOT_UNITS[foot].length;
}

/** Repeat a foot `feetPerLine` times. */
export function buildStressFromFeet(
  foot: FootId,
  feetPerLine: number,
): BinaryStressPattern {
  const unit = FOOT_UNITS[foot];
  const count = Math.max(0, Math.floor(feetPerLine));
  const out: (0 | 1)[] = [];
  for (let i = 0; i < count; i++) {
    out.push(...unit);
  }
  return out;
}

/**
 * Fill a binary stress contour to exactly `syllableCount` slots by repeating
 * the foot unit, truncating a partial final foot if needed.
 */
export function fillStressForSyllables(
  foot: FootId,
  syllableCount: number,
): BinaryStressPattern {
  const unit = FOOT_UNITS[foot];
  const n = Math.max(0, Math.floor(syllableCount));
  if (n === 0) return [];
  const out: (0 | 1)[] = [];
  while (out.length < n) {
    for (const beat of unit) {
      if (out.length >= n) break;
      out.push(beat);
    }
  }
  return out;
}

/** Stress patterns for each line length in a syllable cycle. */
export function stressPatternsForCycle(
  foot: CustomFootId,
  pattern: readonly number[],
): readonly BinaryStressPattern[] | undefined {
  if (foot === "none" || pattern.length === 0) return undefined;
  return pattern.map((syllables) => fillStressForSyllables(foot, syllables));
}
