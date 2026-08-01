import {
  DEFAULT_SETTINGS,
  settingsForMeter,
  type EditorSettings,
} from "@/lib/settings";
import {
  getMeterCatalogEntry,
  isMeterCatalogId,
  listFormCheckerMeters,
} from "./presets";

export type MeterSeedOverlays = Partial<
  Pick<
    EditorSettings,
    "showCounts" | "showRulers" | "showStress" | "showMeterBreaks"
  >
>;

export type MeterSeed = {
  meterId: string;
  overlays: MeterSeedOverlays;
};

function parseBoolParam(value: string | null): boolean | undefined {
  if (value === null) return undefined;
  const v = value.trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes" || v === "on") return true;
  if (v === "0" || v === "false" || v === "no" || v === "off") return false;
  return undefined;
}

/**
 * Parse meter seed from a write-route slug and/or search params.
 * Slug wins for meter id; query can still override overlay flags.
 */
export function parseMeterSeed(
  slug: string | null | undefined,
  searchParams: URLSearchParams,
): MeterSeed | null {
  const fromSlug =
    typeof slug === "string" && slug.length > 0 ? slug.trim() : null;
  const fromQuery = searchParams.get("meter")?.trim() || null;
  const meterId = fromSlug || fromQuery;
  if (!meterId || !isMeterCatalogId(meterId) || meterId === "custom") {
    return null;
  }

  const overlays: MeterSeedOverlays = {};
  const counts = parseBoolParam(searchParams.get("counts"));
  const rulers = parseBoolParam(searchParams.get("rulers"));
  const stress = parseBoolParam(searchParams.get("stress"));
  const breaks = parseBoolParam(searchParams.get("breaks"));
  if (counts !== undefined) overlays.showCounts = counts;
  if (rulers !== undefined) overlays.showRulers = rulers;
  if (stress !== undefined) overlays.showStress = stress;
  if (breaks !== undefined) overlays.showMeterBreaks = breaks;

  return { meterId, overlays };
}

export function settingsFromMeterSeed(seed: MeterSeed): EditorSettings | null {
  return settingsForMeter(seed.meterId, seed.overlays);
}

/** True when the URL still carries seed query flags (fresh deep link). */
export function urlHasMeterSeedQuery(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has("meter") ||
    searchParams.has("counts") ||
    searchParams.has("rulers") ||
    searchParams.has("stress") ||
    searchParams.has("breaks")
  );
}

/**
 * Stable one-shot identity for a seed. Excludes overlay query so stripping
 * `?stress=1` etc. does not look like a new seed.
 */
export function meterSeedIdentity(
  slug: string | null | undefined,
  meterId: string,
): string {
  const fromSlug =
    typeof slug === "string" && slug.trim().length > 0 ? slug.trim() : null;
  return fromSlug ? `slug:${fromSlug}` : `meter:${meterId}`;
}

/**
 * True when a draft can be reused for a meter seed: empty text and either
 * still on the default free canvas or already on the target meter.
 */
export function isReusableEmptyDraft(
  project: {
    text: string;
    settings: EditorSettings;
  },
  targetMeter?: string,
): boolean {
  if (project.text.trim().length !== 0) return false;
  const meter = project.settings.meter;
  if (meter === DEFAULT_SETTINGS.meter) return true;
  return targetMeter !== undefined && meter === targetMeter;
}

/** All form-checker meters get a `/write/:slug` SEO shell. */
export const WRITER_PRERENDER_SLUGS = listFormCheckerMeters().map(
  (entry) => entry.id,
);

export function writerPath(slug: string): string {
  return `/write/${slug}`;
}

export function writerDocumentMeta(slug: string): {
  title: string;
  description: string;
  path: string;
} | null {
  if (!isMeterCatalogId(slug) || slug === "custom" || slug === "none") {
    return null;
  }
  const entry = getMeterCatalogEntry(slug);
  return {
    title: `${entry.label} writer — lyriic`,
    description: `Write ${entry.label.toLowerCase()} in lyriic with live syllable counts and meter guides. ${entry.description}. Drafts stay local in your browser.`,
    path: writerPath(slug),
  };
}
