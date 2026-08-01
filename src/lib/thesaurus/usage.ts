/** WordNet-style open-class usage tags used by the synonym map. */
export type WordUsage = "n" | "v" | "a" | "r";

const DETERMINERS = new Set([
  "the",
  "a",
  "an",
  "my",
  "your",
  "his",
  "her",
  "its",
  "our",
  "their",
  "this",
  "that",
  "these",
  "those",
  "some",
  "any",
  "every",
  "each",
  "no",
  "another",
  "both",
]);

const SUBJECT_PRONOUNS = new Set([
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "who",
]);

const AUX_MODALS = new Set([
  "will",
  "would",
  "can",
  "could",
  "should",
  "must",
  "may",
  "might",
  "shall",
  "do",
  "does",
  "did",
  "don't",
  "doesn't",
  "didn't",
]);

const DEGREE = new Set([
  "very",
  "too",
  "quite",
  "rather",
  "more",
  "most",
  "so",
  "pretty",
  "fairly",
  "extremely",
  "slightly",
  "somewhat",
]);

const COPULA = new Set([
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "am",
  "seem",
  "seems",
  "seemed",
  "feel",
  "feels",
  "felt",
  "look",
  "looks",
  "looked",
  "become",
  "becomes",
  "became",
]);

/** -ly forms that are usually not adverbs. */
const LY_NON_ADV = new Set([
  "only",
  "early",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "family",
  "supply",
  "apply",
  "rely",
  "imply",
  "reply",
  "comply",
  "ally",
  "belly",
  "rally",
  "tally",
  "jelly",
  "folly",
  "holly",
  "homily",
  "assembly",
  "friendly",
  "lonely",
  "lovely",
  "lively",
  "unlikely",
  "likely",
  "ugly",
  "silly",
  "holy",
  "costly",
  "deadly",
  "earthly",
  "heavenly",
  "worldly",
  "ghastly",
  "ghostly",
  "leisurely",
  "mannerly",
  "orderly",
  "scholarly",
  "cowardly",
  "northeasterly",
  "southwesterly",
]);

const TOKEN_RE = /[a-z]+(?:'[a-z]+)*/gi;

function tokensWithSpans(
  text: string,
): { word: string; start: number; end: number }[] {
  const out: { word: string; start: number; end: number }[] = [];
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    out.push({
      word: match[0].toLowerCase(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return out;
}

function previousWord(
  lineText: string,
  localFrom: number,
  localTo: number,
): string | null {
  const tokens = tokensWithSpans(lineText);
  let index = tokens.findIndex(
    (t) => t.start === localFrom || (localFrom >= t.start && localFrom < t.end),
  );
  if (index < 0) {
    index = tokens.findIndex((t) => t.end === localTo);
  }
  if (index <= 0) return null;
  return tokens[index - 1]!.word;
}

function morphologyUsage(word: string): WordUsage | null {
  if (word.endsWith("ing") && word.length > 4) return "v";
  if (word.endsWith("ed") && word.length > 3) return "v";
  if (/(?:ness|tion|sion|ment|ity|ance|ence)$/.test(word)) return "n";
  if (/(?:ous|ful|less|ish|ive|able|ible)$/.test(word) && word.length > 4) {
    return "a";
  }
  if (word.endsWith("ly") && word.length > 3 && !LY_NON_ADV.has(word)) {
    return "r";
  }
  return null;
}

/**
 * Best-effort open-class usage for thesaurus ranking.
 * Uses local line context first, then light morphology. Returns null when unsure.
 */
export function detectUsage(
  word: string,
  lineText: string,
  localFrom: number,
  localTo: number = localFrom + word.length,
): WordUsage | null {
  const normalized = word
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, "'");
  if (!normalized) return null;

  const prev = previousWord(lineText, localFrom, localTo);

  if (prev && DETERMINERS.has(prev)) return "n";
  if (prev === "to") return "v";
  if (prev && AUX_MODALS.has(prev)) return "v";
  if (prev && SUBJECT_PRONOUNS.has(prev)) return "v";
  if (prev && DEGREE.has(prev)) {
    return normalized.endsWith("ly") && !LY_NON_ADV.has(normalized) ? "r" : "a";
  }
  if (prev && COPULA.has(prev)) {
    return normalized.endsWith("ly") && !LY_NON_ADV.has(normalized) ? "r" : "a";
  }

  return morphologyUsage(normalized);
}
