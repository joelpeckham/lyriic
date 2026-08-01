import { isMeterPresetId, type MeterPresetId } from "@/lib/meters";

export type EditorSettings = {
  meter: MeterPresetId;
  showCounts: boolean;
  showRulers: boolean;
  customSyllables: number;
  /** Editor font size in rem. */
  fontSize: number;
};

export const CUSTOM_SYLLABLES_MIN = 1;
export const CUSTOM_SYLLABLES_MAX = 20;
export const FONT_SIZE_MIN = 1;
export const FONT_SIZE_MAX = 3;
export const DEFAULT_FONT_SIZE = 1.75;

export const DEFAULT_SETTINGS: EditorSettings = {
  meter: "none",
  showCounts: true,
  showRulers: false,
  customSyllables: 8,
  fontSize: DEFAULT_FONT_SIZE,
};

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampFontSize(value: number): number {
  const rounded = Math.round(value * 100) / 100;
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, rounded));
}

/** Normalize persisted or partial settings into a valid EditorSettings. */
export function normalizeSettings(raw: unknown): EditorSettings {
  const s =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const meter =
    typeof s.meter === "string" && isMeterPresetId(s.meter)
      ? s.meter
      : DEFAULT_SETTINGS.meter;

  const customSyllables =
    typeof s.customSyllables === "number" && Number.isFinite(s.customSyllables)
      ? clampInt(
          s.customSyllables,
          CUSTOM_SYLLABLES_MIN,
          CUSTOM_SYLLABLES_MAX,
        )
      : DEFAULT_SETTINGS.customSyllables;

  const fontSize =
    typeof s.fontSize === "number" && Number.isFinite(s.fontSize)
      ? clampFontSize(s.fontSize)
      : DEFAULT_SETTINGS.fontSize;

  return {
    meter,
    showCounts:
      typeof s.showCounts === "boolean"
        ? s.showCounts
        : DEFAULT_SETTINGS.showCounts,
    showRulers:
      typeof s.showRulers === "boolean"
        ? s.showRulers
        : DEFAULT_SETTINGS.showRulers,
    customSyllables,
    fontSize,
  };
}
