import { useEffect, useState } from "react";

import {
  getDictRevision,
  loadDict,
  subscribeDictReady,
} from "@/lib/syllables/dict";
import { prefetchThesaurus } from "@/lib/thesaurus";

function scheduleDictLoad(start: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const idleId = window.requestIdleCallback(start, { timeout: 2000 });
    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }
  const timeoutId = window.setTimeout(start, 1);
  return () => window.clearTimeout(timeoutId);
}

/**
 * Subscribes to lexicon readiness so syllable overlays recount after the
 * binary pack loads (heuristic → dict). Schedules loadDict after idle / first
 * paint so the asset does not contend with LCP. Prefetches the thesaurus once
 * the lexicon is ready.
 */
export function useDictRevision(): number {
  const [revision, setRevision] = useState(getDictRevision);

  useEffect(() => {
    const cancelSchedule = scheduleDictLoad(() => {
      void loadDict().then(() => {
        prefetchThesaurus();
      });
    });
    const unsubscribe = subscribeDictReady(() => {
      setRevision(getDictRevision());
    });
    return () => {
      cancelSchedule();
      unsubscribe();
    };
  }, []);

  return revision;
}