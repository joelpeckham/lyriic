import { useSyncExternalStore } from "react";

import {
  getDictRevision,
  subscribeDictReady,
} from "@/lib/data/lexicon";

/**
 * Subscribes to lexicon readiness so syllable overlays recount after the
 * binary pack loads (heuristic → dict). Load is scheduled once at app root
 * via scheduleLexiconLoad.
 */
export function useDictRevision(): number {
  return useSyncExternalStore(
    subscribeDictReady,
    getDictRevision,
    getDictRevision,
  );
}
