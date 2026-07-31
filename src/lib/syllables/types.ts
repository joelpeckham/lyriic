export type SyllableSource = "dict" | "heuristic" | "override";

export type WordToken = {
  /** Raw slice from the line. */
  raw: string;
  /** Normalized form used for counting (lowercase, straight apostrophes). */
  word: string;
  start: number;
  end: number;
};

export type WordSyllableCount = {
  word: string;
  count: number;
  source: SyllableSource;
};

export type LineSyllableCount = {
  total: number;
  perWord: WordSyllableCount[];
  tokens: WordToken[];
};

/** Future languages implement this; English is the first provider. */
export type SyllableProvider = {
  id: string;
  countWord: (word: string) => WordSyllableCount;
};
