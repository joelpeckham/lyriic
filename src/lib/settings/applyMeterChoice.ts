import {
  isStressAwareMeterConfig,
  resolveMeterConfig,
} from "@/lib/meters/presets";
import type { EditorSettings } from "@/lib/settings";

/**
 * When the user picks a meter in Settings, enable sensible overlays.
 * Choosing "none" leaves overlay toggles as-is (user may still want counts).
 */
export function applyMeterChoice(
  settings: EditorSettings,
  meterId: string,
): EditorSettings {
  const next: EditorSettings = { ...settings, meter: meterId };
  if (meterId === "none") return next;

  const config = resolveMeterConfig({
    meter: meterId,
    customPattern: next.customPattern,
    customFoot: next.customFoot,
  });
  const stressAware = isStressAwareMeterConfig(config);
  return {
    ...next,
    showCounts: true,
    showRulers: config.pattern.length > 0,
    showMeterBreaks: stressAware ? true : next.showMeterBreaks,
  };
}
