import { clearMemo } from "./memo";

/** In-memory user overrides. Projects persist this map via localStorage. */
const overrides = new Map<string, number>();

/**
 * Normalize an override key: lowercase, straight apostrophes, keep letters
 * (Unicode), apostrophes, and hyphens so compounds do not collide with
 * unhyphenated forms.
 */
export function normalizeOverrideKey(word: string): string {
  return word
    .toLowerCase()
    .replace(/['\u2019]/g, "'")
    .replace(/[^\p{L}'-]/gu, "");
}

/** Accept finite integers >= 1 only. */
export function isValidOverrideCount(count: unknown): count is number {
  return typeof count === "number" && Number.isFinite(count) && count >= 1;
}

export function normalizeOverridesRecord(
  entries: unknown,
): Record<string, number> {
  if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
    return {};
  }
  const result: Record<string, number> = {};
  for (const [word, count] of Object.entries(
    entries as Record<string, unknown>,
  )) {
    const key = normalizeOverrideKey(word);
    if (!key || !isValidOverrideCount(count)) continue;
    result[key] = Math.floor(count);
  }
  return result;
}

export function getOverride(word: string): number | undefined {
  const key = normalizeOverrideKey(word);
  if (!key) return undefined;
  return overrides.get(key);
}

export function setOverride(word: string, count: number): void {
  const key = normalizeOverrideKey(word);
  if (!key || !isValidOverrideCount(count)) return;
  overrides.set(key, Math.floor(count));
  clearMemo();
}

export function clearOverride(word: string): void {
  const key = normalizeOverrideKey(word);
  if (!key) return;
  overrides.delete(key);
  clearMemo();
}

export function clearAllOverrides(): void {
  overrides.clear();
  clearMemo();
}

/** Replace the entire override map (e.g. when switching projects). */
export function replaceOverrides(entries: Record<string, number>): void {
  overrides.clear();
  for (const [word, count] of Object.entries(
    normalizeOverridesRecord(entries),
  )) {
    overrides.set(word, count);
  }
  clearMemo();
}

export function overridesToRecord(): Record<string, number> {
  return Object.fromEntries(overrides);
}

export function getOverrides(): ReadonlyMap<string, number> {
  return overrides;
}
