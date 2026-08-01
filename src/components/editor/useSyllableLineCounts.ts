/* eslint-disable react-hooks/refs -- I-10: intentional render-time count cache via useRef */
import { useRef } from "react";

import {
  countLinesIncremental,
  type LineSyllableCount,
} from "@/lib/syllables";

type CountCache = {
  value: string;
  lines: string[];
  counts: LineSyllableCount[];
  documentKey: string;
  overrideRevision: string;
};

/**
 * Incremental syllable line counts, cached in a ref mutated during render.
 * Idempotent for identical inputs — avoids setState-during-render double commit.
 *
 * Pass project `overrides` so counts resolve against that record on the first
 * render (no dependency on module Map sync timing).
 */
export function useSyllableLineCounts(
  value: string,
  documentKey: string,
  overrideRevision: string,
  overrides: Record<string, number>,
): { lines: string[]; counts: LineSyllableCount[] } {
  const cacheRef = useRef<CountCache | null>(null);
  const cache = cacheRef.current;

  if (
    cache &&
    cache.value === value &&
    cache.documentKey === documentKey &&
    cache.overrideRevision === overrideRevision
  ) {
    return { lines: cache.lines, counts: cache.counts };
  }

  const policyChanged =
    !cache ||
    cache.documentKey !== documentKey ||
    cache.overrideRevision !== overrideRevision;
  const lineCounts = countLinesIncremental(
    value,
    policyChanged ? null : (cache?.lines ?? null),
    policyChanged ? null : (cache?.counts ?? null),
    overrides,
  );
  cacheRef.current = {
    value,
    lines: lineCounts.lines,
    counts: lineCounts.counts,
    documentKey,
    overrideRevision,
  };
  return lineCounts;
}
