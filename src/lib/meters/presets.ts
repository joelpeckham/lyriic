export type MeterPresetId =
  | "none"
  | "haiku"
  | "iambic-pentameter"
  | "common-meter"
  | "custom";

/** Binary foot: 0 = unstressed, 1 = stressed. */
export type BinaryStressPattern = readonly (0 | 1)[];

export type MeterPreset = {
  readonly id: MeterPresetId;
  readonly label: string;
  /** Target syllables per line in cycle order. Empty = no targets. */
  readonly pattern: readonly number[];
  /**
   * Expected binary stress per line in cycle order (same length as that
   * line’s syllable target). Empty / omitted = syllable-count only.
   */
  readonly stressPatterns?: readonly BinaryStressPattern[];
  readonly description: string;
};

const IAMBIC_10: BinaryStressPattern = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
const IAMBIC_8: BinaryStressPattern = [0, 1, 0, 1, 0, 1, 0, 1];
const IAMBIC_6: BinaryStressPattern = [0, 1, 0, 1, 0, 1];

const METER_PRESET_IDS: readonly MeterPresetId[] = [
  "none",
  "haiku",
  "iambic-pentameter",
  "common-meter",
  "custom",
] as const;

export function isMeterPresetId(value: string): value is MeterPresetId {
  return (METER_PRESET_IDS as readonly string[]).includes(value);
}

export const METER_PRESETS: readonly MeterPreset[] = [
  {
    id: "none",
    label: "None",
    pattern: [],
    description: "Syllable counts only",
  },
  {
    id: "haiku",
    label: "Haiku",
    pattern: [5, 7, 5],
    description: "5 / 7 / 5",
  },
  {
    id: "iambic-pentameter",
    label: "Iambic pentameter",
    pattern: [10],
    stressPatterns: [IAMBIC_10],
    description: "10 syllables, unstressed–stressed feet",
  },
  {
    id: "common-meter",
    label: "Common meter",
    pattern: [8, 6],
    stressPatterns: [IAMBIC_8, IAMBIC_6],
    description: "8 / 6 iambic ballad stanza",
  },
  {
    id: "custom",
    label: "Custom",
    pattern: [8],
    description: "Fixed syllables per line",
  },
] as const;

export function getMeterPreset(id: MeterPresetId): MeterPreset {
  return METER_PRESETS.find((preset) => preset.id === id) ?? METER_PRESETS[0]!;
}

export function targetForLine(
  pattern: readonly number[],
  lineIndex: number,
): number | null {
  if (pattern.length === 0) return null;
  return pattern[lineIndex % pattern.length] ?? null;
}

/** Expected binary stress for a line, or null when the meter is syllable-only. */
export function stressPatternForLine(
  stressPatterns: readonly BinaryStressPattern[] | undefined,
  lineIndex: number,
): BinaryStressPattern | null {
  if (!stressPatterns || stressPatterns.length === 0) return null;
  return stressPatterns[lineIndex % stressPatterns.length] ?? null;
}

/** True when a meter preset validates stress as well as syllable count. */
export function isStressAwareMeter(id: MeterPresetId): boolean {
  const patterns = getMeterPreset(id).stressPatterns;
  return Boolean(patterns && patterns.length > 0);
}
