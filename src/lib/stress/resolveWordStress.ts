/**
 * Resolve per-syllable stress: override → dict → heuristic.
 * Hyphenated compounds concat part patterns (like syllable summing).
 * Meter-fit may apply dictionary syllable alts separately.
 */

import type { StressCode } from "@/lib/data/dictPack";
import { lookupStress } from "@/lib/data/stress";
import { stressForSyllableCount } from "@/lib/data/variants";
import { countWord } from "@/lib/syllables/countWord";
import { normalizeWord } from "@/lib/syllables/normalize";
import {
  isValidOverrideCount,
  normalizeOverrideKey,
} from "@/lib/syllables/overrides";
import { heuristicStress, isWeakFunctionWord } from "./heuristic";
import { isValidStressOverride } from "./overrides";

export type StressSource = "dict" | "heuristic" | "override";

export type WordStress = {
  word: string;
  pattern: StressCode[];
  source: StressSource;
};

function patternFromPrimary(
  syllableCount: number,
  primaryIndex: number,
): StressCode[] {
  const n = Math.max(0, Math.floor(syllableCount));
  if (n <= 0) return [];
  const pattern = new Array<StressCode>(n).fill(0);
  const idx = Math.min(Math.max(0, primaryIndex), n - 1);
  pattern[idx] = 1;
  return pattern;
}

/** First primary (1), else first secondary/non-zero, else null. */
export function primaryStressIndex(
  pattern: readonly StressCode[],
): number | null {
  const primary = pattern.findIndex((s) => s === 1);
  if (primary >= 0) return primary;
  const secondary = pattern.findIndex((s) => s !== 0);
  return secondary >= 0 ? secondary : null;
}

/** Keep rightmost primary; demote earlier primaries to secondary. */
function demoteExtraPrimaries(pattern: StressCode[]): StressCode[] {
  let keep = -1;
  for (let i = pattern.length - 1; i >= 0; i--) {
    if (pattern[i] === 1) {
      keep = i;
      break;
    }
  }
  if (keep < 0) return pattern;
  for (let i = 0; i < pattern.length; i++) {
    if (i !== keep && pattern[i] === 1) pattern[i] = 2;
  }
  return pattern;
}

function alignPatternLength(
  word: string,
  pattern: StressCode[],
  syllableCount: number,
): StressCode[] {
  if (pattern.length === syllableCount) return pattern;
  if (syllableCount <= 0) return [];
  const fromVariants = stressForSyllableCount(word, syllableCount);
  if (fromVariants && fromVariants.length === syllableCount) {
    return fromVariants;
  }
  const primary = primaryStressIndex(pattern);
  const idx = primary !== null ? Math.min(primary, syllableCount - 1) : 0;
  return patternFromPrimary(syllableCount, idx);
}

function resolveOverrideIndex(
  word: string,
  stressOverrides: Record<string, number>,
  syllableCount: number,
): number | undefined {
  const key = normalizeOverrideKey(word);
  if (!key) return undefined;
  const index = stressOverrides[key];
  if (!isValidStressOverride(index)) return undefined;
  const floored = Math.floor(index);
  // Out-of-range → fall through to dict/heuristic (don't clamp-as-override).
  if (syllableCount > 0 && floored >= syllableCount) return undefined;
  return floored;
}

function resolveSyllableOverride(
  word: string,
  syllableOverrides: Record<string, number>,
): number | undefined {
  const key = normalizeOverrideKey(word);
  if (!key) return undefined;
  const count = syllableOverrides[key];
  if (!isValidOverrideCount(count)) return undefined;
  return Math.floor(count);
}

function baseStress(normalized: string, syllableCount: number): WordStress {
  if (isWeakFunctionWord(normalized) && syllableCount === 1) {
    return { word: normalized, pattern: [0], source: "heuristic" };
  }

  const dict = lookupStress(normalized);
  if (dict !== undefined) {
    if (dict.length === syllableCount) {
      return { word: normalized, pattern: dict, source: "dict" };
    }
    if (syllableCount <= 0) {
      return { word: normalized, pattern: [], source: "dict" };
    }
    const fromVariants = stressForSyllableCount(normalized, syllableCount);
    if (fromVariants && fromVariants.length === syllableCount) {
      return { word: normalized, pattern: fromVariants, source: "dict" };
    }
    const primary = primaryStressIndex(dict);
    const idx = primary !== null ? Math.min(primary, syllableCount - 1) : 0;
    return {
      word: normalized,
      pattern: patternFromPrimary(syllableCount, idx),
      source: "dict",
    };
  }

  const fromVariants = stressForSyllableCount(normalized, syllableCount);
  if (fromVariants && fromVariants.length === syllableCount) {
    return { word: normalized, pattern: fromVariants, source: "dict" };
  }

  return {
    word: normalized,
    pattern: heuristicStress(syllableCount),
    source: "heuristic",
  };
}

/**
 * Resolve stress for a word (or hyphenated compound).
 * `syllableOverrides` are threaded so compound syllable totals stay consistent.
 */
export function resolveWordStress(
  word: string,
  stressOverrides: Record<string, number> = {},
  syllableOverrides: Record<string, number> = {},
): WordStress {
  const display = word;
  const memoKey = normalizeWord(word, { keepHyphen: true });
  const syllables = countWord(memoKey, syllableOverrides).count;

  const overrideIndex = resolveOverrideIndex(
    memoKey,
    stressOverrides,
    syllables,
  );
  if (overrideIndex !== undefined) {
    return {
      word: display,
      pattern: patternFromPrimary(syllables, overrideIndex),
      source: "override",
    };
  }

  // Prefer whole-word citation stress when present (compounds in stress.bin).
  const wholeNormalized = normalizeWord(memoKey);
  if (wholeNormalized && memoKey.includes("-")) {
    const wholeDict = lookupStress(wholeNormalized);
    if (wholeDict !== undefined && wholeDict.length === syllables) {
      return { word: display, pattern: wholeDict, source: "dict" };
    }
    const wholeVariant = stressForSyllableCount(wholeNormalized, syllables);
    if (wholeVariant && wholeVariant.length === syllables) {
      return { word: display, pattern: wholeVariant, source: "dict" };
    }
  }

  // Whole-word syllable override on a compound: shape stress to that count.
  const wholeSylOverride = resolveSyllableOverride(memoKey, syllableOverrides);
  if (wholeSylOverride !== undefined && memoKey.includes("-")) {
    const parts = memoKey
      .split("-")
      .map((part) => normalizeWord(part))
      .filter(Boolean);
    const partPatterns: StressCode[] = [];
    let allDict = true;
    for (const part of parts) {
      const partSyl = countWord(part, {}).count;
      const resolved = baseStress(part, partSyl);
      partPatterns.push(...resolved.pattern);
      if (resolved.source !== "dict") allDict = false;
    }
    demoteExtraPrimaries(partPatterns);
    return {
      word: display,
      pattern: alignPatternLength(memoKey, partPatterns, syllables),
      source: allDict ? "dict" : "heuristic",
    };
  }

  if (memoKey.includes("-")) {
    const parts = memoKey
      .split("-")
      .map((part) => normalizeWord(part))
      .filter(Boolean);
    if (parts.length === 0) {
      return { word: display, pattern: [], source: "heuristic" };
    }

    const pattern: StressCode[] = [];
    let allDict = true;
    let anyOverride = false;
    for (const part of parts) {
      const partSyl = countWord(part, syllableOverrides).count;
      const partOverride = resolveOverrideIndex(
        part,
        stressOverrides,
        partSyl,
      );
      if (partOverride !== undefined) {
        pattern.push(...patternFromPrimary(partSyl, partOverride));
        anyOverride = true;
        continue;
      }
      const resolved = baseStress(part, partSyl);
      pattern.push(...resolved.pattern);
      if (resolved.source !== "dict") allDict = false;
    }

    demoteExtraPrimaries(pattern);
    return {
      word: display,
      pattern: alignPatternLength(memoKey, pattern, syllables),
      source: anyOverride ? "override" : allDict ? "dict" : "heuristic",
    };
  }

  const normalized = normalizeWord(memoKey);
  if (!normalized) {
    return { word: display, pattern: [], source: "heuristic" };
  }

  const resolved = baseStress(normalized, syllables);
  return { word: display, pattern: resolved.pattern, source: resolved.source };
}

/** Binary scansion: primary/secondary → stressed (1), unstressed → 0. */
export function toBinaryStress(pattern: readonly StressCode[]): (0 | 1)[] {
  return pattern.map((s) => (s === 0 ? 0 : 1));
}
