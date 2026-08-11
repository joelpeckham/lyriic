/**
 * Helper for poem-page editor settings (same pattern as about demos).
 */

import {
  overlaysForMeterSeed,
  resolveMeterConfig,
} from "@/lib/meters/presets";
import { DEFAULT_SETTINGS, type EditorSettings } from "@/lib/settings";

export function poemMeterSettings(
  meter: string,
  options: {
    customPattern?: number[];
    showCounts?: boolean;
    showRulers?: boolean;
    showStress?: boolean;
    showMeterBreaks?: boolean;
    showRhymeScheme?: boolean;
  } = {},
): EditorSettings {
  const customPattern = options.customPattern ?? DEFAULT_SETTINGS.customPattern;
  const config = resolveMeterConfig({
    meter,
    customPattern,
    customFoot: DEFAULT_SETTINGS.customFoot,
    customRhymePattern: DEFAULT_SETTINGS.customRhymePattern,
  });
  const overlays = overlaysForMeterSeed(config);
  return {
    ...DEFAULT_SETTINGS,
    meter,
    customPattern,
    ...overlays,
    showCounts: options.showCounts ?? overlays.showCounts,
    showRulers: options.showRulers ?? overlays.showRulers,
    showStress: options.showStress ?? overlays.showStress,
    showMeterBreaks: options.showMeterBreaks ?? overlays.showMeterBreaks,
    showRhymeScheme: options.showRhymeScheme ?? false,
  };
}

/** Free-verse / open reading: counts on, no stress drill. */
export function poemOpenSettings(
  options: {
    showCounts?: boolean;
    showRulers?: boolean;
  } = {},
): EditorSettings {
  return {
    ...DEFAULT_SETTINGS,
    meter: "none",
    showCounts: options.showCounts ?? true,
    showRulers: options.showRulers ?? false,
    showStress: false,
    showMeterBreaks: false,
    showRhymeScheme: false,
  };
}
