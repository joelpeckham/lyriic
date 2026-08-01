import type { LineSyllableCount } from "@/lib/syllables/types";

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
  /**
   * Cumulative syllable ends after each token (and 0 at the start).
   * Equivalent to `[0, ...tokens.map(t => t.syllableEnd)]`.
   * Ruler tick geometry uses token spans via `mapSyllableToOffset`, not this array.
   */
  boundaries: number[];
};
