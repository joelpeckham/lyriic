import { normalizeOverrideKey } from "@/lib/syllables/overrides";

/** Accept finite primary-stress indices >= 0. */
export function isValidStressOverride(index: unknown): index is number {
  return (
    typeof index === "number" &&
    Number.isFinite(index) &&
    index >= 0 &&
    Number.isInteger(index)
  );
}

export function normalizeStressOverridesRecord(
  entries: unknown,
): Record<string, number> {
  if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
    return {};
  }
  const result: Record<string, number> = {};
  for (const [word, index] of Object.entries(
    entries as Record<string, unknown>,
  )) {
    const key = normalizeOverrideKey(word);
    if (!key || !isValidStressOverride(index)) continue;
    result[key] = Math.floor(index);
  }
  return result;
}
