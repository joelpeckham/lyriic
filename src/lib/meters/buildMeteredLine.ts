import { targetForLine } from "./presets";
import type { LineSyllableCount, WordToken } from "@/lib/syllables/types";

export type MeterStatus = "none" | "under" | "exact" | "over";

export type MeteredToken = {
  raw: string;
  word: string;
  start: number;
  end: number;
  syllables: number;
  /** Inclusive start of this token’s span in the line’s cumulative syllable count. */
  syllableStart: number;
  /** Exclusive end of this token’s span in the line’s cumulative syllable count. */
  syllableEnd: number;
  source: LineSyllableCount["perWord"][number]["source"];
};

export type MeteredLine = {
  total: number;
  target: number | null;
  status: MeterStatus;
  tokens: MeteredToken[];
  /** Cumulative syllable boundaries after each token (and 0 at the start). */
  boundaries: number[];
};

export function buildMeteredLine(
  count: LineSyllableCount,
  lineIndex: number,
  pattern: readonly number[],
): MeteredLine {
  const target = targetForLine(pattern, lineIndex);
  const tokens: MeteredToken[] = [];
  const boundaries = [0];
  let cursor = 0;

  for (let i = 0; i < count.tokens.length; i++) {
    const token: WordToken = count.tokens[i]!;
    const wordCount = count.perWord[i];
    const syllables = wordCount?.count ?? 0;
    const syllableStart = cursor;
    const syllableEnd = cursor + syllables;
    tokens.push({
      raw: token.raw,
      word: token.word,
      start: token.start,
      end: token.end,
      syllables,
      syllableStart,
      syllableEnd,
      source: wordCount?.source ?? "heuristic",
    });
    cursor = syllableEnd;
    boundaries.push(cursor);
  }

  const total = count.total;
  let status: MeterStatus = "none";
  if (target !== null) {
    if (total === 0 && !count.tokens.length) {
      status = "none";
    } else if (total < target) {
      status = "under";
    } else if (total === target) {
      status = "exact";
    } else {
      status = "over";
    }
  }

  return { total, target, status, tokens, boundaries };
}
