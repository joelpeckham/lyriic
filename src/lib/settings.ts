import {
  isCustomFootId,
  type CustomFootId,
} from "@/lib/meters/feet";
import {
  isMeterCatalogId,
  overlaysForMeterSeed,
  resolveMeterConfig,
} from "@/lib/meters/presets";

export type EditorSettings = {
  /** Catalog id, `none`, or `custom`. */
  meter: string;
  showCounts: boolean;
  showRulers: boolean;
  showStress: boolean;
  /** Highlight syllables that break a stress-aware meter pattern. */
  showMeterBreaks: boolean;
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
    customPattern,
    customFoot,
  };
}

/** Build settings for a catalog meter (deep link / writer route). */
export function settingsForMeter(
  meterId: string,
  overlayOverrides?: Partial<
    Pick<
      EditorSettings,
      "showCounts" | "showRulers" | "showStress" | "showMeterBreaks"
    >
  >,
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
    ...overlays,
    ...overlayOverrides,
  };
}
