import { useSyncExternalStore } from "react";

import {
  getStressRevision,
  subscribeStressReady,
} from "@/lib/data/stress";

/**
 * Subscribes to stress-pack readiness so meter checkers re-scan after load.
 */
export function useStressRevision(): number {
  return useSyncExternalStore(
    subscribeStressReady,
    getStressRevision,
    getStressRevision,
  );
}
