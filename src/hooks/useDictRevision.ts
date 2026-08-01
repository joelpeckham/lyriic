import { useEffect, useState } from "react";

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
  const [revision, setRevision] = useState(getDictRevision);

  useEffect(() => {
    // Sync in case the pack finished between first render and subscribe.
    setRevision(getDictRevision());
    return subscribeDictReady(() => {
      setRevision(getDictRevision());
    });
  }, []);

  return revision;
}
