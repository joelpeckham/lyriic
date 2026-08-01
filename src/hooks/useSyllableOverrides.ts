import { getOverrides, replaceOverrides } from "@/lib/syllables";

function overridesMatch(
  map: ReadonlyMap<string, number>,
  record: Record<string, number>,
): boolean {
  const keys = Object.keys(record);
  if (map.size !== keys.length) return false;
  for (const key of keys) {
    if (map.get(key) !== record[key]) return false;
  }
  return true;
}

/**
 * Keep the module-level syllable override Map in sync with the active
 * project's persisted overrides. Syncs during render (not in an effect) so
 * the same pass that receives new project state also sees the fresh Map
 * before children count syllables.
 */
export function useSyllableOverrides(
  overrides: Record<string, number>,
): void {
  if (!overridesMatch(getOverrides(), overrides)) {
    replaceOverrides(overrides);
  }
}
