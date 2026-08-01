import { useEffect, useState } from "react";

import {
  getStressRevision,
  subscribeStressReady,
} from "@/lib/data/stress";

/**
 * Subscribes to stress-pack readiness so meter overlays recount after load.
 */
export function useStressRevision(): number {
  const [revision, setRevision] = useState(getStressRevision);

  useEffect(() => {
    setRevision(getStressRevision());
    return subscribeStressReady(() => {
      setRevision(getStressRevision());
    });
  }, []);

  return revision;
}
