import type { MeterStatus } from "./types";

/**
 * Shared screen-reader / aria-describedby phrasing for a line’s meter status.
 * Used by PoemEditor (live region) and the syllable overlay.
 */
export function formatMeterLabel(
  total: number,
  target: number | null,
  status: MeterStatus,
  lineHasText: boolean,
): string {
  if (!lineHasText && total === 0) return "Empty line";
  if (target === null) return `${total} syllables`;
  const phrase =
    status === "exact"
      ? ", on meter"
      : status === "stress"
        ? ", stress off meter"
        : status === "over"
          ? ", over target"
          : status === "under"
            ? ", under target"
            : "";
  return `${total} of ${target} syllables${phrase}`;
}
