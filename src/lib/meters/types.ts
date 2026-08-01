import type { StressCode } from "@/lib/data/dictPack";
import type { LineSyllableCount } from "@/lib/syllables/types";

export type MeterStatus = "none" | "under" | "exact" | "over" | "stress";

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
  /** Per-syllable stress codes (0/1/2); length matches `syllables`. */
  stress: StressCode[];
};

export type MeteredLine = {
  total: number;
  target: number | null;
  status: MeterStatus;
  tokens: MeteredToken[];
  /** Expected binary stress when the preset is stress-aware; null otherwise. */
  expectedStress: readonly (0 | 1)[] | null;
};
