import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

import { LineCountOverlay } from "@/components/LineCountOverlay";
import { buildMeteredLine } from "@/lib/meters/buildMeteredLine";
import { getMeterPreset } from "@/lib/meters/presets";
import type { EditorSettings } from "@/lib/settings";
import {
  countLinesIncremental,
  type LineSyllableCount,
} from "@/lib/syllables";
import { cn } from "@/lib/utils";

type TextCanvasProps = {
  value: string;
  onChange: (value: string) => void;
  settings: EditorSettings;
  /** Active project overrides — used only to invalidate count cache. */
  overrides: Record<string, number>;
  /** Stable document identity (e.g. project id) for full remount sizing. */
  documentKey: string;
};

/**
 * Soft-wrap leading within a poetic line (unitless, scales with font-size).
 * Must stay > 1 so descenders (y, g, p) are not clipped by overflow:hidden.
 */
const WRAP_LEADING = 1.35;
/** Extra space between hard-newline poetic lines. */
const LINE_GAP_CLASS = "gap-4";

function splitLines(value: string): string[] {
  return value.split("\n");
}

function joinLines(lines: string[]): string {
  return lines.join("\n");
}

function autosize(el: HTMLTextAreaElement): void {
  el.style.height = "0px";
  el.style.height = `${el.scrollHeight}px`;
}

function overridesKey(overrides: Record<string, number>): string {
  return Object.keys(overrides)
    .sort()
    .map((key) => `${key}:${overrides[key]}`)
    .join("|");
}

export function TextCanvas({
  value,
  onChange,
  settings,
  overrides,
  documentKey,
}: TextCanvasProps) {
  const lineRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  const pendingFocus = useRef<{ index: number; offset: number } | null>(null);
  const prevCountRef = useRef<{
    lines: string[];
    counts: LineSyllableCount[];
    documentKey: string;
    overrideRevision: string;
  } | null>(null);
  const dirtyLinesRef = useRef<Set<number> | "all">("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const prevDocumentKeyForSizeRef = useRef(documentKey);

  const lines = useMemo(() => splitLines(value), [value]);
  const overrideRevision = useMemo(
    () => overridesKey(overrides),
    [overrides],
  );

  const lineCounts = useMemo(() => {
    const prev = prevCountRef.current;
    const policyChanged =
      !prev ||
      prev.documentKey !== documentKey ||
      prev.overrideRevision !== overrideRevision;
    return countLinesIncremental(
      value,
      policyChanged ? null : prev.lines,
      policyChanged ? null : prev.counts,
    );
  }, [value, documentKey, overrideRevision]);

  useLayoutEffect(() => {
    prevCountRef.current = {
      lines: lineCounts.lines,
      counts: lineCounts.counts,
      documentKey,
      overrideRevision,
    };
  }, [lineCounts, documentKey, overrideRevision]);

  const pattern = useMemo((): readonly number[] => {
    if (settings.meter === "custom") return [settings.customSyllables];
    return getMeterPreset(settings.meter).pattern;
  }, [settings.meter, settings.customSyllables]);

  const meteredLines = useMemo(
    () =>
      lineCounts.counts.map((count, index) =>
        buildMeteredLine(count, index, pattern),
      ),
    [lineCounts.counts, pattern],
  );

  useLayoutEffect(() => {
    if (prevDocumentKeyForSizeRef.current !== documentKey) {
      dirtyLinesRef.current = "all";
      prevDocumentKeyForSizeRef.current = documentKey;
    }
    const dirty = dirtyLinesRef.current;
    if (dirty === "all") {
      for (const el of lineRefs.current) {
        if (el) autosize(el);
      }
    } else {
      for (const index of dirty) {
        const el = lineRefs.current[index];
        if (el) autosize(el);
      }
    }
    dirtyLinesRef.current = new Set();
  }, [value, lines.length, settings.fontSize, documentKey]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      dirtyLinesRef.current = "all";
      for (const el of lineRefs.current) {
        if (el) autosize(el);
      }
      dirtyLinesRef.current = new Set();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;
    const el = lineRefs.current[pending.index];
    if (!el) return;
    el.focus();
    const offset = Math.min(pending.offset, el.value.length);
    el.setSelectionRange(offset, offset);
  }, [value]);

  const markDirty = (...indices: number[]) => {
    if (dirtyLinesRef.current === "all") return;
    for (const index of indices) {
      if (index >= 0) dirtyLinesRef.current.add(index);
    }
  };

  const updateLines = (
    next: string[],
    focus?: { index: number; offset: number },
    dirty: number[] | "all" = "all",
  ) => {
    if (focus) pendingFocus.current = focus;
    if (dirty === "all") {
      dirtyLinesRef.current = "all";
    } else {
      markDirty(...dirty);
    }
    onChange(joinLines(next));
  };

  const onLineChange = (index: number, text: string) => {
    const cleaned = text.replace(/\n/g, "");
    const next = [...lines];
    next[index] = cleaned;
    updateLines(next, undefined, [index]);
  };

  const focusLine = (index: number, offset: number) => {
    const el = lineRefs.current[index];
    if (!el) return;
    el.focus();
    const nextOffset = Math.min(Math.max(0, offset), el.value.length);
    el.setSelectionRange(nextOffset, nextOffset);
  };

  const onLineKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    const ta = event.currentTarget;
    const { selectionStart, selectionEnd } = ta;

    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      const before = lines[index]!.slice(0, selectionStart);
      const after = lines[index]!.slice(selectionEnd);
      const next = [...lines];
      next[index] = before;
      next.splice(index + 1, 0, after);
      updateLines(next, { index: index + 1, offset: 0 }, [index, index + 1]);
      return;
    }

    if (
      event.key === "Backspace" &&
      selectionStart === 0 &&
      selectionEnd === 0 &&
      index > 0
    ) {
      event.preventDefault();
      const prevLen = lines[index - 1]!.length;
      const next = [...lines];
      next[index - 1] = next[index - 1]! + next[index]!;
      next.splice(index, 1);
      updateLines(next, { index: index - 1, offset: prevLen }, [
        index - 1,
        index,
      ]);
      return;
    }

    if (
      event.key === "ArrowUp" &&
      index > 0 &&
      selectionStart === selectionEnd &&
      isCaretOnFirstVisualRow(ta)
    ) {
      event.preventDefault();
      focusLine(index - 1, selectionStart);
      return;
    }

    if (
      event.key === "ArrowDown" &&
      index < lines.length - 1 &&
      selectionStart === selectionEnd &&
      isCaretOnLastVisualRow(ta)
    ) {
      event.preventDefault();
      focusLine(index + 1, selectionStart);
    }
  };

  const onLinePaste = (
    index: number,
    event: ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const pasted = event.clipboardData.getData("text").replace(/\r\n/g, "\n");
    if (!pasted.includes("\n")) return;

    event.preventDefault();
    const ta = event.currentTarget;
    const { selectionStart, selectionEnd } = ta;
    const parts = pasted.split("\n");
    const before = lines[index]!.slice(0, selectionStart);
    const after = lines[index]!.slice(selectionEnd);
    const next = [...lines];
    next[index] = before + parts[0]!;
    const rest = parts.slice(1);
    if (rest.length > 0) {
      rest[rest.length - 1] = rest[rest.length - 1]! + after;
      next.splice(index + 1, 0, ...rest);
      const focusIndex = index + rest.length;
      const focusOffset = rest[rest.length - 1]!.length - after.length;
      const dirty = Array.from(
        { length: rest.length + 1 },
        (_, i) => index + i,
      );
      updateLines(next, { index: focusIndex, offset: Math.max(0, focusOffset) }, dirty);
    } else {
      next[index] = before + parts[0]! + after;
      updateLines(
        next,
        {
          index,
          offset: before.length + parts[0]!.length,
        },
        [index],
      );
    }
  };

  const isEmptyDoc = lines.length === 1 && lines[0] === "";
  const fontSizeRem = `${settings.fontSize}rem`;
  const minLineHeightRem = `${settings.fontSize * WRAP_LEADING}rem`;

  return (
    <div
      ref={containerRef}
      className="mx-auto h-full w-full max-w-3xl overflow-auto py-16 pr-4 pl-6 [scrollbar-gutter:stable]"
    >
      <div className={cn("flex flex-col", LINE_GAP_CLASS)}>
        {lines.map((line, index) => {
          const metered = meteredLines[index]!;
          const lineId = `lyriic-line-${index}`;
          const statusId = `${lineId}-status`;

          return (
            <div key={index} className="relative flex items-start">
              <label className="sr-only" htmlFor={lineId}>
                {index === 0 ? "Poem canvas" : `Line ${index + 1}`}
              </label>
              <textarea
                ref={(el) => {
                  lineRefs.current[index] = el;
                }}
                id={lineId}
                value={line}
                rows={1}
                spellCheck
                autoFocus={index === 0}
                placeholder={
                  isEmptyDoc && index === 0 ? "Write a line…" : undefined
                }
                aria-describedby={
                  settings.showCounts ? statusId : undefined
                }
                onChange={(event) => onLineChange(index, event.target.value)}
                onKeyDown={(event) => onLineKeyDown(index, event)}
                onPaste={(event) => onLinePaste(index, event)}
                className={cn(
                  "w-full resize-none overflow-hidden bg-transparent pr-12",
                  "whitespace-pre-wrap break-words font-[family-name:var(--font-editor)] tracking-[0.01em]",
                  "text-foreground caret-[var(--lyriic-ink)] placeholder:text-muted-foreground/45",
                  "outline-none selection:bg-[var(--lyriic-selection)]",
                )}
                style={{
                  fontSize: fontSizeRem,
                  lineHeight: WRAP_LEADING,
                  minHeight: minLineHeightRem,
                }}
              />

              {settings.showCounts && (
                <LineCountOverlay
                  total={metered.total}
                  target={metered.target}
                  status={metered.status}
                  lineHasText={line.length > 0}
                  statusId={statusId}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isCaretOnFirstVisualRow(ta: HTMLTextAreaElement): boolean {
  if (ta.selectionStart === 0) return true;
  const lineHeight = parseFloat(window.getComputedStyle(ta).lineHeight);
  if (!Number.isFinite(lineHeight) || lineHeight <= 0) return true;
  return getCaretTop(ta) < lineHeight * 0.75;
}

function isCaretOnLastVisualRow(ta: HTMLTextAreaElement): boolean {
  if (ta.selectionStart >= ta.value.length) return true;
  const lineHeight = parseFloat(window.getComputedStyle(ta).lineHeight);
  if (!Number.isFinite(lineHeight) || lineHeight <= 0) return true;
  return getCaretTop(ta) >= ta.scrollHeight - lineHeight * 1.25;
}

function getCaretTop(ta: HTMLTextAreaElement): number {
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
