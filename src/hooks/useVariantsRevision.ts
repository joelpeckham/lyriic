import { useSyncExternalStore } from "react";

import {
  getVariantsRevision,
  subscribeVariantsReady,
} from "@/lib/data/variants";

/**
 * Subscribes to variants-pack readiness so meter overlays recount after load.
 */
export function useVariantsRevision(): number {
  return useSyncExternalStore(
    subscribeVariantsReady,
    getVariantsRevision,
    getVariantsRevision,
  );
}
