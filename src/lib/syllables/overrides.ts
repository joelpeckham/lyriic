import { normalizeWord } from "./normalize";

/** Override key: letters, apostrophes, and hyphens (compounds stay distinct). */
export function normalizeOverrideKey(word: string): string {
  return normalizeWord(word, { keepHyphen: true });
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
