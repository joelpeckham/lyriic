import { getMeterCatalogEntry } from "@/lib/meters/presets";

/** Display custom syllable cycle with en-dashes (e.g. 5–7–5). */
export function formatCustomPatternDashes(
  pattern: readonly number[],
): string {
  const nums = pattern.length > 0 ? pattern : [8];
  return nums.join("–");
}

/**
 * Header meter chip label + aria.
 * Custom shows the cycle; closed forms keep the form name with N/M progress
 * so overshoot never looks like a failing grade.
 */
export function formatActiveMeterChip(
  meterId: string,
  customPattern: readonly number[],
  writtenLines: number,
): { label: string; ariaLabel: string } {
  if (meterId === "none") {
    return {
      label: "Free verse",
      ariaLabel: "Free verse. Opens settings to pick a meter.",
    };
  }

  if (meterId === "custom") {
    const cycle = formatCustomPatternDashes(customPattern);
    const label = `Custom · ${cycle}`;
    return {
      label,
      ariaLabel: `${label}. Open settings to change.`,
    };
  }

  const entry = getMeterCatalogEntry(meterId);
  const stanzaLines = entry.stanzaLines ?? null;
  if (stanzaLines != null && stanzaLines > 0 && writtenLines > 0) {
    const label = `${entry.label} · ${writtenLines}/${stanzaLines}`;
    return {
      label,
      ariaLabel: `${entry.label}, line ${writtenLines} of ${stanzaLines}. Open settings to change.`,
    };
  }

  return {
    label: entry.label,
    ariaLabel: `Meter: ${entry.label}. Open settings to change.`,
  };
}
