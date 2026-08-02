/** Thin helpers for getting draft text out of the local-first editor. */

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Safe .txt filename from a draft name. */
export function draftFilename(name: string): string {
  const base =
    name
      .trim()
      .replace(/[^\w\s-]+/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "draft";
  return `${base}.txt`;
}

export function countPoemLines(text: string): number {
  if (!text.trim()) return 0;
  return text.split("\n").filter((line) => line.trim().length > 0).length;
}

/** First non-empty verse line, truncated for list previews. */
export function firstVerseLine(text: string, maxLen = 40): string | null {
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.length <= maxLen) return trimmed;
    return `${trimmed.slice(0, Math.max(1, maxLen - 1))}…`;
  }
  return null;
}

export function formatRelativeUpdatedAt(
  updatedAt: number,
  now = Date.now(),
): string {
  const deltaSec = Math.round((now - updatedAt) / 1000);
  if (!Number.isFinite(deltaSec) || deltaSec < 45) return "Just now";
  const minutes = Math.round(deltaSec / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** Secondary draft-list line: verse preview, else relative time. */
export function draftListSecondary(
  text: string,
  updatedAt: number,
  now = Date.now(),
): string {
  return firstVerseLine(text) ?? formatRelativeUpdatedAt(updatedAt, now);
}

/** Date/time stub used when creating a new draft from the switcher. */
export function defaultDraftName(now = Date.now()): string {
  return new Date(now).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
