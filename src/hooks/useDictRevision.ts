import { useEffect, useState } from "react";

import {
  getDictRevision,
  loadDict,
  subscribeDictReady,
} from "@/lib/syllables/dict";

type NetworkConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

/** Idle timeout before lexicon fetch — longer on constrained networks. */
function dictIdleTimeoutMs(): number {
  const conn = (
    navigator as Navigator & { connection?: NetworkConnection }
  ).connection;
  if (!conn) return 2000;
  if (conn.saveData) return 10_000;
  const type = conn.effectiveType;
  if (type === "slow-2g" || type === "2g" || type === "3g") return 10_000;
  return 2000;
}

function scheduleDictLoad(start: () => void): () => void {
  const timeout = dictIdleTimeoutMs();
  if (typeof window.requestIdleCallback === "function") {
    const idleId = window.requestIdleCallback(start, { timeout });
    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }
  const timeoutId = window.setTimeout(start, timeout);
  return () => window.clearTimeout(timeoutId);
}

/**
 * Subscribes to lexicon readiness so syllable overlays recount after the
 * binary pack loads (heuristic → dict). Schedules loadDict after idle / first
 * paint so the asset does not contend with TTI. Thesaurus loads on demand
 * when the synonym helper opens.
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
