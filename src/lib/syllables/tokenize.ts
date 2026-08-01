import { normalizeWord } from "./normalize";
import type { WordToken } from "./types";

/** Straight apostrophe or typographic right single quotation mark. */
const APOSTROPHE = "['\\u2019]";

/**
 * Words with optional leading elision, multiple internal apostrophes,
 * trailing possessives, hyphenated compounds, and Unicode letters.
 */
const WORD_RE = new RegExp(
  `${APOSTROPHE}?\\p{L}+(?:${APOSTROPHE}\\p{L}+)*(?:-(?:${APOSTROPHE}?\\p{L}+(?:${APOSTROPHE}\\p{L}+)*))*${APOSTROPHE}?`,
  "gu",
);

/** Split a poetic line into word tokens with character offsets. */
export function tokenizeLine(line: string): WordToken[] {
  const tokens: WordToken[] = [];
  for (const match of line.matchAll(WORD_RE)) {
    const raw = match[0];
    const start = match.index ?? 0;
    tokens.push({
      raw,
      word: normalizeWord(raw, { keepHyphen: true }),
      start,
      end: start + raw.length,
    });
  }
  return tokens;
}
