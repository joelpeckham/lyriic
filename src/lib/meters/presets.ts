export type MeterPresetId =
  | "none"
  | "haiku"
  | "iambic-pentameter"
  | "common-meter"
  | "custom";

export type MeterPreset = {
  readonly id: MeterPresetId;
  readonly label: string;
  /** Target syllables per line in cycle order. Empty = no targets. */
  readonly pattern: readonly number[];
  readonly description: string;
};

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
    description: "10 syllables per line",
  },
  {
    id: "common-meter",
    label: "Common meter",
    pattern: [8, 6],
    description: "8 / 6 ballad stanza",
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
