/**
 * English syllable count: override → CMU primary dict → heuristic.
 * Hyphenated compounds are split and summed (wine-bottle → 1+2).
 * Ambiguous poetic words (fire, every, …) default to CMU primary;
 * pass overrides for user preference.
 *
 * Base dict|heuristic counts are memoized; overrides are layered on top
 * so threaded project overrides never pollute the cache.
 */
import { lookupDict } from "./dict";
import { countHeuristic } from "./heuristic";
import { normalizeWord } from "./normalize";
import { isValidOverrideCount, normalizeOverrideKey } from "./overrides";
import type { SyllableSource, WordSyllableCount } from "./types";

type BaseCount = {
  count: number;
  source: Exclude<SyllableSource, "override">;
};

/** Memo for dict/heuristic only — never stores override results. */
const baseMemo = new Map<string, BaseCount>();

export function clearMemo(): void {
  baseMemo.clear();
}

function countSimple(normalized: string): BaseCount {
  const dictCount = lookupDict(normalized);
  if (dictCount !== undefined) {
    return { count: dictCount, source: "dict" };
  }
  return { count: countHeuristic(normalized), source: "heuristic" };
}

function baseCount(normalized: string): BaseCount {
  const cached = baseMemo.get(normalized);
  if (cached) return cached;
  const result = countSimple(normalized);
  baseMemo.set(normalized, result);
  return result;
}

function resolveOverride(
  word: string,
  overrides: Record<string, number>,
): number | undefined {
  const key = normalizeOverrideKey(word);
  if (!key) return undefined;
  const count = overrides[key];
  if (!isValidOverrideCount(count)) return undefined;
  return Math.floor(count);
}

/**
 * Count syllables in a word (or hyphenated compound).
 * `word` should already be roughly normalized; punctuation is stripped.
 *
 * Overrides are always threaded (default `{}`). Invalid override values
 * are ignored via isValidOverrideCount.
 */
export function countWord(
  word: string,
  overrides: Record<string, number> = {},
): WordSyllableCount {
  const display = word;
  const memoKey = normalizeWord(word, { keepHyphen: true });

  const override = resolveOverride(memoKey, overrides);
  if (override !== undefined) {
    return { word: display, count: override, source: "override" };
  }

  // Hyphenated compound: split + sum
  if (memoKey.includes("-")) {
    const parts = memoKey
      .split("-")
      .map((part) => normalizeWord(part))
      .filter(Boolean);
    if (parts.length === 0) {
      return { word: display, count: 0, source: "heuristic" };
    }

    let total = 0;
    let allDict = true;
    let anyOverride = false;
    for (const part of parts) {
      const partOverride = resolveOverride(part, overrides);
      if (partOverride !== undefined) {
        total += partOverride;
        anyOverride = true;
        continue;
      }
      const { count, source } = baseCount(part);
      total += count;
      if (source !== "dict") allDict = false;
    }

    return {
      word: display,
      count: total,
      source: anyOverride ? "override" : allDict ? "dict" : "heuristic",
    };
  }

  const normalized = normalizeWord(memoKey);
  if (!normalized) {
    return { word: display, count: 0, source: "heuristic" };
  }

  const { count, source } = baseCount(normalized);
  return { word: display, count, source };
}
