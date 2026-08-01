/** Mirror-div caret geometry for soft-wrapped textareas. */

function styleMirror(mirror: HTMLDivElement, ta: HTMLTextAreaElement): void {
  const style = window.getComputedStyle(ta);
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.overflowWrap = "break-word";
  mirror.style.wordBreak = "normal";
  mirror.style.width = `${ta.clientWidth}px`;
  mirror.style.font = style.font;
  mirror.style.letterSpacing = style.letterSpacing;
  mirror.style.lineHeight = style.lineHeight;
  mirror.style.padding = style.padding;
  mirror.style.border = style.border;
  mirror.style.boxSizing = style.boxSizing;
}

function measureCaretInMirror(
  mirror: HTMLDivElement,
  value: string,
  index: number,
): { top: number; left: number } {
  mirror.replaceChildren();
  mirror.appendChild(document.createTextNode(value.slice(0, index)));
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  mirror.appendChild(marker);
  return { top: marker.offsetTop, left: marker.offsetLeft };
}

export function getCaretTop(ta: HTMLTextAreaElement): number {
  const pos = ta.selectionStart;
  const mirror = document.createElement("div");
  styleMirror(mirror, ta);
  document.body.appendChild(mirror);
  const { top } = measureCaretInMirror(mirror, ta.value, pos);
  document.body.removeChild(mirror);
  return top;
}

/**
 * Map a client point to a caret offset inside a soft-wrapped textarea.
 * Poetic lines are short, so a linear scan over character ends is fine.
 */
export function caretIndexFromPoint(
  ta: HTMLTextAreaElement,
  clientX: number,
  clientY: number,
): number {
  const value = ta.value;
  if (value.length === 0) return 0;

  const style = window.getComputedStyle(ta);
  const lineHeight =
    parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2 || 20;
  const taRect = ta.getBoundingClientRect();
  const x = clientX - taRect.left + ta.scrollLeft;
  const y = clientY - taRect.top + ta.scrollTop;

  const mirror = document.createElement("div");
  styleMirror(mirror, ta);
  document.body.appendChild(mirror);

  let bestIndex = 0;
  let bestScore = Infinity;

  for (let i = 0; i <= value.length; i++) {
    const { top, left } = measureCaretInMirror(mirror, value, i);
    const rowCenter = top + lineHeight / 2;
    // Prefer same visual row, then nearest X.
    const score = Math.abs(rowCenter - y) * 10_000 + Math.abs(left - x);
    if (score < bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  document.body.removeChild(mirror);
  return bestIndex;
}

/** Nearest poetic-line index for a client point (handles gaps between lines). */
export function lineIndexFromPoint(
  lineEls: ReadonlyArray<HTMLTextAreaElement | null>,
  clientY: number,
): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < lineEls.length; i++) {
    const el = lineEls[i];
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (clientY >= rect.top && clientY <= rect.bottom) return i;
    const dist = clientY < rect.top ? rect.top - clientY : clientY - rect.bottom;
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

export function isCaretOnFirstVisualRow(ta: HTMLTextAreaElement): boolean {
  if (ta.selectionStart === 0) return true;
  const lineHeight = parseFloat(window.getComputedStyle(ta).lineHeight);
  if (!Number.isFinite(lineHeight) || lineHeight <= 0) return true;
  return getCaretTop(ta) < lineHeight * 0.75;
}

export function isCaretOnLastVisualRow(ta: HTMLTextAreaElement): boolean {
  if (ta.selectionStart >= ta.value.length) return true;
  const lineHeight = parseFloat(window.getComputedStyle(ta).lineHeight);
  if (!Number.isFinite(lineHeight) || lineHeight <= 0) return true;
  return getCaretTop(ta) >= ta.scrollHeight - lineHeight * 1.25;
}
