import { buildMeteredLine, type BuildMeteredLineOptions } from "./buildMeteredLine";
import type { MeteredLine } from "./types";
import type { BinaryStressPattern } from "./presets";
import type { LineSyllableCount } from "@/lib/syllables/types";

type CacheEntry = {
  pattern: readonly number[];
  stressPatterns: readonly BinaryStressPattern[] | undefined;
  stressRevision: string;
  overridesKey: string;
  lineIndex: number;
  metered: MeteredLine;
};

function overridesCacheKey(options: BuildMeteredLineOptions): string {
  const stress = options.stressOverrides;
  const syl = options.syllableOverrides;
  if (!stress && !syl) return "";
  return JSON.stringify({
    s: stress ?? null,
    y: syl ?? null,
  });
}

/**
 * Cache keyed by stable `LineSyllableCount` object identity (from
 * `countLinesIncremental`). Entries are reused when the count object,
 * pattern reference, stress revision, overrides, and line index match.
 */
const cache = new WeakMap<LineSyllableCount, CacheEntry>();

function getMeteredLineCached(
  count: LineSyllableCount,
  lineIndex: number,
  options: BuildMeteredLineOptions,
  stressRevision: string,
): MeteredLine {
  const oKey = overridesCacheKey(options);
  const cached = cache.get(count);
  if (
    cached &&
    cached.pattern === options.pattern &&
    cached.stressPatterns === options.stressPatterns &&
    cached.stressRevision === stressRevision &&
    cached.overridesKey === oKey &&
    cached.lineIndex === lineIndex
  ) {
    return cached.metered;
  }
  const metered = buildMeteredLine(count, lineIndex, options);
  cache.set(count, {
    pattern: options.pattern,
    stressPatterns: options.stressPatterns,
    stressRevision,
    overridesKey: oKey,
    lineIndex,
    metered,
  });
  return metered;
}

/** Map counts → metered lines, rebuilding only cache misses. */
export function buildMeteredLines(
  counts: readonly LineSyllableCount[],
  patternOrOptions: readonly number[] | BuildMeteredLineOptions,
  stressRevision = "",
): MeteredLine[] {
  const options: BuildMeteredLineOptions = Array.isArray(patternOrOptions)
    ? { pattern: patternOrOptions }
    : patternOrOptions;

  return counts.map((count, index) =>
    getMeteredLineCached(count, index, options, stressRevision),
  );
}
