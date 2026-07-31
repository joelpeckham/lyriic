/**
 * English syllable count: override → CMU primary dict → heuristic.
 * Hyphenated compounds are split and summed (wine-bottle → 1+2).
 * Ambiguous poetic words (fire, every, …) default to CMU primary;
 * use setOverride() for user preference.
 */
import { lookupDict } from "./dict";
import { countHeuristic } from "./heuristic";
import { getMemo, setMemo } from "./memo";
import { getOverride } from "./overrides";
import type { SyllableSource, WordSyllableCount } from "./types";

function normalizePart(part: string): string {
  return part
    .toLowerCase()
    .replace(/['\u2019]/g, "'")
    .replace(/[^\p{L}']/gu, "");
}

function countSimple(normalized: string): {
  count: number;
  source: Exclude<SyllableSource, "override">;
} {
  const dictCount = lookupDict(normalized);
  if (dictCount !== undefined) {
    return { count: dictCount, source: "dict" };
  }
  return { count: countHeuristic(normalized), source: "heuristic" };
}

/**
 * Count syllables in a word (or hyphenated compound).
 * `word` should already be roughly normalized; punctuation is stripped.
 */
export function countWord(word: string): WordSyllableCount {
  const display = word;
  const memoKey = word.toLowerCase().replace(/['\u2019]/g, "'");

  const cached = getMemo(memoKey);
  if (cached) {
    return { ...cached, word: display };
  }

  const override = getOverride(memoKey);
  if (override !== undefined) {
    const result: WordSyllableCount = {
      word: display,
      count: override,
      source: "override",
    };
    setMemo(memoKey, result);
    return result;
  }

  // Hyphenated compound: split + sum
  if (memoKey.includes("-")) {
    const parts = memoKey.split("-").map(normalizePart).filter(Boolean);
    if (parts.length === 0) {
      const result: WordSyllableCount = {
        word: display,
        count: 0,
        source: "heuristic",
      };
      setMemo(memoKey, result);
      return result;
    }

    let total = 0;
    let allDict = true;
    let anyOverride = false;
    for (const part of parts) {
      const partOverride = getOverride(part);
      if (partOverride !== undefined) {
        total += partOverride;
        anyOverride = true;
        continue;
      }
      const { count, source } = countSimple(part);
      total += count;
      if (source !== "dict") allDict = false;
    }

    const result: WordSyllableCount = {
      word: display,
      count: total,
      source: anyOverride ? "override" : allDict ? "dict" : "heuristic",
    };
    setMemo(memoKey, result);
    return result;
  }

  const normalized = normalizePart(memoKey);
  if (!normalized) {
    const result: WordSyllableCount = {
      word: display,
      count: 0,
      source: "heuristic",
    };
    setMemo(memoKey, result);
    return result;
  }

  const { count, source } = countSimple(normalized);
  const result: WordSyllableCount = { word: display, count, source };
  setMemo(memoKey, result);
  return result;
}
