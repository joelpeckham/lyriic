import { countWord } from "./countWord";
import { tokenizeLine } from "./tokenize";
import type { LineSyllableCount } from "./types";

export function countLine(line: string): LineSyllableCount {
  const tokens = tokenizeLine(line);
  const perWord = tokens.map((token) => countWord(token.word));
  const total = perWord.reduce((sum, item) => sum + item.count, 0);

  return { total, perWord, tokens };
}

export function countLines(text: string): LineSyllableCount[] {
  return text.split("\n").map((line) => countLine(line));
}

/**
 * Recount lines that differ by array index vs a previous snapshot.
 * Unchanged line strings at the same index reuse prior count objects.
 *
 * Note: inserting/deleting a line shifts later indices, so those lines are
 * recounted even when their text is unchanged. Callers must pass a null
 * previous snapshot (or a new overrideRevision) when counting policy changes.
 */
export function countLinesIncremental(
  text: string,
  prevLines: string[] | null,
  prevCounts: LineSyllableCount[] | null,
): { lines: string[]; counts: LineSyllableCount[] } {
  const lines = text.split("\n");

  if (!prevLines || !prevCounts || prevLines.length !== prevCounts.length) {
    return { lines, counts: lines.map((line) => countLine(line)) };
  }

  const counts = lines.map((line, index) => {
    if (index < prevLines.length && prevLines[index] === line) {
      return prevCounts[index]!;
    }
    return countLine(line);
  });

  return { lines, counts };
}
