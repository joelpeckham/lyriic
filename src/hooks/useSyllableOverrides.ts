import { useLayoutEffect } from "react";

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
 * project's persisted overrides.
 *
 * Sync runs in useLayoutEffect (not during render) so React render stays
 * pure under the Compiler. Editor syllable counting must NOT depend on this
 * Map — PoemEditor threads overrides into countLinesIncremental so the first
 * render is correct before layout effects run. This hook remains a legacy
 * bridge for unit tests and any callers that still use getOverride /
 * setOverride on the module Map.
 *
 * Hard contract: only one PoemEditor / one active project may call this
 * hook. The module Map is a single global writer target — concurrent
 * editors or multiple project syncs would race and corrupt counts.
 */
export function useSyllableOverrides(
  overrides: Record<string, number>,
): void {
  useLayoutEffect(() => {
    if (!overridesMatch(getOverrides(), overrides)) {
      replaceOverrides(overrides);
    }
  }, [overrides]);
}
