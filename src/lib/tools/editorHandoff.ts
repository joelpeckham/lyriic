/**
 * One-shot SEO-tool → editor draft handoff (sessionStorage).
 *
 * ## Write side (tools)
 * Prefer `continueToEditor({ text, samples })` (see `continueToEditor.ts`) in
 * click handlers before navigating to `/write` or `/write/:meter`. It stashes only
 * when the user has real text that is not still a stock sample
 * (`shouldCarryToolText`). Tools should also `registerToolHandoffSource` so FAQ
 * continue links can stash the same way.
 *
 * ## Read side (editor)
 * Call `consumeToolDraft()` once on EditorShell mount (via `useToolHandoff`).
 * It returns `{ text }` or `null` and clears the key so a refresh won’t re-seed.
 *
 * Key: `lyriic.toolHandoff.v1`
 */

export const TOOL_HANDOFF_KEY = "lyriic.toolHandoff.v1";

export type ToolHandoffPayload = {
  text: string;
  /** Epoch ms when stashed (debug / future TTL). */
  at: number;
};

/** Normalize line endings and trim trailing whitespace on each line. */
export function normalizeDraftText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\n+$/g, "");
}

/** True when `text` matches any stock sample (after normalize). */
export function isStockSampleText(
  text: string,
  samples: readonly string[],
): boolean {
  const normalized = normalizeDraftText(text);
  if (!normalized) return true;
  return samples.some(
    (sample) => normalizeDraftText(sample) === normalized,
  );
}

/**
 * Whether the tool draft should be carried into the editor.
 * Skips empty text and untouched stock samples.
 */
export function shouldCarryToolText(
  text: string,
  samples: readonly string[],
): boolean {
  if (!text.trim()) return false;
  return !isStockSampleText(text, samples);
}

export function stashToolDraft(text: string): void {
  if (typeof sessionStorage === "undefined") return;
  const trimmed = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (!trimmed.trim()) return;
  try {
    const payload: ToolHandoffPayload = { text: trimmed, at: Date.now() };
    sessionStorage.setItem(TOOL_HANDOFF_KEY, JSON.stringify(payload));
  } catch {
    // Quota / private mode — handoff is best-effort.
  }
}

/** One-shot read: returns payload and removes the key. */
export function consumeToolDraft(): ToolHandoffPayload | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(TOOL_HANDOFF_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(TOOL_HANDOFF_KEY);
    const parsed = JSON.parse(raw) as Partial<ToolHandoffPayload>;
    if (typeof parsed.text !== "string" || !parsed.text.trim()) return null;
    return {
      text: parsed.text.replace(/\r\n/g, "\n").replace(/\r/g, "\n"),
      at: typeof parsed.at === "number" ? parsed.at : Date.now(),
    };
  } catch {
    try {
      sessionStorage.removeItem(TOOL_HANDOFF_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}
