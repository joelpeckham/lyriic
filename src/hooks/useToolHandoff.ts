import { useEffect, useRef } from "react";

import { consumeToolDraft } from "@/lib/tools/editorHandoff";

/**
 * Consume a one-shot tool→editor draft on mount.
 *
 * Wire in EditorShell **after** `useMeterSeed` so meter seeding can land on an
 * empty draft first, then this applies carried text:
 *
 * ```ts
 * useMeterSeed(routeSlug, applyMeterSeed);
 * useToolHandoff(applyToolDraft);
 * ```
 *
 * `applyToolDraft` should immediately replace/create draft text (not the
 * debounced keystroke `setText`).
 */
export function useToolHandoff(applyToolDraft: (text: string) => void): void {
  const applyRef = useRef(applyToolDraft);
  const doneRef = useRef(false);

  useEffect(() => {
    applyRef.current = applyToolDraft;
  }, [applyToolDraft]);

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const draft = consumeToolDraft();
    if (draft?.text) {
      applyRef.current(draft.text);
    }
  }, []);
}
