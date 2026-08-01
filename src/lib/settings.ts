import {
  isCustomFootId,
  type CustomFootId,
} from "@/lib/meters/feet";
import {
  isMeterCatalogId,
  overlaysForMeterSeed,
  resolveMeterConfig,
  resolveRhymeScheme,
  rhymeSchemesForMeter,
} from "@/lib/meters/presets";

export type EditorSettings = {
  /** Catalog id, `none`, or `custom`. */
  meter: string;
  showCounts: boolean;
  showRulers: boolean;
  showStress: boolean;
  /** Highlight syllables that break a stress-aware meter pattern. */
  showMeterBreaks: boolean;
  /** Show rhyme-scheme gutter dots when the meter has schemes. */
  showRhymeScheme: boolean;
  /** Selected named rhyme scheme id for the current meter (null when none). */
  rhymeSchemeId: string | null;
  /** Syllable targets per line for custom meter (cycle). */
  customPattern: number[];
  /** Optional foot used to fill stress for each custom line length. */
  customFoot: CustomFootId;
};

export const CUSTOM_SYLLABLES_MIN = 1;
export const CUSTOM_SYLLABLES_MAX = 20;
export const CUSTOM_PATTERN_MAX_LINES = 16;

export const DEFAULT_SETTINGS: EditorSettings = {
  meter: "none",
  showCounts: true,
  showRulers: true,
  showStress: true,
  showMeterBreaks: true,
  showRhymeScheme: false,
  rhymeSchemeId: null,
  customPattern: [8],
  customFoot: "none",
};

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function clampCustomSyllables(value: number): number {
  return clampInt(value, CUSTOM_SYLLABLES_MIN, CUSTOM_SYLLABLES_MAX);
}

/** Parse "5,7,5" or "8" into a validated custom pattern. */
export function parseCustomPattern(raw: string): number[] | null {
  const parts = raw
    .split(/[,\s/]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length > CUSTOM_PATTERN_MAX_LINES) return null;
  const nums: number[] = [];
  for (const part of parts) {
    const n = Number(part);
    if (!Number.isFinite(n)) return null;
    nums.push(clampCustomSyllables(n));
  }
  return nums.length > 0 ? nums : null;
}

export function formatCustomPattern(pattern: readonly number[]): string {
  return pattern.join(", ");
}

function normalizeCustomPattern(
  raw: unknown,
  legacySyllables: unknown,
): number[] {
  if (Array.isArray(raw)) {
    const nums = raw
      .filter((n): n is number => typeof n === "number" && Number.isFinite(n))
      .map(clampCustomSyllables)
      .slice(0, CUSTOM_PATTERN_MAX_LINES);
    if (nums.length > 0) return nums;
  }
  if (typeof legacySyllables === "number" && Number.isFinite(legacySyllables)) {
    return [clampCustomSyllables(legacySyllables)];
  }
  return [...DEFAULT_SETTINGS.customPattern];
}

/** Default scheme id for a meter, or null when the meter has none. */
export function defaultRhymeSchemeId(meterId: string): string | null {
  return resolveRhymeScheme(meterId, null)?.id ?? null;
}

/**
 * Normalize a persisted scheme id against the meter's catalog schemes.
 * Falls back to the first scheme (or null).
 */
export function normalizeRhymeSchemeId(
  meterId: string,
  schemeId: unknown,
): string | null {
  const schemes = rhymeSchemesForMeter(meterId);
  if (schemes.length === 0) return null;
  if (typeof schemeId === "string" && schemes.some((s) => s.id === schemeId)) {
    return schemeId;
  }
  return schemes[0]?.id ?? null;
}

/** Normalize persisted or partial settings into a valid EditorSettings. */
export function normalizeSettings(raw: unknown): EditorSettings {
  const s =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const meter =
    typeof s.meter === "string" && isMeterCatalogId(s.meter)
      ? s.meter
      : DEFAULT_SETTINGS.meter;

  const customPattern = normalizeCustomPattern(
    s.customPattern,
    s.customSyllables,
  );

  const customFoot =
    typeof s.customFoot === "string" && isCustomFootId(s.customFoot)
      ? s.customFoot
      : DEFAULT_SETTINGS.customFoot;

  const rhymeSchemeId = normalizeRhymeSchemeId(meter, s.rhymeSchemeId);
  const hasRhyme = rhymeSchemeId !== null;

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
    showMeterBreaks:
      typeof s.showMeterBreaks === "boolean"
        ? s.showMeterBreaks
        : DEFAULT_SETTINGS.showMeterBreaks,
    showRhymeScheme:
      typeof s.showRhymeScheme === "boolean"
        ? s.showRhymeScheme
        : hasRhyme
          ? true
          : DEFAULT_SETTINGS.showRhymeScheme,
    rhymeSchemeId,
    customPattern,
    customFoot,
  };
}

export type OverlaySettingsPick = Pick<
  EditorSettings,
  | "showCounts"
  | "showRulers"
  | "showStress"
  | "showMeterBreaks"
  | "showRhymeScheme"
>;

/** Build settings for a catalog meter (deep link / writer route). */
export function settingsForMeter(
  meterId: string,
  overlayOverrides?: Partial<OverlaySettingsPick>,
): EditorSettings | null {
  if (!isMeterCatalogId(meterId) || meterId === "custom") return null;
  const config = resolveMeterConfig({
    meter: meterId,
    customPattern: DEFAULT_SETTINGS.customPattern,
    customFoot: DEFAULT_SETTINGS.customFoot,
  });
  const overlays = overlaysForMeterSeed(config);
  return {
    ...DEFAULT_SETTINGS,
    meter: meterId,
    rhymeSchemeId: defaultRhymeSchemeId(meterId),
    ...overlays,
    ...overlayOverrides,
  };
}
