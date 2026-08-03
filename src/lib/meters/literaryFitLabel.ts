import type { LiteraryFit } from "./types";

/** Short UI label for an accepted literary contour (form checkers / overlays). */
export function formatLiteraryFitLabel(fit: LiteraryFit | undefined): string | null {
  switch (fit) {
    case "catalexis":
      return "catalexis";
    case "feminine":
      return "feminine ending";
    case "inversion":
      return "inversion";
    case "ideal":
      return null;
    default:
      return null;
  }
}

/** Status chip text: Matches, Matches · catalexis, Stress off, ±N, … */
export function formatMeterMatchLabel(
  status: "none" | "under" | "exact" | "over" | "stress",
  fit: LiteraryFit | undefined,
  delta: number,
  empty: boolean,
  target: number,
): string {
  if (empty) return `Need ${target}`;
  if (status === "exact") {
    const fitLabel = formatLiteraryFitLabel(fit);
    return fitLabel ? `Matches · ${fitLabel}` : "Matches";
  }
  if (status === "stress") return "Stress off";
  if (delta === 0) return "Matches";
  if (delta > 0) return `+${delta}`;
  return `−${Math.abs(delta)}`;
}
