import { targetForLine } from "./presets";
import type { MeteredLine, MeteredToken, MeterStatus } from "./types";
import type { LineSyllableCount, WordToken } from "@/lib/syllables/types";

export type { MeteredLine, MeteredToken, MeterStatus } from "./types";

export function buildMeteredLine(
  count: LineSyllableCount,
  lineIndex: number,
  pattern: readonly number[],
): MeteredLine {
  const target = targetForLine(pattern, lineIndex);
  const tokens: MeteredToken[] = [];
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

  return { total, target, status, tokens };
}
