import { buildMeteredLine } from "./buildMeteredLine";
import type { MeteredLine } from "./types";
import type { LineSyllableCount } from "@/lib/syllables/types";

type CacheEntry = {
  pattern: readonly number[];
  lineIndex: number;
  metered: MeteredLine;
};

/**
 * Cache keyed by stable `LineSyllableCount` object identity (from
 * `countLinesIncremental`). Entries are reused when the count object,
 * pattern reference, and line index match — so unchanged lines skip rebuild.
 */
const cache = new WeakMap<LineSyllableCount, CacheEntry>();

function getMeteredLineCached(
  count: LineSyllableCount,
  lineIndex: number,
  pattern: readonly number[],
): MeteredLine {
  const cached = cache.get(count);
  if (
    cached &&
    cached.pattern === pattern &&
    cached.lineIndex === lineIndex
  ) {
    return cached.metered;
  }
  const metered = buildMeteredLine(count, lineIndex, pattern);
  cache.set(count, { pattern, lineIndex, metered });
  return metered;
}

/** Map counts → metered lines, rebuilding only cache misses. */
export function buildMeteredLines(
  counts: readonly LineSyllableCount[],
  pattern: readonly number[],
): MeteredLine[] {
  return counts.map((count, index) =>
    getMeteredLineCached(count, index, pattern),
  );
}
