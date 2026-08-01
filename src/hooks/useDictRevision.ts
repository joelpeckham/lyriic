import { useEffect, useState } from "react";

import {
  getDictRevision,
  loadDict,
  subscribeDictReady,
} from "@/lib/syllables/dict";

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
 * Subscribes to CMU dict readiness so syllable overlays recount after the
 * lazy chunk loads (heuristic → dict). Schedules loadDict after idle / first
 * paint so the chunk does not contend with LCP.
 */
export function useDictRevision(): number {
  const [revision, setRevision] = useState(getDictRevision);

  useEffect(() => {
    const cancelSchedule = scheduleDictLoad(() => {
      void loadDict();
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
