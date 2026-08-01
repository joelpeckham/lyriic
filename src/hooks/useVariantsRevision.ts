import { useEffect, useState } from "react";

import {
  getVariantsRevision,
  subscribeVariantsReady,
} from "@/lib/data/variants";

/**
 * Subscribes to variants-pack readiness so meter overlays recount after load.
 */
export function useVariantsRevision(): number {
  const [revision, setRevision] = useState(getVariantsRevision);

  useEffect(() => {
    setRevision(getVariantsRevision());
    return subscribeVariantsReady(() => {
      setRevision(getVariantsRevision());
    });
  }, []);

  return revision;
}
