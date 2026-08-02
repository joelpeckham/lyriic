import {
  isStressAwareMeterConfig,
  resolveMeterConfig,
} from "@/lib/meters/presets";
import {
  defaultRhymeSchemeId,
  type EditorSettings,
} from "@/lib/settings";

/**
 * When the user picks a meter in Settings, enable sensible overlays.
 * Choosing "none" leaves overlay toggles as-is (user may still want counts).
 * Stress overlays turn on only for stress-aware meters.
 */
export function applyMeterChoice(
  settings: EditorSettings,
  meterId: string,
): EditorSettings {
  const next: EditorSettings = {
    ...settings,
    meter: meterId,
    rhymeSchemeId: defaultRhymeSchemeId(
      meterId,
      settings.customRhymePattern,
    ),
  };
  if (meterId === "none") return next;

  const config = resolveMeterConfig({
    meter: meterId,
    customPattern: next.customPattern,
    customFoot: next.customFoot,
    customRhymePattern: next.customRhymePattern,
  });
  const stressAware = isStressAwareMeterConfig(config);
  const hasRhyme = Boolean(config.rhymeSchemes && config.rhymeSchemes.length > 0);
  return {
    ...next,
    showCounts: true,
    showRulers: config.pattern.length > 0,
    // Syllable-only forms stay quiet; stress-aware picks seed marks + breaks.
    showStress: stressAware,
    showMeterBreaks: stressAware,
    showRhymeScheme: hasRhyme ? true : next.showRhymeScheme,
  };
}
