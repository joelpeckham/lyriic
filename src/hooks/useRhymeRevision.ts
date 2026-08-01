import { useSyncExternalStore } from "react";

import { getRhymeRevision, subscribeRhymeReady } from "@/lib/rhyme";

/**
 * Subscribes to rhyme-pack readiness so scheme overlays re-analyze after load.
 */
export function useRhymeRevision(): number {
  return useSyncExternalStore(
    subscribeRhymeReady,
    getRhymeRevision,
    getRhymeRevision,
  );
}
