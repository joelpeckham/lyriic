import { isMeterPresetId, type MeterPresetId } from "@/lib/meters";

export type EditorSettings = {
  meter: MeterPresetId;
  showCounts: boolean;
  showRulers: boolean;
  showStress: boolean;
  customSyllables: number;
};

export const CUSTOM_SYLLABLES_MIN = 1;
export const CUSTOM_SYLLABLES_MAX = 20;

export const DEFAULT_SETTINGS: EditorSettings = {
  meter: "none",
  showCounts: true,
  showRulers: false,
  showStress: false,
  customSyllables: 8,
};

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
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
    showStress:
      typeof s.showStress === "boolean"
        ? s.showStress
        : DEFAULT_SETTINGS.showStress,
    customSyllables,
  };
}
