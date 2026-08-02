import { shouldCarryToolText, stashToolDraft } from "@/lib/tools/editorHandoff";

/** Muted line under primary CTA when a draft will carry. */
export const CARRY_HINT =
  "Your text stays on this device and opens in the editor.";

type HandoffSource = {
  text: string;
  samples: readonly string[];
};

/** Active tool draft for FAQ / shared continue links (same-tab session). */
let registeredSource: HandoffSource | null = null;

/**
 * Tools register their live draft so FAQ “Continue…” links can stash when
 * carryable — without wiring every parent page.
 */
export function registerToolHandoffSource(source: HandoffSource | null): void {
  registeredSource = source;
}

/**
 * Stash into sessionStorage when text should carry, then let navigation proceed.
 * Prefer explicit `{ text, samples }`; otherwise uses the registered tool source.
 */
export function continueToEditor(options?: {
  text?: string;
  samples?: readonly string[];
}): void {
  const text = options?.text ?? registeredSource?.text;
  const samples = options?.samples ?? registeredSource?.samples ?? [];
  if (typeof text === "string" && shouldCarryToolText(text, samples)) {
    stashToolDraft(text);
  }
}
