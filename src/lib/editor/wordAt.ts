import { tokenizeLine } from "@/lib/syllables/tokenize";
import type { WordToken } from "@/lib/syllables/types";

export type WordAtResult = {
  /** Absolute document positions. */
  from: number;
  to: number;
  raw: string;
  word: string;
  /** 0-based line index. */
  lineIndex: number;
  /** Line-local token (offsets relative to the line). */
  token: WordToken;
};

/**
 * Resolve caret or single-word selection to a token on that line.
 * Empty selection expands to the word containing the caret.
 * Multi-word selections and empty / non-word positions return null.
 */
export function wordAt(
  docLineText: string,
  lineFrom: number,
  lineIndex: number,
  selFrom: number,
  selTo: number,
): WordAtResult | null {
  const tokens = tokenizeLine(docLineText);
  if (tokens.length === 0) return null;

  const localFrom = selFrom - lineFrom;
  const localTo = selTo - lineFrom;

  if (localFrom === localTo) {
    // Caret: find token containing the position (inclusive start, exclusive end;
    // allow caret at token end).
    const token =
      tokens.find((t) => localFrom >= t.start && localFrom < t.end) ??
      tokens.find((t) => localFrom === t.end);
    if (!token) return null;
    return {
      from: lineFrom + token.start,
      to: lineFrom + token.end,
      raw: token.raw,
      word: token.word,
      lineIndex,
      token,
    };
  }

  // Selection: must cover exactly one token (allow whitespace trim on edges).
  const selected = docLineText.slice(localFrom, localTo);
  const trimmed = selected.trim();
  if (!trimmed) return null;

  const trimStart = selected.indexOf(trimmed);
  const absStart = localFrom + trimStart;
  const absEnd = absStart + trimmed.length;

  const token = tokens.find((t) => t.start === absStart && t.end === absEnd);
  if (!token) return null;

  return {
    from: lineFrom + token.start,
    to: lineFrom + token.end,
    raw: token.raw,
    word: token.word,
    lineIndex,
    token,
  };
}
