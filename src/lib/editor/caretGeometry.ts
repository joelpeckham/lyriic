/** Mirror-div caret Y for soft-wrapped textareas (visual-row ArrowUp/Down). */

export function getCaretTop(ta: HTMLTextAreaElement): number {
  const pos = ta.selectionStart;
  const style = window.getComputedStyle(ta);
  const mirror = document.createElement("div");
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

  mirror.textContent = ta.value.slice(0, pos);
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  mirror.appendChild(marker);
  document.body.appendChild(mirror);
  const top = marker.offsetTop;
  document.body.removeChild(mirror);
  return top;
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
