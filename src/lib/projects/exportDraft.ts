/** Thin helpers for getting draft text out of the local-first editor. */

import { METER_CATALOG } from "@/lib/meters/presets";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Safe .txt filename from a draft name. */
export function draftFilename(name: string): string {
  const base =
    name
      .trim()
      .replace(/[^\w\s-]+/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "draft";
  return `${base}.txt`;
}

export function countPoemLines(text: string): number {
  if (!text.trim()) return 0;
  return text.split("\n").filter((line) => line.trim().length > 0).length;
}

/** First non-empty verse line, truncated for list previews. */
export function firstVerseLine(text: string, maxLen = 40): string | null {
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.length <= maxLen) return trimmed;
    return `${trimmed.slice(0, Math.max(1, maxLen - 1))}…`;
  }
  return null;
}

export function formatRelativeUpdatedAt(
  updatedAt: number,
  now = Date.now(),
): string {
  const deltaSec = Math.round((now - updatedAt) / 1000);
  if (!Number.isFinite(deltaSec) || deltaSec < 45) return "Just now";
  const minutes = Math.round(deltaSec / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/**
 * Secondary draft-list line: verse preview, else empty cue.
 * Prefer optional meter label; otherwise relative time.
 */
export function draftListSecondary(
  text: string,
  updatedAt: number,
  meterLabel?: string,
  now = Date.now(),
): string {
  const preview = firstVerseLine(text);
  if (preview) return preview;
  const detail = meterLabel?.trim() || formatRelativeUpdatedAt(updatedAt, now);
  return `Empty · ${detail}`;
}

/** Date/time stub used when creating a new draft from the switcher. */
export function defaultDraftName(now = Date.now()): string {
  return new Date(now).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Locale stubs from `defaultDraftName` — short month/day + clock time. */
const DEFAULT_DRAFT_NAME_RE =
  /^(?:[\p{L}.]+\s+\d{1,2}|\d{1,2}\.?\s+[\p{L}.]+),?\s+\d{1,2}:\d{2}(?:\s*[AaPp]\.?[Mm]\.?)?$/u;

const PLACEHOLDER_SEED_LABELS = new Set<string>([
  "Untitled",
  "None", // legacy catalog label
  ...METER_CATALOG.map((entry) => entry.label),
]);

/**
 * True for auto-assigned draft titles that soft-rename may replace:
 * Untitled, meter/form seed labels, and datetime stubs from `defaultDraftName`.
 */
export function isPlaceholderDraftName(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return true;
  if (PLACEHOLDER_SEED_LABELS.has(trimmed)) return true;
  return DEFAULT_DRAFT_NAME_RE.test(trimmed);
}

/**
 * Auto draft title: first three whitespace-separated words, truncated.
 * Returns null when text has no words.
 */
export function autoDraftNameFromText(
  text: string,
  maxLen = 30,
): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const words = trimmed.split(/\s+/).slice(0, 3);
  if (words.length === 0) return null;
  const joined = words.join(" ");
  if (joined.length <= maxLen) return joined;
  return joined.slice(0, maxLen);
}

/**
 * Soft title from poem text while auto-naming is active (flag or placeholder).
 * Empty content falls back to a date stub; `autoNamed: false` locks the name.
 * Returns null when the name should stay as-is.
 */
export function softDraftNameFromText(
  currentName: string,
  text: string,
  options?: { autoNamed?: boolean; now?: number },
): string | null {
  if (options?.autoNamed === false) return null;
  const canAuto =
    options?.autoNamed === true || isPlaceholderDraftName(currentName);
  if (!canAuto) return null;
  return (
    autoDraftNameFromText(text) ?? defaultDraftName(options?.now ?? Date.now())
  );
}
