/**
 * Poetic scansion helpers: metrical monosyllables + flexible secondary stress.
 */

import type { StressCode } from "@/lib/data/dictPack";
import { normalizeOverrideKey } from "@/lib/syllables/overrides";
import { isValidStressOverride } from "@/lib/stress/overrides";
import type { BinaryStressPattern } from "./presets";
import type { MeteredToken } from "./types";

/** True when the word has an in-range primary-stress override. */
export function hasStressOverride(
  word: string,
  stressOverrides: Record<string, number>,
  syllableCount: number,
): boolean {
  const key = normalizeOverrideKey(word);
  if (!key) return false;
  const index = stressOverrides[key];
  if (!isValidStressOverride(index)) return false;
  const floored = Math.floor(index);
  if (syllableCount > 0 && floored >= syllableCount) return false;
  return true;
}

/**
 * Assign expected meter stress to monosyllables (citation stress bends to the
 * beat). Skips words with a user stress override. Mutates token.stress in place.
 * Only call when line syllable total equals the meter target.
 */
export function applyMetricalMonosyllables(
  tokens: MeteredToken[],
  expected: BinaryStressPattern,
  stressOverrides: Record<string, number> = {},
): void {
  for (const token of tokens) {
    if (token.syllables !== 1) continue;
    if (hasStressOverride(token.word, stressOverrides, 1)) continue;
    const bit = expected[token.syllableStart];
    if (bit === undefined) continue;
    token.stress = [bit];
  }
}

/**
 * Per-syllable mismatch flags when actual and expected lengths match;
 * otherwise null (not comparable).
 *
 * Primary (1) and unstressed (0) must match the expected bit; secondary (2)
 * matches either (wildcard).
 */
export function stressMismatchMask(
  actual: readonly StressCode[],
  expected: BinaryStressPattern,
): boolean[] | null {
  if (actual.length !== expected.length) return null;
  return expected.map((bit, i) => {
    const code = actual[i]!;
    if (code === 2) return false;
    const binary: 0 | 1 = code === 0 ? 0 : 1;
    return binary !== bit;
  });
}

/** Flatten token stress into a line contour. */
export function flattenTokenStress(
  tokens: readonly MeteredToken[],
): StressCode[] {
  const out: StressCode[] = [];
  for (const token of tokens) {
    out.push(...token.stress);
  }
  return out;
}
